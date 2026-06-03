import axios from "axios";

export const HandleCommentLikeToggle = async (isLiked, setIsLiked, setLikesCount, comment, currentUser) => {

    const token = currentUser?.token;

    try {

    if (isLiked) {

        // unlike comment
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/comments/${comment._id}/unlike`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        console.log("unlike comment data:", response.data);
        console.log(`Comment with id${comment._id} have been unliked`)

        // remove 1 from likes count
        setLikesCount(prev => prev - 1);

    } else {

        // like comment
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/comments/${comment._id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

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
