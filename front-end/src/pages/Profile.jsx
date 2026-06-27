  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { getProfile,followUser,removeFollowing } from "../api/userApi";
  import { getPostsByUser} from "../api/postApi";
  import { getMe } from "../api/userApi";
  import PostCard from "../components/PostCard";

  function Profile() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [follow, setFollow] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const userRes = await getProfile(id);
          const postRes = await getPostsByUser(id);
          const meRes = await getMe();

          setUser(userRes.data.data);
          setPosts(postRes.data.data || []);
          setFollow(userRes.data.data.followers || []);
          setFollowing(userRes.data.data.following || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [id]);

    const isFollowing = follow.includes(meRes._id);
    
    const followAndUnfollow = async () => {
      try {
        if (isFollowing) {
          await removeFollowing(id);
        } else {
          await followUser(id);
        }
        // Update the follow list
        setFollow((prev) => {
          if (isFollowing) {
            return prev.filter((userId) => userId !== meRes._id);
          } else {
            return [...prev, meRes._id];
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

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

          <p>Followers: {follow.length}</p>
          <p>Following: {following.length}</p>
          <button onClick={() => followAndUnfollow()}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
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