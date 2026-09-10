import React, { useState, useEffect } from "react";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";
import { FiBookmark } from "react-icons/fi";

function SavedPostsPage({ currentUser, setCurrentUser }) {
  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { id: "All", label: "All" },
    { id: "General", label: "General" },
    { id: "Breakfast", label: "Breakfast" },
    { id: "Lunch & Dinner", label: "Lunch & Dinner" },
    { id: "Desserts", label: "Desserts" },
    { id: "Candy", label: "Candy" },
    { id: "Snacks", label: "Snacks" },
    { id: "Supplements", label: "Supplements" },
    { id: "Training", label: "Training" },
    { id: "Cardio", label: "Cardio" },
    { id: "Lifting", label: "Lifting" },
    { id: "Music", label: "Music" },
    { id: "Activewear", label: "Activewear" },
    { id: "Mindset & Recovery", label: "Mindset & Recovery" },
    { id: "Helpme", label: "Helpme" },
  ];

  const getSavedPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/savedposts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.savedPosts);
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Saved posts could not be fetched. Please try again.");
    }
  };

  useEffect(() => {
    if (token) getSavedPosts();
  }, [token]);

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    /* 🔴 KORRIGERAT: Separerad sido-padding (px) och topp-padding (pt) så att titeln alltid knuffas ner under headern på iPad */
    <section className="flex-1 w-full max-w-4xl mx-auto px-2 md:px-6 pb-10 pt-20 xl:pt-6 font-sans text-gray-800 relative">

      {/* Header */}
      <div className="w-full text-center mb-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FiBookmark size={20} className="text-black fill-black" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            Saved Posts
          </h1>
        </div>

        {/* MOBIL & IPAD: Kategori-scroll (visas under xl) */}
        {posts.length > 0 && (
          <div className="xl:hidden w-full max-w-[calc(100vw-2rem)] mx-auto overflow-x-auto no-scrollbar py-2 mt-3">
            <div className="flex items-center gap-2 w-max px-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* INNEHÅLL */}
      <div className="w-full">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
              <FiBookmark size={22} />
            </div>
            <p className="text-zinc-600 text-sm font-semibold">No saved posts yet</p>
            <p className="text-zinc-400 text-xs mt-1">Posts you save will appear here in your collection.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-zinc-500 text-xs font-medium">
              No saved posts found in <span className="font-bold">{selectedCategory}</span>.
            </p>
          </div>
        ) : (
          <PostFeed
            posts={filteredPosts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            layout="grid-3x3"
            getSavedPosts={getSavedPosts}
          />
        )}
      </div>

      {/* DESKTOP-MENY: Placerad till höger (endast på XL-skärmar) */}
      {posts.length > 0 && (
        <aside className="hidden xl:block absolute left-[102%] top-6 w-44">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-3">
            Categories
          </h2>
          <div className="flex flex-col gap-0.5 w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "font-bold text-black bg-zinc-100"
                      : "font-normal text-zinc-500 hover:text-black hover:bg-zinc-50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </aside>
      )}

    </section>
  );
}

export default SavedPostsPage;