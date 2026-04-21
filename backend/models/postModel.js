import mongoose, { Schema } from "mongoose";

// schema for post
const postSchema = new mongoose.Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: [{ type: String }],
    content: {type: String, required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }]

}, {timestamps: true})

// post model
export const Post = mongoose.model('Post', postSchema)