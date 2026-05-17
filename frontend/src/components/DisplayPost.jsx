import React from "react";
import { Link } from "react-router-dom";

function DisplayPost({ post }) {

    return (
        <>
            <section>
                {/* display user information */}
                <div>
                    <img src={post.createdBy.profileImage} />
                    <Link to={`/users/${post.createdBy._id}`}>{post.createdBy.username}</Link> // link to user profile page
                </div>
                {/* Display post content */}
                <Link to={`/posts/${post._id}`}> // link to single post page
                    <h2>{post.content}</h2>
                    {post.media && <img src={post.media} alt="Post media" />}
                </Link>
            </section>
        </>
    );
}

export default DisplayPost;