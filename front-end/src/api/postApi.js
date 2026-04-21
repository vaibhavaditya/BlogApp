import API from "./axios";

// FEED
export const getAllPosts = () =>
  API.get("/posts");

// MY POSTS
export const getMyPosts = () =>
  API.get("/posts/my-posts");

// POSTS BY USER
export const getPostsByUser = (id) =>
  API.get(`/posts/user/${id}/posts`);

// SINGLE POST
export const getPostById = (id) =>
  API.get(`/posts/post/${id}`);

// CREATE POST (multipart)
export const createPost = (formData) =>
  API.post("/posts/create-post", formData);

// UPDATE POST (multipart)
export const updatePost = (id, formData) =>
  API.put(`/posts/post/${id}`, formData);

// DELETE POST
export const deletePost = (id) =>
  API.delete(`/posts/post/${id}`);