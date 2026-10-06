import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import PostFeed from "../components/posts/PostFeed";
import { FiBookmark, FiChevronDown } from "react-icons/fi";

function SavedPostsPage({ currentUser, setCurrentUser }) {
  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // State för desktop och mobil dropdown
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  const mobileDropdownRef = useRef(null);

  // Paginerings-states
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const observer = useRef();

  // Stäng mobilmenyn om man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
        setExpandedMobileCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kategoristruktur som matchar Navbar
  const categoriesData = [
    { id: "All", label: "All" },
    { id: "General", label: "General" },
    {
      id: "Food",
      label: "Food",
      subcategories: ["Breakfast", "Lunch & Dinner", "Desserts", "Candy", "Snacks"]
    },
    { id: "Supplements", label: "Supplements" },
    {
      id: "Training",
      label: "Training",
      subcategories: ["Cardio", "Lifting", "CrossFit", "Powerlifting", "Running", "Other"]
    },
    {
      id: "Music",
      label: "Music",
      subcategories: ["Electronic", "Rock", "HipHop", "Pop", "R&B", "Reggaeton", "Other"]
    },
    { id: "Activewear", label: "Activewear" },
    { id: "Mindset & Recovery", label: "Mindset & Recovery" },
    { id: "Helpme", label: "Helpme" },
  ];

  // Funktion för att hämta sparade inlägg
  const getSavedPosts = async (currentPage, isInitialLoad = false) => {
    if (isInitialLoad) {
      setError("");
    } else {
      setLoadingMorePosts(true);
    }

    try {
      const response = await api.get(`/users/savedposts?page=${currentPage}&limit=10`);
      const { savedPosts: newPosts, hasMore, totalPosts } = response.data;

      setPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
      setTotalPosts(totalPosts);
      setHasMorePosts(hasMore);
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Saved posts could not be fetched. Please try again.");
    } finally {
      setLoadingMorePosts(false);
    }
  };

  useEffect(() => {
    if (token) {
      setPage(1);
      setHasMorePosts(true);
      getSavedPosts(1, true);
    }
  }, [token]);

  useEffect(() => {
    if (page > 1) {
      getSavedPosts(page, false);
    }
  }, [page]);

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

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === "All") return true;

    const matchesCategory = post.category?.toLowerCase() === selectedCategory.toLowerCase();

    if (selectedSubCategory) {
      return matchesCategory && post.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase();
    }

    return matchesCategory;
  });

  const handleCategoryClick = (catId) => {
    if (selectedCategory === catId && !selectedSubCategory) {
      setExpandedCategory(expandedCategory === catId ? null : catId);
    } else {
      setSelectedCategory(catId);
      setSelectedSubCategory(null);
      setExpandedCategory(catId);
    }
  };

  const handleSubCategoryClick = (catId, sub) => {
    setSelectedCategory(catId);
    setSelectedSubCategory(sub);
  };

  const handleMobileSelect = (catId, sub = null) => {
    setSelectedCategory(catId);
    setSelectedSubCategory(sub);
    setIsMobileDropdownOpen(false);
    setExpandedMobileCategory(null);
  };

  const getDisplayCategoryName = () => {
    if (selectedSubCategory) {
      return `${selectedCategory} → ${selectedSubCategory}`;
    }
    return selectedCategory;
  };

  return (
    <section className="flex-1 w-full max-w-4xl mx-auto px-2 md:px-6 pb-10 pt-20 xl:pt-6 font-sans text-gray-800 relative">
      {/* Header */}
      <div className="w-full text-center mb-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FiBookmark size={20} className="text-black fill-black" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">Saved Posts</h1>
        </div>

        {/* Diskret undertitel som anpassar sig efter vald kategori */}
        {totalPosts > 0 && (
          <p className="text-xs text-zinc-400 font-medium">
            {selectedCategory === "All" ? (
              <>{totalPosts} {totalPosts === 1 ? "saved post" : "saved posts"} in your collection</>
            ) : (
              <>{filteredPosts.length} {filteredPosts.length === 1 ? "saved post" : "saved posts"} in <span className="font-semibold text-zinc-600">{getDisplayCategoryName()}</span></>
            )}
          </p>
        )}

        {/* MOBIL & IPAD: Diskret kategori-knapp */}
        {posts.length > 0 && (
          <div className="xl:hidden flex justify-center mt-3 relative" ref={mobileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
              className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg px-3 py-1.5 flex items-center gap-2 focus:outline-none cursor-pointer transition-colors font-medium"
            >
              <span>Category: {getDisplayCategoryName()}</span>
              <FiChevronDown size={12} className="text-zinc-500" />
            </button>

            {isMobileDropdownOpen && (
              <div className="absolute top-full mt-1 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50 text-xs text-zinc-700 max-h-72 overflow-y-auto text-left [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                <button
                  type="button"
                  onClick={() => handleMobileSelect("All")}
                  className={`w-full text-left px-3.5 py-1.5 hover:bg-zinc-100 transition-colors ${selectedCategory === "All" ? "font-bold text-black bg-zinc-50" : ""}`}
                >
                  All
                </button>

                {categoriesData.filter(c => c.id !== "All").map((cat) => {
                  const isExp = expandedMobileCategory === cat.id;
                  const isCatActive = selectedCategory === cat.id && !selectedSubCategory;

                  return (
                    <div key={cat.id}>
                      <div
                        onClick={() => {
                          if (cat.subcategories) {
                            setExpandedMobileCategory(isExp ? null : cat.id);
                          } else {
                            handleMobileSelect(cat.id);
                          }
                        }}
                        className={`w-full text-left px-3.5 py-1.5 hover:bg-zinc-100 transition-colors flex items-center justify-between cursor-pointer ${isCatActive ? "font-bold text-black bg-zinc-50" : ""}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); handleMobileSelect(cat.id); }}>
                          {cat.label} {cat.subcategories && <span className="text-xs text-zinc-400 font-normal">(All)</span>}
                        </span>
                        {cat.subcategories && (
                          <FiChevronDown size={11} className={`text-zinc-400 transition-transform ${isExp ? "rotate-180" : ""}`} />
                        )}
                      </div>

                      {cat.subcategories && isExp && (
                        <div className="bg-zinc-50 py-0.5">
                          {cat.subcategories.map((sub) => {
                            const isSubActive = selectedCategory === cat.id && selectedSubCategory === sub;
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => handleMobileSelect(cat.id, sub)}
                                className={`w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-100 text-xs ${isSubActive ? "font-bold text-black bg-zinc-100" : "text-zinc-500"}`}
                              >
                                └ {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
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
              <FiBookmark size={22} />
            </div>
            <p className="text-zinc-600 text-sm font-semibold">No saved posts yet</p>
            <p className="text-zinc-400 text-xs mt-1">Posts you save will appear here in your collection.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-zinc-500 text-xs font-medium">
              No saved posts found in <span className="font-bold">{getDisplayCategoryName()}</span>.
            </p>
          </div>
        ) : (
          <PostFeed
            posts={filteredPosts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            layout="grid-3x3"
            getSavedPosts={() => getSavedPosts(1, true)}
            lastPostElementRef={lastPostElementRef}
            loadingMorePosts={loadingMorePosts}
            hasMorePosts={hasMorePosts}
          />
        )}
      </div>

      {/* DESKTOP-MENY */}
      {posts.length > 0 && (
        <aside className="hidden xl:block fixed left-[calc(50%+28rem)] top-24 w-48 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-3">
            Categories
          </h2>
          <div className="flex flex-col gap-0.5 w-full text-xs">
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedSubCategory(null); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === "All" ? "font-bold text-black bg-zinc-100" : "font-normal text-zinc-500 hover:text-black hover:bg-zinc-50"
              }`}
            >
              All
            </button>

            {categoriesData.filter(c => c.id !== "All").map((cat) => {
              const isActive = selectedCategory === cat.id && !selectedSubCategory;
              const isExpanded = expandedCategory === cat.id;

              return (
                <div key={cat.id} className="w-full">
                  <div
                    onClick={() => {
                      if (cat.subcategories) {
                        setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                      } else {
                        setSelectedCategory(cat.id);
                        setSelectedSubCategory(null);
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      isActive ? "font-bold text-black bg-zinc-100" : "font-normal text-zinc-500 hover:text-black hover:bg-zinc-50"
                    }`}
                  >
                    <span onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory(null);
                      if (cat.subcategories) setExpandedCategory(cat.id);
                    }}>
                      {cat.label} {cat.subcategories && <span className="text-xs text-zinc-400 font-normal">(All)</span>}
                    </span>
                    {cat.subcategories && (
                      <FiChevronDown size={11} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    )}
                  </div>

                  {/* Underkategorier i desktopmenyn */}
                  {cat.subcategories && isExpanded && (
                    <div className="flex flex-col pl-3 py-1 space-y-0.5">
                      {cat.subcategories.map((sub) => {
                        const isSubActive = selectedCategory === cat.id && selectedSubCategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => handleSubCategoryClick(cat.id, sub)}
                            className={`w-full text-left px-2 py-1 rounded-md transition-colors cursor-pointer ${
                              isSubActive ? "font-bold text-black bg-zinc-100" : "text-zinc-400 hover:text-black hover:bg-zinc-50"
                            }`}
                          >
                            └ {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </section>
  );
}

export default SavedPostsPage;