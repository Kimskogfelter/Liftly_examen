import axios from "axios";

export const HandleFollowUserToggle = async (userInfo, setUserInfo, currentUser, isAlreadyFollowing) => {

    const token = currentUser?.token;

    try {

    if (isAlreadyFollowing) {

        // unfollow user
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userInfo._id}/unfollow`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        console.log("unfollowed user successfully:", response.data);
        console.log(`User with id${userInfo._id} have been unfollowed`)

        // remove current user id from list of followers locally
        setUserInfo(prev => ({
                ...prev,
                followers: prev.followers.filter(id => id !== currentUser.id)
            }));


    } else {

        // follow user
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/${userInfo._id}/follow`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

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
