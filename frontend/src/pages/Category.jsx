import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Category({ currentUser }) {

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
    <section className="pt-6 pb-24 max-w-4xl mx-auto px-4 font-sans">
      
        <div className="mb-6 border-b border-zinc-200 pb-4">
            <h1 className="text-xl font-bold text-zinc-800 tracking-wide">
                Category: <span className="text-zinc-500 font-medium">{categoryName}</span>
            </h1>
        </div>

        {/* 3x3 GRID LAYOUT */}
        {posts.length === 0 ? (
            <div className="text-center mt-16">
                <p className="text-zinc-500 text-sm">No posts found in this category yet.</p>
            </div>
        ) : (
            <div className="w-full grid grid-cols-3 gap-1 md:gap-2">
                {/* ... din map-loop ... */}
            </div>
        )}
    </section>
  );
}

export default Category;