import axios from "axios";

export const HandlePostLikeToggle = async (isLiked, setIsLiked, setLikesCount, post, currentUser) => {

    const token = currentUser?.token;

    try {

    if (isLiked) {

        // unlike post
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/unlike`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        console.log("unlike post data:", response.data);
        console.log(`Post with id${post._id} have been unliked`)

        // remove 1 from likes count
        setLikesCount(prev => prev - 1);

    } else {

        // like post
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("like post data:", response.data);
        console.log(`Post with id${post._id} have been liked`)

        // add 1 to likes count
        setLikesCount(prev => prev + 1);

    }

    setIsLiked(prev => !prev); 

        } catch (err) {

        console.error(err);

    }

};
