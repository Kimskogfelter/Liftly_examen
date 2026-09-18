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

        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "search query missing" });
        }

        const cleanQuery = query.replace("#", "").trim(); // removes # if user searched for ex. #gym
        if (!cleanQuery) return res.status(200).json({ users: [], posts: [] });

        // Escape specialtecken så att sökningar på t.ex. "(" eller "*" inte kraschar servern
        const safeQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(safeQuery, "i"); // Case-insensitive matching

        // Run search for user and posts at the same time for better performance
        const [matchedUsers, matchedPosts] = await Promise.all([
            // 1. Search for user based on username
            User.find({ username: regex })
                .select("-password -refreshTokens -email -resetPasswordToken -resetPasswordExpires"),

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
        return next(new HttpError(error.message || "Search failed", 500));
    }

};