import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";

const JobApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/applications/job/${id}`);
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}`, { status });
      fetchApplicants();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const statusStyle = {
    accepted: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    rejected: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800",
    pending: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Applicants
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {applications.length} application{applications.length !== 1 ? "s" : ""} received
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-7 h-7 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-sm">No applicants yet</p>
          </div>
        )}

        {/* Applicant Cards */}
        {!loading && applications.map((app) => (
          <div
            key={app._id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              {/* Left: avatar + info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center flex-shrink-0 text-indigo-500 dark:text-indigo-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {app.applicant?.email || "Unknown"}
                  </p>

                  {/* Status badge */}
                  <span className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${statusStyle[app.status] || statusStyle.pending}`}>
                    {app.status || "pending"}
                  </span>

                  {/* Resume link */}
                  {app.applicant?.resume && (
                    <div className="mt-2">
                      <a
                        href={`http://localhost:5000/uploads/${app.applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
                <button
                  onClick={() => updateStatus(app._id, "accepted")}
                  disabled={app.status === "accepted"}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors active:scale-95"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  disabled={app.status === "rejected"}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors active:scale-95"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default JobApplicants;