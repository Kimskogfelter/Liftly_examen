import React from "react";
import PostCard from "./posts/PostCard";

function Feed({ posts, currentUser, onSetPosts }) {

    const handleEditPost = (updatedPost) => {
        // Map through the posts and update the edited post in the posts state
        const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
        onSetPosts(updatedPosts); // Update the posts state in the parent component (Home.jsx)
    };

    const handleDeletePost = (postId) => {
        // Filter out the deleted post from the posts state
        const updatedPosts = posts.filter((post) => post._id !== postId);
        onSetPosts(updatedPosts); // Update the posts state in the parent component (Home.jsx)
    };


    return (
        <>
            <div>
                {/* if no posts available */}
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />
                    ))
                )}
            </div>
        </>
    );
}

export default Feed;