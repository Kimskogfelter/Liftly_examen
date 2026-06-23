import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import PostActionsMenu from "./PostActionsMenu";
import { handlePostLikeToggle } from "../../functions/handlePostLikeToggle";
import { handleSavePost } from "../../functions/handleSavePost";
import TimeAgo from "react-timeago";
import { BsThreeDots } from "react-icons/bs";
import { FiHeart, FiBookmark, FiMessageCircle, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";

function PostCard({ post, currentUser, setCurrentUser, handleEditPost, handleDeletePost, getSavedPosts }) {
    const [showPostActions, setShowPostActions] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
    const [isSaved, setIsSaved] = useState(currentUser?.savedPosts?.map(String).includes(String(post._id)) || false);

    // State to keep track of the currently active media index
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    // Guard clause to check if media exists and has items
    const hasMedia = post.media && post.media.length > 0;
    const currentMediaUrl = hasMedia ? post.media[currentMediaIndex] : "";

    // Check if the currently active file is a video
    const isVideo = currentMediaUrl.match(/\.(mp4|mov|webm|mkv|avi)$/i) || currentMediaUrl.includes("/video/upload/");

    // Functions to navigate between multiple images/videos
    const handleNextMedia = (e) => {
        e.preventDefault(); // Prevents the Link component from triggering a redirect
        if (post.media && currentMediaIndex < post.media.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    };

    const handlePrevMedia = (e) => {
        e.preventDefault(); // Prevents the Link component from triggering a redirect
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    };

    return (
        <>
            <section className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-sans text-gray-800 my-3 relative h-115 flex flex-col justify-between">
                <div>
                    {/* display user information */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <ProfileImage profileImage={post.createdBy?.profileImage} />
                            </div>
                            <Link to={`/users/${post.createdBy?._id}`} className="font-semibold text-sm hover:underline text-black tracking-wide">
                                {post.createdBy?.username}
                            </Link>
                        </div>

                        {/* Post actions menu */}
                        {post.createdBy?._id === currentUser?.id && (
                            <div className="relative flex items-center justify-center">

                                {showPostActions && (
                                    <div className="absolute right-11 top-1/2 -translate-y-1/2 z-35 flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-md transition-all whitespace-nowrap">
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
                                    className={`p-1.5 rounded-full transition-colors cursor-pointer text-gray-500 hover:bg-gray-100 z-10 ${showPostActions ? 'bg-gray-100 text-black' : ''}`}
                                    onClick={() => setShowPostActions(!showPostActions)}
                                >
                                    {showPostActions ? (
                                        <FiX size={16} /> /* Displays X icon when edit/delete buttons are showing */
                                    ) : (
                                        <BsThreeDots size={16} />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-1.5 text-xs font-bold text-gray-500 mb-1.5">
                            {post.hashtags?.map((hashtag, index) => (
                                <span key={index} className="px-1 py-0.5 rounded cursor-pointer transition-colors">
                                    #{hashtag}
                                </span>
                            ))}
                        </div>

                        {/* Post content */}
                        <Link to={`/posts/${post._id}`} className="block group mb-2 text-left">

                            {/* Media slider container with absolute navigation buttons */}
                            {hasMedia ? (
                                <div className="relative w-full h-56 md:h-60 rounded-lg overflow-hidden mb-3 bg-gray-50 flex items-center justify-center group/media">
                                    {isVideo ? (
                                        <video
                                            src={currentMediaUrl}
                                            controls={true} // Gives users play/pause and timeline controls
                                            loop={true} // Automatically restarts the video when it ends, just like TikTok/Reels
                                            playsInline={true} // Prevents iOS devices from forcing the video into fullscreen mode
                                            muted={true}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={currentMediaUrl}
                                            alt="Post media"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    )}

                                    {/* Left arrow button - Only shows if there is a previous item */}
                                    {currentMediaIndex > 0 && (
                                        <button
                                            onClick={handlePrevMedia}
                                            className="absolute left-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors z-10 cursor-pointer"
                                        >
                                            <FiChevronLeft size={18} />
                                        </button>
                                    )}

                                    {currentMediaIndex < post.media.length - 1 && (
                                        <button
                                            onClick={handleNextMedia}
                                            className="absolute right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors z-10 cursor-pointer"
                                        >
                                            <FiChevronRight size={18} />
                                        </button>
                                    )}

                                    {/* Media dot indicators at the bottom center */}
                                    {post.media.length > 1 && (
                                        <div className="absolute bottom-2 flex gap-1 z-10">
                                            {post.media.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-12"></div>
                            )}

                            <p className="text-gray-600 leading-snug text-xs mb-1.5 line-clamp-6 overflow-hidden">{post.content}</p>
                        </Link>
                    </div>
                </div>

                <div>
                    {/* display post information */}
                    <p className="text-[10px] text-gray-400 mb-2"><TimeAgo date={post.createdAt} /></p>
                    <hr className="border-gray-100 my-3" />

                    {/* Footer Row containing actions and metrics */}
                    <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-5">
                            {/* display post likes */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    className={`text-lg cursor-pointer transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-black hover:text-gray-600"}`}
                                    onClick={() => handlePostLikeToggle(isLiked, setIsLiked, setLikesCount, post, currentUser)}
                                >
                                    {isLiked ? <FiHeart className="fill-red-500 text-red-500" size={18} /> : <FiHeart size={18} />}
                                </button>
                                <span className="font-medium text-xs text-gray-700">{likesCount}</span>
                            </div>

                            {/* Display comment count */}
                            <Link to={`/posts/${post._id}`} className="flex items-center gap-1.5 text-black hover:text-gray-600 text-lg">
                                <FiMessageCircle size={18} />
                                <span className="font-medium text-xs text-gray-700">{post.comments?.length || 0}</span>
                            </Link>
                        </div>

                        {/* Save / Bookmark Button */}
                        <button onClick={() => handleSavePost(isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts)} className="text-lg text-black hover:text-gray-600 cursor-pointer">
                            {isSaved ? <FaBookmark size={18} /> : <FiBookmark size={18} />}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PostCard;