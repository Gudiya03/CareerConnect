import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/applications");
      setApplications(res.data);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to load applications list");
    } finally {
      setLoading(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredApplications.map((app) => app._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !window.confirm(`Are you sure you want to permanently delete these ${selectedIds.length} candidate submittals?`)) {
      return;
    }

    try {
      const res = await API.post("/admin/applications/bulk-action", { ids: selectedIds, action });
      toast.success(res.data.message || "Bulk action executed successfully!");
      fetchApplications();
    } catch {
      toast.error("Failed to execute bulk action");
    }
  };

  // Update status directly
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await API.put(`/admin/applications/${appId}`, { status: newStatus });
      toast.success(res.data.message || `Application marked as ${newStatus}`);
      setApplications(applications.map((app) => app._id === appId ? { ...app, status: newStatus } : app));
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch {
      toast.error("Failed to update candidate submittal status");
    }
  };

  // Delete single application
  const deleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to permanently delete this application record from audit?")) {
      return;
    }
    try {
      const res = await API.delete(`/admin/applications/${appId}`);
      toast.success(res.data.message || "Application deleted successfully");
      setApplications(applications.filter((app) => app._id !== appId));
      setViewOpen(false);
    } catch {
      toast.error("Failed to delete application record");
    }
  };

  const openViewModal = (app) => {
    setSelectedApp(app);
    setViewOpen(true);
  };

  const filteredApplications = applications.filter((app) => {
    const jobTitle = app.job?.title || "";
    const company = app.job?.company || "";
    const applicantName = app.applicant?.name || "";
    const applicantEmail = app.applicant?.email || "";

    return (
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      applicantEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Application Audit
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Audit candidate applications across all companies</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            placeholder="Search job, company, candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium sm:ml-auto">{filteredApplications.length} submissions found</span>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-violet-500/10 dark:bg-violet-500/5 border border-violet-500/20 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
              {selectedIds.length} candidate application{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkAction("accept")}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-emerald-600 transition cursor-pointer"
            >
              Bulk Accept
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-amber-600 transition cursor-pointer"
            >
              Bulk Reject
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-red-600 transition cursor-pointer"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin w-8 h-8 text-violet-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm text-gray-400">Loading applications list…</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-slate-800/50 border-b border-gray-150 dark:border-slate-800/80">
                  <th className="px-4 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredApplications.length > 0 && selectedIds.length === filteredApplications.length}
                      className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Company</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40">
                {filteredApplications.map((app) => {
                  const isSelected = selectedIds.includes(app._id);
                  return (
                    <tr
                      key={app._id}
                      className={`hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition ${
                        isSelected ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(app._id)}
                          className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {app.applicant ? (
                          <div>
                            <button
                              onClick={() => openViewModal(app)}
                              className="font-semibold text-gray-800 dark:text-gray-100 hover:text-violet-600 hover:underline text-left cursor-pointer"
                            >
                              {app.applicant.name}
                            </button>
                            <p className="text-[10px] text-gray-400 mt-0.5">{app.applicant.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Deleted Account User</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {app.job ? app.job.title : <span className="text-gray-400 italic">Deleted Job</span>}
                      </td>
                      <td className="px-6 py-4 text-indigo-500 font-semibold">
                        {app.job ? app.job.company : <span className="text-gray-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={app.status || "pending"}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-250 dark:border-slate-700 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openViewModal(app)}
                            className="px-2 py-1 bg-gray-50 dark:bg-slate-800 text-gray-655 dark:text-gray-300 rounded hover:bg-gray-100 transition text-xs font-semibold cursor-pointer"
                          >
                            Audit
                          </button>
                          <button
                            onClick={() => deleteApplication(app._id)}
                            className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DETAILS & AUDIT MODAL */}
      {viewOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111120] border border-gray-150 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
            <button
              onClick={() => setViewOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              ✕
            </button>
            
            <div>
              <h3 className="text-lg font-bold text-gray-850 dark:text-white">Application Audit Review</h3>
              <p className="text-xs text-gray-400 mt-0.5">Moderate candidate applications and inspect credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applicant Card */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100 dark:border-slate-700/80">
                  Applicant Credentials
                </h4>
                {selectedApp.applicant ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Candidate Name</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedApp.applicant.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{selectedApp.applicant.email}</p>
                    </div>
                    {selectedApp.applicant.phone && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedApp.applicant.phone}</p>
                      </div>
                    )}
                    {selectedApp.applicant.location && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Location</p>
                        <p className="text-sm font-semibold text-gray-850 dark:text-white">📍 {selectedApp.applicant.location}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">User profile deleted</p>
                )}
              </div>

              {/* Job Card */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100 dark:border-slate-700/80">
                  Target Job Position
                </h4>
                {selectedApp.job ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Job Title</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{selectedApp.job.title}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Hiring Company</p>
                      <p className="text-sm font-semibold text-indigo-500">{selectedApp.job.company}</p>
                    </div>
                    {selectedApp.job.location && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Job Location</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">📍 {selectedApp.job.location}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Job vacancy has been deleted</p>
                )}
              </div>
            </div>

            {/* Resume and current status control */}
            <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-semibold">Candidate Resume</p>
                {selectedApp.resume ? (
                  <a
                    href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${selectedApp.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-bold hover:underline"
                  >
                    📄 Open Candidate Resume File
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">No resume uploaded</span>
                )}
              </div>

              <div className="space-y-1 sm:text-right">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Set Outcome Status</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, "accepted")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedApp.status === "accepted"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-500/15 hover:text-emerald-500"
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, "rejected")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedApp.status === "rejected"
                        ? "bg-rose-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-500/15 hover:text-rose-500"
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, "pending")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedApp.status === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-500/15 hover:text-amber-500"
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => deleteApplication(selectedApp._id)}
                className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition rounded-xl text-xs font-bold cursor-pointer mr-auto"
              >
                Delete Record
              </button>
              <button
                type="button"
                onClick={() => setViewOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Done Auditing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
