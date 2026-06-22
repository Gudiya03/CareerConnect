import { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Jobs = () => {

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

  // ⭐ NEW STATES
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await API.get("/auth/profile");
      const uid = profileRes.data._id;
      setCurrentUserId(uid);
      setUserSkills(profileRes.data.skills || []);

      const jobsRes = await API.get("/jobs");
      setJobs(jobsRes.data);

      const saved = jobsRes.data
        .filter((job) => job.savedBy && job.savedBy.includes(uid))
        .map((job) => job._id);
      setSavedJobs(saved);
    } catch (err) {
      console.log("Error loading user profile or jobs");
    }

    try {
      const appsRes = await API.get("/applications/my");
      const jobIds = appsRes.data.map((app) => app.job?._id);
      setAppliedJobs(jobIds);
    } catch {}
  };

  // ⭐ SAVE JOB TO SERVER
  const toggleSave = async (id) => {
    try {
      const res = await API.post(`/jobs/save/${id}`);
      if (res.data.saved) {
        setSavedJobs([...savedJobs, id]);
        toast.success("Job saved successfully!");
      } else {
        setSavedJobs(savedJobs.filter(j => j !== id));
        toast.success("Job removed from saved!");
      }
    } catch {
      toast.error("Failed to update saved status");
    }
  };

  // ⭐ MATCH % (CASE-INSENSITIVE)
  const getMatch = (jobSkills = []) => {
    if (!jobSkills.length || !userSkills.length) return 0;

    const matched = jobSkills.filter(skill =>
      userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );

    return Math.round((matched.length / jobSkills.length) * 100);
  };

  const openApplyModal = (jobId) => {
    setSelectedJob(jobId);
    setShowModal(true);
  };

  const applyJob = async () => {
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      await API.post(`/applications/${selectedJob}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setAppliedJobs([...appliedJobs, selectedJob]);
      setShowModal(false);
      setResume(null);
      toast.success("Applied successfully!");

    } catch (err) {
      toast.error(err.response?.data?.message || "Apply error");
    }
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <Toaster position="top-right" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 relative z-10">

        {/* 🔥 PREMIUM HEADER */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-xl mb-10 flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Find Your Dream Job</h1>
            <p className="text-blue-200/40 text-sm mt-1">
              Personalized for you
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-blue-200/40 font-bold uppercase tracking-wider">Profile Strength</p>
            <p className="text-lg font-bold text-blue-400">
              {userSkills.length * 20}%
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[420px] p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all backdrop-blur-sm"
          />

          <div className="text-blue-200/40 text-sm font-semibold">
            {filteredJobs.length} jobs found
          </div>
        </div>

        {/* JOB GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredJobs.map((job) => {
            const match = getMatch(job.skills);

            return (
              <div
                key={job._id}
                className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-blue-500/5 hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* TITLE + SAVE */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-2">
                      {job.title}
                    </h3>
                    <button 
                      onClick={() => toggleSave(job._id)}
                      className="text-lg focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                    >
                      {savedJobs.includes(job._id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <p className="text-blue-400 text-sm font-semibold mt-1">
                    {job.company}
                  </p>

                  <p className="text-[10px] text-blue-200/40 font-bold uppercase tracking-wider mb-3">
                    Posted {timeAgo(job.createdAt)}
                  </p>

                  {/* MATCH */}
                  <p className="text-xs mb-3 text-blue-200/60 font-semibold">
                    Match:{" "}
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {match}%
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-200/60 font-medium mb-4">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                  </div>

                  <p className="text-sm text-blue-100/70 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={() => openApplyModal(job._id)}
                    disabled={appliedJobs.includes(job._id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md ${
                      appliedJobs.includes(job._id)
                        ? "bg-emerald-600/80 text-white border border-emerald-500/20 shadow-emerald-600/10"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/10 hover:shadow-blue-500/20"
                    }`}
                  >
                    {appliedJobs.includes(job._id)
                      ? "Applied ✓"
                      : "Apply Now"}
                  </button>

                  <Link to={`/job/${job._id}`} className="block">
                    <button className="w-full py-2.5 border border-white/10 text-blue-200 hover:bg-white/5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0c142c] border border-white/10 p-6 rounded-2xl w-[400px] shadow-2xl relative z-50 text-white space-y-4 animate-[dropIn_0.2s_ease-out]">
            <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>
            
            <h2 className="text-xl font-bold text-white tracking-tight">
              Upload Resume
            </h2>

            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="text-xs text-blue-200 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={applyJob}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-500/35 transition-all cursor-pointer"
              >
                Apply
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/10 text-blue-200 hover:bg-white/5 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;