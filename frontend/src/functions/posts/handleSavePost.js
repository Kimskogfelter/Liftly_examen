import api from "../../api/axios";

export const handleSavePost = async (isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts) => {


    try {

        if (isSaved) {

            // unsave post
            const response = await api.delete(`/posts/${post._id}/unsave`);

            // update currentUser state with unsaved post
            setCurrentUser(prev => ({
                ...prev,
                savedPosts: prev.savedPosts.filter(id => String(id) !== String(post._id))
            }));

            console.log("unsaved post data:", response.data);
            console.log(`Post with id${post._id} have been unsaved`)

        } else {

            // save post
            const response = await api.post(`/posts/${post._id}/save`, {});

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

