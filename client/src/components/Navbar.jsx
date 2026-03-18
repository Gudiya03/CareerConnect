import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const dropdownRef = useRef();
  const mobileMenuRef = useRef();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const companyName = localStorage.getItem("companyName");

  const avatarLetter =
    role === "employer"
      ? (companyName?.trim()?.charAt(0)?.toUpperCase() || "E")
      : (userName?.trim()?.charAt(0)?.toUpperCase() || "U");

  /* Dark mode */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileMenu(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); setProfileMenu(false); }, [location.pathname]);

  const logout = () => { localStorage.clear(); navigate("/login"); };

  const isActive = (path) => location.pathname === path;
  const profileRoute = role === "employer" ? "/employer/profile" : "/profile";

  const navLinks =
    role === "candidate"
      ? [{ label: "Jobs", to: "/jobs" }, { label: "Applications", to: "/my-applications" }]
      : role === "employer"
      ? [{ label: "Dashboard", to: "/employer" }]
      : [];

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#0d0d14]/88 backdrop-blur-md border-b border-black/[0.07] dark:border-white/[0.06] transition-colors duration-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[60px] max-w-[1400px] mx-auto">

          {/* LOGO */}
          <button
            onClick={() => navigate("/jobs")}
            className="text-[19px] sm:text-[20px] font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity select-none flex-shrink-0"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            CareerConnect
          </button>

          {token ? (
            <>
              {/* ── DESKTOP NAV ── */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className={[
                      "text-[13.5px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150",
                      isActive(to)
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/8",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* ── DESKTOP RIGHT ── */}
              <div className="hidden md:flex items-center gap-2">
                {/* Theme toggle */}
                <button
                  onClick={() => setDark(p => !p)}
                  aria-label="Toggle theme"
                  className="w-9 h-9 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-all hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                >
                  {dark ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </button>

                {/* Avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileMenu(p => !p)}
                    aria-label="Profile menu"
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-sm font-bold shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-indigo-500/40 transition-all duration-150 flex items-center justify-center"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {avatarLetter}
                  </button>

                  {profileMenu && (
                    <div className="absolute top-[calc(100%+10px)] right-0 w-[185px] bg-white dark:bg-[#13131f] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-xl dark:shadow-black/40 overflow-hidden animate-[dropIn_0.15s_ease]"
                      style={{ animation: "dropIn 0.15s ease" }}
                    >
                      <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

                      {/* Header */}
                      <div className="px-3.5 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                        <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-50 truncate">
                          {role === "employer" ? companyName : userName}
                        </p>
                        <p className="text-[11px] text-gray-400 capitalize mt-0.5">{role}</p>
                      </div>

                      <Link
                        to={profileRoute}
                        onClick={() => setProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        Profile
                      </Link>

                      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mx-0" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50/70 dark:hover:bg-red-500/10 transition-colors text-left"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── MOBILE RIGHT (theme + hamburger) ── */}
              <div className="flex md:hidden items-center gap-2" ref={mobileMenuRef}>
                <button
                  onClick={() => setDark(p => !p)}
                  aria-label="Toggle theme"
                  className="w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                >
                  {dark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setMenuOpen(p => !p)}
                  aria-label="Toggle menu"
                  className="w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                >
                  {menuOpen ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* ── NOT LOGGED IN ── */
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white text-[13px] font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-indigo-500/40 transition-all duration-150"
            >
              Sign In
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          )}
        </div>

        {/* ── MOBILE DROPDOWN MENU ── */}
        {token && menuOpen && (
          <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-white/95 dark:bg-[#0d0d14]/95 backdrop-blur-md px-4 py-3 space-y-1">

            {/* User info pill */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-gray-50 dark:bg-white/[0.04] rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/30"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 truncate">{role === "employer" ? companyName : userName}</p>
                <p className="text-[11px] text-gray-400 capitalize">{role}</p>
              </div>
            </div>

            {/* Nav links */}
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={[
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive(to)
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}

            {/* Profile */}
            <Link
              to={profileRoute}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </Link>

            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mx-1 my-1" />

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/70 dark:hover:bg-red-500/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer so page content clears the fixed navbar */}
      
    </>
  );
};

export default Navbar;