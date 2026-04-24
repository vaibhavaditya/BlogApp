import API from "./axios";

// AUTH
export const registerUser = (data) => 
  API.post("/users/register", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const loginUser = (data) =>
  API.post("/users/login", data);

export const logoutUser = () =>
  API.post("/users/logout");

// USER
export const getMe = () =>
  API.get("/users/me");

export const getMyProfile = () =>
  API.get("/users/profile");

export const getProfile = (id) =>
  API.get(`/users/profile/${id}`);

// UPDATE
export const changePassword = (data) =>
  API.post("/users/change-password", data);

export const changeDetails = (data) =>
  API.post("/users/change-details", data);

export const changeAvatar = (formData) =>
  API.post("/users/change-avatar", formData);

// FOLLOW SYSTEM
export const followUser = (id) =>
  API.post(`/users/add-following/${id}`);

export const removeFollower = (id) =>
  API.patch(`/users/remove-follower/${id}`);

export const removeFollowing = (id) =>
  API.patch(`/users/remove-following/${id}`);

// SOCIAL GRAPH
export const getFollowers = () =>
  API.get("/users/followers");

export const getFollowing = () =>
  API.get("/users/following");

export const getFollowersById = (id) =>
  API.get(`/users/followers/${id}`);

export const getFollowingById = (id) =>
  API.get(`/users/following/${id}`);