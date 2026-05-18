import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import ProfileImage from "../components/ProfileImage";

function ProfilePage({ currentUser }) {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const token = currentUser?.token;
  const userId  = currentUser?.id;
  const [userInfo, setUserInfo] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

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

            // update the user info state with the fetched user information
            setUserInfo(response.data.user);

        } catch (err) {

            // handle errors and display error message to user
            const errorResponse = err.response?.data;
            setError(errorResponse?.message || "User info could not be fetched. Please try again.");
        }
    };

    // call getUserInfo function
    useEffect(() => {
        getUserInfo();
    }, []);

  return (
    <div className="flex">
      {/* Navbar */}
      {/* onOpenCreatePost prop passed to Navbar */}
      <Navbar currentUser={currentUser} onOpenCreatePost={() => setShowCreatePost(true)} />
      {/* render CreatePost component when showCreatePost is true */}
      {
        showCreatePost && (
          <CreatePost
            setPosts={setPosts}
            posts={posts}
            currentUser={currentUser}
            onClose={() => setShowCreatePost(false)}
          />
        )
      }
      <section className="flex-1 p-4">
        {/* display user information */}
        <div>
          <div>
            <h2>{userInfo?.username}</h2>
            <ProfileImage image={userInfo?.profileImage} />
          </div>
          {/* display user's bio */}
          <div>
            <p>{userInfo?.profileBio}</p>
          </div>
        </div>
        {/* display user's posts */}
        <div></div>
      </section>
    </div>
  );
}

export default ProfilePage;