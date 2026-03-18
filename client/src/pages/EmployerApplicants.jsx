import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const EmployerApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setSelectedJob(jobId);
    } catch {
      toast.error("Failed to load applicants");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      toast.success("Status updated");
      if (selectedJob) fetchApplicants(selectedJob);
    } catch {
      toast.error("Update failed");
    }
  };

  /* Status badge helper */
  const StatusBadge = ({ status }) => {
    const map = {
      accepted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${map[status] || "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Applicants
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Select a job to view its applicants</p>
      </div>

      {/* JOB FILTER PILLS */}
      {jobs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {jobs.map((job) => {
            const active = selectedJob === job._id;
            return (
              <button
                key={job._id}
                onClick={() => fetchApplicants(job._id)}
                className={[
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400",
                ].join(" ")}
              >
                {job.title}
                {job.applicantsCount > 0 && (
                  <span className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500"}`}>
                    {job.applicantsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* APPLICANTS PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

        {!selectedJob ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-gray-300 dark:text-gray-600">Choose a job above to see applicants</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-800/60">
                    {["Candidate", "Resume", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-sm text-gray-300 dark:text-gray-600">
                        No applicants yet for this job
                      </td>
                    </tr>
                  ) : applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">

                      {/* Candidate */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {app.applicant?.email?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-200">{app.applicant?.email}</span>
                        </div>
                      </td>

                      {/* Resume */}
                      <td className="px-5 py-3.5">
                        {app.resume ? (
                          <a
                            href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 hover:underline underline-offset-2 transition-colors"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">No resume</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStatus(app._id, "accepted")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "rejected")}
                            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-50 dark:divide-slate-800">
              {applicants.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-gray-300 dark:text-gray-600">No applicants yet</p>
              ) : applicants.map((app) => (
                <div key={app._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {app.applicant?.email?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{app.applicant?.email}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {app.resume && (
                    <a
                      href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-indigo-500 hover:underline underline-offset-2"
                    >
                      Download Resume
                    </a>
                  )}

                  <div className="flex gap-2 pt-0.5">
                    <button
                      onClick={() => updateStatus(app._id, "accepted")}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      className="flex-1 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerApplicants;