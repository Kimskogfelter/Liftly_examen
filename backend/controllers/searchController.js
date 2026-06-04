import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { HttpError } from "../models/errorModel.js"
import mongoose from "mongoose";



// ---------------------------- SEARCH --------------------------- 
// GET req: /api/search?query=gym
// PROTECTED

export const searchEverything = async (req, res, next) => {

    try {

        const { query } = req.query; // takes query from frontend

        if (!query) {

            return res.status(400).json({ message: "search query missing" });
        }


        const cleanQuery = query.replace("#", ""); // removes # if user searched for ex. #gym
        const regex = new RegExp(cleanQuery, "i"); // The "i" flag makes the search case-insensitive (e.g., "gym", "Gym", and "GYM" will all match).

        // Run search for user and posts at the same time for better prestanda
        const [matchedUsers, matchedPosts] = await Promise.all([
            // 1. Search for user based on username
            User.find({ username: regex }),

            // 2. Search for posts based on content or hashtags
            Post.find({
                $or: [
                    { content: regex },
                    { hashtags: regex }
                ]
            }).populate("createdBy", "username profileImage")
        ]);

        res.status(200).json({
            users: matchedUsers,
            posts: matchedPosts
        });



    } catch (error) {
        // Om något går fel när vi försöker registrera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}