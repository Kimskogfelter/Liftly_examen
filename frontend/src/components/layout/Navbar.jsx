import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FiHome, FiBookmark, FiPlusSquare, FiLogOut } from "react-icons/fi";
import logo from '../../assets/images/liftly-logo.png';
import ProfileImage from "../users/ProfileImage";
import { logout } from "../../functions/logout";

function Navbar({ currentUser, setCurrentUser, onOpenCreatePost }) {
  const navigate = useNavigate();

  return (
    <>
      {/* =========================================================================
          1. MOBILE VIEW (Top Header + Bottom Menu)
          Only visible on mobile (block), hidden on desktop (md:hidden)
          ========================================================================= */}
      <div className="block md:hidden">

        {/* MOBILE TOP HEADER */}
        <header className="fixed top-0 left-0 w-full h-14 bg-[#0D0D0E] border-b border-zinc-800 flex items-center justify-between px-4 z-50">
          {/* Logo acts as a home button */}
          <Link to="/home">
            <img className="h-5 w-auto object-contain" src={logo} alt="Liftly logo" />
          </Link>

          {/* search icon */}
          <Link to="/search" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <CiSearch size={22} />
          </Link>
        </header>

        {/* MOBILE BOTTOM MENU (Instagram / TikTok style) */}
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#0D0D0E] border-t border-zinc-800 flex items-center justify-around px-2 z-50">
          <Link to="/home" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <FiHome size={22} />
          </Link>

          <Link to="/savedPosts" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <FiBookmark size={22} />
          </Link>

          <button onClick={onOpenCreatePost} className="text-zinc-400 hover:text-white p-2 transition-colors cursor-pointer">
            <FiPlusSquare size={22} />
          </button>

          <Link to={`/users/${currentUser?.id}`} className="p-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-800 shrink-0">
              <ProfileImage currentUser={currentUser} />
            </div>
          </Link>
        </nav>
      </div>


      {/* =========================================================================
          2. DESKTOP VIEW (Sidebar on the left side)
          Hidden on mobile (hidden), visible on desktop (md:flex)
          ========================================================================= */}
      <nav className="hidden md:flex flex-col justify-between items-center w-32 h-screen bg-[#0D0D0E] p-4 border-r border-zinc-800 fixed top-0 left-0 z-50 font-sans">

        {/* Logo + Links */}
        <div className="flex flex-col items-start w-full gap-5">
          {/* Logo */}
          <div className="shrink-0 pl-1.5">
            <Link to="/home">
              <img className="h-7 w-auto object-contain" src={logo} alt="Liftly logo" />
            </Link>
          </div>

          {/* Search Link */}
          <Link to="/search" className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all">
            <CiSearch size={16} className="shrink-0" />
            <span className="text-xs font-medium tracking-wide">Search</span>
          </Link>

          {/* Navigation links */}
          <ul className="flex flex-col items-start gap-0.5 w-full">
            {/* Profile */}
            <li className="w-full">
              <Link
                to={`/users/${currentUser?.id}`}
                className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                  <ProfileImage currentUser={currentUser} />
                </div>
                <span className="text-xs font-medium tracking-wide">Profile</span>
              </Link>
            </li>

            {/* Saved */}
            <li className="w-full">
              <Link
                to="/savedPosts"
                className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <FiBookmark size={16} className="shrink-0" />
                <span className="text-xs font-medium tracking-wide">Saved</span>
              </Link>
            </li>

            {/* Create */}
            <li className="w-full">
              {currentUser ? (
                <button
                  onClick={onOpenCreatePost}
                  className="flex items-center gap-2.5 w-full text-left py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all cursor-pointer"
                >
                  <FiPlusSquare size={16} className="shrink-0" />
                  <span className="text-xs font-medium tracking-wide">Create</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2.5 w-full text-left py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all cursor-pointer"
                >
                  <FiPlusSquare size={16} className="shrink-0" />
                  <span className="text-xs font-medium tracking-wide">Create</span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Logout at the bottom on Desktop */}
        <div className="w-full border-t border-zinc-900 pt-2">
          {currentUser ? (
            <button
              onClick={() => logout(setCurrentUser, navigate)}
              className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-500 hover:text-red-400 transition-colors text-xs font-medium cursor-pointer rounded-lg hover:bg-red-950/10"
            >
              <FiLogOut size={14} className="shrink-0" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium cursor-pointer rounded-lg hover:bg-zinc-900/50"
            >
              <FiLogOut size={14} className="shrink-0" />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;