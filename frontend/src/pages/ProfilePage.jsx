import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileImage from "../components/users/ProfileImage";
import PostFeed from "../components/posts/PostFeed";
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
      setPosts(response.data.user.posts);

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
    <section className="flex-1 p-6 max-w-5xl mx-auto font-sans text-gray-800">

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
      {/* display user information */}
      <div className="w-full max-w-md mx-auto bg-white p-5 mb-6 flex items-start gap-5 font-sans">

        {/* Profile image */}
        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden border border-gray-100">
          <ProfileImage image={userInfo?.profileImage} />
        </div>

        {/* Info container */}
        <div className="flex-1 space-y-3 text-left">

          {/* First row: username + Follow-button */}
          <div className="flex items-center gap-3">
            <h2 className="text-base md:text-lg font-bold text-black tracking-wide leading-none">
              {userInfo?.username || "Kim Moberg"}
            </h2>

            {/* Follow-button*/}
            <button className="bg-[#3A3939] hover:bg-zinc-800 text-white text-[10px] font-bold rounded transition-all cursor-pointer w-15.5 h-5.5 flex items-center justify-center shrink-0">
              Follow
            </button>
          </div>

          {/* (Second row: Posts, Followers, Following) */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div>
              <span className="font-bold text-black text-sm">312</span> posts
            </div>
            <div>
              <span className="font-bold text-black text-sm">21</span> followers
            </div>
            <div>
              <span className="font-bold text-black text-sm">500</span> following
            </div>
          </div>

          {/* Third row: User bio */}
          <p className="text-gray-700 text-xs leading-relaxed max-w-xs pt-0.5">
            {userInfo?.profileBio || "No bio yet."}
          </p>

        </div>
      </div>

      <hr className="border-gray-100 my-6" />

      {/* display user's posts */}
      <div>
        {/* render Post feed component to display posts */}
        <PostFeed
          posts={posts}
          currentUser={currentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          layout="grid-3x3"
        />
      </div>
    </section>
  );
}

export default ProfilePage;