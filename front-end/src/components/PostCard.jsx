import { likePost,unlikePost} from "../api/like.js"
import { useAuth } from "../hooks/useAuth.js"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
const PostCard = ({post})=>{
    const {user,isAuthorised} = useAuth();
    const navigate = useNavigate();

    const [likedBy, setLikedBy] = useState(post.likedBy || []);
    const isLiked = likedBy.some(u=> u._id.toString() === user?._id.toString())

    const likeAction = async ()=>{
        if(!isAuthorised) return alert("Please login to like posts")
        try {
            if(isLiked){
                await unlikePost(post._id);
                setLikedBy((prev)=>{
                    return prev.filter(u => u._id.toString()!== user?._id.toString())
                })
            } else{
                await likePost(post._id);
                setLikedBy((prev)=>{
                    return [...prev,{_id: user._id}]
                })
            }
        } catch (error) {
            console.error("Error in liking/unliking post:", error);
            alert("An error occurred. Please try again later.");
        }

    }

    return(
        <div>
            <h3>{post.title}</h3>
            {
                post.postImages?.map((img,index)=>(
                    <img
                        key={index}
                        src={img}
                        alt={`post-img-${index}`}
                    />
                ))
                
            }

            {
                post.postVideos?.map((video,index)=>(
                    <video
                        key={index}
                        src={video}
                        controls
                    />
                ))
                
            }

            <p>{post.description}</p>

            <button onClick={likeAction}>{isLiked ? "Unlike" : "Like"}</button>
            <span>{likedBy.length} Likes</span>
            
            <button onClick={() => navigate(`/posts/${post._id}/comments`)}>
                Comments ({post.comments?.length || 0})
            </button>

        </div>
    )
}

export default PostCard