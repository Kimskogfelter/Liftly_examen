import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handlePostLikeToggle } from "../../functions/posts/handlePostLikeToggle";
import { handleSavePost } from "../../functions/posts/handleSavePost";
import { createSpotifyEmbedUrl } from "../../functions/spotify/spotify";
import FullsizeImageModal from "./FullsizeImageModal";
import PostCalendarShare from "./PostCalendarShare";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostRecipe from "./PostRecipe";
import PostFooter from "./PostFooter";

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

    // Visar enbart underkategorin (eller kategorin om subCategory saknas)
    const displayCategory = post.subCategory || post.category || "General";

    return (
        <>
            <section className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-4 font-sans text-gray-800 my-3 relative h-auto flex flex-col justify-between">
                <div>
                    {/* HEADER: Användare, Tid, Kategori och Meny */}
                    <PostHeader
                        post={post}
                        currentUser={currentUser}
                        displayCategory={displayCategory}
                        showPostActions={showPostActions}
                        setShowPostActions={setShowPostActions}
                        handleEditPost={handleEditPost}
                        handleDeletePost={handleDeletePost}
                        customTimeFormatter={customTimeFormatter}
                    />

                    {/* POST INNEHÅLL */}
                    <div
                        onClick={!isDetailView ? handleCardClick : undefined}
                        className={`block group text-left ${!isDetailView ? "cursor-pointer transition-opacity hover:opacity-95" : ""}`}
                    >

                        {/* MEDIA HÖGST UPP */}
                        <PostMedia
                            hasMedia={hasMedia}
                            isVideo={isVideo}
                            currentMediaUrl={currentMediaUrl}
                            currentMediaIndex={currentMediaIndex}
                            post={post}
                            isDetailView={isDetailView}
                            handlePrevMedia={handlePrevMedia}
                            handleNextMedia={handleNextMedia}
                            setFullsizeImage={setFullsizeImage}
                        />

                        {/* TEXT & HASHTAGS */}
                        <div className="mb-2 px-0.5 space-y-1">
                            <p className={`${isDetailView ? "" : "line-clamp-2 overflow-hidden"} text-xs text-gray-800 font-normal leading-relaxed`}>
                                {post.content}
                            </p>

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

                        {/* RECEPT-KORT */}
                        <PostRecipe recipe={post.recipe} isDetailView={isDetailView} />

                        {/* KALENDER-KORT (DELAD MÅNAD) - LJUS STIL */}
                        <PostCalendarShare calendarShare={post.calendarShare} />
                    </div>

                    {/* SPOTIFY EMBED */}
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
                <PostFooter
                    post={post}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    likesCount={likesCount}
                    setLikesCount={setLikesCount}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    commentsCount={commentsCount}
                    handlePostLikeToggle={handlePostLikeToggle}
                    handleSavePost={handleSavePost}
                    getSavedPosts={getSavedPosts}
                />

                {fullsizeImage && (
                    <FullsizeImageModal imageUrl={fullsizeImage} onClose={() => setFullsizeImage(null)} />
                )}
            </section>
        </>
    );
}

export default PostCard;