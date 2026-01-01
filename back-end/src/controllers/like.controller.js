import Post from '.../models/post.model.js';
import Comment from '../models/comment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';


const likePost = asyncHandler(async(req,res)=>{
    const postId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post id")
    }

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $addToSet: { likedBy: req.user._id },
            $inc: { likeCount: 1 }
        }
        ,{new:true});

    return res.status(200).json(new apiResponse(200, post, "Post liked successfully"));
})

const unlikePost = asyncHandler(async(req,res)=>{
    const postId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post id")
    }

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $pull: { likedBy: req.user._id },
            $inc: { likeCount: -1 }
        }
        ,{new:true});

    return res.status(200).json(new apiResponse(200, post, "Post unliked successfully"));
})

const likeComment = asyncHandler(async(req,res)=>{
    const commentId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new apiError(400,"Invalid comment id")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $inc: { likeCount: 1 }
        },
        { new: true }
    );
    return res.status(200).json(new apiResponse(200, comment, "Comment liked successfully"));
})

const unlikeComment = asyncHandler(async(req,res)=>{
    const commentId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new apiError(400,"Invalid comment id")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $inc: { likeCount: -1 }
        },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, comment, "Comment unliked successfully"));
});

export {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment
}