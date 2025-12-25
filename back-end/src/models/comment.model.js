import mongoose,{Schema} from "mongoose";


const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },

    likeCount: {
        type: Number,
        default: 0
    },
    
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

export const Comment = mongoose.model('Comment',commentSchema);