import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PostFeed from "../components/posts/PostFeed";
import api from "../api/axios";
import { FiFolder, FiGrid } from "react-icons/fi";

function CategoryPage({ currentUser }) {
    const { categoryName } = useParams();
    const [searchParams] = useSearchParams();
    const subCategory = searchParams.get("sub");

    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Paginerings-states
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);

    const observer = useRef();

    // Funktion för att hämta kategoriposters med stöd för subCategory
    const fetchCategoryPosts = async (currentPage, isInitialLoad = false) => {
        if (isInitialLoad) {
            setLoading(true);
            setError("");
        } else {
            setLoadingMorePosts(true);
        }

        try {
            let url = `/posts/category?category=${categoryName}&page=${currentPage}&limit=10`;
            if (subCategory) {
                url += `&subCategory=${encodeURIComponent(subCategory)}`;
            }

            const res = await api.get(url);
            const { posts: newPosts, hasMore, totalPosts } = res.data;

            setPosts((prev) => (isInitialLoad ? newPosts : [...prev, ...newPosts]));
            if (totalPosts !== undefined) {
                setTotalPosts(totalPosts);
            }
            setHasMorePosts(hasMore);
        } catch (err) {
            if (err.response?.status === 404) {
                if (isInitialLoad) setPosts([]);
                setHasMorePosts(false);
            } else {
                setError("Could not fetch posts for this category.");
            }
        } finally {
            setLoading(false);
            setLoadingMorePosts(false);
        }
    };

    // Återställ och hämta sida 1 vid nyladdning eller om kategori/underkategori byts
    useEffect(() => {
        setPage(1);
        setHasMorePosts(true);
        fetchCategoryPosts(1, true);
    }, [categoryName, subCategory]);

    // Hämta fler inlägg när page höjs
    useEffect(() => {
        if (page > 1) {
            fetchCategoryPosts(page, false);
        }
    }, [page]);

    // IntersectionObserver för oändlig skrollning
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

    const getDisplayTitle = () => {
        if (subCategory && subCategory !== categoryName) {
            return `${categoryName} → ${subCategory}`;
        }
        return categoryName;
    };

    if (loading) {
        return <p className="text-zinc-500 text-center mt-20 text-sm animate-pulse">Loading feed...</p>;
    }

    return (
        <section className="flex-1 md:px-6 max-w-4xl mx-auto pt-20 xl:pt-6 font-sans text-gray-800">
            {/* Header */}
            <div className="w-full text-center mb-6 border-b border-zinc-200 pb-4">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiFolder size2={20} className="text-black" />
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Category: <span className="text-zinc-500 font-normal">{getDisplayTitle()}</span>
                    </h1>
                </div>

                {totalPosts > 0 && (
                    <p className="text-xs text-zinc-400 font-medium mt-1">
                        {totalPosts} {totalPosts === 1 ? "post found" : "posts found"}
                    </p>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 text-center font-medium">
                    {error}
                </div>
            )}

            {/* 3x3 GRID LAYOUT / POST FEED */}
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                        <FiGrid size={22} />
                    </div>
                    <p className="text-zinc-700 text-sm font-semibold">No posts found in this category yet</p>
                    <p className="text-zinc-400 text-xs mt-1">Be the first to create a post for {getDisplayTitle()}.</p>
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
        </section>
    );
}

export default CategoryPage;