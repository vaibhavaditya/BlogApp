import {Post} from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
const getAllPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId).select("following");

    const randomFollowing = user.following
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);

    const allPosts = await Post.aggregate([
        {
            $match: {
                author: { $in: randomFollowing }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },

        // OPTIONAL: keep only latest post per author
        {
            $group: {
                _id: "$author",
                post: { $first: "$$ROOT" }
            }
        },
        {
            $replaceRoot: { newRoot: "$post" }
        },

        {
            $addFields: {
                isLiked: {
                    $in: [new mongoose.Types.ObjectId(userId), "$likedBy"]
                }
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "author",     // ✅ FIXED
                foreignField: "_id",      // ✅ FIXED
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },

        {
            $addFields: {                // ✅ FIXED
                author: {
                    _id: "$author._id",
                    username: "$author.username",
                    avatar: "$author.avatar"
                }
            }
        },

        {
            $limit: 20
        }
    ]);

    return res.status(200).json(
        new apiResponse(200, allPosts, "All posts fetched successfully")
    );
});

const getAllPostsByMe = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user ID");
    }

    const allPosts = await Post.find({author: userId})
    .select('title description postImages postVideos likedBy comments author createdAt')
    .populate({
        path: 'author',
        select: 'username avatar'
    })
    .sort({createdAt: -1});   
    
    
    return res.status(200).json(new apiResponse(200, allPosts, "All posts fetched successfully"));      
})

const getAllPostsByUser = asyncHandler(async(req,res)=>{
    const userId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user ID");
    }
    const allPosts = await Post.find({author: userId})
    .select('title description postImages postVideos likedBy comments author createdAt')
    .populate({
        path: 'author',
        select: 'username avatar'
    })
    .sort({createdAt: -1});   
    
    
    return res.status(200).json(new apiResponse(200, allPosts, "All posts fetched successfully"));  
})

const createPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new apiError(400, "Invalid user ID");
  }

  const imageFiles = req.files?.images || [];
  const videoFiles = req.files?.videos || [];

  if (imageFiles.length > 5 || videoFiles.length > 2) {
    throw new apiError(400, "Exceeded maximum upload limit");
  }

  if (!title?.trim() && imageFiles.length === 0 && videoFiles.length === 0) {
    throw new apiError(400, "Post cannot be empty");
  }

  let images = [];
  let videos = [];

  // Upload images
  for (const file of imageFiles) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded) images.push(uploaded.url);
  }

  // Upload videos
  for (const file of videoFiles) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded) videos.push(uploaded.url);
  }

  const newPost = await Post.create({
    title,
    description,
    postImages: images,
    postVideos: videos,
    author: userId,
  });

  if (!newPost) {
    throw new apiError(500, "Post creation failed");
  }

  return res
    .status(201)
    .json(new apiResponse(201, newPost, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new apiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new apiError(404, "Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new apiError(403, "Unauthorized");
  }

  post.title = title || post.title;
  post.description = description || post.description;

  const imageFiles = req.files?.images || [];
  const videoFiles = req.files?.videos || [];

  let images = [];
  let videos = [];

  for (const file of imageFiles) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded) images.push(uploaded.url);
  }

  for (const file of videoFiles) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded) videos.push(uploaded.url);
  }

  if (images.length > 0) post.postImages = images;
  if (videos.length > 0) post.postVideos = videos;

  await post.save();

  return res
    .status(200)
    .json(new apiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new apiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new apiError(404, "Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new apiError(403, "Unauthorized");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new apiResponse(200, null, "Post deleted successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new apiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId)
    .select("title description postImages postVideos author createdAt likedBy comments")
    .populate({
      path: "author",
      select: "username avatar",
    });

    if (!post) {
        throw new apiError(404, "Post not found");
    }

    return res.status(200).json(
        new apiResponse(200, post, "Post fetched successfully")
    );
});


export {
    getAllPosts,
    getAllPostsByMe,
    getAllPostsByUser,
    createPost,
    getPostById,
    updatePost,
    deletePost
}