import mongoose from "mongoose";

// schema/strukturen för user
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength: 3, maxlength: 15},
    email: {type: String, required: true, unique: true, minlength: 10, maxlength: 45},
    password: {type: String, required: true, minlength: 8, maxlength: 30},
    profileBio: {type: String, default: "", minlength: 10, maxlength: 200},
    createdAt: {type: Date, default: Date.now}

})

// user modell
const User = mongoose.model('User', userSchema)

// exporterar user modell så den kan användas i andra filer
export default User;