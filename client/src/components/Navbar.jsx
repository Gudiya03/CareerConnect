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

  const userName = localStorage.getItem("name");
  const companyName = localStorage.getItem("companyName");

  // ✅ FINAL AVATAR LOGIC
  const avatarLetter =
    role === "employer"
      ? (companyName?.trim()?.charAt(0)?.toUpperCase() || "E")
      : (userName?.trim()?.charAt(0)?.toUpperCase() || "U");

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

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const activeLink = (path) =>
    location.pathname === path
      ? "text-indigo-500"
      : "text-gray-600 dark:text-gray-300 hover:text-indigo-500";

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

        {token ? (
          <div className="hidden md:flex items-center gap-8 text-sm">

            {role === "candidate" && (
              <>
                <Link to="/jobs" className={activeLink("/jobs")}>Jobs</Link>
                <Link to="/my-applications" className={activeLink("/my-applications")}>
                  Applications
                </Link>
              </>
            )}

            {role === "employer" && (
              <Link to="/employer" className={activeLink("/employer")}>
                Dashboard
              </Link>
            )}

            {/* THEME */}
            <button onClick={toggleTheme} className="text-xl">
              {dark ? "☀️" : "🌙"}
            </button>

            {/* PROFILE */}
            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setProfileMenu(!profileMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow"
              >
                {avatarLetter}
              </button>

              {profileMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-slate-900 border rounded-lg shadow">

                  <Link
                    to={profileRoute}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800"
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
            className="bg-indigo-600 px-4 py-2 rounded text-white"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;