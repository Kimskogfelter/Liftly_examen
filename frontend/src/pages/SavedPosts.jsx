import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import PostFeed from "../components/posts/PostFeed";

function SavedPosts({ currentUser }) {

  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [posts, setPosts] = useState([]);

  // function to fetch saved posts
  const getSavedPosts = async () => {
    try {
      // fetched saved posts from backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Saved posts fetched successfully:", response.data.user);

      // update the saved posts state with the fetched user information
      setSavedPosts(response.data.user.savedPosts);

    } catch (err) {
      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Saved posts could not be fetched. Please try again.");
    }
  };

  // call getSavedPosts function
  useEffect(() => {
    getSavedPosts();
  }, []);

  return (
    <>
      <div className="flex">
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Your saved posts</h1>
          {/* display user's saved posts */}
          <div>
            {/* render Post feed component to display posts */}
            <PostFeed
              posts={posts}
              currentUser={currentUser}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default SavedPosts;