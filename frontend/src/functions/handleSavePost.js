import axios from "axios";

export const handleSavePost = async (isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts) => {

    const token = currentUser?.token;

    try {

        if (isSaved) {

            // unsave post
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/unsave`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // update currentUser state with unsaved post
            setCurrentUser(prev => ({
                ...prev,
                savedPosts: prev.savedPosts.filter(id => String(id) !== String(post._id))
            }));

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
            console.log(`Post with id ${post._id} have been saved`)

            // update currentUser state with saved post
            setCurrentUser(prev => ({
                ...prev,
                savedPosts: [...(prev.savedPosts || []), post._id]
            }));

        }

        setIsSaved(prev => !prev);
        // run get saved posts get req to update UI directly
        if (getSavedPosts) {
            getSavedPosts();
        }

    } catch (err) {

        console.error(err);

    }

};

