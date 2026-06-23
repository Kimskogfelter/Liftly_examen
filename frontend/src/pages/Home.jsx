import { useState, React, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";


function Home({ currentUser, setCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const token = currentUser?.token;
  const [error, setError] = useState("");

  // function to fetch posts
  const getPosts = async () => {
    try {
      // 1. Fetched ALL created posts data from backend
      const allPostsRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      console.log("Posts fetched successfully:", allPostsRes.data);
      setPosts(allPostsRes.data.getAllPosts);

      // 2. IF token only fetch posts from followed users
      if (token) {
        const followingPostsRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts/following`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Following posts fetched successfully:", followingPostsRes.data);
        setFollowingPosts(followingPostsRes.data.followingPosts);
      }

    } catch (err) {
      // Om backend skickar en 404 för "No posts could be found", vill vi kanske inte visa ett rött felmeddelande, 
      // utan bara låta listan vara tom. Vi sätter felmeddelandet om det är ett "riktigt" serverfel.
      if (err.response?.status !== 404) {
        const errorResponse = err.response?.data;
        setError(errorResponse?.message || "Posts could not be fetched. Please try again.");
      }
    }
  };

  // call getPosts function
  useEffect(() => {
    getPosts();
  }, []);

  // function to handle post editing and update the posts state
  const handleEditPost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
    setFollowingPosts(followingPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  // function to handle post deletion and update the posts state
  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setFollowingPosts(followingPosts.filter((post) => post._id !== postId));
  };

  return (
    <>
      <section className="pt-24 flex-1 p-4 max-w-5xl mx-auto">
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* TABS */}
        <div className="sticky top-20 bg-white z-10 flex border-b border-gray-100 mb-6 px-4 py-2">
          {/* ALL BUTTON */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${
              activeTab === "posts"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            All ({posts.length})
          </button>

          {/* FOLLOWING BUTTON */}
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${
              activeTab === "following"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            Following ({followingPosts.length})
          </button>
        </div>

        {/* render post feed component to display posts */}
        {activeTab === "following" && followingPosts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-10">No posts from users you follow yet.</p>
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
    </>
  );
}

export default Home;