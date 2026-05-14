import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/images/liftly-logo.png';

function Navbar() {
  return (
    <nav className="bg-[#0D0D0E] p-4 text-white w-[90px] h-screen text-[10px] flex flex-col justify-between items-center">
      
      <div>
        {/* Logo */}
        <div className="mb-4">
          <Link to="/home">
            <img src={logo} alt="Liftly logo" />
          </Link>
        </div>
        {/* Navigation links */}
        <ul>
          <li><Link to="/users/:userId">Profile</Link></li>
          <li><Link to="/savedPosts">Saved Posts</Link></li>
          <li><Link to="/post">Create post</Link></li>
          
        </ul>
      </div>
      {/* Logout button */}
      <div>
        <input className="cursor-pointer bg-amber-50 hover:bg-gray-600 text-black font-bold py-2 px-4 rounded" type="button" value="Logout" />
      </div>
    </nav>
  );
}

export default Navbar;