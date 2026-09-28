import api from "../../api/axios";

export const handlePostLikeToggle = async (isLiked, setIsLiked, setLikesCount, post, currentUser) => {

    try {

        if (isLiked) {

            // unlike post
            await api.delete(`/posts/${post._id}/unlike`);


            // remove 1 from likes count
            setLikesCount(prev => prev - 1);

        } else {

            // like post
            await api.post(`/posts/${post._id}/like`, {});


            // add 1 to likes count
            setLikesCount(prev => prev + 1);

        }

        setIsLiked(prev => !prev);

    } catch (err) {


    }

};
