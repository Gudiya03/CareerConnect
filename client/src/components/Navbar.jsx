import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const dropdownRef = useRef();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // ⭐ GET USER NAME
  const userName = localStorage.getItem("userName");

  // ⭐ AVATAR LETTER FROM NAME
  const avatarLetter = userName
    ? userName.charAt(0).toUpperCase()
    : "U";

  /* DARK MODE */

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  /* CLOSE DROPDOWN IF CLICK OUTSIDE */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  const activeLink = (path) =>
    location.pathname === path
      ? "text-indigo-500"
      : "text-gray-600 dark:text-gray-300 hover:text-indigo-500";

  const closeMenu = () => setMenuOpen(false);

  const profileRoute = role === "employer" ? "/employer/profile" : "/profile";

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-[#020617] border-b border-gray-200 dark:border-slate-800">

      <div className="w-full flex justify-between items-center px-6 py-4">

        {/* LOGO */}

        <h1
          className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/jobs")}
        >
          CareerConnect
        </h1>

        {/* DESKTOP MENU */}

        {token ? (
          <div className="hidden md:flex items-center gap-8 text-sm">

            {role === "candidate" && (
              <>
                <Link to="/jobs" className={activeLink("/jobs")}>
                  Jobs
                </Link>

                <Link
                  to="/my-applications"
                  className={activeLink("/my-applications")}
                >
                  Applications
                </Link>
              </>
            )}

            {role === "employer" && (
              <Link to="/employer" className={activeLink("/employer")}>
                Dashboard
              </Link>
            )}

            {/* THEME BUTTON */}

            <button
              onClick={toggleTheme}
              className="text-xl text-gray-500 hover:text-indigo-500"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* PROFILE AVATAR */}

            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setProfileMenu(!profileMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md hover:scale-105 transition"
              >
                {avatarLetter}
              </button>

              {/* DROPDOWN */}

              {profileMenu && (
                <div className="absolute right-0 mt-3 w-44 
                bg-white dark:bg-slate-900 
                border border-gray-200 dark:border-slate-700 
                rounded-lg shadow-lg overflow-hidden">

                  <Link
                    to={profileRoute}
                    onClick={() => setProfileMenu(false)}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Profile
                  </Link>

                  {role === "candidate" && (
                    <Link
                      to="/my-applications"
                      onClick={() => setProfileMenu(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      Applications
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
          >
            Login
          </Link>
        )}

        {/* MOBILE MENU BUTTON */}

        <button
          className="md:hidden text-xl text-gray-700 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#020617] border-t border-gray-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-4">

          {role === "candidate" && (
            <>
              <Link to="/jobs" onClick={closeMenu}>
                Jobs
              </Link>
              <Link to="/my-applications" onClick={closeMenu}>
                Applications
              </Link>
              <Link to={profileRoute} onClick={closeMenu}>
                Profile
              </Link>
            </>
          )}

          {role === "employer" && (
            <>
              <Link to="/employer" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/employer/profile" onClick={closeMenu}>
                Profile
              </Link>
            </>
          )}

          <button onClick={toggleTheme}>
            {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg text-white"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  );
};

export default Navbar;