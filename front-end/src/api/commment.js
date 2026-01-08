import API from "./auth.js";

export const getComments = (postId)=>{
    return API.get(`comments/getCommentsByPost/${postId}`)
}

export const addComment = (postId)=>{
    return API.get(`/comments/addComment/${postId}`)
}

export const editComment = (commentId)=>{
    return API.get(`/comments/updateComment/${commentId}`)
}

export const deleteComment = (commentId)=>{
    return API.get(`/comments/deleteComment/${commentId}`)
}