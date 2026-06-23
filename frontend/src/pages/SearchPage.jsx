import { useState, React, useEffect } from "react";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";
import SearchBar from "../components/layout/SearchBar";
import { useSearchParams, Link } from "react-router-dom";

function SearchPage({ currentUser, setCurrentUser }) {

    const token = currentUser?.token;
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams(); // Hook to access URL search parameters
    const searchQuery = searchParams.get("query") || ""; // Get the search query from URL parameters, default to empty string if not present


    // function to fetch search results from backend based on search query
    const getSearchResults = async () => {

        try {

            // fetched created posts data from backend
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/search`, {
                params: { query: searchQuery },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Search results fetched successfully:", response.data);
            // update the posts and user state with the fetched array of posts and user from the backend
            setPosts(response.data.posts);
            setUsers(response.data.users);

            // UX: If there are no post results but there are user results, automatically switch to the "users" tab. Otherwise, default to "posts".
            if (response.data.posts?.length === 0 && response.data.users?.length > 0) {
                setActiveTab("users");
            } else {
                setActiveTab("posts");
            }

        } catch (err) {

            // handle errors and display error message to user
            const errorResponse = err.response.data;
            setError(errorResponse.message || "Search failed. Please try again.");
        }
    };

    // call getSearchResults function
    useEffect(() => {
        if (searchQuery) {
            getSearchResults();
        }
    }, [searchQuery]); // Re-run the effect whenever the search query changes


    // function to handle post editing and update the posts state
    const handleEditPost = (updatedPost) => {
        // Map through the posts and update the edited post in the posts state
        const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
        setPosts(updatedPosts); // Update the posts state
    };

    // function to handle post deletion and update the posts state
    const handleDeletePost = (postId) => {
        const updatedPosts = posts.filter((post) => post._id !== postId);
        setPosts(updatedPosts);
    };



    return (
        <>
            <section className="pt-24 flex-1 p-4 max-w-5xl mx-auto">
                {/* SEARCHBAR */}
                <SearchBar currentUser={currentUser} />

                {error && <p className="text-red-500 text-xs text-center my-4">{error}</p>}

                {/* 1. DISPLAY TITLE IF THERE IS A SEARCH QUERY */}
                {searchQuery && (
                    <h2 className="text-gray-500 text-xs mb-6 px-4 font-sans">
                        Results for: <span className="font-bold text-gray-800">"{searchQuery}"</span>
                    </h2>
                )}

                {/* 2. SHOW TABS IF THERE IS A SEARCH QUERY */}
                {searchQuery && (
                    <>
                        {/* TABS */}
                        <div className="flex border-b border-gray-100 mb-6 px-4">
                            <button
                                onClick={() => setActiveTab("posts")}
                                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${activeTab === "posts" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                Posts ({posts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${activeTab === "users" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                Users ({users.length})
                            </button>
                        </div>

                        {/* DISPLAY ACTIVE TAB */}
                        {activeTab === "posts" && (
                            <div>
                                {posts.length > 0 ? (
                                    <PostFeed posts={posts} currentUser={currentUser} setCurrentUser={setCurrentUser} handleEditPost={handleEditPost} handleDeletePost={handleDeletePost} layout="grid-3x3" />
                                ) : (
                                    <p className="text-gray-400 text-xs text-center mt-10">No posts found matching your search.</p>
                                )}
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="px-4">
                                {users.length > 0 ? (
                                    <div className="flex flex-wrap gap-4">
                                        {users.map((u) => (
                                            <Link to={`/users/${u._id}`} key={u._id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm min-w-50 transition-all">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                    {u.profileImage ? <img src={u.profileImage} alt={u.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-300" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">@{u.username}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-xs text-center mt-10">No users found matching your search.</p>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* 3. SHOW TEXT IF SEARCH QUERY IS EMPTY (!searchQuery) */}
                {!searchQuery && (
                    <p className="text-gray-400 text-xs text-center mt-20 font-sans">
                        Type something above to search for amazing workouts, tags or friends!
                    </p>
                )}
            </section>
        </>
    );
}

export default SearchPage;