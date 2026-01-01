import mongoose,{Schema} from 'mongoose';

const postSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },

    description:{
        type: String,
        trim: true
    },

    postImages: [{
        type: String,
        trim: true
    }],

    postVideos: [{
        type: String,
        trim: true
    }],

    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    likeCount: {
        type: Number,
        default: 0
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    
    commentsCount: {
        type: Number,
        default: 0
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps: true});

export const Post = mongoose.model('Post',postSchema)