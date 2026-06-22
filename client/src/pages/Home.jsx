import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { name: "Software Development", icon: "💻", openJobs: "1,240+", color: "from-blue-500/10 to-indigo-500/10 text-indigo-500" },
    { name: "UI/UX Design", icon: "🎨", openJobs: "840+", color: "from-purple-500/10 to-pink-500/10 text-purple-500" },
    { name: "Data Science & AI", icon: "🤖", openJobs: "620+", color: "from-emerald-500/10 to-teal-500/10 text-emerald-500" },
    { name: "Digital Marketing", icon: "📈", openJobs: "480+", color: "from-amber-500/10 to-orange-500/10 text-amber-500" },
    { name: "Finance & Accounting", icon: "💰", openJobs: "350+", color: "from-rose-500/10 to-red-500/10 text-rose-500" },
    { name: "Product Management", icon: "🚀", openJobs: "290+", color: "from-violet-500/10 to-fuchsia-500/10 text-violet-500" },
  ];

  const stats = [
    { number: "15,000+", label: "Active Job Listings" },
    { number: "8,000+", label: "Verified Companies" },
    { number: "250,000+", label: "Successful Placements" },
  ];

  const testimonials = [
    {
      quote: "CareerConnect completely transformed my job hunt. I set up my profile, added my skills, and within 4 days I had 3 interviews lined up with top tech firms.",
      author: "Alex Rivers",
      role: "Senior Frontend Engineer",
      avatar: "AR"
    },
    {
      quote: "As a recruiter, finding the right talent was always our bottleneck. The Skill Match percentage tool on CareerConnect has saved us dozens of hours of manual resume vetting.",
      author: "Meera Patel",
      role: "Head of Talent, DevCorp",
      avatar: "MP"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#060814] text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Blobs */}
      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── HEADER NAVBAR ── */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate("/")}>
          CareerConnect
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-16">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-6">
          🚀 The Future of Job Searching is Here
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
          Find Your Next Dream Job <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Powered by Skill-Match
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
          Skip the generic search. CareerConnect parses your professional skills and highlights the best-suited roles with a real-time matching engine.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-2xl shadow-black/50">
          <div className="flex-1 flex items-center pl-3">
            <span className="text-gray-500 mr-2 flex-shrink-0">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job titles, skills, or companies..."
              className="w-full bg-transparent border-0 text-white placeholder-white/35 text-sm focus:outline-none focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-200 hover:shadow-indigo-500/20 hover:shadow-lg active:scale-[0.98]"
          >
            Search Jobs
          </button>
        </form>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 border-t border-white/5">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl font-extrabold text-white mb-1">{stat.number}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Explore Popular Categories</h2>
          <p className="text-sm text-gray-500">Discover hundreds of job listings across top fields</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.name)}`)}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition duration-200 cursor-pointer flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                {cat.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200">{cat.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{cat.openJobs} Active Jobs</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">How CareerConnect Works</h2>
          <p className="text-sm text-gray-500">An optimized recruitment loop designed for speed and relevance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Create Your Profile", text: "Complete your setup and add your core technical skills, experience, and resume." },
            { step: "02", title: "Review Match Engine", text: "Browse verified job postings and check your live match score on every listing." },
            { step: "03", title: "Apply Seamlessly", text: "Submit your application with one-click resume attachments directly to hiring managers." },
          ].map((item, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-white/[0.01] border border-white/5">
              <span className="absolute top-4 right-6 text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent opacity-20">
                {item.step}
              </span>
              <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">What Our Users Say</h2>
          <p className="text-sm text-gray-500 font-medium">Read about real career-enhancing journeys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
              <p className="text-gray-400 text-sm italic leading-relaxed mb-6">"{test.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white font-bold flex items-center justify-center text-xs">
                  {test.avatar}
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">{test.author}</h5>
                  <p className="text-[10px] text-gray-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full border-t border-white/5 py-8 bg-[#04060f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Support</span>
            <Link to="/admin-login" className="hover:text-indigo-400 font-semibold transition flex items-center gap-1">
              <span>🛡️</span> Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
