import { useState, React, useEffect } from "react";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";
import { useSearchParams, Link } from "react-router-dom";

function SearchPage({ currentUser }) {

    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState(null);
    const token = currentUser?.token;
    const [searchParams] = useSearchParams(); // Hook to access URL search parameters
    const searchQuery = searchParams.get("query") || ""; // Get the search query from URL parameters, default to empty string if not present
    const [error, setError] = useState("");

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

                <h2 className="text-gray-500 text-xs mb-6 px-4 font-sans">
                    Results for: <span className="font-bold text-gray-800">"{searchQuery}"</span>
                </h2>

                {error && <p className="text-red-500 text-xs text-center my-4">{error}</p>}

                {/* USERS */}
                {users?.length > 0 && (
                    <div className="mb-10 px-4 font-sans">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Users</h3>
                        <div className="flex flex-wrap gap-4">
                            {users.map((u) => (
                                <Link to={`/users/${u._id}`}
                                    key={u._id}
                                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm min-w-50 cursor-pointer transition-transform"
                                >
                                    {/* Profile image */}
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {u.profileImage ? (
                                            <img src={u.profileImage} alt={u.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300" /> // Standard-avatar image if user doesn't have a profile image
                                        )}
                                    </div>
                                    {/* Username */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">@{u.username}</p>
                                        
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* POSTS */}
                <div className="mt-4">
                    {posts.length > 0 && (
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 font-sans">Posts</h3>
                    )}

                    {posts.length > 0 ? (
                        <PostFeed
                            posts={posts}
                            currentUser={currentUser}
                            handleEditPost={handleEditPost}
                            handleDeletePost={handleDeletePost}
                            layout="grid-3x3"
                        />
                    ) : (
                        posts?.length === 0 && users && users?.length === 0 && (
                            <p className="text-gray-400 text-xs text-center mt-10 font-sans">
                                No results found.
                            </p>
                        )
                    )}
                </div>
            </section>
        </>
    );
}

export default SearchPage;