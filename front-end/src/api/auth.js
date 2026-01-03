import API from './index.js'

export const registerUser = (data)=>{
    return API.post("/users/register",data)
}

export const loginUser = (data)=>{
    return API.post("/users/login",data)
}

export const getMe = ()=>{
    return API.get("/users/me")
}

