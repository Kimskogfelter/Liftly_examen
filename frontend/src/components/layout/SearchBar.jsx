import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

function SearchBar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, tags or people..."
          className="w-full h-10 pl-10 pr-4 text-sm rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-gray-400 focus:shadow-sm"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <CiSearch size={18} className="text-gray-400" />
        </div>
      </div>
    </form>
  );
}

export default SearchBar;