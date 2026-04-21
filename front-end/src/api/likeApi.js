import API from "./axios";

export const likePost = (id) =>
  API.post(`/likes/likePost/${id}`);

export const unlikePost = (id) =>
  API.post(`/likes/unlikePost/${id}`);

export const likeComment = (id) =>
  API.post(`/likes/likeComment/${id}`);

export const unlikeComment = (id) =>
  API.post(`/likes/unlikeComment/${id}`);
