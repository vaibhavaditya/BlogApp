import { useEffect, useState } from "react";
import { getMyPosts } from "../api/postApi";
import useAuth from "../hooks/useAuth";
import PostCard from "../components/PostCard";

function MyProfile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getMyPosts().then((res) =>
      setPosts(res.data.data || [])
    );
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      <p>{user?.username}</p>

      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
}

export default MyProfile;