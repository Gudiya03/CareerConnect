import { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userId, setUserId] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch profile
      const profileRes = await API.get("/auth/profile");
      setUserSkills(profileRes.data.skills || []);
      setUserId(profileRes.data._id);

      // Fetch applications to see which are applied
      const appsRes = await API.get("/applications/my");
      const jobIds = appsRes.data.map((app) => app.job?._id);
      setAppliedJobs(jobIds);

      // Fetch jobs
      const jobsRes = await API.get("/jobs");
      setJobs(jobsRes.data);
    } catch (err) {
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const toggleUnsave = async (jobId) => {
    try {
      const res = await API.post(`/jobs/save/${jobId}`);
      if (!res.data.saved) {
        setJobs(jobs.map(j => {
          if (j._id === jobId) {
            return { ...j, savedBy: j.savedBy.filter(id => id !== userId) };
          }
          return j;
        }));
        toast.success("Job removed from saved!");
      }
    } catch {
      toast.error("Failed to unsave job");
    }
  };

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

  // Filter jobs by current user saving it and searching it
  const savedJobs = jobs.filter((job) => {
    const isSaved = job.savedBy && job.savedBy.some(id => id.toString() === userId.toString());
    if (!isSaved) return false;

    const title = job.title || "";
    const company = job.company || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-200">
      <Toaster position="top-right" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Jobs</h1>
            <p className="text-gray-400 text-sm mt-1">Review positions you have bookmarked</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Saved Positions:</span>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-full border border-indigo-100 dark:border-indigo-500/20">
              {savedJobs.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              placeholder="Search saved job titles or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm text-gray-400">Loading saved jobs…</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm">
            <span className="text-5xl mb-4 block">🔖</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No saved jobs</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              When browsing through available jobs, click the heart icon on any post to keep track of it here.
            </p>
            <Link to="/jobs" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition duration-150">
              Browse Jobs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedJobs.map((job) => {
              const match = getMatch(job.skills);
              return (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">{job.company}</p>
                      </div>
                      <button
                        onClick={() => toggleUnsave(job._id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center hover:scale-105 transition-transform"
                        title="Remove from Saved"
                      >
                        ❤️
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-4">Posted {timeAgo(job.createdAt)}</p>

                    {/* Skill Match Indicator */}
                    <div className="mb-4 bg-gray-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-medium">Skills Match</span>
                      <span className={`text-xs font-bold ${match >= 75 ? "text-emerald-500" : match >= 40 ? "text-amber-500" : "text-gray-400"}`}>
                        {match}%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span>📍</span> <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>💰</span> <span>{job.salary}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed mb-4">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/60 mt-4">
                    <button
                      onClick={() => openApplyModal(job._id)}
                      disabled={appliedJobs.includes(job._id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                        appliedJobs.includes(job._id)
                          ? "bg-emerald-500 text-white cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                      }`}
                    >
                      {appliedJobs.includes(job._id) ? "Applied ✓" : "Apply Now"}
                    </button>
                    <Link to={`/job/${job._id}`} className="w-full">
                      <button className="w-full py-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition duration-150">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Resume Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-[scaleUp_0.2s_ease-out]">
            <style>{`@keyframes scaleUp{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            
            <h2 className="text-lg font-bold mb-1">Apply to Job</h2>
            <p className="text-xs text-gray-400 mb-4">Upload your professional resume in PDF format</p>

            <label className={`flex flex-col items-center gap-3 w-full cursor-pointer border-2 border-dashed rounded-xl p-5 mb-5 transition-colors
              ${resume
                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-700"
                : "border-gray-200 dark:border-slate-700 hover:border-indigo-400 bg-gray-50 dark:bg-slate-800/40"
              }`}>
              <span className="text-2xl">📄</span>
              <div className="text-center min-w-0">
                {resume ? (
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{resume.name}</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Click to upload resume</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">PDF only</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="hidden"
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={applyJob}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Submit Application
              </button>
              <button
                onClick={() => { setShowModal(false); setResume(null); }}
                className="border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 py-2.5 px-4 rounded-xl text-xs font-medium transition"
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

export default SavedJobs;
