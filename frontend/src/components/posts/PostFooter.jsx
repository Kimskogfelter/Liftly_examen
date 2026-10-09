import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBookmark, FiMessageCircle } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

const PostFooter = ({
    post,
    currentUser,
    setCurrentUser,
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    isSaved,
    setIsSaved,
    commentsCount,
    handlePostLikeToggle,
    handleSavePost,
    getSavedPosts
}) => {
    return (
        <div>
            <hr className="border-gray-100 my-2" />

            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <button
                            className={`text-lg cursor-pointer transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-black hover:text-gray-600"}`}
                            onClick={() => handlePostLikeToggle(isLiked, setIsLiked, setLikesCount, post, currentUser)}
                        >
                            {isLiked ? <FiHeart className="fill-red-500 text-red-500" size={18} /> : <FiHeart size={18} />}
                        </button>
                        <span className="font-medium text-xs text-gray-700">{likesCount}</span>
                    </div>

                    <Link to={`/posts/${post._id}`} className="flex items-center gap-1.5 text-black hover:text-gray-600 text-lg">
                        <FiMessageCircle size={18} />
                        <span className="font-medium text-xs text-gray-700">
                            {commentsCount}
                        </span>
                    </Link>
                </div>

                <button onClick={() => handleSavePost(isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts)} className="text-lg text-black hover:text-gray-600 cursor-pointer">
                    {isSaved ? <FaBookmark size={18} /> : <FiBookmark size={18} />}
                </button>
            </div>
        </div>
    );
};

export default PostFooter;