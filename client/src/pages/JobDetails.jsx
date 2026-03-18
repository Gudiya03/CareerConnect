import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);
    } catch {
      alert("Failed to load job");
    }
  };

  const applyJob = async () => {
    if (!resume) {
      alert("Please upload your resume first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      await API.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm text-gray-400">Loading job details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

        {/* Job Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h1>
          <p className="text-indigo-500 dark:text-indigo-400 font-semibold text-sm mb-5">
            {job.company}
          </p>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mb-7">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                📍 {job.location}
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                💰 {job.salary}
              </span>
            )}
            {job.experience && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                🧠 {job.experience}
              </span>
            )}
            {job.jobType && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                💼 {job.jobType}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

          {/* Resume Upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload Resume (PDF)
            </label>
            <label className={`flex flex-col sm:flex-row items-center gap-3 w-full cursor-pointer border-2 border-dashed rounded-xl px-4 py-4 transition-colors
              ${resume
                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-700"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-gray-50 dark:bg-gray-800/50"
              }`}>
              <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={resume ? "#6366f1" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {resume ? (
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{resume.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload your resume</p>
                    <p className="text-xs text-gray-400 mt-0.5">PDF only</p>
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

          {/* Apply Button */}
          <button
            onClick={applyJob}
            disabled={applied}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.98]
              ${applied
                ? "bg-emerald-500 text-white cursor-not-allowed opacity-90"
                : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50"
              }`}
          >
            {applied ? "✓ Applied Successfully" : "Apply Now"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Applicants", value: job.applicantsCount || 0, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
            { label: "Accepted", value: job.acceptedCount || 0, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
            { label: "Pending", value: job.pendingCount || 0, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default JobDetails;