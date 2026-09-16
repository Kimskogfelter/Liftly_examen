import api from "../../api/axios";

export const handleFollowUserToggle = async (userInfo, setUserInfo, currentUser, isAlreadyFollowing) => {

    try {

    if (isAlreadyFollowing) {

        // unfollow user
        const response = await api.delete(`/users/${userInfo._id}/unfollow`); 

        console.log("unfollowed user successfully:", response.data);
        console.log(`User with id${userInfo._id} have been unfollowed`)

        // remove current user id from list of followers locally
        setUserInfo(prev => ({
                ...prev,
                followers: prev.followers.filter(id => id !== currentUser.id)
            }));


    } else {

        // follow user
        const response = await api.post(`/users/${userInfo._id}/follow`, {});

        console.log("followed user successfully:", response.data);
        console.log(`User with id${userInfo._id} have been followed`)

        // add current user id to list of followers locally
        setUserInfo(prev => ({
                ...prev,
                followers: [...prev.followers, currentUser.id]
            }));

    }

        } catch (err) {

        console.error(err);

    }

};
