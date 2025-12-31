import {Post} from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const getAllPosts = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user ID");
    }
    const allPosts = await Post.findById({author: userId})
    .selecct('title description postImage postVideo likeCount commentsCount author createdAt')
    .populate({
        path: 'author',
        select: 'username profileImage'
    })
    .sort({createdAt: -1});   
    
    
    return res.status(200).json(new apiResponse(200, allPosts, "All posts fetched successfully"));  
})

const createPost = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {title, description, postImage, postVideo} = req.body;    
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user ID");
    }
    const newPost = await Post.create({
        title,
        description,
        postImage,
        postVideo,  
        author: userId
    });

    if(!newPost){
        throw new apiError(500,"Post creation failed");
    }

    return res.status(201).json(new apiResponse(201, newPost, "Post created successfully"));
});

const getPostById = asyncHandler(async(req,res)=>{
    const postId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post ID");
    }

    const post = await Post.findById(postId)
    .select('title description postImage postVideo likeCount commentsCount author createdAt')
    .populate({ 
        path: 'author',
        select: 'username avatar'
    });
    if(!post){
        throw new apiError(404,"Post not found");
    }
    return res.status(200).json(new apiResponse(200, post, "Post fetched successfully"));
});


const updatePost = asyncHandler(async(req,res)=>{
    const postId = req.params.id;
    const userId = req.user._id;
    const {title, description, postImage, postVideo} = req.body;    
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post ID");
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new apiError(404,"Post not found");
    }
    if(post.author.toString() !== userId){
        throw new apiError(403,"You are not authorized to update this post");
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.postImage = postImage || post.postImage;
    post.postVideo = postVideo || post.postVideo;

    await post.save();
    return res.status(200).json(new apiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async(req,res)=>{
    const postId = req.params.id;
    const userId = req.user._id;    
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post ID");
    }
    const post = await Post.findById(postId);
    if(!post){
        throw new apiError(404,"Post not found");
    }
    if(post.author.toString() !== userId){
        throw new apiError(403,"You are not authorized to delete this post");
    }

    await post.remove();
    return res.status(200).json(new apiResponse(200, null, "Post deleted successfully"));
});

export {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost
}