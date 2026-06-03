import { React, useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../users/ProfileImage";
import { HandleCommentLikeToggle } from "../../functions/HandleCommentLikeToggle";
import { FiHeart } from "react-icons/fi";
import TimeAgo from "react-timeago";

function CommentCard({ comment, currentUser }) {


    const [isLiked, setIsLiked] = useState(comment.likes?.includes(currentUser?.id) || false);
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

    return (
        <>
            <section className="w-full max-w-md mx-auto bg-white p-3 flex items-start gap-3 font-sans">

                {/* Profile image */}
                <div className="w-8 h-8 rounded-full overflow-hidden object-cover shrink-0">
                    <ProfileImage image={comment.createdBy?.profileImage} />
                </div>

                {/* Comment content container */}
                <div className="flex-1 text-left min-w-0">

                    {/* User name and comment text */}
                    <div className="text-xs text-gray-800 leading-relaxed wrap-break-word">
                        <Link
                            to={`/users/${comment.createdBy?._id}`}
                            className="font-bold text-black hover:underline mr-1.5 inline-block"
                        >
                            {comment.createdBy?.username}
                        </Link>
                        <span>{comment.content}</span>
                    </div>

                    {/* Footer row: Time, Reply action */}
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1 font-medium">
                        <span><TimeAgo date={comment.createdAt} /></span>
                        <button className="hover:text-gray-600 transition-colors cursor-pointer">
                            Reply
                        </button>
                    </div>

                </div>

                {/* Right side: heart icon  */}
                <div className="flex flex-col items-center justify-center shrink-0 text-black hover:text-red-500 transition-colors cursor-pointer pt-1">

                    {/* like button */}
                    <button
                        className={`text-lg cursor-pointer transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-black hover:text-gray-600"}`}
                        onClick={() => HandleCommentLikeToggle(isLiked, setIsLiked, setLikesCount, comment, currentUser)}
                    >
                        {/* heart icon */}
                        {isLiked ? <FiHeart className="fill-red-500 text-red-500" size={11} /> : <FiHeart size={11} />}
                    </button>
                    {/* display likes count */}
                    <span className="text-[9px] font-bold text-black mt-0.5">{likesCount}</span>
                </div>

            </section>
        </>
    );
}

export default CommentCard;