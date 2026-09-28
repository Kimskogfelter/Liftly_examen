import api from "../../api/axios";
export const handleCommentLikeToggle = async (isLiked, setIsLiked, setLikesCount, comment, currentUser) => {

    try {

    if (isLiked) {

        // unlike comment
        await api.delete(`/posts/comments/${comment._id}/unlike`); 

        // remove 1 from likes count
        setLikesCount(prev => prev - 1);

    } else {

        // like comment
        await api.post(`/posts/comments/${comment._id}/like`, {}); 

        // add 1 to likes count
        setLikesCount(prev => prev + 1);

    }

    setIsLiked(prev => !prev); 

        } catch (err) {

    }

};
