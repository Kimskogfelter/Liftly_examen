import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import PostActionsMenu from "./PostActionsMenu";
import TimeAgo from "react-timeago";
import { BsThreeDots } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function DisplayPost({ post, currentUser, onEditPost, onDeletePost }) {

    const [showPostActions, setShowPostActions] = useState(false);
    const [likePost, setLikePost] = useState(false);

    console.log("Current User:", currentUser);
    console.log("post data in DisplayPost:", post);

    return (
        <>
            <section>
                {/* display user information */}
                <div>
                    <ProfileImage image={post.createdBy.profileImage} />
                    <Link to={`/users/${post.createdBy._id}`}>{post.createdBy.username}</Link> {/* Link to user profile page */}
                </div>

                <div>

                    {/* Post actions menu */}
                    {/* only shows if the current user id matches the post creator's id */}
                    {post.createdBy._id === currentUser?.id && (
                        <>
                            {showPostActions && <PostActionsMenu post={post} onEditPost={onEditPost} onDeletePost={onDeletePost} />}
                            <button onClick={() => setShowPostActions(!showPostActions)}>
                                <BsThreeDots />
                            </button>
                        </>
                    )}
                    {/* Display post content */}
                    <Link to={`/posts/${post._id}`}> {/* Link to single post page */}
                        <h2>{post.content}</h2>
                        {post.media && <img src={post.media} alt="Post media" />}
                        <p><TimeAgo date={post.createdAt} /></p>
                        {/* Display comment count */}
                        <p>{post.comments.length} comments</p>
                    </Link>
                    {/* display post likes */}
                    <p>{post.likes.length} likes</p>
                    {/* like button */}
                    <button onClick={() => setLikePost(prev => !prev)}>
                        {likePost ? <FaHeart /> : <FiHeart />}
                    </button>

                </div>

            </section>
        </>
    );
}

export default DisplayPost;