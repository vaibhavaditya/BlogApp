import React, { useState } from "react";
import {likePost, unlikePost} from "../api/likeApi.js"

function PostCard({ post, user }) {
  const author = post.author || {};

  const [likes, setLikes] = useState(post.likedBy?.length || 0);
  const [liked, setLiked] = useState(false);

  
  const handleLike = async () => {
    try {
      if(liked){
        setLikes((prev) => prev - 1);
        setLiked(false);
        await unlikePost(post._id);
      } 
      else{
        setLikes((prev) => prev + 1);
        setLiked(true);
        await likePost(post._id);
      }
    } catch (err) {
      console.error("Like error", err);
    }
  };

  useEffect(() => {
    if (user && post.likedBy) {
      setLiked(post.likedBy.includes(user._id));
    }
  }, [user, post.likedBy]);
  
  return (
    <div>
      {/* USER */}
      <div>
        <img
          src={author.avatar || ""}
          alt="avatar"
        />
        <div>
          <p>{author.username || "Unknown User"}</p>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <h3>{post.title}</h3>

      <p>{post.description}</p>

      {post.postImages?.map((img, i) => (
        <img key={i} src={img} alt="post" />
      ))}

      <div>
        <p>Likes: {likes}</p>
        <p>Comments: {post.comments.length}</p>
      </div>

      <div>
        <button onClick={handleLike}>
          {liked ? "Unlike" : "Like"}
        </button>
        <button>Comment</button>
      </div>
    </div>
  );
}

export default PostCard;