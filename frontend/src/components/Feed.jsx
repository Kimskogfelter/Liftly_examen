import React from "react";
import PostCard from "./posts/PostCard";

function Feed({ posts, currentUser, handleDeletePost, handleEditPost  }) {


    return (
        <>
            <div>
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

export default Feed;