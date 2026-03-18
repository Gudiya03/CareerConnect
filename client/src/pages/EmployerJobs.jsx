import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      setJobs(jobs.filter((job) => job._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Jobs
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage all posted jobs here</p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-800/60">
                {["Title", "Company", "Location", "Applicants", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-gray-300 dark:text-gray-600">
                    No jobs posted yet
                  </td>
                </tr>
              ) : jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100">{job.title}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-indigo-500">{job.company}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{job.location}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{job.applicantsCount || 0}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-gray-50 dark:divide-slate-800">
          {jobs.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-300 dark:text-gray-600">No jobs posted yet</p>
          ) : jobs.map((job) => (
            <div key={job._id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{job.title}</p>
                  <p className="text-xs font-medium text-indigo-500 mt-0.5">{job.company}</p>
                </div>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{job.location}</span>
                <span>{job.applicantsCount || 0} applicant{job.applicantsCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;