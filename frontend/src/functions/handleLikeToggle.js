import axios from "axios";

export const HandleLikeToggle = async (isLiked, setIsLiked, post, currentUser) => {

    const token = currentUser?.token;

    try {

    if (isLiked) {

        // unlike post
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/unlike`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); (post._id);

        console.log("unlike post data:", response.data);
        console.log(`Post with id${post._id} have been unliked`)

    } else {

        // like post
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); (post._id);

        console.log("like post data:", response.data);
        console.log(`Post with id${post._id} have been liked`)

    }

    setIsLiked(prev => !prev); 

        } catch (err) {

        console.error(err);

    }

};
