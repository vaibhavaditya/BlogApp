import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import { log } from 'console';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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


const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, bio } = req.body;

  if (
    !username?.trim() ||
    !fullName?.trim() ||
    !email?.trim() ||
    !password?.trim()
  ) {
    throw new apiError(400, "Required credentials are not given");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    throw new apiError(409, "User already exists");
  }

  const avatarLocalPath = req.file?.path;
  let avatarUrl = "";

  if (avatarLocalPath) {
    const uploaded = await uploadOnCloudinary(avatarLocalPath);

    if (!uploaded) {
      throw new apiError(500, "Avatar upload failed");
    }

    avatarUrl = uploaded.url;
  }

  const user = await User.create({
    username: username.trim(),
    fullName: fullName.trim(),
    email: email.trim(),
    password,
    avatar: avatarUrl,
    role: "user",
    bio,
  });

  const registeredUser = await User.findById(user._id);

  return res
    .status(201)
    .json(
      new apiResponse(201, registeredUser, "User registered successfully")
    );
});

// ================= LOGIN =================
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || !password.trim()) {
    throw new apiError(400, "Required credentials are not given");
  }

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new apiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Wrong password");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  user.password = undefined;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, { user }, "User logged in successfully")
    );
});

// ================= CHANGE AVATAR =================
const changeAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new apiError(400, "Invalid user id");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "No file uploaded");
  }

  const uploaded = await uploadOnCloudinary(avatarLocalPath);

  if (!uploaded) {
    throw new apiError(500, "Avatar upload failed");
  }

  const newAvatarUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: uploaded.url,
      },
    },
    { new: true }
  );

  if (!newAvatarUser) {
    throw new apiError(400, "Avatar cannot be changed");
  }

  return res
    .status(200)
    .json(new apiResponse(200, newAvatarUser, "Avatar changed"));
});

const logoutUser = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $unset:{
                refreshToken:""
            }
        },
    {new: true})

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logout Successfully"))
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

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

const changeCurrentUserDetails = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {newUsername,newFullName,newBio,password} = req.body;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    if(!newUsername.trim() || !password.trim() || !newFullName.trim() || !newBio.trim()){
        throw new apiError(400,"please provide both username and password")
    }

    const usernameExist = await User.exists({username: newUsername});
    if(usernameExist){
        throw new apiError(400,"Username already exist")
    }
    
    const user = await User.findById(userId).select('+password')
    if(!user){
        throw new apiError(400,"Cannot find the user to update")
    }
    
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new apiError(401,"Password is incorrect")
    }

    user.username = newUsername || user.username;
    user.fullName = newFullName || user.fullName;
    user.bio = newBio || user.bio;

    await user.save({validateBeforeSave: false})
    
    return res
    .status(200)
    .json(new apiResponse(200,{},"Username updated succesfully"))
    
})

const getUserProfile = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    // const userProfile = await User.aggregate([
    //     {
    //         $match:{
    //             _id: new mongoose.Types.ObjectId(userId)
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from: "posts",
    //             localField:"_id",
    //             foreignField:"author",
    //             as: "userPosts"
    //         }
    //     },

    //     {
    //         $addFields:{
    //             postsCount: {$size:"$userPPosts"}
    //         }        
    //     },

    //     {
    //         $project:{
    //             username: 1,
    //             fullName: 1,
    //             bio: 1,
    //             avatar: 1,
    //             followersCount: 1,
    //             postsCount: 1,
    //             userPosts: 1
    //         }
    //     }
    // ])

    // if(!userProfile || userProfile.length === 0){
    //     throw new apiError(404,"User not found")
    // }

    // return res
    // .status(200)
    // .json(new apiResponse(200,userProfile[0],"User profile fetched successfully"))

    const userProfile = await User.findById(userId)
    .select('username fullName bio avatar followers following')
    .populate('createdPosts')

    if(!userProfile){
        throw new apiError(404,"User not found")
    }
    return res
    .status(200)
    .json(new apiResponse(200,userProfile,"User profile fetched successfully"))

})

const getUserProfileById = asyncHandler(async(req,res)=>{
    const userId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    const userProfile = await User.findById(userId)
    .select('username fullName bio avatar followersCount followingCount')
    .populate('createdPosts')

    if(!userProfile){
        throw new apiError(404,"User not found")
    }
    return res
    .status(200)
    .json(new apiResponse(200,userProfile,"User profile fetched successfully"))
});

const getAllFollowers = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    const user = await User.findById(userId).select('followers').populate({
        path: 'followers',  
        select: 'username fullName avatar'
    });

    if(!user){
        throw new apiError(404,"User not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,user.followers,"Followers fetched successfully"))
})

const getAllFollowing = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    const user = await User.findById(userId).select('following').populate({
        path: 'following',
        select: 'username fullName avatar'
    })

    if(!user){
        throw new apiError(404,"User not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,user.following,"Followers fetched successfully")) 
})

const getAllFollowersById = asyncHandler( async(req,res)=>{
    const userId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    const user = await User.findById(userId).select('followers').populate({
        path: 'followers',
        select: 'username fullName avatar'
    })

    if(!user){
        throw new apiError(404,"User not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,user.followers,"All the followers"))
})

const getAllFollowingById = asyncHandler( async(req,res)=>{
    const userId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400,"Invalid user id")
    }

    const user = await User.findById(userId).select('following').populate({
        path: 'following',
        select: 'username fullName avatar'
    })

    if(!user){
        throw new apiError(404,"User not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200,user.following,"All the following"))
})


const followAUser = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const toFollow = req.params.id
    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(toFollow)){
        throw new apiError(400,"Invalid user id")
    }

    if (userId.toString() === toFollow.toString()) {
        throw new apiError(400, "You cannot follow yourself");
    }

    const alreadyFollowing = await User.exists({
        _id: userId,
        following: toFollow
    });

    if (alreadyFollowing){
        throw new apiError(400, "Already following this user");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $addToSet:{
                following: toFollow
            },
            $inc:{
                followingCount: +1
            }
        },
    {new: true})

    const followedUser = await User.findByIdAndUpdate(
        toFollow,
        {
            $addToSet:{
                followers: userId
            },

            $inc:{
                followersCount: +1
            }
        }
    ,{new: true})


    if(!user || !followedUser){
        throw new apiError(404,"User cannot be addded in the following list at this moment")
    }

    return res
    .status(200)
    .json(new apiResponse(200,{},"User added in following list successfully"))
})

const removeFollower = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const followerId = req.params.id

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followerId)){
        throw new apiError(400,"Invalid user id")
    }

    if (userId.toString() === followerId.toString()) {
        throw new apiError(400, "You cannot remove yourself from followers");
    }

    const isFollower = await User.exists({
        _id: userId,
        followers: followerId
    });

    if (!isFollower) {
        throw new apiError(400, "User is not your follower");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull:{
                followers: followerId
            },
            $inc:{
                followersCount: -1
            }
        },
    {new: true})
    
    const removedUser = await User.findByIdAndUpdate(
        followerId,
        {
            $pull: {
                following: userId
            },
            
            $inc: {
                followingCount: -1
            }
        },
        {new: true})
    if(!user || !removedUser){
        throw new apiError(404,"User cannot be removed as a follower at this moment")
    }

    return res
    .status(200)
    .json(new apiResponse(200,{},"Follower removed successfully"))
})

const removeFollowing = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const followingId = req.params.id

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followingId)){
        throw new apiError(400,"Invalid user id")
    }
    
    if (userId.toString() === followingId.toString()) {
        throw new apiError(400, "You cannot remove yourself from following list");
    }

    const isFollowing = await User.exists({
        _id: userId,
        following: followingId
    })

    if(!isFollowing){
        throw new apiError(400, "User is not your following list");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $pull: {
                following: followingId
            },
            
            $inc: {
                followingCount: -1
            }
        }
    ,{new: true})
    
    const removedFollowing = await User.findByIdAndUpdate(
        followingId,
        {
            $pull:{
                followers: userId
            },
            $inc:{
                followersCount: -1
            }
        },{new: true})


    if(!user || !removedFollowing){
        throw new apiError(404,"User cannot be removed from the following list at this moment")
    }

    return res
    .status(200)
    .json(new apiResponse(200,{},"User removed from following list successfully"))
})

const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json(
      new apiResponse(200, [], "No query provided")
    );
  }

  const users = await User.find({
    $or: [
      { username: { $regex: `^${q}`, $options: "i" } },
      { fullName: { $regex: `^${q}`, $options: "i" } }
    ]
  })
    .select("username avatar fullName")
    .limit(10);

  return res.status(200).json(
    new apiResponse(200, users, "Users fetched successfully")
  );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    searchUsers,
    getUserProfileById,
    getUserProfile,
    getAllFollowers,
    getAllFollowing,
    getAllFollowersById,
    getAllFollowingById,
    changeAvatar,
    followAUser,
    removeFollower,
    removeFollowing,
    changeCurrentUserDetails
}