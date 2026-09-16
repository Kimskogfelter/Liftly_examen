import api from "../../api/axios";
export const handleCommentLikeToggle = async (isLiked, setIsLiked, setLikesCount, comment, currentUser) => {

    try {

    if (isLiked) {

        // unlike comment
        const response = await api.delete(`/posts/comments/${comment._id}/unlike`); 

        console.log("unlike comment data:", response.data);
        console.log(`Comment with id${comment._id} have been unliked`)

        // remove 1 from likes count
        setLikesCount(prev => prev - 1);

    } else {

        // like comment
        const response = await api.post(`/posts/comments/${comment._id}/like`, {}); 

        console.log("like comment data:", response.data);
        console.log(`Comment with id${comment._id} have been liked`)

        // add 1 to likes count
        setLikesCount(prev => prev + 1);

    }

    setIsLiked(prev => !prev); 

        } catch (err) {

        console.error(err);

    }

};
