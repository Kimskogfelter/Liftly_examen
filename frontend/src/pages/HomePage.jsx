import { useState, React, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";

function HomePage({ currentUser, setCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const token = currentUser?.token;
  const [error, setError] = useState("");

  const getPosts = async () => {
    try {
      const allPostsRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      setPosts(allPostsRes.data.getAllPosts);

      if (token) {
        const followingPostsRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts/following`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingPosts(followingPostsRes.data.followingPosts);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        const errorResponse = err.response?.data;
        setError(errorResponse?.message || "Posts could not be fetched. Please try again.");
      }
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleEditPost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
    setFollowingPosts(followingPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setFollowingPosts(followingPosts.filter((post) => post._id !== postId));
  };

  return (
    <section className="flex-1 max-w-2xl mx-auto pb-10 px-4 min-h-screen pt-14 xl:pt-0">
      {/* TABS - Ligger nu direkt i toppen med rätt sticky offset */}
      <div className="sticky top-14 xl:top-0 bg-white/80 backdrop-blur-md z-30 pt-4 xl:pt-0 mb-10 xl:mb-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex">
          {/* ALL BUTTON */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${
              activeTab === "posts"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            All
          </button>

          {/* FOLLOWING BUTTON */}
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${
              activeTab === "following"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* FEED CONTENT */}
      {activeTab === "following" && followingPosts.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-10 pt-5">
          No posts from users you follow yet.
        </p>
      ) : (
        <PostFeed
          posts={activeTab === "posts" ? posts : followingPosts}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          layout="list"
        />
      )}
    </section>
  );
}

export default HomePage;