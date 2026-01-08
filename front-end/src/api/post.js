import API from './index.js'

export const createNewPost = (data)=>{
    return API.post("/posts/create-post",data)
}

export const getAllPostsByUser = (id)=>{
    return API.get(`/posts/user/${id}/posts`)
}