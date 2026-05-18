import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import TimeAgo from "react-timeago";

function CommentCard({ comment }) {

    return (
        <>
            <section>
                {/* display user information */}
                <div>
                    <ProfileImage image={comment.createdBy.profileImage} />
                    <Link to={`/users/${comment.createdBy._id}`}>{comment.createdBy.username}</Link> Link to user profile page
                </div>
                {/* Display comment content */}
                <p>{comment.content}</p>
                <p><TimeAgo date={comment.createdAt} /></p>
            </section>
        </>
    );
}

export default CommentCard;