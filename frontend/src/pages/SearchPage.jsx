import { useState, React, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import PostFeed from "../components/posts/PostFeed";
import SearchBar from "../components/layout/SearchBar";
import { useSearchParams, Link } from "react-router-dom";

function SearchPage({ currentUser, setCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  // Paginerings-states för inlägg
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const observer = useRef();

  // Funktion för att hämta sökresultat med paginering för posts
  const getSearchResults = async (currentPage, isInitialLoad = false) => {
    if (isInitialLoad) {
      setError("");
    } else {
      setLoadingMorePosts(true);
    }

    try {
      const response = await api.get(`/search`, {
        params: { query: searchQuery, page: currentPage, limit: 10 }
      });

      const { posts: newPosts, users: fetchedUsers, hasMore } = response.data;

      setPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
      setHasMorePosts(hasMore);

      if (isInitialLoad) {
        setUsers(fetchedUsers || []);

        // UX: Om inga inlägg hittas men användare finns, växla till "users"-fliken
        if (newPosts?.length === 0 && fetchedUsers?.length > 0) {
          setActiveTab("users");
        } else {
          setActiveTab("posts");
        }
      }
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Search failed. Please try again.");
    } finally {
      setLoadingMorePosts(false);
    }
  };

  // Nollställ och sök på nytt när sökfrasen ändras
  useEffect(() => {
    if (searchQuery) {
      setPage(1);
      setHasMorePosts(true);
      getSearchResults(1, true);
    } else {
      setPosts([]);
      setUsers([]);
    }
  }, [searchQuery]);

  // Hämta fler inlägg när 'page' ökar
  useEffect(() => {
    if (page > 1) {
      getSearchResults(page, false);
    }
  }, [page]);

  // Ref-callback för oändlig skrollning på sökresultat
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
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <section className="flex-1 px-4 md:px-6 max-w-4xl mx-auto pt-24 sm:pt-28 xl:pt-8 font-sans text-gray-800 w-full">
      <div className="max-w-xl mx-auto w-full mb-6">
        {/* Searchbar */}
        <SearchBar currentUser={currentUser} />

        {/* DISPLAY TITLE AND TABS IF THERE IS A SEARCH QUERY */}
        {searchQuery && (
          <>
            <h2 className="text-gray-500 text-xs my-6">
              Results for: <span className="font-bold text-gray-800">"{searchQuery}"</span>
            </h2>

            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${
                  activeTab === "posts" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 text-center cursor-pointer ${
                  activeTab === "users" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Users ({users.length})
              </button>
            </div>
          </>
        )}
      </div>

      {/* DISPLAY ACTIVE TAB */}
      {searchQuery && (
        <div className="mt-6">
          {activeTab === "posts" && (
            <div>
              {posts.length > 0 ? (
                <PostFeed
                  posts={posts}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  handleEditPost={handleEditPost}
                  handleDeletePost={handleDeletePost}
                  layout="grid-3x3"
                  lastPostElementRef={lastPostElementRef}
                  loadingMorePosts={loadingMorePosts}
                  hasMorePosts={hasMorePosts}
                />
              ) : (
                <p className="text-gray-400 text-xs text-center mt-10">No posts found matching your search.</p>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="w-full max-w-xl mx-auto">
              {users.length > 0 ? (
                <div className="flex flex-col gap-2 w-full">
                  {users.map((u) => (
                    <Link
                      to={`/users/${u._id}`}
                      key={u._id}
                      className="flex items-center gap-3 bg-white hover:bg-gray-50/80 rounded-xl px-3.5 py-2.5 transition-all w-full border border-gray-200/80 shadow-sm hover:shadow hover:border-gray-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200/60 overflow-hidden shrink-0">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[11px] text-gray-600 font-bold">
                            {u.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-800 truncate">@{u.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs text-center mt-10">No users found matching your search.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* DISPLAY INFO TEXT IF THERE IS NO SEARCH QUERY */}
      {!searchQuery && (
        <p className="text-gray-400 text-xs text-center mt-20">
          Type something above to search for amazing workouts, tags or friends!
        </p>
      )}
    </section>
  );
}

export default SearchPage;