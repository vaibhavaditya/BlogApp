import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';


const generateAccessAndRefreshToken = async(userId)=>{
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken,refreshToken}   
}


const registerUser = asyncHandler( async(req,res)=>{
    const {username,fullName,email,password,bio} = req.body;

    if(!username || !fullName || !email || !password){
        throw new apiError(400,"Required credentials are not given")
    }

    const userExists = await User.findOne({$or:[{email},{username}]})

    if(userExists){
        throw new apiError(409,"User with given email or username already exists")
    }

    const avatarUrl = req.file?.path || '';

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar:avatarUrl,
        role:'user',
        bio
    });

    if(!user){
        throw new apiError(500,"Unable to create user");
    }

    const registeredUser = await User.findById(user._id);
    return res.status(201).json(new apiResponse(201,registeredUser,"User registered successfully"))
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username,password} = req.body;

    if(!username || !password){
        throw new apiError(400,"Required credentials are not given")
    }

    const user = await User.findOne({username: username}).select("+password");
    if(!user){
        throw new apiError(400,"User does not exit")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(401, "Wrong password please try again");
    }

    
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    user.password = undefined;

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,
        {
            user: user,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
    ))

})

const logoutUser = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    await User.findOneAndUpdate(
        userId,
        {
            $unset:{
                refreshToken:""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken".option)
    .json(new apiResponse(200,{},"User logout Successfully"))
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new apiError(400,"Old password and new password are required")
    }
    const user = await User.findById(userId).select("+password");

    if(!user){
        throw new apiError(404,"User not found")
    }   

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new apiError(401,"Old password is incorrect")
    }

    user.password = newPassword;
    await user.save();

    return res
    .status(200)
    .json(new apiResponse(200,{},"Password changed successfully"))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword
}