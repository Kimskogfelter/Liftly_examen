import React from "react";
import PostCard from "./PostCard";
import PostGridItem from "./PostGridItem";

function PostFeed({ 
    posts, 
    currentUser, 
    setCurrentUser, 
    handleDeletePost, 
    handleEditPost, 
    layout, 
    getSavedPosts, 
    lastPostElementRef, 
    loadingMorePosts, 
    hasMorePosts 
}) {

    const isGrid = layout?.includes("grid-3x3");

    const feedLayout = isGrid
        ? "grid grid-cols-3 gap-1 md:gap-3 max-w-[1000px] mx-auto w-full" 
        : "flex flex-col gap-4 w-full max-w-2xl mx-auto";

    if (posts.length === 0 && !loadingMorePosts) {
        return <p className="text-center text-gray-500 my-8 text-sm">No posts available.</p>;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className={feedLayout}>
                {posts.map((post, index) => {
                    const isLastPost = posts.length === index + 1;
                    const cardRef = isLastPost ? lastPostElementRef : null;

                    return isGrid ? (
                        <div key={post._id} ref={cardRef}>
                            <PostGridItem post={post} />
                        </div>
                    ) : (
                        <div key={post._id} ref={cardRef}>
                            <PostCard 
                                post={post} 
                                currentUser={currentUser} 
                                setCurrentUser={setCurrentUser} 
                                handleEditPost={handleEditPost} 
                                handleDeletePost={handleDeletePost} 
                                getSavedPosts={getSavedPosts} 
                            />
                        </div>
                    );
                })}
            </div>

            {/* Indikatorer under flödet */}
            {loadingMorePosts && (
                <p className="py-6 text-center text-xs text-gray-400 animate-pulse font-medium">
                    Loading more posts...
                </p>
            )}

            {!hasMorePosts && posts.length > 0 && (
                <p className="py-8 text-center text-xs text-gray-400">
                    No more posts to display
                </p>
            )}
        </div>
    );
}

export default PostFeed;