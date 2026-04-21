import React, { useState, useEffect } from "react";
import { likePost, unlikePost } from "../api/likeApi.js";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const author = post.author || {};

  // state
  const [likes, setLikes] = useState(post.likedBy?.length || 0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  // decide liked from context
  useEffect(() => {
    if (user && post.likedBy) {
      setLiked(post.likedBy.includes(user._id));
    }
  }, [user, post.likedBy]);

  // like/unlike with optimistic update + rollback
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
      // optimistic update
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
      console.error("Like error", err);

      // rollback if API fails
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setLoadingLike(false);
    }
  };

  // navigate to full post
  const handleOpenPost = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      
      {/* USER */}
      <div style={{ display: "flex", gap: 10 }}>
        <img
          src={author.avatar || "https://via.placeholder.com/40"}
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
        <img
          key={i}
          src={img}
          alt="post"
          style={{ width: "200px", marginRight: 5 }}
        />
      ))}

      {/* VIDEOS */}
      {post.postVideos?.map((vid, i) => (
        <video
          key={i}
          src={vid}
          controls
          style={{ width: "300px", display: "block", marginTop: 5 }}
        />
      ))}

      {/* STATS */}
      <div>
        <p>Likes: {likes}</p>
        <p>Comments: {post.comments?.length || 0}</p>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleLike} disabled={loadingLike}>
          {liked ? "❤️ Unlike" : "🤍 Like"}
        </button>

        <button onClick={handleOpenPost}>
          Comment
        </button>
      </div>
    </div>
  );
}

export default PostCard;