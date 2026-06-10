import { useState, useEffect, React } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileImage from "../components/users/ProfileImage";
import EditProfileImage from "../components/users/EditProfileImage";
import EditProfileBio from "../components/users/EditProfileBio";
import PostFeed from "../components/posts/PostFeed";
import { handleFollowUserToggle } from "../functions/handleFollowUserToggle";
import { FaRegEdit } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

function ProfilePage({ currentUser, setCurrentUser }) {

  const [error, setError] = useState("");
  const token = currentUser?.token;

  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  const [posts, setPosts] = useState([]);

  const isAlreadyFollowing = userInfo?.followers?.includes(currentUser?.id) || false;
  
  const [showEditProfileImage, setShowEditProfileImage] = useState(false);
  const [showEditProfileBio, setShowEditProfileBio] = useState(false);

  // function to fetch user information and posts
  const getUserInfo = async () => {
    try {
      // fetched user information from backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("User info fetched successfully:", response.data.user);

      // update the user info and posts state with the fetched user information
      setUserInfo(response.data.user);
      setPosts(response.data.user.posts);

    } catch (err) {
      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "User info could not be fetched. Please try again.");
    }
  };

  // call getUserInfo function
  // [userId] re-runs the getUserInfo functions if you change to a profile page with a new user id
  useEffect(() => {
    getUserInfo();
  }, [userId]);

  // function to handle post editing and update the posts state
  const handleEditPost = (updatedPost) => {
    // Map through the posts and update the edited post in the posts state
    const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
    setPosts(updatedPosts); // Update the posts state
  };

  // function to handle post deletion and update the posts state
  const handleDeletePost = (postId) => {
    // Filter out the deleted post from the posts state
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts); // Update the posts state
  };

  return (
    <section className="flex-1 p-6 max-w-5xl mx-auto mt-8 font-sans text-gray-800">

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
      {/* display user information */}
      <div className="w-full max-w-md mx-auto bg-white p-5 mb-6 flex items-start gap-5 font-sans">

        {/* Profile image */}
        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden border border-gray-100">
          {/* IF logged in user display change image option when hovering */}
          {userInfo?._id === currentUser?.id ? (
            <div className="relative group cursor-pointer w-full h-full" onClick={() => setShowEditProfileImage(true)}>
              <ProfileImage profileImage={userInfo?.profileImage} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                <FaCamera size={12} />
              </div>
            </div>) : (
            // if another user or logged out display ONLY image
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full overflow-hidden border border-gray-100">
              <ProfileImage profileImage={userInfo?.profileImage} />
            </div>)}
        </div>
        {/* show edit profile image form */}
        {showEditProfileImage && (<EditProfileImage getUserInfo={getUserInfo} currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={() => setShowEditProfileImage(false)} />)}

        {/* Info container */}
        <div className="flex-1 space-y-3 text-left max-w-70 sm:max-w-75">

          {/* First row: username + Follow-button */}
          <div className="flex items-center justify-between gap-3 w-full">
            <h2 className="text-base md:text-lg font-bold text-black tracking-wide leading-none truncate">
              {userInfo?.username || "Username"}
            </h2>

            {/* Follow-button*/}
            {/* display follow button if the user is not the current user */}
            {userInfo?._id !== currentUser?.id && (
              <button onClick={() => handleFollowUserToggle(userInfo, setUserInfo, currentUser, isAlreadyFollowing)} className="bg-[#3A3939] hover:bg-zinc-800 text-white text-[10px] font-bold rounded transition-all cursor-pointer w-15.5 h-5.5 flex items-center justify-center shrink-0">
                {/* check if the current user is following this user */}
                {isAlreadyFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* (Second row: Posts, Followers, Following) */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div>
              <span className="font-bold text-black text-sm">{userInfo?.posts.length}</span> posts
            </div>
            <div>
              <span className="font-bold text-black text-sm">{userInfo?.followers.length}</span> followers
            </div>
            <div>
              <span className="font-bold text-black text-sm">{userInfo?.following.length}</span> following
            </div>
          </div>


          {/* Third row: User bio */}
          {/* IF logged in user display change bio option when hovering */}
          {userInfo?._id === currentUser?.id ? (
            <p
              className="text-gray-700 text-xs leading-relaxed pt-0.5 p-1.5 -m-1.5 rounded-lg cursor-pointer hover:bg-gray-50/80 hover:text-black transition-all flex items-center justify-between group w-full"
              onClick={() => setShowEditProfileBio(true)}
              title="Click to edit bio"
            >
              <span className="wrap-break-words pr-4">{userInfo?.profileBio || "No bio yet."}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-black shrink-0">
                <FaRegEdit size={14} />
              </span>
            </p>) : (
            <p className="text-gray-700 text-xs leading-relaxed max-w-xs pt-0.5">
              {userInfo?.profileBio || "No bio yet."}
            </p>)}
          {/* show edit profile bio form */}
          {showEditProfileBio && (<EditProfileBio getUserInfo={getUserInfo} currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={() => setShowEditProfileBio(false)} />)}

        </div>
      </div>


      {/* display user's posts */}
      <div>
        {/* render Post feed component to display posts */}
        <PostFeed
          posts={posts}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          layout="grid-3x3"
        />
      </div>
    </section>
  );
}

export default ProfilePage;