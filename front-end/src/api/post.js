import API from './index.js'

export const createNewPost = (data)=>{
    return API.post("/posts/create-post",data)
}