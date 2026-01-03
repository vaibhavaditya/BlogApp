import { useState,useEffect } from "react";
import { createNewPost } from "../api/post.js";
import { useNavigate } from "react-router-dom";

const CreatePost = ()=>{
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.append("title",title)
        formData.append("description",description)
        images.forEach(file => {
            formData.append("images", file);
        });

        videos.forEach(file => {
            formData.append("videos", file);
        });

        try {
            const newPost = await createNewPost(formData);
            alert("Post created successfully");
            navigate(`/posts/${newPost.data.data._id}`);
            return;
        } catch (error) {
            alert("Error creating post")
            return;
        }
        
    }
    return(
        <form onSubmit={handleSubmit}>
            <input placeholder="title" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
            <input placeholder="description" value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e)=>{setImages([...e.target.files])}}
            />
            <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e)=>{setVideos([...e.target.files])}}
            />

            <button type="submit">Create Post</button>
            <input/>
        </form>
    )   
}

export default CreatePost