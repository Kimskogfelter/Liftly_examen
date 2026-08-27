import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PostFeed from "../components/posts/PostFeed";
import axios from "axios";
import { FiFolder, FiGrid } from "react-icons/fi";

function CategoryPage({ currentUser }) {

    const token = currentUser?.token;
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {


        const getCategoryPosts = async () => {
            try {
                setLoading(true);
                setError("");
                setPosts([]);

                // Här gör vi det skalbara anropet direkt till ditt backend-filter!
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/category?category=${categoryName}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(res.data.getAllPosts || res.data);


            } catch (err) {

                if (err.response?.status === 404) {
                    setPosts([]);
                } else {
                    setError("Could not fetch posts for this category.");
                }
            } finally {
                setLoading(false);
            }
        };

        getCategoryPosts();
    }, [categoryName]);

    if (loading) {
        return <p className="text-zinc-500 text-center mt-20 text-sm animate-pulse">Loading feed...</p>;
    }

    return (
        <section className="flex-1 p-6 max-w-2xl mx-auto pt-16 md:pt-6 font-sans text-gray-800">

            {/* Centrerad Header – Exakt samma layout som Saved Posts */}
            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <FiFolder size={20} className="text-black" />
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Category: <span className="text-zinc-500 font-normal">{categoryName}</span>
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    {posts.length} {posts.length === 1 ? "post" : "posts"} in this topic
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

            {/* 3x3 GRID LAYOUT */}
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                        <FiGrid size={22} />
                    </div>
                    <p className="text-zinc-700 text-sm font-semibold">No posts found in this category yet</p>
                    <p className="text-zinc-400 text-xs mt-1">Be the first to create a post for {categoryName}.</p>
                </div>
            ) : (
                <PostFeed posts={posts} layout="grid-3x3" />
            )}
        </section>
    );
}

export default CategoryPage;