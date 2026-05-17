import React from "react";
import DisplayComment from "./DisplayComment";

function CommentList({ comments }) {

    return (

        <>
        
        {/* if comments exist execute below code */}
            {comments && (
                <>  
                    {/* maps through comments array */}
                    {comments.map((comment) => (
                        <DisplayComment key={comment._id} comment={comment} />
                    ))}
                </>
            )}
    </>
    );
}

export default CommentList;