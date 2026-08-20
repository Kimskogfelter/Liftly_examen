import React from "react";
import PostCard from "./PostCard";
import PostGridItem from "./PostGridItem";

function PostFeed({ posts, currentUser, setCurrentUser, handleDeletePost, handleEditPost, layout, getSavedPosts }) {

    const isGrid = layout?.includes("grid-3x3");

    const feedLayout = isGrid
        ? "grid grid-cols-3 gap-1 md:gap-3 max-w-[1000px] mx-auto w-full" 
        : "flex flex-col gap-4 w-full max-w-2xl mx-auto";

    if (posts.length === 0) {
        return <p className="text-center text-gray-500 my-8 text-sm">No posts available.</p>;
    }

    return (
        <div className={feedLayout}>
            {posts.map((post) => 
                isGrid ? (
                    <PostGridItem key={post._id} post={post} />
                ) : (
                    <PostCard 
                        key={post._id} 
                        post={post} 
                        currentUser={currentUser} 
                        setCurrentUser={setCurrentUser} 
                        handleEditPost={handleEditPost} 
                        handleDeletePost={handleDeletePost} 
                        getSavedPosts={getSavedPosts} 
                    />
                )
            )}
        </div>
    );
}

export default PostFeed;