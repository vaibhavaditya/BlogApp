import mongoose,{Schema, syncIndexes} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String,
    },

    createdPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    savedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    bio: {
        type: String,
        maxlength: 200
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    followersCount: {
        type: Number,
        default: 0
    },

    followingCount: {
        type: Number,
        default: 0
    },

    refreshToken: {
        type: String,
        select: false
    }

},{timestamps: true})


userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',userSchema);