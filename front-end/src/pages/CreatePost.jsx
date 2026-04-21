import { useState } from "react";
import { createPost } from "../api/postApi";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      // images
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      // videos
      for (let i = 0; i < videos.length; i++) {
        formData.append("videos", videos[i]);
      }

      await createPost(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />

      <h4>Images</h4>
      <input type="file" multiple onChange={(e) => setImages(e.target.files)} />

      <h4>Videos</h4>
      <input type="file" multiple onChange={(e) => setVideos(e.target.files)} />

      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}

export default CreatePost;