import { React, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfileImage from "../users/ProfileImage";
import { handleCommentLikeToggle } from "../../functions/handleCommentLikeToggle";
import { FiHeart } from "react-icons/fi";
import TimeAgo from "react-timeago";

function CommentCard({ comment, currentUser }) {
    const token = currentUser?.token;

    const [isLiked, setIsLiked] = useState(comment.likes?.includes(currentUser?.id) || false);
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyToUser, setReplyToUser] = useState(""); // Sparar vem vi svarar
    const [replies, setReplies] = useState(comment.replies || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Klicka "Reply" på HUVUDKOMMENTAR
    const handleReplyToComment = () => {
        const username = comment.createdBy?.username || "";
        setReplyToUser(username);
        setReplyContent(`@${username} `);
        setShowReplyInput(true);
    };

    // 2. Klicka "Reply" på ett ETT SVAR (REPLY)
    const handleReplyToReply = (targetReply) => {
        const username = targetReply.createdBy?.username || "";
        setReplyToUser(username);
        setReplyContent(`@${username} `);
        setShowReplyInput(true);
    };

    // Skicka svaret till backend
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/posts/comments/${comment._id}/reply`,
                { content: replyContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReplies((prev) => [...prev, response.data.reply]);
            setReplyContent("");
            setReplyToUser("");
            setShowReplyInput(false);
        } catch (err) {
            console.error("Kunde inte skicka svaret:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full max-w-lg mx-auto bg-white p-3 font-sans text-left border-b border-gray-50 flex flex-col gap-2">

            {/* HUVUDKOMMENTAR */}
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden object-cover shrink-0">
                    <ProfileImage profileImage={comment.createdBy?.profileImage} />
                </div>

                <div className="flex-1 text-left min-w-0">
                    <div className="text-xs text-gray-800 leading-relaxed wrap-break-word">
                        <Link
                            to={`/users/${comment.createdBy?._id}`}
                            className="font-bold text-black hover:underline mr-1.5 inline-block"
                        >
                            {comment.createdBy?.username}
                        </Link>
                        <span>{comment.content}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1 font-medium">
                        <span><TimeAgo date={comment.createdAt} /></span>
                        <button
                            onClick={() => {
                                if (showReplyInput) {
                                    setShowReplyInput(false);
                                    setReplyContent("");
                                } else {
                                    handleReplyToComment();
                                }
                            }}
                            className="hover:text-gray-600 transition-colors cursor-pointer font-semibold"
                        >
                            {showReplyInput ? "Cancel" : "Reply"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 text-black hover:text-red-500 transition-colors cursor-pointer pt-1">
                    <button
                        className={`text-lg cursor-pointer transition-transform active:scale-90 ${isLiked ? "text-red-500" : "text-black hover:text-gray-600"}`}
                        onClick={() => handleCommentLikeToggle(isLiked, setIsLiked, setLikesCount, comment, currentUser)}
                    >
                        {isLiked ? <FiHeart className="fill-red-500 text-red-500" size={11} /> : <FiHeart size={11} />}
                    </button>
                    <span className="text-[9px] font-bold text-black mt-0.5">{likesCount}</span>
                </div>
            </div>

            {/* FORMULÄR FÖR ATT SVARA */}
            {showReplyInput && (
                <form onSubmit={handleSendReply} className="pl-11 pr-2 flex gap-2 items-center my-1.5 animate-in fade-in duration-150">
                    <input
                        type="text"
                        placeholder={`Replying to @${replyToUser}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-1 text-xs bg-gray-100/70 focus:bg-gray-100 rounded-full px-3.5 py-1.5 focus:outline-none transition-all placeholder:text-gray-400"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !replyContent.trim()}
                        className="text-xs font-bold text-black hover:text-gray-600 disabled:opacity-30 cursor-pointer transition-opacity"
                    >
                        {isSubmitting ? "Post..." : "Post"}
                    </button>
                </form>
            )}

            {/* LISTA ÖVER SVAR (REPLIES) */}
            {replies.length > 0 && (
                <div className="pl-8 space-y-2.5 mt-1 border-l-2 border-gray-100 ml-4">
                    {replies.map((reply) => {
                        const content = reply.content || "";
                        const isMention = content.startsWith("@");
                        
                        // Separera @username från resten av meddelandet
                        const words = content.split(" ");
                        const mentionTag = isMention ? words[0] : "";
                        const actualMessage = isMention ? words.slice(1).join(" ") : content;

                        return (
                            <div key={reply._id} className="flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-full overflow-hidden object-cover shrink-0 mt-0.5">
                                    <ProfileImage profileImage={reply.createdBy?.profileImage} />
                                </div>
                                
                                <div className="flex-1 text-xs text-gray-800 leading-relaxed wrap-break-word">
                                    {/* Den som skickade svaret */}
                                    <Link
                                        to={`/users/${reply.createdBy?._id}`}
                                        className="font-bold text-black hover:underline mr-1.5 inline-block text-[11px]"
                                    >
                                        {reply.createdBy?.username}
                                    </Link>

                                    {/* Om svaret startar med @username gör vi taggen blå */}
                                    {isMention && (
                                        <span className="font-semibold text-blue-600 mr-1 text-[11px]">
                                            {mentionTag}
                                        </span>
                                    )}

                                    {/* Själva texten */}
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
                            </div>
                        );
                    })}
                </div>
            )}

        </section>
    );
}

export default CommentCard;