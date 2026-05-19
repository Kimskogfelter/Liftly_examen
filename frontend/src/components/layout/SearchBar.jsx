import React from "react";
import { CiSearch } from "react-icons/ci"; 

function SearchBar() {
  return (
    <form className="flex items-center bg-white/40 backdrop-blur-sm border border-gray-100/70 rounded-xl p-2 w-full max-w-2xl mx-auto mb-2 transition-all focus-within:bg-white/80 focus-within:border-gray-200 focus-within:shadow-sm">
      <input
        className="bg-transparent text-xs w-full focus:outline-none placeholder-gray-400 text-gray-700 block px-1"
        type="search"
        placeholder="Search posts, tags or people..."
        disabled 
      />
      <button className="text-gray-400 px-1" type="button">
        <CiSearch size={18} />
      </button>
    </form>
  );
}

export default SearchBar;