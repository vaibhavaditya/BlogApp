import { useState,useEffect } from "react"
import PostCard from "../components/PostCard.jsx"
import { useParams } from  "react-router-dom"
import {} from "../api/post.js"
const Posts = () => {
    const [posts,setPosts] = useState([]);
    const { userId } = useParams();

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try {
                const res = getAllPostsByUser(userId)
                setPosts(res.data.data)
                console.log(posts);
            } catch (error) {
                console.log(error);
                alert("Cannot open posts at this moment")     
            }
        }
        fetchPosts();
    },[userId])
    return (
        <>
            {
                posts.map((post)=>(
                    <PostCard key={post._id} post={post}/>
                ))
            }
        </>
    )
}

export default Posts
