import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import PostFeed from "../components/posts/PostFeed";
import { FiBookmark } from "react-icons/fi";

function SavedPostsPage({ currentUser, setCurrentUser }) {
  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [posts, setPosts] = useState([]);

  // Function to fetch saved posts
  const getSavedPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/savedposts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // update the saved posts state with the fetched user information
      setPosts(response.data.savedPosts);
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Saved posts could not be fetched. Please try again.");
    }
  };

  useEffect(() => {
    if (token) getSavedPosts();
  }, [token]);

  return (
    <section className="flex-1 p-6 max-w-2xl mx-auto pt-16 md:pt-6 font-sans text-gray-800">

      {/* 1. TikTok/Instagram Style Header */}
      <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FiBookmark size={20} className="text-black fill-black" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            Saved Posts
          </h1>
        </div>
        <p className="text-xs text-zinc-500 font-medium">
          {posts.length} {posts.length === 1 ? "saved post" : "saved posts"} in your collection
        </p>
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* 2. Feed med Empty State fall-back */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <FiBookmark size={22} />
          </div>
          <p className="text-zinc-600 text-sm font-semibold">No saved posts yet</p>
          <p className="text-zinc-400 text-xs mt-1">Posts you save will appear here in your collection.</p>
        </div>
      ) : (
        <div>
          <PostFeed
            posts={posts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            layout="grid-3x3"
            getSavedPosts={getSavedPosts}
          />
        </div>
      )}

    </section>
  );
}

export default SavedPostsPage;