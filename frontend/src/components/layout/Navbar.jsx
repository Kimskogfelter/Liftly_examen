import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import logo from '../../assets/images/liftly-logo.png';
import ProfileImage from "../users/ProfileImage";
import CreatePost from "../posts/CreatePostModal";
import { Logout } from "../../functions/Logout";

function Navbar({ currentUser, setCurrentUser, onOpenCreatePost }) {

  const profileImage = currentUser?.profileImage;
  const navigate = useNavigate();

  return (
    // Updated width to md:w-20 (80px) for a sleek, non-intrusive desktop sidebar
    <nav className="bg-[#0D0D0E] text-white p-3 flex flex-row md:flex-col justify-between items-center w-full md:w-20 h-auto md:h-screen border-b md:border-b-0 md:border-r border-zinc-800 sticky md:fixed top-0 left-0 z-50">

      {/* Container for Logo and Links */}
      <div className="flex md:flex-col items-center w-full gap-4 md:gap-6">
        {/* Logo */}
        <div className="mb-0 md:mb-2 shrink-0">
          <Link to="/home">
            <img className="h-7 md:h-8 w-auto object-contain mx-auto" src={logo} alt="Liftly logo" />
          </Link>
        </div>

        {/* Navigation links */}
        <ul className="flex flex-row md:flex-col items-center gap-5 md:gap-6 ml-auto md:ml-0 text-[11px] font-medium tracking-wide text-center w-full justify-end md:justify-start">
          {/* Logged in users profile link */}
          <li className="order-3 md:order-0">
            <Link to={`/users/${currentUser?.id}`} className="block w-8 h-8 rounded-full overflow-hidden border border-zinc-800 hover:border-zinc-500 transition-colors mx-auto">
              <ProfileImage image={profileImage} />
            </Link>
          </li>

          <li>
            <Link to="/savedPosts" className="hover:text-zinc-400 transition-colors block py-1">
              <span className="md:block">Saved</span>
              <span className="hidden md:inline"> Posts</span>
            </Link>
          </li>

          {/* Create Post button */}
          <li className="w-full">
            <button
              onClick={onOpenCreatePost}
              className="bg-white text-black hover:bg-zinc-200 font-bold py-1 px-3 md:px-1 rounded-md transition-colors cursor-pointer text-[10px] w-full text-center block"
            >
              Create
            </button>
          </li>
        </ul>
      </div>

      {/* Logout button */}
      <div className="hidden md:block w-full pt-4 border-t border-zinc-900 text-center">
        <button
          onClick={() => Logout(setCurrentUser, navigate)}
          className="w-full text-zinc-500 hover:text-red-400 transition-colors text-[11px] font-medium py-1 cursor-pointer"
        > Logout
        </button>
      </div>

      {/* Quick Logout for mobile view */}
      <div className="block md:hidden">
        <button
          onClick={() => Logout(setCurrentUser, navigate)}
          className="text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 py-1 px-2.5 rounded border border-zinc-800 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;