import React from "react";
import DisplayPost from "./DisplayPost";

function Feed({ posts }) {


    return (
        <>
            <div>
                {/* if no posts available */}
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <DisplayPost key={post._id} post={post} />
                    ))
                )}
            </div>
        </>
    );
}

export default Feed;