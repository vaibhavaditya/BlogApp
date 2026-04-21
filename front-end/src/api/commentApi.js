import API from "./axios";

// GET all comments of a post
export const getCommentsByPost = (postId) =>
  API.get(`/comments/post/${postId}`);

// ADD a new comment
export const addComment = (postId, data) =>
  API.post(`/comments/post/${postId}`, data);

// DELETE a comment
export const deleteComment = (id) =>
  API.delete(`/comments/${id}`);

// UPDATE a comment
export const updateComment = (id, data) =>
  API.put(`/comments/${id}`, data);