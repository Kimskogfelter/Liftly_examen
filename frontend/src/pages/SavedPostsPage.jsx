import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import PostFeed from "../components/posts/PostFeed";

function SavedPostsPage({ currentUser, setCurrentUser }) {

  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [posts, setPosts] = useState([]);

  // function to fetch saved posts
  const getSavedPosts = async () => {
    try {
      // fetched saved posts from backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/savedposts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Saved posts fetched successfully:", response.data.savedPosts);

      // update the saved posts state with the fetched user information
      setPosts(response.data.savedPosts);

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

  console.log("posts", posts)

return (
    <section className="flex-1 p-6 max-w-4xl mx-auto pt-6 font-sans text-gray-800">
      <div className="w-full max-w-md mx-auto mb-6">
        <h1 className="text-xl font-bold text-zinc-800 tracking-wide border-b border-zinc-200 pb-4">
          Saved posts
        </h1>
      </div>
          
      <div>
        <PostFeed
          posts={posts}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          layout="grid-3x3"
          getSavedPosts={getSavedPosts}
        />
      </div>
    </section>
  );
}

export default SavedPostsPage;