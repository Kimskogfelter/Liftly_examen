import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import PostActionsMenu from "./PostActionsMenu";
import { handleLikeToggle } from "../../functions/HandleLikeToggle";
import TimeAgo from "react-timeago";
import { BsThreeDots } from "react-icons/bs";
import { FiHeart, FiBookmark, FiMessageCircle } from "react-icons/fi";

function PostCard({ post, currentUser, handleEditPost, handleDeletePost }) {

    const [showPostActions, setShowPostActions] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    console.log("Current User:", currentUser);
    console.log("post data in DisplayPost:", post);

    return (
        <>
            <section className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-sans text-gray-800 my-3 relative">
                {/* display user information */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden object-cover">
                            <ProfileImage image={post.createdBy?.profileImage} />
                        </div>
                        <Link to={`/users/${post.createdBy?._id}`} className="font-semibold text-sm hover:underline text-black tracking-wide">
                            {post.createdBy.username}
                        </Link>
                    </div>

                    {/* Post actions menu */}
                    {post.createdBy?._id === currentUser?.id && (
                        <div className="flex items-center gap-1 relative">

                            {showPostActions && (
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5 transition-all">
                                    <PostActionsMenu
                                        currentUser={currentUser}
                                        post={post}
                                        handleEditPost={handleEditPost}
                                        handleDeletePost={handleDeletePost}
                                    />
                                </div>
                            )}

                            {/* "..." menu icon */}
                            <button
                                className={`p-1.5 rounded-full transition-colors cursor-pointer text-gray-500 hover:bg-gray-100 ${showPostActions ? 'bg-gray-100 text-black' : ''}`}
                                onClick={() => setShowPostActions(!showPostActions)}
                            >
                                <BsThreeDots size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    {/* Display post content */}
                    <Link to={`/posts/${post._id}`} className="block group mb-2">

                        {/* Placeholder tags */}
                        <div className="flex flex-wrap gap-1.5 text-xs font-bold text-gray-500 mb-1.5">
                            <span>#training</span>
                            <span>#fit</span>
                            <span>#pushup</span>
                        </div>

                        {/* Post media */}
                        {post.media?.[0] && (
                            <div className="w-full h-56 md:h-64 rounded-lg overflow-hidden mb-3">
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

                        <p className="text-gray-600 leading-snug text-xs mb-1.5">{post.content}</p>

                        <p className="text-[10px] text-gray-400"><TimeAgo date={post.createdAt} /></p>
                    </Link>

                    <hr className="border-gray-100 my-3" />

                    {/* Footer Row containing actions and metrics */}
                    <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-5">

                            {/* display post likes */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    className={`text-lg cursor-pointer transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-black hover:text-gray-600"}`}
                                    onClick={() => handleLikeToggle(isLiked, setIsLiked, post, currentUser)}
                                >
                                    {/* Om det är gillat visar vi ett ifyllt hjärta (eller rött), annars det snygga tunna linjehjärtat */}
                                    {isLiked ? <FiHeart className="fill-red-500 text-red-500" size={18} /> : <FiHeart size={18} />}
                                </button>
                                <span className="font-medium text-xs text-gray-700">{post.likes.length}</span>
                            </div>

                            {/* Display comment count */}
                            <Link to={`/posts/${post._id}`} className="flex items-center gap-1.5 text-black hover:text-gray-600 text-lg">
                                {/* Bytte till FiMessageCircle som har mycket tunnare och renare linjer */}
                                <FiMessageCircle size={18} />
                                <span className="font-medium text-xs text-gray-700">{post.comments.length}</span>
                            </Link>

                        </div>

                        {/* Save / Bookmark Button */}
                        <button className="text-lg text-black hover:text-gray-600 cursor-pointer">
                            <FiBookmark size={18} />
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PostCard;