import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../api/userApi";
import { getPostsByUser } from "../api/postApi";
import PostCard from "../components/PostCard";

function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getProfile(id);
        const postRes = await getPostsByUser(id);

        setUser(userRes.data.data);
        setPosts(postRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>Profile</h2>

      {/* USER INFO */}
      <div>
        <img
          src={user.avatar || "https://via.placeholder.com/80"}
          alt="avatar"
          width={80}
        />

        <h3>{user.fullName}</h3>
        <p>@{user.username}</p>
        <p>{user.bio || "No bio"}</p>

        <p>Followers: {user.followers?.length || 0}</p>
        <p>Following: {user.following?.length || 0}</p>
      </div>

      <hr />

      {/* POSTS */}
      <h3>Posts</h3>

      {posts.length === 0 ? (
        <p>No posts</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} user={user}/>
        ))
      )}
    </div>
  );
}

export default Profile;