import { useEffect, useState } from "react";
import { getAllPosts } from "../api/postApi.js";
import { getMe } from "../api/userApi.js";
import PostCard from "../components/PostCard.jsx";
import { get } from "mongoose";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const fetchPosts = async () => {
    try {
      const res = await getAllPosts();
      setPosts(res.data.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ()=>{
    try {
      const res = await getMe();
      console.log(res.data.user);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user", err);
    } 
  }
  useEffect(() => {
    fetchPosts();
    loginUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Home Feed</h2>

      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} user={user} />
        ))
      )}
    </div>
  );
}

export default Home;