const PostCard = ({post,onLike})=>{
    return(
        <div>
            <h3>post.title</h3>
            <p>post.description</p>
            
            <button onClick={()=>{onLike(post._id)}}>❤️{post.likeCount}</button>
        </div>
    )
}

export default PostCard