import { useEffect, useState } from "react";
import { getMyProfile } from "../api/userApi";
import PostCard from "../components/PostCard";

function MyProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();        
        setProfile(res.data.data); // if you didn't standardize API  
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>

      {/* USER INFO */}
      <div>
        <img
          src={profile.avatar}
          alt="avatar"
          width={80}
        />

        <h3>{profile.fullName}</h3>
        <p>@{profile.username}</p>
        <p>{profile.email}</p>

        <p>{profile.bio || "No bio yet"}</p>

        <p>Followers: {profile.followers?.length || 0}</p>
        <p>Following: {profile.following?.length || 0}</p>
      </div>

      <hr />

      {/* POSTS */}
      <h3>My Posts</h3>

      {profile.createdPosts?.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        profile.createdPosts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))
      )}
    </div>
  );
}

export default MyProfile;