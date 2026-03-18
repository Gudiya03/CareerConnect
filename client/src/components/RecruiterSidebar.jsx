import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/employer",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Jobs",
    path: "/employer/jobs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    name: "Applicants",
    path: "/employer/applicants",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Analytics",
    path: "/employer/analytics",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
];

const RecruiterSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = () => (
    <ul className="flex flex-col gap-1 flex-1 list-none m-0 p-0">
      {menu.map((item) => {
        const active = location.pathname === item.path;
        return (
          <li key={item.name}>
            <Link
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 no-underline group
                ${active
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                  : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110
                ${active ? "text-white" : ""}`}>
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">Recruiter Panel</span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col px-3 py-4 gap-4 transform transition-transform duration-250 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 px-2">Main Menu</p>
        <NavLinks />
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 px-2">
            Logged in as <span className="font-semibold text-indigo-500">Employer</span>
          </p>
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed top-[60px] left-0 w-56 h-[calc(100vh-60px)] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col px-3 py-5 gap-4 z-40 overflow-hidden">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-400/10 blur-2xl" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 pb-4 mb-1 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">Recruiter Panel</span>
        </div>

        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 px-2">Main Menu</p>

        <NavLinks />

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 px-2 leading-relaxed">
            Logged in as{" "}
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">Employer</span>
          </p>
        </div>
      </aside>

      {/* ── Tablet bottom tab bar (md breakpoint hidden, show on sm only if preferred) ── */}
      {/* Alternatively a bottom tab bar for small tablets */}
    </>
  );
};

export default RecruiterSidebar;