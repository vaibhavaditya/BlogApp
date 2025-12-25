import mongoose,{Schema} from "mongoose";

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
        required: true
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
    }

},{timestamps: true})

export const User = mongoose.model('User',userSchema);