import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/api";

const Home = () => {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Fetch featured jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await API.get("/jobs");
        // Get first 4 active jobs as featured
        const activeJobs = res.data.filter(j => j.status !== "Closed").slice(0, 4);
        setFeaturedJobs(activeJobs);
      } catch (err) {
        console.error("Error fetching featured jobs for homepage:", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = "";
    if (what.trim()) {
      query += `search=${encodeURIComponent(what.trim())}`;
    }
    if (where.trim()) {
      query += `${query ? "&" : ""}location=${encodeURIComponent(where.trim())}`;
    }
    navigate(`/jobs${query ? `?${query}` : ""}`);
  };

  const handleCategorySearch = (categoryName) => {
    navigate(`/jobs?search=${encodeURIComponent(categoryName)}`);
  };

  // Mock featured jobs fallback if database is empty
  const mockJobs = [
    {
      _id: "mock1",
      title: "Frontend Developer",
      company: "Google",
      location: "Bangalore, India",
      salary: "12-18 LPA",
      skills: ["React", "TypeScript", "Tailwind"],
      createdAt: new Date(Date.now() - 2 * 24 * 65 * 60000)
    },
    {
      _id: "mock2",
      title: "UI/UX Designer",
      company: "Microsoft",
      location: "Hyderabad, India",
      salary: "10-15 LPA",
      skills: ["Figma", "Design Systems"],
      createdAt: new Date(Date.now() - 1 * 24 * 65 * 60000)
    },
    {
      _id: "mock3",
      title: "Data Analyst",
      company: "Amazon",
      location: "Pune, India",
      salary: "8-12 LPA",
      skills: ["SQL", "Python", "Tableau"],
      createdAt: new Date(Date.now() - 3 * 24 * 65 * 60000)
    },
    {
      _id: "mock4",
      title: "Software Engineer",
      company: "Infosys",
      location: "Chennai, India",
      salary: "5-8 LPA",
      skills: ["Java", "Spring Boot"],
      createdAt: new Date(Date.now() - 5 * 24 * 65 * 60000)
    }
  ];

  const jobsToShow = featuredJobs.length > 0 ? featuredJobs : mockJobs;

  const categories = [
    { name: "Development", count: "15,000+ Jobs", icon: "💻", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
    { name: "Design", count: "4,500+ Jobs", icon: "🎨", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20" },
    { name: "Marketing", count: "6,800+ Jobs", icon: "📊", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20" },
    { name: "Business", count: "7,200+ Jobs", icon: "💼", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" },
    { name: "Support", count: "3,400+ Jobs", icon: "🎧", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20" },
    { name: "Others", count: "5,600+ Jobs", icon: "⚙️", color: "text-slate-600 bg-slate-50 dark:bg-slate-900/40" },
  ];

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 transition-colors duration-250 flex flex-col justify-between overflow-x-hidden">
      
      {/* ── HEADER NAVBAR ── */}
      <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="text-xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent cursor-pointer tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            JobPortal
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-7">
            <span onClick={() => navigate("/")} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">Home</span>
            <span onClick={() => navigate("/jobs")} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition">Jobs</span>
            <span onClick={() => navigate("/jobs")} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition">Companies</span>
            <span onClick={() => navigate("/career-tools")} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition">Resources</span>
            <span onClick={() => navigate("/interview-experiences")} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition">About Us</span>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              to={role === "employer" ? "/employer" : "/jobs"}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl transition duration-150"
            >
              For Employers
            </Link>

            {token ? (
              <button 
                onClick={() => navigate(role === "employer" ? "/employer" : "/candidate-dashboard")}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 transition duration-150 cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link 
                to="/login"
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 transition duration-150"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Search Info */}
        <div className="space-y-7 text-left">
          <h1 className="text-4xl sm:text-5.5xl font-black text-slate-900 leading-[1.12] tracking-tight">
            Find the job that <br className="hidden sm:inline" />
            builds <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent underline decoration-indigo-250 decoration-wavy underline-offset-8">your future</span>
          </h1>
          <p className="text-slate-550 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
            Explore thousands of opportunities from top companies and take the next step in your career.
          </p>

          {/* Dual Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="bg-white border border-slate-200/80 p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 max-w-xl">
            {/* What field */}
            <div className="flex-1 flex items-center px-2 border-b md:border-b-0 md:border-r border-slate-100 pb-2.5 md:pb-0">
              <span className="text-slate-400 mr-2 flex-shrink-0 text-sm">🔍</span>
              <div className="text-left w-full">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">What</label>
                <input
                  type="text"
                  placeholder="Job title, skills or company"
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-0 mt-0.5"
                />
              </div>
            </div>

            {/* Where field */}
            <div className="flex-1 flex items-center px-2 pb-2.5 md:pb-0">
              <span className="text-slate-400 mr-2 flex-shrink-0 text-sm">📍</span>
              <div className="text-left w-full">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Where</label>
                <input
                  type="text"
                  placeholder="City, state or remote"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-0 mt-0.5"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Search Jobs
            </button>
          </form>

          {/* Popular searches tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span className="text-slate-400">Popular Searches:</span>
            {["Software Developer", "UI/UX Designer", "Data Analyst", "Product Manager"].map((term, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCategorySearch(term)}
                className="px-3.5 py-1.5 border border-slate-200/80 bg-white hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition duration-150 text-[11px] cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Right Candidate Illustration / Photo with Floating Cards */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Main Hero Photo */}
          <div className="relative w-full max-w-[420px] rounded-3xl overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-blue-600/5 rounded-[40px] transform rotate-3 blur-sm -z-10" />
            <img 
              src="/hero_candidate.png" 
              alt="Professional Candidate" 
              className="w-full h-auto object-cover rounded-3xl shadow-lg border border-white/50"
            />

            {/* Floating Card 1: 10K+ Jobs */}
            <div className="absolute top-[12%] -left-[14%] bg-white/90 backdrop-blur-md border border-slate-150/70 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-inner">
                💼
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-900">10K+</h4>
                <p className="text-[9px] font-semibold text-slate-400">Jobs Available</p>
              </div>
            </div>

            {/* Floating Card 2: Top Companies */}
            <div className="absolute top-[48%] -right-[8%] bg-white/90 backdrop-blur-md border border-slate-150/70 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-inner">
                📈
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-900">Top Companies</h4>
                <p className="text-[9px] font-semibold text-slate-450">Hiring Now</p>
              </div>
            </div>

            {/* Floating Card 3: Find Jobs Near You */}
            <div className="absolute bottom-[8%] -left-[10%] bg-white/90 backdrop-blur-md border border-slate-150/70 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shadow-inner">
                📍
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-900">Find Jobs</h4>
                <p className="text-[9px] font-semibold text-slate-450">Near You</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY LOGOS GALLERY ── */}
      <section className="w-full bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by 5,000+ companies</p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 opacity-50 dark:opacity-40">
            {["Google", "Microsoft", "Amazon", "Tata", "Infosys", "Wipro", "Deloitte", "Flipkart"].map((company, idx) => (
              <span key={idx} className="text-base sm:text-lg font-black text-slate-700 select-none tracking-tight">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-2 mb-14">
          <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight">How JobPortal Works?</h2>
          <p className="text-slate-400 text-xs font-semibold">Simple steps to find your dream job</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {[
            { step: "1", title: "Create Account", text: "Sign up and create your profile in just a few minutes.", icon: "👤" },
            { step: "2", title: "Search Jobs", text: "Explore jobs that match your skills and career goals.", icon: "🔍" },
            { step: "3", title: "Apply & Get Hired", text: "Apply to jobs and get noticed by top employers.", icon: "✈️" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-150/70 p-7 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition relative group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner mx-auto">
                {item.icon}
              </div>
              <h4 className="text-sm font-black text-slate-800">{item.step}. {item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR JOB CATEGORIES ── */}
      <section className="w-full bg-white border-y border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div className="text-left space-y-1.5">
              <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight">Popular Job Categories</h2>
              <p className="text-slate-400 text-xs font-semibold">Discover hundreds of job listings across top fields</p>
            </div>
            <button 
              onClick={() => navigate("/jobs")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer flex items-center gap-1 hover:underline"
            >
              View All Categories <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleCategorySearch(cat.name)}
                className="p-5 bg-slate-50/50 border border-slate-200/50 hover:bg-white hover:border-indigo-500/20 hover:shadow-md rounded-2xl cursor-pointer text-left flex flex-col justify-between h-40 transition-all duration-200 group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${cat.color} group-hover:scale-105 transition-transform`}>
                  {cat.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">{cat.name}</h4>
                  <p className="text-[10px] text-slate-450 font-semibold">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS SECTION ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight">Featured Jobs</h2>
            <p className="text-slate-400 text-xs font-semibold">Audited and hot postings verified by our vetting team</p>
          </div>
          <button 
            onClick={() => navigate("/jobs")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer flex items-center gap-1 hover:underline"
          >
            View All Jobs <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobsToShow.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/50 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-inner">
                    {job.company?.charAt(0).toUpperCase() || "J"}
                  </div>
                  <button 
                    onClick={() => navigate("/jobs")}
                    className="text-slate-350 hover:text-rose-500 transition text-sm cursor-pointer"
                  >
                    🤍
                  </button>
                </div>

                <h4 className="text-xs font-black text-slate-800 mt-4.5 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-snug">{job.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 truncate">{job.company}</p>

                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-450 font-bold truncate">📍 {job.location || "Remote"}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Full-time
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">
                  Posted {timeAgo(job.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CALL-TO-ACTION BANNER ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl overflow-hidden relative">
          {/* Subtle background accent shapes */}
          <div className="absolute -top-[100px] -left-[100px] w-[350px] h-[350px] bg-white/5 rounded-full blur-[80px]" />
          
          <div className="text-left space-y-4 max-w-lg relative z-10">
            <h2 className="text-2xl sm:text-3.5xl font-black leading-tight tracking-tight">Ready to take the next step?</h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-semibold">
              Create your profile today and connect with top employers hiring now.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => navigate("/resume-builder")}
                className="px-5 py-3 bg-white text-indigo-600 hover:bg-slate-50 font-bold rounded-xl text-xs shadow-lg transition duration-150 cursor-pointer"
              >
                Upload Your Resume
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="px-5 py-3 border border-white/30 hover:border-white text-white font-bold rounded-xl text-xs transition duration-150 cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          </div>

          {/* Right Banner Desk Illustration */}
          <div className="w-full max-w-[280px] sm:max-w-[340px] relative z-10 flex justify-center lg:justify-end">
            <img 
              src="/cta_working.png" 
              alt="Desk Workspace Illustration" 
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER LINKS & COPYRIGHT ── */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-indigo-600 cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-indigo-600 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition">Support</span>
            <Link to="/admin-login" className="hover:text-indigo-600 font-bold transition flex items-center gap-1">
              <span>🛡️</span> Admin Login
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
