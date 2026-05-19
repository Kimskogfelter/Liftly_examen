import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import PostActionsMenu from "./PostActionsMenu";
import { handleLikeToggle } from "../../functions/HandleLikeToggle";
import TimeAgo from "react-timeago";
import { BsThreeDots } from "react-icons/bs";
import { FiHeart, FiBookmark } from "react-icons/fi"; 
import { FaHeart, FaRegComment } from "react-icons/fa";

function PostCard({ post, currentUser, onEditPost, onDeletePost }) {

    const [showPostActions, setShowPostActions] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    console.log("Current User:", currentUser);
    console.log("post data in DisplayPost:", post);

    return (
        <>
            <section className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-sans text-gray-800 my-4 relative">
                {/* display user information */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden object-cover">
                            <ProfileImage image={post.createdBy.profileImage} />
                        </div>
                        <Link to={`/users/${post.createdBy._id}`} className="font-semibold text-lg hover:underline text-black">
                            {post.createdBy.username}
                        </Link> {/* Link to user profile page */}
                    </div>

                    {/* Post actions menu */}
                    {/* only shows if the current user id matches the post creator's id */}
                    {post.createdBy._id === currentUser?.id && (
                        <div className="relative">
                            {showPostActions && (
                                <div className="absolute right-0 mt-2 z-10">
                                    <PostActionsMenu currentUser={currentUser} post={post} onEditPost={onEditPost} onDeletePost={onDeletePost} />
                                </div>
                            )}
                            <button 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600" 
                                onClick={() => setShowPostActions(!showPostActions)}
                            >
                                <BsThreeDots size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    {/* Display post content */}
                    <Link to={`/posts/${post._id}`} className="block group mb-3"> {/* Link to single post page */}
                        
                        {/* Placeholder tags to match the Figma layout */}
                        <div className="flex flex-wrap gap-2 text-sm font-bold text-gray-700 mb-2">
                            <span>#training</span>
                            <span>#fit</span>
                            <span>#pushup</span>
                        </div>
                        
                        {/* Post media */}
                        {post.media?.[0] && (
                            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
                                <img
                                    src={post.media[0]}
                                    alt="Post media"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                        
                        <p className="text-gray-600 leading-relaxed text-sm mb-2">{post.content}</p>
                        
                        <p className="text-xs text-gray-400"><TimeAgo date={post.createdAt} /></p>
                    </Link>

                    <hr className="border-gray-100 my-4" />

                    {/* Footer Row containing actions and metrics */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-6">
                            
                            {/* display post likes */}
                            <div className="flex items-center gap-2">
                                {/* like/unlike button */}
                                <button 
                                    className={`text-2xl cursor-pointer transition-transform active:scale-95 ${isLiked ? "text-red-500" : "text-black hover:text-red-500"}`} 
                                    onClick={() => handleLikeToggle(isLiked, setIsLiked, post, currentUser)}
                                >
                                    {isLiked ? <FaHeart /> : <FiHeart />}
                                </button>
                                <span className="font-medium text-sm">{post.likes.length}</span>
                            </div>

                            {/* Display comment count */}
                            <Link to={`/posts/${post._id}`} className="flex items-center gap-2 text-black hover:text-gray-600 text-2xl">
                                <FaRegComment />
                                <span className="font-medium text-sm">{post.comments.length}</span>
                            </Link>

                        </div>

                        {/* Save / Bookmark Button from Figma */}
                        <button className="text-2xl text-black hover:text-gray-600 cursor-pointer">
                            <FiBookmark />
                        </button>
                    </div>

                </div>
            </section>
        </>
    );
}

export default PostCard;