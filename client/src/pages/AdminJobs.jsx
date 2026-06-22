import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | null
  const [selectedJob, setSelectedJob] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "Full-Time",
    description: "",
    status: "Open",
    skills: "",
    isApproved: false
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/jobs");
      setJobs(res.data);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to load jobs list");
    } finally {
      setLoading(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredJobs.map((j) => j._id));
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
    if (action === "delete" && !window.confirm(`Are you sure you want to permanently delete these ${selectedIds.length} job postings? This will delete all applications submitted to them!`)) {
      return;
    }

    try {
      const res = await API.post("/admin/jobs/bulk-action", { ids: selectedIds, action });
      toast.success(res.data.message || "Bulk job action executed!");
      fetchJobs();
    } catch {
      toast.error("Failed to execute bulk action");
    }
  };

  // Crud actions
  const approveJob = async (jobId) => {
    try {
      await API.put(`/admin/approve-job/${jobId}`);
      toast.success("Job post approved successfully! ✓");
      setJobs(jobs.map(j => j._id === jobId ? { ...j, isApproved: true } : j));
    } catch {
      toast.error("Failed to approve job listing");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing? This will also remove any candidate applications submitted to it!")) {
      return;
    }
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch {
      toast.error("Failed to delete job listing");
    }
  };

  const openViewModal = (job) => {
    setSelectedJob(job);
    setActiveModal("view");
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      experience: job.experience || "",
      jobType: job.jobType || "Full-Time",
      description: job.description || "",
      status: job.status || "Open",
      skills: (job.skills || []).join(", "),
      isApproved: job.isApproved || false
    });
    setActiveModal("edit");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/admin/jobs/${selectedJob._id}/edit`, formData);
      toast.success(res.data.message || "Job listing updated successfully!");
      setActiveModal(null);
      fetchJobs();
    } catch {
      toast.error("Failed to update job listing details");
    }
  };

  const exportJobsCSV = () => {
    if (jobs.length === 0) {
      toast.error("No job listings found to export");
      return;
    }

    const headers = ["Title", "Company", "Location", "Salary", "Experience", "Skills", "Approved"];
    const rows = jobs.map(j => [
      j.title || "",
      j.company || "",
      j.location || "",
      j.salary || "",
      j.experience || "",
      (j.skills || []).join("; "),
      j.isApproved ? "Yes" : "No"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareerConnect_Jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Job database exported successfully! 📁");
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";
    const location = job.location || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Job Moderation
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Audit, approve and delete active job postings</p>
        </div>
        <button
          onClick={exportJobsCSV}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/10 cursor-pointer"
        >
          📥 Export Jobs CSV
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            placeholder="Search by title, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium sm:ml-auto">{filteredJobs.length} positions found</span>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-violet-500/10 dark:bg-violet-500/5 border border-violet-500/20 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
              {selectedIds.length} vacancy listing{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkAction("approve")}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-emerald-600 transition cursor-pointer"
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-amber-600 transition cursor-pointer"
            >
              Bulk Reject
            </button>
            <button
              onClick={() => handleBulkAction("open")}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-blue-600 transition cursor-pointer"
            >
              Bulk Mark Open
            </button>
            <button
              onClick={() => handleBulkAction("close")}
              className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-gray-600 transition cursor-pointer"
            >
              Bulk Mark Closed
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
            <p className="text-sm text-gray-400">Loading jobs list…</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">No jobs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-slate-800/50 border-b border-gray-150 dark:border-slate-800/80">
                  <th className="px-4 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredJobs.length > 0 && selectedIds.length === filteredJobs.length}
                      className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Posted By</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Location</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40">
                {filteredJobs.map((job) => {
                  const isSelected = selectedIds.includes(job._id);
                  return (
                    <tr
                      key={job._id}
                      className={`hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition ${
                        isSelected ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(job._id)}
                          className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(job)}
                            className="hover:text-violet-600 hover:underline text-left cursor-pointer"
                          >
                            {job.title}
                          </button>
                          {job.isApproved ? (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded text-[9px] font-bold">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded text-[9px] font-bold">
                              Pending Review
                            </span>
                          )}
                          {job.status === "Closed" && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-400 rounded text-[9px] font-bold">
                              Closed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-indigo-500 font-semibold">{job.company}</td>
                      <td className="px-6 py-4">
                        {job.postedBy ? (
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{job.postedBy.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{job.postedBy.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Unknown Recruiter</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">📍 {job.location || "Remote"}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openViewModal(job)}
                            className="px-2 py-1 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 transition text-xs font-semibold cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(job)}
                            className="px-2 py-1 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded hover:bg-violet-100 transition text-xs font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          {!job.isApproved && (
                            <button
                              onClick={() => approveJob(job._id)}
                              className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => deleteJob(job._id)}
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

      {/* VIEW JOB MODAL */}
      {activeModal === "view" && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111120] border border-gray-150 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-6">
              {/* Header profile */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-slate-800/80 pr-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-850 dark:text-white flex flex-wrap items-center gap-2">
                    {selectedJob.title}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedJob.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {selectedJob.isApproved ? "Approved" : "Pending Approval"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full font-bold uppercase">
                      {selectedJob.jobType}
                    </span>
                  </h3>
                  <p className="text-sm font-semibold text-indigo-500 mt-1">{selectedJob.company}</p>
                </div>
              </div>

              {/* Job parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Location</span>
                  <p className="text-sm font-semibold mt-0.5 text-gray-700 dark:text-gray-200">
                    📍 {selectedJob.location || "Remote"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Salary Budget</span>
                  <p className="text-sm font-semibold mt-0.5 text-gray-750 dark:text-gray-200">
                    💰 {selectedJob.salary || "Not Disclosed"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Experience Required</span>
                  <p className="text-sm font-semibold mt-0.5 text-gray-750 dark:text-gray-200">
                    💼 {selectedJob.experience || "0-1 Years"}
                  </p>
                </div>
              </div>

              {/* Skills required */}
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Required Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedJob.skills && selectedJob.skills.length > 0 ? (
                    selectedJob.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-450 italic">None specified</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Job Description</span>
                  <p className="text-sm mt-1.5 text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-800/30 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                    {selectedJob.description}
                  </p>
                </div>
              )}

              {/* Recruiter profile info */}
              <div className="pt-4 border-t border-gray-50 dark:border-slate-800/80">
                <span className="text-xs text-gray-400 uppercase font-semibold">Posted By Recruiter</span>
                {selectedJob.postedBy ? (
                  <div className="flex items-center gap-3 mt-2 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                      {selectedJob.postedBy.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedJob.postedBy.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{selectedJob.postedBy.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-1">Unknown recruiter account</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {activeModal === "edit" && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white dark:bg-[#111120] border border-gray-150 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative space-y-6"
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              ✕
            </button>
            
            <div>
              <h3 className="text-lg font-bold text-gray-850 dark:text-white">Edit Job Listing</h3>
              <p className="text-xs text-gray-400 mt-0.5">Modify vacancy details and publication flags</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Salary (e.g. $80k - $100k)</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Skills Required (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleFormChange}
                placeholder="React, Node.js, Express, MongoDB"
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Job Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Recruitment Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-2 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                >
                  <option value="Open">Open Listing</option>
                  <option value="Closed">Closed Listing</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200 select-none">
                  <input
                    type="checkbox"
                    name="isApproved"
                    checked={formData.isApproved}
                    onChange={handleFormChange}
                    className="accent-violet-600 rounded"
                  />
                  Approved & Published (Publicly Visible)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-violet-500/10 cursor-pointer"
              >
                Save Job Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
