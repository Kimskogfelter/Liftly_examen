import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function SearchBar({ currentUser }) {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {

    e.preventDefault(); // stops the form from refreshing the page on submit

    if (!searchQuery.trim()) {
      return; // Do not perform search if the query is empty or only contains whitespace
    }

    if (!currentUser) {
      navigate("/login"); // Redirect to login page if user is not logged in
    } else {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to search results page with the search query as a URL parameter
    }

  };

  return (
    <form onSubmit={handleSearch} className="fixed mt-4 top-4 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white/40 backdrop-blur-sm border border-gray-100/70 rounded-xl p-2 w-full max-w-md mb-10 transition-all focus-within:bg-white/80 focus-within:border-gray-200 focus-within:shadow-sm">
      <input
        className="bg-transparent text-xs w-full focus:outline-none placeholder-gray-400 text-gray-700 block px-1"
        type="search"
        placeholder="Search posts, tags or people..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="text-gray-400 px-1" type="submit">
        <CiSearch size={18} />
      </button>
    </form>
  );
}

export default SearchBar;