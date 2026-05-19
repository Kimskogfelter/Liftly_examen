import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileImage from "../components/users/ProfileImage";
import Feed from "../components/Feed"; 
import { useParams } from "react-router-dom";

function ProfilePage({ currentUser }) {

  const [error, setError] = useState("");
  const token = currentUser?.token;
  const { userId } = useParams(); 
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);

  // function to fetch user information and posts
  const getUserInfo = async () => {
    try {
      // fetched user information from backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("User info fetched successfully:", response.data.user);

      // update the user info and posts state with the fetched user information
      setUserInfo(response.data.user);
      setPosts(response.data.user.posts); // Storing the user's specific posts here

    } catch (err) {
      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "User info could not be fetched. Please try again.");
    }
  };

  // call getUserInfo function
  // [userId] re-runs the getUserInfo functions if you change to a profile page with a new user id
  useEffect(() => {
    getUserInfo();
  }, [userId]);

  // function to handle post editing and update the posts state
  const handleEditPost = (updatedPost) => {
    // Map through the posts and update the edited post in the posts state
    const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
    setPosts(updatedPosts); // Update the posts state
  };

  // function to handle post deletion and update the posts state
  // FIX: Changed parameter to postId since modals send up strings, not full objects
  const handleDeletePost = (postId) => {
    // Filter out the deleted post from the posts state
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts); // Update the posts state
  };

  return (
    <section className="flex-1 p-6 max-w-4xl mx-auto font-sans text-gray-800">
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

      {/* display user information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0">
          <ProfileImage image={userInfo?.profileImage} />
        </div>
        
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold text-black">{userInfo?.username}</h2>
          {/* display user's bio */}
          <p className="text-gray-600 text-sm max-w-xl leading-relaxed">
            {userInfo?.profileBio}
          </p>
        </div>
      </div>

      <hr className="border-gray-100 my-6" />

      {/* display user's posts */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-black">Posts</h3>
        {/* render Feed component to display posts */}
        <Feed
          posts={posts}
          currentUser={currentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
        />
      </div>
    </section>
  );
}

export default ProfilePage;