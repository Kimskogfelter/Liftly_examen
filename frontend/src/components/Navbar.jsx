import React from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import logo from '../assets/images/liftly-logo.png';
import ProfileImage from "./ProfileImage";
import CreatePost from "./CreatePost";

function Navbar({ currentUser }) {

  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  // ? is there to prevent errors if currentUser is null or undefined
  const token = currentUser?.token;
  const profileImage = currentUser?.profileImage;
  const userId = currentUser?.id;

  return (
    <nav className="bg-[#0D0D0E] p-4 text-white w-22.5 h-screen text-[10px] flex flex-col justify-between items-center">

      <div>
        {/* Logo */}
        <div className="mb-4">
          <Link to="/home">
            <img src={logo} alt="Liftly logo" />
          </Link>
        </div>
        {/* search bar */}
        <form className="mb-2">
          <input className="w-[70%]" type="search" placeholder="Search..." />
          <button className="cursor-pointer" type="submit"><CiSearch /></button>
        </form>
        {/* Navigation links */}
        <ul>
          <li><Link to={`/users/${userId}`}><ProfileImage image={profileImage} /></Link></li>
          <li><Link to="/savedPosts">Saved Posts</Link></li>
          <li><Link to="/post"><CreatePost onCreatePost={createPost} currentUser={currentUser} /></Link></li>

        </ul>
      </div>
      {/* Logout button */}
      {/* only shown when user is logged in with a valid token */}
      <div>{token ?
        <Link to="/logout">
          <input className="cursor-pointer bg-amber-50 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded" type="button" value="Logout" />
        </Link> : <Link to="/login">Login</Link>
      }
      </div>
    </nav>
  );
}

export default Navbar;