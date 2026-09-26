import { useState, React, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import PostFeed from "../components/posts/PostFeed";

function HomePage({ currentUser, setCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [error, setError] = useState("");

  // Paginerings-states
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  // Observer-ref för infinite scroll
  const observer = useRef();

  // Funktion för att hämta inlägg baserat på aktiv sida & flik
  const fetchPosts = async (currentPage, isInitialLoad = false) => {
    setLoadingMorePosts(true);

    try {
      if (activeTab === "posts") {
        // Hämta publika inlägg med pagination
        const response = await api.get(`/posts?page=${currentPage}&limit=10`);
        const { posts: newPosts, hasMore } = response.data;

        setPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
        setHasMorePosts(hasMore);
      } else if (activeTab === "following" && currentUser) {
        // Hämta following-inlägg med pagination
        const response = await api.get(`/posts/following?page=${currentPage}&limit=10`);
        const { followingPosts: newPosts, hasMore } = response.data;

        setFollowingPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
        setHasMorePosts(hasMore);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Posts could not be fetched.");
      } else {
        setHasMorePosts(false);
      }
    } finally {
      setLoadingMorePosts(false);
    }
  };

  // Återställ sida & ladda om när man byter flik
  // Lyssna på när ett nytt inlägg skapas (från CreatePostModal i Navbaren)
  useEffect(() => {
    setPage(1);
    setHasMorePosts(true);
    fetchPosts(1, true);

    // Lyssna på när ett nytt inlägg skapas
    const handleNewPost = () => {
      setPage(1);
      setHasMorePosts(true);
      fetchPosts(1, true);
    };

    window.addEventListener("postCreated", handleNewPost);
    return () => window.removeEventListener("postCreated", handleNewPost);
  }, [activeTab]);

  // Hämta fler inlägg när 'page' ökar
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, false);
    }
  }, [page]);


  // Ref-callback som kopplas till det sista elementet i PostFeed
  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingMorePosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePosts) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMorePosts, hasMorePosts]
  );

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
      {/* TABS */}
      <div className="sticky top-14 xl:top-0 bg-white/80 backdrop-blur-md z-30 pt-4 xl:pt-0 mb-10 xl:mb-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${activeTab === "posts"
              ? "border-gray-800 text-gray-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${activeTab === "following"
              ? "border-gray-800 text-gray-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* FEED CONTENT */}
      {activeTab === "following" && followingPosts.length === 0 && !loadingMorePosts ? (
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
          lastPostElementRef={lastPostElementRef}
          loadingMorePosts={loadingMorePosts}
          hasMorePosts={hasMorePosts}
        />
      )}
    </section>
  );
}

export default HomePage;