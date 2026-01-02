import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
import apiError from '../utils/apiError.js';


export const authMiddleware = async (req,_,next)=>{
    try {
        const token = req.cookies.accessToken ||req.headers.authorization?.replace("Bearer ","")
    
        if(!token){
            throw new apiError(401,'Not authorized, token missing');
        }
    
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded.id);
    
        if(!user){
            throw new apiError(401,'Not authorized, user not found');
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(402,"Invalid access token")
    }
}
