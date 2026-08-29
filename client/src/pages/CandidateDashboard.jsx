import { useEffect, useState, useRef } from "react";
import { API } from "../api/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layout & UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Sync Dark/Light Theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile details
      const profileRes = await API.get("/auth/profile");
      setProfile(profileRes.data);

      // Fetch applications
      const appsRes = await API.get("/applications/my");
      setApplications(appsRes.data);
      setAppliedCount(appsRes.data.length);

      // Fetch all jobs
      const jobsRes = await API.get("/jobs");
      setJobs(jobsRes.data);

      const savedList = jobsRes.data.filter(
        (job) => job.savedBy && job.savedBy.includes(profileRes.data._id)
      );
      setSavedCount(savedList.length);

      // Fetch chat conversations
      const chatRes = await API.get("/chat/conversations");
      setChatRooms(chatRes.data);

    } catch (err) {
      toast.error("Error loading dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    let fields = 0;
    if (profile.bio) fields += 20;
    if (profile.skills && profile.skills.length > 0) fields += 20;
    if (profile.education && profile.education.length > 0) fields += 20;
    if (profile.experience && profile.experience.length > 0) fields += 20;
    if (profile.phone) fields += 10;
    if (profile.profileImage) fields += 10;
    return fields;
  };

  const getSkillsMatch = (jobSkills = []) => {
    if (!jobSkills.length || !profile?.skills?.length) return 0;
    const userSkills = profile.skills.map(s => s.toLowerCase());
    const matched = jobSkills.filter(skill =>
      userSkills.includes(skill.toLowerCase())
    );
    return Math.round((matched.length / jobSkills.length) * 100);
  };

  // Filter recommendations & saved jobs
  const recommendedJobs = jobs
    .filter(job => job.status !== "Closed" && getSkillsMatch(job.skills) >= 40)
    .slice(0, 3);

  const savedJobsList = jobs
    .filter(job => job.savedBy && job.savedBy.includes(profile?._id))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070b19] transition-colors duration-200">
        <svg className="animate-spin w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-semibold">Syncing candidate dashboard...</p>
      </div>
    );
  }

  const profileComplete = getProfileCompleteness();
  const userName = profile?.name || "User";

  // Sidebar Links config
  const sidebarLinks = [
    { label: "Dashboard", icon: "📊", to: "/candidate-dashboard", active: true },
    { label: "Profile", icon: "👤", to: "/profile" },
    { label: "My Applications", icon: "📝", to: "/my-applications" },
    { label: "Saved Jobs", icon: "❤️", to: "/saved-jobs" },
    { label: "Job Alerts", icon: "🔔", to: "#", onClick: () => toast("Job alerts setup coming soon!", { icon: "🔔" }) },
    { label: "Messages", icon: "💬", to: "/chat" },
    { label: "Assessments", icon: "✍️", to: "/assessments" },
    { label: "Resume Builder", icon: "📄", to: "/resume-builder" },
    { label: "Skills Profile", icon: "🧠", to: "/candidate-setup" },
    { label: "Settings", icon: "⚙️", to: "/profile" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#070b19] dark:text-slate-100 flex transition-colors duration-200">
      <Toaster position="top-right" />

      {/* ── SIDEBAR ── */}
      <aside className={`w-[260px] bg-white border-r border-slate-200/80 dark:bg-[#0d1226] dark:border-slate-800/80 flex flex-col justify-between p-6 fixed inset-y-0 left-0 z-40 transition-transform duration-300 xl:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="space-y-7">
          {/* Logo & Close Button (Mobile only) */}
          <div className="flex items-center justify-between">
            <span 
              onClick={() => navigate("/")}
              className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight cursor-pointer"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              JobPortal
            </span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="xl:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => (
              link.to === "#" ? (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white transition-all duration-150"
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </button>
              ) : (
                <Link
                  key={idx}
                  to={link.to}
                  className={`flex items-center gap-3.5 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-150 ${link.active ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"}`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        </div>

        {/* Promo Sidebar Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl p-4 mt-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm shadow-md shadow-blue-500/20 mb-3">
            💼
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">Want to get hired faster?</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Complete your profile to increase your profile view counts.</p>
          <button 
            onClick={() => navigate("/candidate-setup")} 
            className="w-full mt-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[10px] transition shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 cursor-pointer"
          >
            Complete Profile
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col xl:pl-[260px]">

        {/* ── TOP HEADER BAR ── */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#070b19]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Search Bar / Menu button */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="xl:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              ☰
            </button>

            <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
              <input
                type="text"
                placeholder="Search job title, skills or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 placeholder-slate-400 dark:border-slate-800 dark:bg-[#0d1226]/50 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <svg className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {/* User Profile & Utilities */}
          <div className="flex items-center gap-4">
            {/* Quick shortcuts */}
            <div className="hidden lg:flex items-center gap-3.5 border-r border-slate-200/80 dark:border-slate-800/80 pr-4.5">
              <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">Home</Link>
              <Link to="/jobs" className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">Jobs</Link>
              <Link to="/my-applications" className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">Applications</Link>
              <Link to="/chat" className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">Messages</Link>
            </div>

            {/* Dark Mode toggle */}
            <button 
              onClick={() => setDark(!dark)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Toggle Dark Mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/10 overflow-hidden">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{userName}</h4>
                  <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Candidate</span>
                </div>
              </div>

              {/* Menu items */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 dark:bg-[#0d1226] dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">My Profile</Link>
                  <Link to="/candidate-setup" className="block px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Profile Setup</Link>
                  <hr className="border-slate-200 dark:border-slate-800 my-1" />
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── MAIN DASHBOARD CONTENT ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-7 max-w-[1450px] mx-auto w-full">
          {/* Header Greetings */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{userName}</span>! 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Find the right opportunity and take the next step in your career.</p>
          </div>

          {/* ── STATS GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Applications */}
            <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center text-lg">
                💼
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{appliedCount}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Applications</p>
                <span className="text-[9px] text-blue-500 dark:text-blue-400 font-semibold mt-1 block">3 in review</span>
              </div>
            </div>

            {/* Card 2: Saved Jobs */}
            <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center text-lg">
                🔖
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{savedCount}</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Saved Jobs</p>
                <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-semibold mt-1 block">New matches</span>
              </div>
            </div>

            {/* Card 3: Profile Views */}
            <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center text-lg">
                👁️
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">2</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Profile Views</p>
                <span className="text-[9px] text-purple-500 dark:text-purple-400 font-semibold mt-1 block">This week</span>
              </div>
            </div>

            {/* Card 4: Job Alerts */}
            <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center text-lg">
                🔔
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">3</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">Job Alerts</p>
                <span className="text-[9px] text-orange-500 dark:text-orange-400 font-semibold mt-1 block">Active alerts</span>
              </div>
            </div>
          </div>

          {/* ── TWO COLUMNS CONTENT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

            {/* ── LEFT/CENTER COLUMN (2x spans) ── */}
            <div className="lg:col-span-2 space-y-7">
              {/* Recent Applications widget */}
              <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Recent Applications</h3>
                  <Link to="/my-applications" className="text-xs text-blue-600 hover:text-blue-500 font-bold dark:text-blue-400 dark:hover:text-blue-300">View All</Link>
                </div>

                <div className="overflow-x-auto">
                  {applications.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-8 font-medium">No application records found. Start applying to jobs!</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 pb-3">
                          <th className="pb-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company & Job</th>
                          <th className="pb-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Applied Date</th>
                          <th className="pb-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="pb-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.slice(0, 5).map((app) => {
                          const isPending = app.status === "pending";
                          const isAccepted = app.status === "accepted";
                          const isRejected = app.status === "rejected";

                          const statusText = isPending ? "In Review" : isAccepted ? "Shortlisted" : "Rejected";
                          const statusBg = isPending 
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/20" 
                            : isAccepted 
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20" 
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450 border-rose-100 dark:border-rose-900/20";

                          const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) : "N/A";

                          return (
                            <tr key={app._id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                              <td className="py-4.5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                                  {app.job?.company?.charAt(0).toUpperCase() || "J"}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{app.job?.title || "Role deleted"}</h4>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 truncate">{app.job?.company || "Unknown Company"}</p>
                                </div>
                              </td>
                              <td className="py-4.5 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell font-medium">
                                {appliedDate}
                              </td>
                              <td className="py-4.5">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBg}`}>
                                  {statusText}
                                </span>
                              </td>
                              <td className="py-4.5 text-right">
                                <button 
                                  onClick={() => app.job?._id && navigate(`/job/${app.job._id}`)}
                                  className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 hover:border-blue-500 dark:border-slate-800 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition"
                                >
                                  ❯
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Recommended Jobs widget */}
              <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Recommended Jobs</h3>
                  <Link to="/job-recommendations" className="text-xs text-blue-600 hover:text-blue-500 font-bold dark:text-blue-400 dark:hover:text-blue-300">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendedJobs.length === 0 ? (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No vacancies fit your exact profile skills.</p>
                      <button 
                        onClick={() => navigate("/candidate-setup")}
                        className="text-xs text-blue-500 font-bold mt-2 hover:underline hover:text-blue-600 block mx-auto"
                      >
                        Add more skills +
                      </button>
                    </div>
                  ) : (
                    recommendedJobs.map((job) => {
                      const match = getSkillsMatch(job.skills);
                      return (
                        <div key={job._id} className="bg-slate-50/50 border border-slate-200/50 dark:bg-[#090d20] dark:border-slate-800/70 rounded-2xl p-4.5 flex flex-col justify-between hover:border-blue-500/30 hover:shadow-md transition">
                          <div>
                            {/* Card Header Info */}
                            <div className="flex items-start justify-between">
                              <div className="w-9.5 h-9.5 rounded-lg bg-white dark:bg-[#0d1226] border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-base font-bold shadow-sm">
                                {job.company?.charAt(0).toUpperCase() || "C"}
                              </div>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10">
                                {match}% Match
                              </span>
                            </div>

                            {/* Job Details */}
                            <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-3.5 line-clamp-1 leading-snug">{job.title}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 truncate">{job.company}</p>

                            <div className="mt-3.5 space-y-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                              <div className="flex items-center gap-1.5 truncate">
                                📍 {job.location || "Remote"}
                              </div>
                              <div className="flex items-center gap-1.5">
                                💰 {job.salary || "Not Specified"}
                              </div>
                            </div>
                          </div>

                          <Link 
                            to={`/job/${job._id}`}
                            className="w-full mt-4.5 py-2 border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 dark:border-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white text-center font-bold rounded-xl text-[10px] transition cursor-pointer block"
                          >
                            Apply Now
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (1x span) ── */}
            <div className="space-y-7">
              {/* Profile Strength Checklist */}
              <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Profile Strength</h3>

                {/* Circular indicator & message */}
                <div className="flex items-center gap-5.5">
                  {/* Circle SVG */}
                  <div className="relative flex-shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 dark:text-blue-500 transition-all duration-500"
                        strokeDasharray={`${profileComplete}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    {/* Centered text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-slate-900 dark:text-white">{profileComplete}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {profileComplete >= 80 ? "Excellent Profile! 🎉" : "Good Job! 😊"}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Complete profile sections to capture recruiter views.</p>
                  </div>
                </div>

                {/* Checklist list */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {[
                    { label: "Basic Info & Bio", done: !!profile?.bio },
                    { label: "Work Experience", done: profile?.experience?.length > 0 },
                    { label: "Education Records", done: profile?.education?.length > 0 },
                    { label: "Technical Skills", done: profile?.skills?.length > 0 },
                    { label: "Resume Uploaded", done: !!profile?.resume },
                    { label: "Profile Image", done: !!profile?.profileImage }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-semibold">
                      <span className={item.done ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}>
                        {item.done ? "✓" : "○"} {item.label}
                      </span>
                      <span className={item.done ? "text-emerald-500" : "text-slate-350 dark:text-slate-600"}>
                        {item.done ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate("/candidate-setup")}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/10 cursor-pointer text-center block"
                >
                  Complete Setup
                </button>
              </div>

              {/* Job Alerts notifications panel */}
              <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Job Alerts</h3>
                  <button 
                    onClick={() => toast.success("Alert preferences saved!")}
                    className="text-[10px] text-blue-600 font-bold dark:text-blue-400 hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: "React Developer", location: "Bangalore (Hybrid)", freq: "Daily" },
                    { title: "Frontend Engineer", location: "Remote (India)", freq: "Daily" },
                    { title: "Full Stack Developer", location: "Hyderabad (Onsite)", freq: "Weekly" }
                  ].map((alert, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-slate-50/50 border border-slate-200/40 dark:bg-[#090d20] dark:border-slate-800/50 rounded-xl">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">{alert.title}</h4>
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-550 mt-1 block">📍 {alert.location}</span>
                      </div>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/10">
                        {alert.freq}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career advice resources */}
              <div className="bg-white dark:bg-[#0d1226] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Featured Resources</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Resume Tips", icon: "📝", onClick: () => navigate("/resume-builder") },
                    { label: "Interview Advice", icon: "🤝", onClick: () => navigate("/interview-experiences") },
                    { label: "Salary Tool", icon: "📊", onClick: () => toast("Salary insights estimator tool coming soon!") },
                    { label: "Assessments", icon: "✍️", onClick: () => navigate("/assessments") }
                  ].map((res, idx) => (
                    <button
                      key={idx}
                      onClick={res.onClick}
                      className="p-3 bg-slate-50/50 border border-slate-200/40 dark:bg-[#090d20] dark:border-slate-800/50 rounded-xl hover:border-blue-500/20 hover:shadow-sm text-left flex flex-col gap-2.5 cursor-pointer transition-all duration-150"
                    >
                      <span className="text-lg">{res.icon}</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-snug">{res.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
