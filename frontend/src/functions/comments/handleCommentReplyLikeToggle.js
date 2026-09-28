import api from "../../api/axios";

export const handleCommentReplyLikeToggle = async (isReplyLiked, setIsReplyLiked, setReplyLikesCount, comment, reply, currentUser) => {

    const commentId = comment._id;
    const replyId = reply._id;

    try {

        if (isReplyLiked) {


            // unlike comment reply
            await api.delete(`/posts/comments/${commentId}/replies/${replyId}/unlike`);

            // remove 1 from likes count
            setReplyLikesCount(prev => prev - 1);

        } else {

            // like comment reply
            await api.post(`/posts/comments/${commentId}/replies/${replyId}/like`, {});


            // add 1 to likes count
            setReplyLikesCount(prev => prev + 1);

        }

        setIsReplyLiked(prev => !prev);

    } catch (err) {

    }

};
