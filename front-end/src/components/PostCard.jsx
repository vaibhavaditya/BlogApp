const PostCard = ({post,onLike})=>{
    return(
        <div>
            <h3>post.title</h3>

            {
                post.postImages?.length > 0 &&
                    post.postImages.map((img,index)=>{
                        <img
                            key={index}
                            src={img}
                            alt={`post-img-${index}`}
                        />
                    })
                
            }

            {
                post.postVideos?.length > 0 &&
                    post.postVideos.map((video,index)=>{
                        <video
                            key={index}
                            src={video}
                            alt={`post-img-${index}`}
                        />
                    })
                
            }


            <p>post.description</p>
            
            <button onClick={()=>{onLike(post._id)}}>❤️{post.likeCount}</button>
        </div>
    )
}

export default PostCard