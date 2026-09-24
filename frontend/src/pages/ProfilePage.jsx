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
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border border-gray-100">
            {targetUser?._id === currentUser?.id ? (
              <div className="relative group cursor-pointer w-full h-full" onClick={() => setShowEditProfileImage(true)}>
                <ProfileImage profileImage={targetUser?.profileImage} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                  <FaCamera size={12} />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border border-gray-100">
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
              className={`w-full py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                isAlreadyFollowing
                  ? "bg-gray-100 hover:bg-gray-200 text-black border border-gray-300"
                  : "bg-black hover:bg-zinc-800 text-white"
              }`}
            >
              {isAlreadyFollowing ? "Following" : "Follow"}
            </button>
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