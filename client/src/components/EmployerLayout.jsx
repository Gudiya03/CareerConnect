import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/employer",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Jobs",
    path: "/employer/jobs",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    name: "Applicants",
    path: "/employer/applicants",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Analytics",
    path: "/employer/analytics",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    name: "Profile",
    path: "/employer/profile",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const SidebarContent = ({ location, onNavClick }) => (
  <div className="flex flex-col h-full px-4 py-6 relative overflow-hidden">
    <div className="pointer-events-none absolute -top-14 -right-14 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl" />

    {/* Brand */}
    <div className="flex items-center gap-2.5 pb-5 mb-5 border-b border-black/[0.06] dark:border-white/[0.06] px-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </div>
      <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-gray-50">Recruiter</span>
      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Pro</span>
    </div>

    {/* Nav */}
    <nav className="flex flex-col gap-0.5 flex-1">
      <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Main Menu</p>
      {menu.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onNavClick}
            className={[
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              active
                ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-md shadow-indigo-500/25"
                : "text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300",
            ].join(" ")}
          >
            <span className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">{item.icon}</span>
            <span>{item.name}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
          </Link>
        );
      })}
    </nav>

    {/* User footer */}
    <div className="mt-auto pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 truncate leading-tight">HR Manager</p>
          <p className="text-[11px] text-gray-400 leading-tight">Administrator</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 flex-shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  </div>
);

const EmployerLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] dark:bg-[#0c0c14] text-gray-900 dark:text-gray-100">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={[
          "fixed top-0 left-0 h-full w-[260px] z-50 bg-white dark:bg-[#111120]",
          "border-r border-black/[0.06] dark:border-white/[0.06] shadow-2xl",
          "transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Close menu"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <SidebarContent location={location} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed top-[60px] left-0 w-[230px] xl:w-[245px] h-[calc(100vh-60px)] flex-col bg-white dark:bg-[#111120] border-r border-black/[0.06] dark:border-white/[0.06] z-40 overflow-hidden">
        <SidebarContent location={location} onNavClick={() => {}} />
      </aside>

      {/* MAIN */}
      <main className="flex flex-1 flex-col min-w-0 lg:ml-[230px] xl:ml-[245px] pt-[60px] h-screen overflow-hidden">
        {/* Mobile hamburger bar — only shows on small screens */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white/70 dark:bg-[#111120]/70 backdrop-blur-sm border-b border-black/[0.05] dark:border-white/[0.05]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-black/[0.07] dark:border-white/[0.08] bg-white dark:bg-[#1a1a2e] text-gray-500 hover:text-indigo-500 hover:border-indigo-400 transition-all"
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Menu</span>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 px-4 sm:px-5 lg:px-7 py-2 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployerLayout;