import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import TimeAgo from "react-timeago";

function DisplayPost({ post }) {

    return (
        <>
            <section>
                {/* display user information */}
                <div>
                    <ProfileImage image={post.createdBy.profileImage} />
                    <Link to={`/users/${post.createdBy._id}`}>{post.createdBy.username}</Link> {/* Link to user profile page */}
                </div>
                {/* Display post content */}
                <Link to={`/posts/${post._id}`}> {/* Link to single post page */}
                    <h2>{post.content}</h2>
                    {post.media && <img src={post.media} alt="Post media" />}
                    <p><TimeAgo date={post.createdAt} /></p>
                </Link>
            </section>
        </>
    );
}

export default DisplayPost;