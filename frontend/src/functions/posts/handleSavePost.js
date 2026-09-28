import api from "../../api/axios";

export const handleSavePost = async (isSaved, setIsSaved, post, currentUser, setCurrentUser, getSavedPosts) => {


    try {

        if (isSaved) {

            // unsave post
            await api.delete(`/posts/${post._id}/unsave`);

            // update currentUser state with unsaved post
            setCurrentUser(prev => ({
                ...prev,
                savedPosts: prev.savedPosts.filter(id => String(id) !== String(post._id))
            }));


        } else {

            // save post
            await api.post(`/posts/${post._id}/save`, {});


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

        
    }

};

