import API from './index.js'

export const registerUser = (data)=>{
    API.post("/users/register",data)
}

export const loginUser = (data)=>{
    API.post("/users/login",data)
}