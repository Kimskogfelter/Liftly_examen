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
          <li><Link to={`/users/${currentUser?.id}`}><ProfileImage image={profileImage} /></Link></li>
          <li><Link to="/savedPosts">Saved Posts</Link></li>
          {/* Create Post button */}
          <li><button onClick={onOpenCreatePost}>Create Post</button></li>

        </ul>
      </div>
      {/* Logout button */}
      <div>
          <button onClick={() => Logout(setCurrentUser, navigate)}>
          <input className="cursor-pointer bg-amber-50 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded" type="button" value="Logout" />
        </button>
      
      </div>
    </nav>
  );
}

export default Navbar;