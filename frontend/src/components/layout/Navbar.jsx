import { useNavigate, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FiHome, FiBookmark, FiPlusSquare, FiLogOut } from "react-icons/fi";
import logo from '../../assets/images/liftly-logo.png';
import ProfileImage from "../users/ProfileImage";
import { logout } from "../../functions/logout";

function Navbar({ currentUser, setCurrentUser, onOpenCreatePost, selectedCategory, setSelectedCategory }) {
  const navigate = useNavigate();

  const categories = [
    { id: "All", label: "All" },
    { id: "General", label: "General" },
    { id: "Food", label: "Food" },
    { id: "Desserts", label: "Desserts" },
    { id: "Candy", label: "Candy" },
    { id: "Snacks", label: "Snacks" },
    { id: "Training", label: "Training" },
    { id: "Cardio", label: "Cardio" },
    { id: "Lifting", label: "Lifting" },
    { id: "Music", label: "Music" },
    { id: "Activewear", label: "Activewear" },
    { id: "Helpme", label: "Helpme" },
  ];

const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    
    if (selected === "All") {
      navigate("/home");
    } else {
      // Sends user to category page with choosen category parameter
      navigate(`/category/${selected}`);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. MOBILE VIEW (Top Header + Bottom Menu)
          ========================================================================= */}
      <div className="block md:hidden">

        {/* MOBILE TOP HEADER */}
        <header className="fixed top-0 left-0 w-full h-14 bg-[#0D0D0E] border-b border-zinc-800 flex items-center justify-between px-4 z-50">
          <Link to="/home" onClick={() => setSelectedCategory("All")}>
            <img className="h-5 w-auto object-contain" src={logo} alt="Liftly logo" />
          </Link>

          {/* category dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory || "All"}
              onChange={handleCategoryChange}
              className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg p-1.5 focus:outline-none focus:border-zinc-600 max-w-25 font-sans"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0D0D0E]">
                  {cat.label}
                </option>
              ))}
            </select>

            <Link to="/search" className="text-zinc-400 hover:text-white p-2 transition-colors">
              <CiSearch size={22} />
            </Link>
          </div>
        </header>

        {/* MOBILE BOTTOM MENU */}
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#0D0D0E] border-t border-zinc-800 flex items-center justify-around px-2 z-50">
          <Link to="/home" onClick={() => setSelectedCategory("All")} className="text-zinc-400 hover:text-white p-2 transition-colors">
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
          ========================================================================= */}
      <nav className="hidden md:flex flex-col justify-between items-center w-32 h-screen bg-[#0D0D0E] p-4 border-r border-zinc-800 fixed top-0 left-0 z-50 font-sans">

        {/* Logo + Links */}
        <div className="flex flex-col items-start w-full gap-5">
          {/* Logo */}
          <div className="shrink-0 pl-1.5">
            <Link to="/home" onClick={() => setSelectedCategory("All")}>
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

            {/* DESKTOP CATEGORY DROPDOWN */}
            <li className="w-full">
              <div className="px-2 mb-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-600">Category</span>
              </div>
              <select
                value={selectedCategory || "All"}
                onChange={handleCategoryChange}
                className="w-full text-xs bg-transparent text-zinc-400 hover:text-white px-2 py-1.5 focus:outline-none cursor-pointer font-medium transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0D0D0E] text-zinc-300">
                    {cat.label}
                  </option>
                ))}
              </select>
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