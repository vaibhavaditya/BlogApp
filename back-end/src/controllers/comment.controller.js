import Post from '.../models/post.model.js';
import Comment from '../models/comment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';

const getCommentsByPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post id")
    }

    const post = await Post.findById(postId).select('comments')

    if(!post){
        throw new apiError(404,"Post not found")
    }

    return res.status(200).json(new apiResponse(200, post.comments, "Comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // Implementation for adding a comment
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content } = req.body;
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post id")
    }
    const post = await Post.findById(postId);
    if(!post){
        throw new apiError(404,"Post not found")
    }
    const newComment = new Comment({
        content,
        author: userId,
        post: postId
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    return res.status(200).json(new apiResponse(200, newComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // Implementation for deleting a comment
    const commentId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new apiError(400,"Invalid comment id")
    }

    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new apiError(404,"Comment not found")
    }
    await Post.findByIdAndUpdate(comment.post, {

        $pull: { 
            comments: commentId 
        },
        $inc: {
            commentsCount: -1
        }
    });
    return res.status(200).json(new apiResponse(200, {}, "Comment deleted successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // Implementation for updating a comment
    const commentId = req.params.id;
    const { content } = req.body;
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new apiError(400,"Invalid comment id")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content: content },
        { new: true }
    );
    if(!comment){
        throw new apiError(404,"Comment not found")
    }
    return res.status(200).json(new apiResponse(200, comment, "Comment updated successfully"));
});

const getCommentCount = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new apiError(400,"Invalid post id")
    }
    const post = await Post.findById(postId).select('commentsCount');

    if(!post){
        throw new apiError(404,"Post not found")
    }

    return res.status(200).json(new apiResponse(200, post.commentsCount, "Comment count fetched successfully"));
});

export {
    getCommentsByPost,
    addComment,
    deleteComment,
    updateComment,
    getCommentCount
};