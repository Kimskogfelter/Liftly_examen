import React from "react";
import CommentCard from "./CommentCard";

function CommentList({ comments, currentUser }) {

    return (

        <>
        
        {/* if comments exist execute below code */}
            {comments && (
                <>  
                    {/* maps through comments array */}
                    {comments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} currentUser={currentUser} />
                    ))}
                </>
            )}
    </>
    );
}

export default CommentList;