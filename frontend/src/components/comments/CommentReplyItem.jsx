import { useState } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import { FiHeart } from "react-icons/fi";
import ProfileImage from "../users/ProfileImage";
import { handleCommentReplyLikeToggle } from "../../functions/comments/handleCommentReplyLikeToggle";

function CommentReplyItem({ reply, comment, currentUser, handleReplyToReply }) {
    
    // 1. Lokalt state för detta specifika svar
    const [isReplyLiked, setIsReplyLiked] = useState(
        reply.likes?.includes(currentUser?.id) || false
    );
    const [replyLikesCount, setReplyLikesCount] = useState(
        reply.likes?.length || 0
    );

    // 2. Hantera Mention / Text-uppdelning
    const content = reply.content || "";
    const isMention = content.startsWith("@");
    const words = content.split(" ");
    const mentionTag = isMention ? words[0] : "";
    const actualMessage = isMention ? words.slice(1).join(" ") : content;

    return (
        <div className="flex items-start gap-2.5">
            {/* Profilbild */}
            <div className="w-6 h-6 rounded-full overflow-hidden object-cover shrink-0 mt-0.5">
                <ProfileImage profileImage={reply.createdBy?.profileImage} />
            </div>

            {/* Innehåll */}
            <div className="flex-1 text-xs text-gray-800 leading-relaxed wrap-break-word">
                <Link
                    to={`/users/${reply.createdBy?._id}`}
                    className="font-bold text-black hover:underline mr-1.5 inline-block text-[11px]"
                >
                    {reply.createdBy?.username}
                </Link>

                {isMention && (
                    <span className="font-semibold text-blue-600 mr-1 text-[11px]">
                        {mentionTag}
                    </span>
                )}

                <span className="text-xs text-gray-700">{actualMessage}</span>

                {/* Tid & Reply-knapp */}
                <div className="flex items-center gap-3 text-[9px] text-gray-400 mt-0.5 font-medium">
                    <TimeAgo date={reply.createdAt} />
                    <button
                        onClick={() => handleReplyToReply(reply)}
                        className="hover:text-gray-600 transition-colors cursor-pointer font-semibold"
                    >
                        Reply
                    </button>
                </div>
            </div>

            {/* Like-knapp för svaret */}
            <div className="flex flex-col items-center justify-center shrink-0 text-black hover:text-red-500 transition-colors cursor-pointer pt-0.5">
                <button
                    className={`cursor-pointer transition-transform active:scale-90 ${
                        isReplyLiked ? "text-red-500" : "text-black hover:text-gray-600"
                    }`}
                    onClick={() =>
                        handleCommentReplyLikeToggle(
                            isReplyLiked,
                            setIsReplyLiked,
                            setReplyLikesCount,
                            comment,
                            reply,
                            currentUser
                        )
                    }
                >
                    <FiHeart
                        className={isReplyLiked ? "fill-red-500 text-red-500" : ""}
                        size={10}
                    />
                </button>
                <span className="text-[8px] font-bold text-black mt-0.5">
                    {replyLikesCount}
                </span>
            </div>
        </div>
    );
}

export default CommentReplyItem;