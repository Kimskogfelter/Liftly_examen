import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FiHome } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { FiPlusSquare } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import logo from '../../assets/images/liftly-logo.png';
import ProfileImage from "../users/ProfileImage";
import CreatePost from "../posts/CreatePostForm";
import { Logout } from "../../functions/Logout";

function Navbar({ currentUser, setCurrentUser, onOpenCreatePost }) {

  const profileImage = currentUser?.profileImage;
  const navigate = useNavigate();

  return (

    <nav className="bg-[#0D0D0E] text-white p-3 md:p-4 flex flex-row md:flex-col justify-between items-center w-full md:w-32 h-auto md:h-screen border-b md:border-b-0 md:border-r border-zinc-800 sticky md:fixed top-0 left-0 z-50 font-sans">

      {/* Container for Logo and Links */}
      <div className="flex md:flex-col items-center md:items-start w-full gap-4 md:gap-5">

        {/* Logo */}
        <div className="mb-0 md:mb-1 shrink-0 md:pl-1.5">
          <Link to="/home">
            <img className="h-6 md:h-7 w-auto object-contain" src={logo} alt="Liftly logo" />
          </Link>
        </div>

        {/* Navigation links */}
        <ul className="flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-0.5 ml-auto md:ml-0 w-full justify-end md:justify-start">

          {/* Profile Link */}
          <li className="w-full order-3 md:order-0">
            <Link
              to={`/users/${currentUser?.id}`}
              className="flex items-center gap-2.5 w-full py-2 md:px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                <ProfileImage image={profileImage} />
              </div>
              <span className="hidden md:inline text-xs font-medium tracking-wide">Profile</span>
            </Link>
          </li>

          {/* Saved Posts */}
          <li className="w-full">
            <Link
              to="/savedPosts"
              className="flex items-center gap-2.5 w-full py-2 md:px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <FiBookmark size={16} className="shrink-0" />
              <span className="hidden md:inline text-xs font-medium tracking-wide">Saved</span>
            </Link>
          </li>

          {/* Create Post */}
          <li className="w-full">
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-2.5 w-full text-left py-2 md:px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all cursor-pointer"
            >
              <FiPlusSquare size={16} className="shrink-0" />
              <span className="hidden md:inline text-xs font-medium tracking-wide">Create</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Logout button (Desktop) */}
      <div className="hidden md:block w-full border-t border-zinc-900 pt-2">
        <button
          onClick={() => Logout(setCurrentUser, navigate)}
          className="flex items-center gap-2.5 w-full py-2 md:px-2 text-zinc-500 hover:text-red-400 transition-colors text-xs font-medium cursor-pointer rounded-lg md:hover:bg-red-950/10"
        >
          <FiLogOut size={14} className="shrink-0" />
          <span>Logout</span>
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