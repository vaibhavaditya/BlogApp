import React, { useState, useEffect } from "react";
import { likePost, unlikePost } from "../api/likeApi.js";
import { useNavigate } from "react-router-dom";

function PostCard({ post, user }) {
  const navigate = useNavigate();

  const author = user || "Unknown User";

  const [likes, setLikes] = useState(post.likedBy?.length || 0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    if (user && post.likedBy) {
      setLiked(
        post.likedBy.some((id) => id.toString() === user._id)
      );
    }
  }, [user, post.likedBy]);

  const handleLike = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (loadingLike) return;

    setLoadingLike(true);

    const prevLiked = liked;
    const prevLikes = likes;

    try {
      if (liked) {
        setLiked(false);
        setLikes((p) => p - 1);
        await unlikePost(post._id);
      } else {
        setLiked(true);
        setLikes((p) => p + 1);
        await likePost(post._id);
      }
    } catch (err) {
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      
      {/* USER */}
      <div style={{ display: "flex", gap: 10 }}>
        <img
          src={author.avatar || "/default-avatar.png"}
          alt="avatar"
          width={40}
        />
        <div>
          <p>{author.username || "Unknown User"}</p>
          <p style={{ fontSize: "12px" }}>
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <h3>{post.title}</h3>
      <p>{post.description}</p>

      {/* IMAGES */}
      {post.postImages?.map((img, i) => (
        <img key={i} src={img} style={{ width: 200 }} />
      ))}

      {/* VIDEOS */}
      {post.postVideos?.map((vid, i) => (
        <video key={i} src={vid} controls style={{ width: 300 }} />
      ))}

      {/* STATS */}
      <p>Likes: {likes}</p>
      <p>Comments: {post.comments?.length || 0}</p>

      {/* ACTIONS */}
      <button onClick={handleLike} disabled={loadingLike}>
        {liked ? "❤️ Unlike" : "🤍 Like"}
      </button>

      <button onClick={() => navigate(`/post/${post._id}`)}>
        Comment
      </button>
    </div>
  );
}

export default PostCard;