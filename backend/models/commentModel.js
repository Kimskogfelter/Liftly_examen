import mongoose, { Schema } from "mongoose";

// Schema for reply on comment
const replySchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

// Schema for main comment
const commentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema] // Bäddar in svar-schemat här
}, { timestamps: true });

export const Comment = mongoose.model('Comment', commentSchema);