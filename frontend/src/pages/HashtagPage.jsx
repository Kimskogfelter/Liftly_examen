import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostFeed from "../components/posts/PostFeed";
import axios from "axios";
import { FiHash, FiGrid } from "react-icons/fi";

function HashtagPage({ currentUser }) {
  const token = currentUser?.token;
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHashtagPosts = async () => {
      try {
        setLoading(true);
        setError("");
        setPosts([]);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/hashtag?hashtag=${hashtag}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(res.data.getAllPosts || res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setPosts([]);
        } else {
          setError("Could not fetch posts for this hashtag.");
        }
      } finally {
        setLoading(false);
      }
    };

    getHashtagPosts();
  }, [hashtag]);

  if (loading) {
    return (
      <p className="text-zinc-500 text-center mt-20 text-sm animate-pulse">
        Loading feed...
      </p>
    );
  }

  return (
    
    <section className="flex-1 px-2 md:px-6 max-w-4xl mx-auto pt-20 xl:pt-6 pb-10 font-sans text-gray-800">

      {/* Centrerad Header – Matchar Category & Saved Posts */}
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
          <PostFeed posts={posts} layout="grid-3x3" />
        )}
      </div>
    </section>
  );
}

export default HashtagPage;