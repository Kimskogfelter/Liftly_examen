import React, { useState, useEffect } from "react";
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

// funktion för att formatera datumstämpel
const customTimeFormatter = (value, unit) => {
    const unitMap = {
        second: "s",
        minute: "m",
        hour: "h",
        day: "d",
        week: "w",
        month: "mo",
        year: "y",
    };
    return `${value}${unitMap[unit] || unit.charAt(0)}`;
};

function PostCard({ post, currentUser, setCurrentUser, handleEditPost, handleDeletePost, getSavedPosts, isDetailView }) {

    const [showPostActions, setShowPostActions] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
    const [isSaved, setIsSaved] = useState(currentUser?.savedPosts?.map(String).includes(String(post._id)) || false);

    // State för att hålla koll på antalet kommentarer och uppdatera direkt
    const [commentsCount, setCommentsCount] = useState(
        post.comments?.reduce(
            (total, comment) => total + 1 + (comment.replies?.length || 0),
            0
        ) || 0
    );

    // Lyssna på globalt event när en ny kommentar skapas
    useEffect(() => {
        const handleCommentCreated = () => {
            setCommentsCount((prev) => prev + 1);
        };

        window.addEventListener("commentCreated", handleCommentCreated);
        return () => window.removeEventListener("commentCreated", handleCommentCreated);
    }, []);

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
            <section className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-4 font-sans text-gray-800 my-3 relative h-auto flex flex-col justify-between">
                <div>
                    {/* HEADER: Användare, Tidsstämpel, Kategori och Meny */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <ProfileImage profileImage={post.createdBy?.profileImage} />
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0 text-xs">
                                <Link to={`/users/${post.createdBy?._id}`} className="font-bold text-black hover:underline tracking-wide truncate">
                                    {post.createdBy?.username}
                                </Link>
                                <span className="text-gray-400 shrink-0">•</span>
                                <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                                    <TimeAgo date={post.createdAt} formatter={customTimeFormatter} />
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {post.subCategory && post.subCategory !== post.category
                                    ? `${post.category} / ${post.subCategory}`
                                    : post.category || "General"}
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

                    {/* POST INNEHÅLL (Klickbart i flödet, vanligt statiskt block på detaljsidan) */}
                    <div
                        onClick={!isDetailView ? handleCardClick : undefined}
                        className={`block group text-left ${!isDetailView ? "cursor-pointer transition-opacity hover:opacity-95" : ""}`}
                    >

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

                        {/* TEXT & HASHTAGS */}
                        <div className="mb-2 px-0.5 space-y-1">
                            {/* Själva texten som klipper sig på 2 rader */}
                            <p className={`${isDetailView ? "" : "line-clamp-2 overflow-hidden"} text-xs text-gray-800 font-normal leading-relaxed`}>
                                {post.content}
                            </p>

                            {/* Hashtaggar hamnar på en egen rad under, så de slipper klipper av konstigt */}
                            {post.hashtags && post.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {post.hashtags.map((hashtag, index) => {
                                        const cleanTag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
                                        const displayTag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

                                        return (
                                            <Link
                                                key={index}
                                                to={`/hashtag/${cleanTag}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-xs font-semibold text-gray-500 hover:text-black hover:underline cursor-pointer"
                                            >
                                                {displayTag}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>


                        {/* --- RECEPT-KORT (Kompakt i flödet, helt i detaljvyn) --- */}
                        {post.recipe && (
                            <div className="mt-3 mb-2 bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 text-xs space-y-3">

                                {/* Rubrik & Tid/Makros (Visas alltid) */}
                                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${isDetailView ? "border-b border-zinc-200/60 pb-3" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-zinc-900 text-sm">{post.recipe.title}</h4>

                                    </div>

                                    {/* Tid och Makros */}
                                    <div className="flex items-center gap-2 flex-wrap text-zinc-600 font-medium text-[11px]">
                                        {post.recipe.prepTimeMinutes > 0 && (
                                            <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                                                {post.recipe.prepTimeMinutes} min
                                            </span>
                                        )}
                                        {post.recipe.nutrition?.calories > 0 && (
                                            <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                                                {post.recipe.nutrition.calories} kcal
                                            </span>
                                        )}
                                        {post.recipe.nutrition?.protein > 0 && (
                                            <span className="bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                                                {post.recipe.nutrition.protein}g protein
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Ingredienser & Instruktioner (Visas ENDAST om isDetailView är true) */}
                                {isDetailView && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
                                        <div>
                                            <h5 className="font-bold text-zinc-800 mb-1.5">Ingredients</h5>
                                            <ul className="space-y-1 text-zinc-600">
                                                {post.recipe.ingredients?.map((ing, idx) => (
                                                    <li key={idx} className="flex items-start gap-1.5">
                                                        <span className="text-zinc-400">•</span>
                                                        <span>{ing.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-zinc-800 mb-1.5">Instructions</h5>
                                            <ul className="space-y-1 text-zinc-600">
                                                {post.recipe.instructions?.map((step, idx) => (
                                                    <li key={idx} className="flex items-start gap-1.5">
                                                        <span className="font-semibold text-zinc-400 shrink-0">{idx + 1}.</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 🎵 SPOTIFY EMBED */}
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

                {/* FOOTER */}
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

                {fullsizeImage && (
                    <FullsizeImageModal imageUrl={fullsizeImage} onClose={() => setFullsizeImage(null)} />
                )}
            </section>
        </>
    );
}

export default PostCard;