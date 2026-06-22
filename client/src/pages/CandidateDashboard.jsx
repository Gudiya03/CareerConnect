import { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile details
      const profileRes = await API.get("/auth/profile");
      setProfile(profileRes.data);

      // Fetch applications to count
      const appsRes = await API.get("/applications/my");
      setAppliedCount(appsRes.data.length);

      // Fetch all jobs to evaluate recommendations & saved count
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

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    let fields = 0;
    if (profile.bio) fields += 20;
    if (profile.skills && profile.skills.length > 0) fields += 20;
    if (profile.education && profile.education.length > 0) fields += 20;
    if (profile.experience && profile.experience.length > 0) fields += 20;
    if (profile.phone) fields += 20;
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

  // Recommendations: top jobs with > 40% skills match
  const recommendedJobs = jobs
    .filter(job => job.status !== "Closed" && getSkillsMatch(job.skills) >= 40)
    .slice(0, 3);

  const savedJobs = jobs
    .filter(job => job.savedBy && job.savedBy.includes(profile?._id))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#020617]">
        <svg className="animate-spin w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-xs text-gray-400 mt-3">Syncing candidate overview dashboard...</p>
      </div>
    );
  }

  const profileComplete = getProfileCompleteness();

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <Toaster position="top-right" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 relative z-10">

        {/* Personalized Welcome greetings card */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{profile?.name}</span>! 👋
            </h1>
            <p className="text-blue-200/40 text-xs mt-1">Here is a summary of your application streams and recruiter updates</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/resume-builder"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-150"
            >
              📄 Open Resume Builder
            </Link>
            <Link
              to="/jobs"
              className="px-4 py-2.5 border border-white/10 text-blue-200 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all duration-150"
            >
              🔍 Browse Jobs
            </Link>
          </div>
        </div>

        {/* Core metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          {/* Applied Jobs Widget */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-blue-500/15 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-xl shadow-inner">
              📝
            </div>
            <div>
              <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider">Applied Jobs</p>
              <h2 className="text-2xl font-bold text-white mt-0.5">{appliedCount}</h2>
            </div>
          </div>

          {/* Bookmarked Jobs Widget */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-rose-500/15 border border-rose-500/20 text-rose-450 rounded-xl flex items-center justify-center text-xl shadow-inner">
              ❤️
            </div>
            <div>
              <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider">Saved Positions</p>
              <h2 className="text-2xl font-bold text-white mt-0.5">{savedCount}</h2>
            </div>
          </div>

          {/* Profile Completion percentage Widget */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-xl shadow-inner">
              🏆
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider">Profile Strength</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold text-white">{profileComplete}%</span>
                <span className="text-[10px] text-blue-200/40">Complete</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${profileComplete}%` }} />
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Panel: Recommendations & Saved Jobs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recommendations Section */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300/80">AI Role Recommendations</h3>
                <p className="text-xs text-blue-200/40 mt-0.5">Top matching vacancies based on your profile skills</p>
              </div>

              <div className="space-y-3">
                {recommendedJobs.length === 0 ? (
                  <p className="text-center text-xs text-blue-200/40 py-6">No matching vacancies found. Add more skills in settings to increase recommendations!</p>
                ) : (
                  recommendedJobs.map((job) => {
                    const match = getSkillsMatch(job.skills);
                    return (
                      <div key={job._id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center hover:bg-white/[0.03] transition-all duration-200">
                        <div>
                          <h4 className="text-xs font-bold text-white leading-snug">{job.title}</h4>
                          <p className="text-[10px] text-blue-400 font-semibold mt-0.5">{job.company} • 📍 {job.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {match}% Match
                          </span>
                          <Link to={`/job/${job._id}`} className="block text-[10px] text-blue-400 font-bold hover:text-blue-300 hover:underline mt-2">View details →</Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Saved Jobs Panel */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300/80">Bookmarked Listings</h3>
                <p className="text-xs text-blue-200/40 mt-0.5">Quick access to postings you bookmarked</p>
              </div>

              <div className="space-y-3">
                {savedJobs.length === 0 ? (
                  <p className="text-center text-xs text-blue-200/40 py-6">No saved vacancies yet</p>
                ) : (
                  savedJobs.map((job) => (
                    <div key={job._id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center hover:bg-white/[0.03] transition-all duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white">{job.title}</h4>
                        <p className="text-[10px] text-blue-200/50 mt-0.5">{job.company} • 💰 {job.salary}</p>
                      </div>
                      <Link to={`/job/${job._id}`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline">Apply Now →</Link>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Side Panel: Messages & Quick Utilities */}
          <div className="space-y-6">
            
            {/* Quick Actions Links */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300/80 mb-2">Development utilities</h3>
              
              <Link to="/career-tools" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-150">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Career Tools</h4>
                  <p className="text-[9px] text-blue-200/40 mt-0.5">Check resume score & skill gaps</p>
                </div>
              </Link>

              <Link to="/chat" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-150">
                <span className="text-lg">💬</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Messenger Chats</h4>
                  <p className="text-[9px] text-blue-200/40 mt-0.5">Contact recruiters & reviews</p>
                </div>
              </Link>
            </div>

            {/* Recruiter Messages Panel */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300/80">Recruiter Messages</h3>
              <div className="space-y-3">
                {chatRooms.length === 0 ? (
                  <p className="text-[11px] text-blue-200/40 py-4 text-center">No messages received yet</p>
                ) : (
                  chatRooms.slice(0, 3).map((chat) => (
                    <div key={chat.user._id} onClick={() => navigate("/chat")} className="p-3 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer flex gap-3 transition-all duration-150">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {chat.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold truncate leading-snug text-white">{chat.user.name}</h4>
                        <p className="text-[10px] text-blue-200/50 truncate mt-0.5">{chat.lastMessage}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CandidateDashboard;
