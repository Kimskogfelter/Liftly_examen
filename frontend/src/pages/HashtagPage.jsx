import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import PostFeed from "../components/posts/PostFeed";
import api from "../api/axios";
import { FiHash, FiGrid } from "react-icons/fi";

function HashtagPage({ currentUser }) {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Paginerings-states
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const observer = useRef();

  // Funktion för att hämta hashtag-inlägg med paginering
  const fetchHashtagPosts = async (currentPage, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
      setError("");
    } else {
      setLoadingMorePosts(true);
    }

    try {
      const res = await api.get(`/posts/hashtag?hashtag=${hashtag}&page=${currentPage}&limit=10`);
      const { posts: newPosts, hasMore } = res.data;

      setPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
      setHasMorePosts(hasMore);
    } catch (err) {
      if (err.response?.status === 404) {
        if (isInitialLoad) setPosts([]);
        setHasMorePosts(false);
      } else {
        setError("Could not fetch posts for this hashtag.");
      }
    } finally {
      setLoading(false);
      setLoadingMorePosts(false);
    }
  };

  // Återställ sida & ladda om vid ändrad hashtag
  useEffect(() => {
    setPage(1);
    setHasMorePosts(true);
    fetchHashtagPosts(1, true);
  }, [hashtag]);

  // Hämta fler inlägg när 'page' ökar
  useEffect(() => {
    if (page > 1) {
      fetchHashtagPosts(page, false);
    }
  }, [page]);

  // Observer-callback för oändlig skrollning
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || loadingMorePosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePosts) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMorePosts, hasMorePosts]
  );

  if (loading) {
    return (
      <p className="text-zinc-500 text-center mt-20 text-sm animate-pulse">
        Loading feed...
      </p>
    );
  }

  return (
    <section className="flex-1 px-2 md:px-6 max-w-4xl mx-auto pt-20 xl:pt-6 pb-10 font-sans text-gray-800">
      {/* Centrerad Header */}
      <div className="w-full text-center mb-6 border-b border-zinc-200 pb-4">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <FiHash size={20} className="text-black" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            Hashtag: <span className="text-zinc-500 font-normal">{hashtag}</span>
          </h1>
        </div>
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* INNEHÅLL */}
      <div className="w-full">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
              <FiGrid size={22} />
            </div>
            <p className="text-zinc-700 text-sm font-semibold">
              No posts found for this hashtag yet
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              Be the first to create a post with #{hashtag}.
            </p>
          </div>
        ) : (
          <PostFeed 
            posts={posts} 
            layout="grid-3x3" 
            lastPostElementRef={lastPostElementRef}
            loadingMorePosts={loadingMorePosts}
            hasMorePosts={hasMorePosts}
          />
        )}
      </div>
    </section>
  );
}

export default HashtagPage;