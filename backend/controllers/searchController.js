import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { HttpError } from "../models/errorModel.js";
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
        const regex = new RegExp(cleanQuery, "i"); // Case-insensitive matching

        // Run search for user and posts at the same time for better performance
        const [matchedUsers, matchedPosts] = await Promise.all([
            // 1. Search for user based on username
            User.find({ username: regex }),

            // 2. Search for posts based on content or hashtags
            Post.find({
                $or: [
                    { content: regex },
                    { hashtags: regex }
                ]
            })
            .populate("createdBy", "username profileImage")
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "createdBy", select: "username profileImage" },
                    { path: "replies.createdBy", select: "username profileImage" }
                ]
            })
        ]);

        return res.status(200).json({
            users: matchedUsers,
            posts: matchedPosts
        });

    } catch (error) {
        return next(new HttpError(error));
    }

};