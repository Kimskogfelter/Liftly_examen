import mongoose, { Schema } from "mongoose";

// schema for post
const postSchema = new mongoose.Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: [{ type: String }],
    content: {type: String},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }],
    category: { type: String, 
                enum: ["General", "Breakfast", "Lunch & Dinner", "Desserts", "Candy", "Snacks", "Supplements", "Training", "Cardio", "Lifting", "Music", "Activewear", "Mindset & Recovery", "Helpme"],
                default: "General"
    }

}, {timestamps: true})

// post model
export const Post = mongoose.model('Post', postSchema)