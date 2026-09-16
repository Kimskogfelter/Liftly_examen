import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import PostActionsMenu from "./PostActionsMenu";
import { handlePostLikeToggle } from "../../functions/posts/handlePostLikeToggle";
import { handleSavePost } from "../../functions/posts/handleSavePost";
import FullsizeImageModal from "./FullsizeImageModal";
import { createSpotifyEmbedUrl } from "../../functions/spotify/spotify";
import TimeAgo from "react-timeago";
import { BsThreeDots } from "react-icons/bs";
import { FiHeart, FiBookmark, FiMessageCircle, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";

function PostCard({ post, currentUser, setCurrentUser, handleEditPost, handleDeletePost, getSavedPosts, isDetailView }) {

    const [showPostActions, setShowPostActions] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
    const [isSaved, setIsSaved] = useState(currentUser?.savedPosts?.map(String).includes(String(post._id)) || false);

    const [fullsizeImage, setFullsizeImage] = useState(null);

    const spotifyEmbedUrl = post.spotifyUrl ? createSpotifyEmbedUrl(post.spotifyUrl) : null;
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const hasMedia = post.media && post.media.length > 0;
    const currentMediaUrl = hasMedia ? post.media[currentMediaIndex] : "";
    const isVideo = currentMediaUrl.match(/\.(mp4|mov|webm|mkv|avi)$/i) || currentMediaUrl.includes("/video/upload/");

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/posts/${post._id}`);
    };

    const handleNextMedia = (e) => {
        e.preventDefault();
        if (post.media && currentMediaIndex < post.media.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    };

    const handlePrevMedia = (e) => {
        e.preventDefault();
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    };

    return (
        <>
            <section className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-sans text-gray-800 my-3 relative h-auto flex flex-col justify-between">
                <div>
                    {/* HEADER: Användare, Tidsstämpel, Kategori och Meny */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <ProfileImage profileImage={post.createdBy?.profileImage} />
                            </div>
                            <div className="flex items-center gap-1.5 truncate text-xs">
                                <Link to={`/users/${post.createdBy?._id}`} className="font-bold text-black hover:underline tracking-wide truncate">
                                    {post.createdBy?.username}
                                </Link>
                                <span className="text-gray-400 shrink-0">•</span>
                                <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                                    <TimeAgo date={post.createdAt} />
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {post.category || "General"}
                            </span>

                            {post.createdBy?._id === currentUser?.id && (
                                <div className="relative flex items-center justify-center">
                                    {showPostActions && (
                                        <div className="absolute right-9 top-1/2 -translate-y-1/2 z-35 flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-md whitespace-nowrap">
                                            <PostActionsMenu
                                                currentUser={currentUser}
                                                post={post}
                                                handleEditPost={handleEditPost}
                                                handleDeletePost={handleDeletePost}
                                                closeMenu={() => setShowPostActions(false)}
                                            />
                                        </div>
                                    )}

                                    <button
                                        className={`p-1 rounded-full transition-colors cursor-pointer text-gray-500 hover:bg-gray-100 z-10 ${showPostActions ? 'bg-gray-100 text-black' : ''}`}
                                        onClick={() => setShowPostActions(!showPostActions)}
                                    >
                                        {showPostActions ? <FiX size={16} /> : <BsThreeDots size={16} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* POST INNEHÅLL */}
                    <div onClick={handleCardClick} className="block group text-left">

                        {/* 🔴 1. MEDIA HÖGST UPP (Om det finns) */}
                        {hasMedia && (
                            <div className="relative w-[calc(100%+2rem)] -mx-4 -mt-1 mb-3 bg-black/90 flex items-center justify-center overflow-hidden">
                                {isVideo ? (
                                    <video
                                        src={currentMediaUrl}
                                        controls={true}
                                        loop={true}
                                        playsInline={true}
                                        muted={true}
                                        className="w-full h-auto max-h-80 object-contain"
                                    />
                                ) : (
                                    <img
                                        src={currentMediaUrl}
                                        alt="Post media"
                                        className={`w-full h-auto max-h-80 object-contain ${isDetailView ? "cursor-zoom-in" : ""}`}
                                        onClick={(e) => {
                                            if (isDetailView) {
                                                e.preventDefault();
                                                setFullsizeImage(currentMediaUrl);
                                            }
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}

                                {currentMediaIndex > 0 && (
                                    <button
                                        onClick={handlePrevMedia}
                                        className="absolute left-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
                                    >
                                        <FiChevronLeft size={18} />
                                    </button>
                                )}

                                {currentMediaIndex < post.media.length - 1 && (
                                    <button
                                        onClick={handleNextMedia}
                                        className="absolute right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
                                    >
                                        <FiChevronRight size={18} />
                                    </button>
                                )}

                                {post.media.length > 1 && (
                                    <div className="absolute bottom-2 flex gap-1 z-10">
                                        {post.media.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentMediaIndex ? "bg-white scale-125" : "bg-white/50"}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TEXT & HASHTAGS INTEGRERADE I SAMMA PARAGRAF */}
                        <div className="mb-2 px-0.5">
                            <p className={`${isDetailView ? "" : "line-clamp-3"} text-xs text-gray-800 font-normal leading-relaxed`}>
                                {post.content}
                                {post.hashtags && post.hashtags.length > 0 && (
                                    <span className="inline-flex flex-wrap gap-1.5 ml-1.5 font-semibold text-gray-500">
                                        {post.hashtags.map((hashtag, index) => {
                                            // Rensa bort # om det redan finns i strängen för URL:en
                                            const cleanTag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
                                            const displayTag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

                                            return (
                                                <Link
                                                    key={index}
                                                    to={`/hashtag/${cleanTag}`}
                                                    onClick={(e) => e.stopPropagation()} // STOPPAR klicket från att öppna post-sidan!
                                                    className="text-gray-600 hover:text-black hover:underline cursor-pointer"
                                                >
                                                    {displayTag}
                                                </Link>
                                            );
                                        })}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* 🎵 SPOTIFY EMBED (Ligger under text/hashtags) */}
                    {spotifyEmbedUrl && (
                        <div className="mt-2 mb-2 overflow-hidden rounded-lg border border-gray-100 shadow-2xs">
                            <iframe
                                src={spotifyEmbedUrl}
                                width="100%"
                                height="80"
                                frameBorder="0"
                                allow="encrypted-media"
                                className="w-full block"
                            />
                        </div>
                    )}
                </div>

                {/* FOOTER: Enbart Linje + Gilla/Kommentarer/Spara */}
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
                                    {post.comments?.reduce(
                                        (total, comment) => total + 1 + (comment.replies?.length || 0),
                                        0
                                    ) || 0}
                                </span>
                            </Link>
                        </div>

                        <button onClick={() => handleSavePost(isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts)} className="text-lg text-black hover:text-gray-600 cursor-pointer">
                            {isSaved ? <FaBookmark size={18} /> : <FiBookmark size={18} />}
                        </button>
                    </div>
                </div>

                {fullsizeImage && (
                    <FullsizeImageModal imageUrl={fullsizeImage} onClose={() => setFullsizeImage(null)} />
                )}
            </section>
        </>
    );
}

export default PostCard;