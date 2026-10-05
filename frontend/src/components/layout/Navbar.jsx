import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FiHome, FiBookmark, FiPlusSquare, FiLogOut, FiChevronDown } from "react-icons/fi";
import { IoBarbellOutline } from "react-icons/io5";
import logo from '../../assets/images/liftly-logo.png';
import ProfileImage from "../users/ProfileImage";
import { logout } from "../../functions/user/logout";

function Navbar({ currentUser, setCurrentUser, onOpenCreatePost }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Desktop dropdown state
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [expandedDesktopCategory, setExpandedDesktopCategory] = useState(null);

  const dropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setExpandedCategory(null);
      }
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
        setIsDesktopDropdownOpen(false);
        setExpandedDesktopCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category, subCategory = null, isDesktop = false) => {
    if (isDesktop) {
      setIsDesktopDropdownOpen(false);
      setExpandedDesktopCategory(null);
    } else {
      setIsDropdownOpen(false);
      setExpandedCategory(null);
    }

    if (category === "All") {
      navigate("/home");
    } else if (subCategory) {
      navigate(`/category/${category}?sub=${subCategory}`);
    } else {
      navigate(`/category/${category}`);
    }
  };
// Återanvändbar meny där ALLA rader har hover, pekhand och ren text utan streck
  const renderCategoryMenu = (isDesktop = false) => {
    const setExp = isDesktop ? setExpandedDesktopCategory : setExpandedCategory;
    const expVal = isDesktop ? expandedDesktopCategory : expandedCategory;

    // Gemensam stil för vanliga knappar (All, General, Supplements, Activewear etc.)
    const standardButtonStyle = "w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white cursor-pointer";
    
    // Gemensam stil för huvudkategorier med underkategorier (Food, Training, Music)
    const accordionStyle = "w-full text-left px-3.5 py-1.5 hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer text-zinc-300 hover:text-white";

    return (
      <div className="absolute left-0 top-full mt-1 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 text-xs text-zinc-300 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        <button
          type="button"
          onClick={() => handleSelect("All", null, isDesktop)}
          className={`${standardButtonStyle} font-semibold`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => handleSelect("General", null, isDesktop)}
          className={standardButtonStyle}
        >
          General
        </button>

        {/* FOOD */}
        <div>
          <div 
            onClick={() => setExp(expVal === "Food" ? null : "Food")}
            className={accordionStyle}
          >
            <span onClick={(e) => { e.stopPropagation(); handleSelect("Food", null, isDesktop); }}>
              Food <span className="text-xs text-zinc-400 font-normal">(All)</span>
            </span>
            <FiChevronDown size={11} className={`text-zinc-500 transition-transform ${expVal === "Food" ? "rotate-180" : ""}`} />
          </div>
          {expVal === "Food" && (
            <div className="bg-zinc-950/60 py-0.5">
              {["Breakfast", "Lunch & Dinner", "Desserts", "Candy", "Snacks"].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSelect("Food", sub, isDesktop)}
                  className="w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer"
                >
                  └ {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSelect("Supplements", null, isDesktop)}
          className={standardButtonStyle}
        >
          Supplements
        </button>

        {/* TRAINING */}
        <div>
          <div 
            onClick={() => setExp(expVal === "Training" ? null : "Training")}
            className={accordionStyle}
          >
            <span onClick={(e) => { e.stopPropagation(); handleSelect("Training", null, isDesktop); }}>
              Training <span className="text-xs text-zinc-400 font-normal">(All)</span>
            </span>
            <FiChevronDown size={11} className={`text-zinc-500 transition-transform ${expVal === "Training" ? "rotate-180" : ""}`} />
          </div>
          {expVal === "Training" && (
            <div className="bg-zinc-950/60 py-0.5">
              {["Cardio", "Lifting", "CrossFit", "Powerlifting", "Running", "Other"].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSelect("Training", sub, isDesktop)}
                  className="w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer"
                >
                  └ {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MUSIC */}
        <div>
          <div 
            onClick={() => setExp(expVal === "Music" ? null : "Music")}
            className={accordionStyle}
          >
            <span onClick={(e) => { e.stopPropagation(); handleSelect("Music", null, isDesktop); }}>
              Music <span className="text-xs text-zinc-400 font-normal">(All)</span>
            </span>
            <FiChevronDown size={11} className={`text-zinc-500 transition-transform ${expVal === "Music" ? "rotate-180" : ""}`} />
          </div>
          {expVal === "Music" && (
            <div className="bg-zinc-950/60 py-0.5">
              {["Electronic", "Rock", "HipHop", "Pop", "R&B", "Reggaeton", "Other"].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSelect("Music", sub, isDesktop)}
                  className="w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer"
                >
                  └ {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSelect("Activewear", null, isDesktop)}
          className={standardButtonStyle}
        >
          Activewear
        </button>

        <button
          type="button"
          onClick={() => handleSelect("Mindset & Recovery", null, isDesktop)}
          className={standardButtonStyle}
        >
          Mindset & Recovery
        </button>

        <button
          type="button"
          onClick={() => handleSelect("Helpme", null, isDesktop)}
          className={standardButtonStyle}
        >
          Helpme
        </button>

      </div>
    );
  };

  return (
    <>
      {/* =========================================================================
          1. MOBILE VIEW (Top Header + Bottom Menu)
          ========================================================================= */}
      <div className="block xl:hidden">
        <header className="fixed top-0 left-0 w-full h-14 bg-[#0D0D0E] border-b border-zinc-800 flex items-center justify-between px-4 z-50">
          <Link to="/home">
            <img className="h-5 w-auto object-contain" src={logo} alt="Liftly logo" />
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <span>Categories</span>
              <FiChevronDown size={12} className="text-zinc-400" />
            </button>

            {isDropdownOpen && renderCategoryMenu(false)}
          </div>

          <div className="flex items-center gap-1">
            <Link to="/search" className="text-zinc-400 hover:text-white p-2 transition-colors">
              <CiSearch size={22} />
            </Link>
            {currentUser ? (
              <button
                onClick={() => logout(setCurrentUser, navigate)}
                className="text-zinc-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                title="Log out"
              >
                <FiLogOut size={18} />
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-zinc-800 text-zinc-200 px-2.5 py-1 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </header>

        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#0D0D0E] border-t border-zinc-800 flex items-center justify-around px-2 z-50">
          <Link to="/home" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <FiHome size={22} />
          </Link>
          <Link to="/savedPosts" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <FiBookmark size={22} />
          </Link>
          <Link to="/training" className="text-zinc-400 hover:text-white p-2 transition-colors">
            <IoBarbellOutline size={22} />
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
      <nav className="hidden xl:flex flex-col justify-between items-center w-32 h-screen bg-[#0D0D0E] p-4 border-r border-zinc-800 fixed top-0 left-0 z-50 font-sans">
        <div className="flex flex-col items-start w-full gap-5">
          <div className="shrink-0 pl-1.5">
            <Link to="/home">
              <img className="h-7 w-auto object-contain" src={logo} alt="Liftly logo" />
            </Link>
          </div>

          <Link to="/search" className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all">
            <CiSearch size={16} className="shrink-0" />
            <span className="text-xs font-medium tracking-wide">Search</span>
          </Link>

          <ul className="flex flex-col items-start gap-0.5 w-full">
            <li className="w-full">
              <Link to={`/users/${currentUser?.id}`} className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                  <ProfileImage currentUser={currentUser} />
                </div>
                <span className="text-xs font-medium tracking-wide">Profile</span>
              </Link>
            </li>

            <li className="w-full">
              <Link to="/savedPosts" className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all">
                <FiBookmark size={16} className="shrink-0" />
                <span className="text-xs font-medium tracking-wide">Saved</span>
              </Link>
            </li>

            <li className="w-full">
              <Link to="/training" className="flex items-center gap-2.5 w-full py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all">
                <IoBarbellOutline size={16} className="shrink-0" />
                <span className="text-xs font-medium tracking-wide">Training</span>
              </Link>
            </li>

            <li className="w-full">
              <button onClick={onOpenCreatePost} className="flex items-center gap-2.5 w-full text-left py-2 px-2 text-zinc-400 hover:text-white md:hover:bg-zinc-900/50 rounded-lg transition-all cursor-pointer">
                <FiPlusSquare size={16} className="shrink-0" />
                <span className="text-xs font-medium tracking-wide">Create</span>
              </button>
            </li>

            {/* DESKTOP CATEGORY BUTTON */}
            <li className="w-full relative mt-2" ref={desktopDropdownRef}>
              <div className="px-2 mb-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-600">Category</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
                className="w-full text-xs text-zinc-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-zinc-900/50 flex items-center justify-between cursor-pointer font-medium transition-colors"
              >
                <span>All</span>
                <FiChevronDown size={12} />
              </button>

              {isDesktopDropdownOpen && renderCategoryMenu(true)}
            </li>
          </ul>
        </div>

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