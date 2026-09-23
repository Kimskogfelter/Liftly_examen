import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { HttpError } from "../models/errorModel.js";
import mongoose from "mongoose";
// funktion för pagination/scroll
import { getPagination, formatPaginatedResponse } from "../utils/pagination.js";

// ---------------------------- SEARCH --------------------------- 
// GET req: /api/search?query=gym&page=1&limit=10
// PROTECTED

export const searchEverything = async (req, res, next) => {

    try {
        const { query } = req.query; // takes query from frontend

        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "search query missing" });
        }

        const cleanQuery = query.replace("#", "").trim(); // removes # if user searched for ex. #gym
        if (!cleanQuery) return res.status(200).json({ users: [], posts: [], hasMore: false });

        // Escape specialtecken så att sökningar på t.ex. "(" eller "*" inte kraschar servern
        const safeQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(safeQuery, "i"); // Case-insensitive matching

        // Hämta page, limit och skip
        const { page, limit, skip } = getPagination(req.query, 10);

        const postQuery = {
            $or: [
                { content: regex },
                { hashtags: regex }
            ]
        };

        // Run search for users, posts and total post count at the same time
        const [matchedUsers, matchedPosts, totalPosts] = await Promise.all([
            // 1. Search for user based on username
            User.find({ username: regex })
                .select("-password -refreshTokens -email -resetPasswordToken -resetPasswordExpires"),

            // 2. Search for posts with pagination
            Post.find(postQuery)
                .populate("createdBy", "username profileImage")
                .populate({
                    path: "comments",
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        { path: "createdBy", select: "username profileImage" },
                        { path: "replies.createdBy", select: "username profileImage" }
                    ]
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            // 3. Count total matching posts for pagination metadata
            Post.countDocuments(postQuery)
        ]);

        const paginatedPosts = formatPaginatedResponse(matchedPosts, totalPosts, page, limit);

        return res.status(200).json({
            users: matchedUsers,
            posts: paginatedPosts.posts,
            hasMore: paginatedPosts.hasMore,
            currentPage: paginatedPosts.currentPage,
            totalPosts: paginatedPosts.totalPosts
        });

    } catch (error) {
        return next(new HttpError(error.message || "Search failed", 500));
    }

};