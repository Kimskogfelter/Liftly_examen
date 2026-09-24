import { useState, useEffect, React, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProfileImage from "../components/users/ProfileImage";
import EditProfileImage from "../components/users/EditProfileImage";
import EditProfileBio from "../components/users/EditProfileBio";
import PostFeed from "../components/posts/PostFeed";
import { FollowModal } from "../components/users/FollowModal";
import { handleFollowUserToggle } from "../functions/user/handleFollowUserToggle";
import { FaRegEdit, FaCamera } from "react-icons/fa";

function ProfilePage({ currentUser, setCurrentUser }) {
  const [error, setError] = useState("");
  const { userId } = useParams();

  const [targetUser, setTargetUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Paginerings-states
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const observer = useRef();

  const [showEditProfileImage, setShowEditProfileImage] = useState(false);
  const [showEditProfileBio, setShowEditProfileBio] = useState(false);
  const [followModalType, setFollowModalType] = useState(null);

  const myId = (currentUser?._id || currentUser?.id)?.toString();
  const isAlreadyFollowing = Boolean(
    targetUser?.followers?.some((item) => {
      const followerId = typeof item === 'object' ? (item._id || item.id) : item;
      return followerId?.toString() === myId;
    })
  );

  // 1. Hämta enbart användarinformationen
  const getUserInfo = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setTargetUser(response.data.user);
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "User info could not be fetched.");
    }
  };

  // 2. Hämta användarens inlägg med paginering
  const fetchUserPosts = async (currentPage, isInitialLoad = false) => {
    if (!userId) return;
    setLoadingMorePosts(true);

    try {
      const response = await api.get(`/posts/users/${userId}?page=${currentPage}&limit=10`);
      const { userPosts, hasMore } = response.data;

      setPosts((prev) => (isInitialLoad ? userPosts : [...prev, ...userPosts]));
      setHasMorePosts(hasMore);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Posts could not be fetched.");
      } else {
        setHasMorePosts(false);
      }
    } finally {
      setLoadingMorePosts(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    setPage(1);
    setHasMorePosts(true);
    fetchUserPosts(1, true);
  }, [userId]);

  useEffect(() => {
    if (page > 1) {
      fetchUserPosts(page, false);
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

  const handleEditPost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <section className="flex-1 px-2 md:px-6 max-w-4xl mx-auto font-sans text-gray-800 pt-16 xl:pt-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

      {/* User Header Info Card */}
      <div className="w-full max-w-md mx-auto bg-white p-5 mb-6 font-sans">

        {/* ÖVRE RADEN: Bild & Info bredvid varandra */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border border-gray-100">
            {targetUser?._id === currentUser?.id ? (
              <div className="relative group cursor-pointer w-full h-full" onClick={() => setShowEditProfileImage(true)}>
                <ProfileImage profileImage={targetUser?.profileImage} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                  <FaCamera size={12} />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border border-gray-100">
                <ProfileImage profileImage={targetUser?.profileImage} />
              </div>
            )}
          </div>

          {showEditProfileImage && (
            <EditProfileImage getUserInfo={getUserInfo} currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={() => setShowEditProfileImage(false)} />
          )}

          <div className="flex-1 space-y-3 text-left min-w-0">
            <div className="flex items-center justify-between gap-3 w-full">
              <h2 className="text-base md:text-lg font-bold text-black tracking-wide leading-none truncate">
                {targetUser?.username || "Username"}
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div>
                <span className="font-bold text-black text-sm">{targetUser?.posts?.length || 0}</span> posts
              </div>
              <div className="cursor-pointer" onClick={() => setFollowModalType('followers')}>
                <span className="font-bold text-black text-sm">{targetUser?.followers?.length || 0}</span> followers
              </div>
              <div className="cursor-pointer" onClick={() => setFollowModalType('following')}>
                <span className="font-bold text-black text-sm">{targetUser?.following?.length || 0}</span> following
              </div>
            </div>

            {targetUser?._id === currentUser?.id ? (
              <p
                className="text-gray-700 text-xs leading-relaxed pt-0.5 p-1.5 -m-1.5 rounded-lg cursor-pointer hover:bg-gray-50/80 hover:text-black transition-all flex items-center justify-between group w-full"
                onClick={() => setShowEditProfileBio(true)}
                title="Click to edit bio"
              >
                <span className="wrap-break-words pr-4">{targetUser?.profileBio || "No bio yet."}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-black shrink-0">
                  <FaRegEdit size={14} />
                </span>
              </p>
            ) : (
              <p className="text-gray-700 text-xs leading-relaxed max-w-xs pt-0.5">
                {targetUser?.profileBio || "No bio yet."}
              </p>
            )}

            {showEditProfileBio && (
              <EditProfileBio getUserInfo={getUserInfo} currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={() => setShowEditProfileBio(false)} />
            )}
          </div>
        </div>

        {/* NEDRE RADEN: Knappen placerad separat under hela headern */}
        {targetUser?._id !== currentUser?.id && targetUser?._id !== currentUser?._id && (
          <div className="mt-4 w-full">
            <button
              onClick={() => handleFollowUserToggle(targetUser, setTargetUser, currentUser, setCurrentUser, isAlreadyFollowing)}
              className={`w-full py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${isAlreadyFollowing
                ? "bg-gray-100 hover:bg-gray-200 text-black border border-gray-300"
                : "bg-black hover:bg-zinc-800 text-white"
                }`}
            >
              {isAlreadyFollowing ? "Following" : "Follow"}
            </button>
          </div>
        )}

        {/* Social Links Badge Block */}
        {targetUser?.socialLinks && (
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-2 border-t border-gray-100/60">
            {/* Instagram */}
            {targetUser.socialLinks.instagram && (
              <a
                href={`https://instagram.com/${targetUser.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-pink-50/80 text-pink-600 border border-pink-100 hover:bg-pink-100/80 hover:scale-[1.02] transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>@{targetUser.socialLinks.instagram}</span>
              </a>
            )}

            {/* TikTok */}
            {targetUser.socialLinks.tiktok && (
              <a
                href={`https://tiktok.com/@${targetUser.socialLinks.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-gray-100/80 text-gray-900 border border-gray-200/80 hover:bg-gray-200/80 hover:scale-[1.02] transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 text-gray-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.56-1.27 2.56.02.82.43 1.62 1.1 2.08.79.57 1.84.7 2.76.42 1.05-.3 1.83-1.22 1.96-2.3.06-1.58.04-3.16.04-4.74V.02z" />
                </svg>
                <span>@{targetUser.socialLinks.tiktok}</span>
              </a>
            )}

            {/* YouTube */}
            {targetUser.socialLinks.youtube && (
              <a
                href={`https://youtube.com/@${targetUser.socialLinks.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-red-50/80 text-red-600 border border-red-100 hover:bg-red-100/80 hover:scale-[1.02] transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>@{targetUser.socialLinks.youtube}</span>
              </a>
            )}
          </div>
        )}

      </div>

      {/* Posts Section */}
      <div>
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
      </div>

      <FollowModal
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        userId={targetUser?._id}
        type={followModalType}
        isOpen={Boolean(followModalType)}
        onClose={() => setFollowModalType(null)}
      />
    </section>
  );
}

export default ProfilePage;