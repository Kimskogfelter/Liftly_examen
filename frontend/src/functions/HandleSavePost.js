import axios from "axios";

export const HandleSavePost = async (isSaved, setIsSaved, post, currentUser) => {

    const token = currentUser?.token;

    try {

        if (isSaved) {

            // unsave post
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/unsave`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("unsaved post data:", response.data);
            console.log(`Post with id${post._id} have been unsaved`)

        } else {

            // save post
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/save`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("saved post data:", response.data);
            console.log(`Post with id${post._id} have been saved`)

        }

        setIsSaved(prev => !prev);

    } catch (err) {

        console.error(err);

    }

};

