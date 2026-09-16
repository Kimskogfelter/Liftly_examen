import api from "../../api/axios";

export const handlePostLikeToggle = async (isLiked, setIsLiked, setLikesCount, post, currentUser) => {

    try {

    if (isLiked) {

        // unlike post
        const response = await api.delete(`/posts/${post._id}/unlike`); 

        console.log("unlike post data:", response.data);
        console.log(`Post with id${post._id} have been unliked`)

        // remove 1 from likes count
        setLikesCount(prev => prev - 1);

    } else {

        // like post
        const response = await api.post(`/posts/${post._id}/like`, {});

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
