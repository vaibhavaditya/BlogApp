import API from './index.js'


//POSTS
export const likePost = ()=>{
    return API.post("/likes/likePost/:id")
}

export const unlikePost = ()=>{
    return API.post("/likes/unlikePost/:id")
}

//COMMMENTS
export const likeComment = ()=>{
    return API.post("/likes/likeComment/:id")
}

export const unlikeComment = ()=>{
    return API.post("/likes/unlikeComment/:id")
}


