import React from "react";
import PostCard from "./PostCard";

function PostFeed({ posts, currentUser, setCurrentUser, handleDeletePost, handleEditPost, layout, getSavedPosts }) {


    // 
    const feedLayout = layout.includes("grid-3x3")
        ? "grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 max-w-[1000px] mx-auto justify-center" // 3x3 layout
        : "flex flex-col gap-4 w-full max-w-2xl mx-auto"; // list layout


    return (
        <>
            <div className={feedLayout}>
                {/* if no posts available */}
                {posts.length === 0 ? (
                    <p className="text-center">No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} handleEditPost={handleEditPost} handleDeletePost={handleDeletePost} getSavedPosts={getSavedPosts} />
                    ))
                )}
            </div>
        </>
    );
}

export default PostFeed;