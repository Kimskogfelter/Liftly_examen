import mongoose, { Schema } from "mongoose";

// schema for comment
const commentSchema = new mongoose.Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {type: String, required: true},
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
   
}, {timestamps: true})

// post model
export const Comment = mongoose.model('Comment', commentSchema)