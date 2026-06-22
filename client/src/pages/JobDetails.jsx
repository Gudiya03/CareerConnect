import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [saved, setSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);

      try {
        const profileRes = await API.get("/auth/profile");
        setUserSkills(profileRes.data.skills || []);
        const uid = profileRes.data._id;
        setCurrentUserId(uid);
        setSaved(res.data.savedBy && res.data.savedBy.includes(uid));
      } catch (err) {
        console.log("No profile fetched");
      }

      try {
        const appsRes = await API.get("/applications/my");
        const hasApplied = appsRes.data.some((app) => app.job?._id === id);
        setApplied(hasApplied);
      } catch (err) {
        console.log("No applications fetched");
      }
    } catch {
      toast.error("Failed to load job details");
    }
  };

  const toggleSave = async () => {
    try {
      const res = await API.post(`/jobs/save/${id}`);
      setSaved(res.data.saved);
      if (res.data.saved) {
        toast.success("Job saved successfully!");
      } else {
        toast.success("Job removed from saved!");
      }
    } catch {
      toast.error("Failed to update saved status");
    }
  };

  const getMatch = (jobSkills = []) => {
    if (!jobSkills.length || !userSkills.length) return 0;
    const matched = jobSkills.filter(skill =>
      userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
    return Math.round((matched.length / jobSkills.length) * 100);
  };

  const applyJob = async () => {
    if (!resume) {
      toast.error("Please upload your resume first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      await API.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplied(true);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Apply failed");
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-xs text-blue-200/40">Loading job details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <Toaster position="top-right" />
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-10 relative z-10 space-y-6">

        {/* Job Header Card */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">

          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {job.title}
              </h1>
              <p className="text-blue-400 font-semibold text-sm">
                {job.company}
              </p>
            </div>
            <button
              onClick={toggleSave}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base border transition hover:scale-105 active:scale-95 flex-shrink-0
                ${saved 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                  : "bg-white/5 border-white/10 text-blue-200/40 hover:bg-white/10 hover:text-white"
                }`}
              title={saved ? "Remove from Saved" : "Save Job"}
            >
              {saved ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mb-6 mt-4">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-450 text-xs font-semibold px-3 py-1.5 rounded-lg">
                📍 {job.location}
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-450 text-xs font-semibold px-3 py-1.5 rounded-lg">
                💰 {job.salary}
              </span>
            )}
            {job.experience && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-450 text-xs font-semibold px-3 py-1.5 rounded-lg">
                🧠 {job.experience}
              </span>
            )}
            {job.jobType && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-450 text-xs font-semibold px-3 py-1.5 rounded-lg">
                💼 {job.jobType}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 mb-6" />

          {/* Job Description */}
          {job.description && (
            <div className="mb-6 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300/80">
                Job Description
              </h3>
              <p className="text-sm text-blue-200/50 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300/80">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, index) => {
                  const hasSkill = userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                        ${hasSkill
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                          : "bg-white/[0.01] border-white/5 text-blue-200/40"
                        }`}
                    >
                      {skill} {hasSkill ? "✓" : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/5 mb-6" />

          {/* Resume Upload */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-300/80 mb-2">
              Upload Resume (PDF)
            </label>
            <label className={`flex flex-col sm:flex-row items-center gap-3 w-full cursor-pointer border-2 border-dashed rounded-xl px-4 py-4 transition-colors
              ${resume
                ? "border-blue-500/30 bg-blue-500/5"
                : "border-white/10 hover:border-blue-500/30 bg-white/[0.02]"
              }`}>
              <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={resume ? "#3b82f6" : "#1e40af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {resume ? (
                  <p className="text-sm font-medium text-blue-400 truncate">{resume.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white">Click to upload your resume</p>
                    <p className="text-xs text-blue-200/40 mt-0.5">PDF only</p>
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={applyJob}
              disabled={applied}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-xs transition-all duration-150 active:scale-[0.98]
                ${applied
                  ? "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
                }`}
            >
              {applied ? "✓ Applied Successfully" : "Apply Now"}
            </button>

            {job.postedBy && (
              <button
                onClick={() => navigate("/chat", { state: { startWithUser: job.postedBy } })}
                className="flex-1 sm:flex-none px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl font-bold text-xs transition-all duration-150 active:scale-[0.98]"
              >
                💬 Message Recruiter
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Applicants", value: job.applicantsCount || 0, color: "text-blue-400" },
            { label: "Accepted", value: job.acceptedCount || 0, color: "text-emerald-400" },
            { label: "Pending", value: job.pendingCount || 0, color: "text-amber-400" },
            { label: "Skills Match", value: `${getMatch(job.skills)}%`, color: "text-indigo-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300/60 mb-3">{stat.label}</p>
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default JobDetails;