import axios from "axios";

export const handleCommentReplyLikeToggle = async (isReplyLiked, setIsReplyLiked, setReplyLikesCount, comment, reply, currentUser) => {

    const token = currentUser?.token;
    const commentId = comment._id;
    const replyId = reply._id;

    try {

    if (isReplyLiked) {
        

        // unlike comment reply
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/comments/${commentId}/replies/${replyId}/unlike`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        console.log("unlike comment reply data:", response.data);
        console.log(`Reply with id ${replyId} has been unliked`)

        // remove 1 from likes count
        setReplyLikesCount(prev => prev - 1);

    } else {

        // like comment reply
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/comments/${commentId}/replies/${replyId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("like comment reply data:", response.data);
        console.log(`Reply with id ${replyId} has been liked`)

        // add 1 to likes count
        setReplyLikesCount(prev => prev + 1);

    }

    setIsReplyLiked(prev => !prev); 

        } catch (err) {

        console.error(err);

    }

};
