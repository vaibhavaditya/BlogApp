import { useState,useEffect } from "react"
import PostCard from "../components/PostCard.jsx"
import { getAllPostsByUser } from "../api/post.js"
const Posts = () => {
    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try {
                const
            } catch (error) {
                
            }
        }
    })
    return (
        <div>
        
        </div>
    )
}

export default Posts
