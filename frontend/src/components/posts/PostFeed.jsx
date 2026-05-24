import React from "react";
import PostCard from "./PostCard";

function PostFeed({ posts, currentUser, handleDeletePost, handleEditPost, layout }) {


    // 
    const feedLayout = layout === "grid-3x3" 
    ? "grid grid-cols-3 gap-2 md:gap-4" // 3x3 layout
    : "flex flex-col gap-4 w-full max-w-2xl mx-auto"; // Long list at home page


    return (
        <>
            <div className={feedLayout}>
                {/* if no posts available */}
                {posts.length === 0 ? (
                    <p className="text-center">No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} handleEditPost={handleEditPost} handleDeletePost={handleDeletePost} />
                    ))
                )}
            </div>
        </>
    );
}

export default PostFeed;