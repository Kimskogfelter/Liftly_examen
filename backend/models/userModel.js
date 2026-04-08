import mongoose, { Schema } from "mongoose";

// schema/strukturen för user
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength: 3, maxlength: 15},
    email: {type: String, required: true, unique: true, minlength: 10, maxlength: 45},
    password: {type: String, required: true, minlength: 8, maxlength: 30},
    profileBio: {type: String, default: "", minlength: 10, maxlength: 200},
    profileImage: {type: String, default: "https://res.cloudinary.com/dn3kezspn/image/upload/q_auto/f_auto/v1775115252/Liftly_profile_avatar_image_le0vou.png"},
    followers: [{type: Schema.Types.ObjectId, ref: "User"}],
    following: [{type: Schema.Types.ObjectId, ref: "User"}],
    savedPosts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],

}, {timestamps: true})

// user modell
export const User = mongoose.model('User', userSchema)