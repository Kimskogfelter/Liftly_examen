import React from "react";
import { useState } from "react";
import CommentCard from "./CommentCard";

function CommentList({ comments, currentUser }) {

    const [showAllComments, setShowAllComments] = useState(false);

    // Visa bara de 3 senaste om showAll är false
    const visibleComments = showAllComments ? comments : comments.slice(0, 3);

    return (

        <>

            {/* if comments exist execute below code */}
            <div className="mt-4 space-y-3">
                {visibleComments.map((comment) => (
                    <CommentCard key={comment._id} comment={comment} currentUser={currentUser} />
                ))}

                {/* Knappen visas bara om det finns fler än 3 kommentarer */}
                {comments.length > 3 && !showAllComments && (
                    <div className="flex justify-center">
                    <button
                        onClick={() => setShowAllComments(true)}
                        className="text-xs font-semibold text-zinc-500 hover:text-black pt-1 cursor-pointer"
                    >
                        View all {comments.length} comments
                    </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default CommentList;