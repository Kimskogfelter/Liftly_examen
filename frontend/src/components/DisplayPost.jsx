import React from "react";

function DisplayPost({ post }) {
    return (
        <>
            <div>
                <h2>{post.content}</h2>
                {post.media && <img src={post.media} alt="Post media" />}
            </div>
        </>
    );
}

export default DisplayPost;