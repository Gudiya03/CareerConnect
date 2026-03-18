import { useState, useEffect, useRef } from "react";
import { API } from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

/* ── Reusable input style ── */
const inp =
  "w-full px-3 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all";

/* ── Stat card ── */
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${color} flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{value}</p>
    </div>
  </div>
);

/* ── Status badge ── */
const StatusBadge = ({ job }) => {
  if (job.acceptedCount > 0)
    return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold">● Hiring</span>;
  if (job.applicantsCount > 0)
    return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold">● Active</span>;
  return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">● Open</span>;
};

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [editJob, setEditJob] = useState(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const applicantsRef = useRef(null);

  const fetchJobs = async () => {
    try { const res = await API.get("/jobs"); setJobs(res.data); }
    catch (err) { console.error(err); }
  };
  useEffect(() => { fetchJobs(); }, []);

  const postJob = async () => {
    try {
      if (!title || !company) { toast.error("Title and company required"); return; }
      await API.post("/jobs", { title, company, location, salary, jobType: "Full-Time", experience, skills: skills ? skills.split(",") : [], description });
      toast.success("Job posted successfully");
      setTitle(""); setCompany(""); setLocation(""); setSalary(""); setExperience(""); setSkills(""); setDescription("");
      setShowForm(false); fetchJobs();
    } catch { toast.error("Job post failed"); }
  };

  const deleteJob = async (id) => {
    try { await API.delete(`/jobs/${id}`); toast.success("Job deleted"); setJobs(jobs.filter(j => j._id !== id)); }
    catch { toast.error("Delete failed"); }
  };

  const openEdit = (job) => {
    setEditJob(job); setTitle(job.title); setCompany(job.company); setLocation(job.location);
    setSalary(job.salary); setExperience(job.experience); setSkills(job.skills?.join(",")); setDescription(job.description);
    setShowEdit(true);
  };

  const updateJob = async () => {
    try {
      const updatedSkills = skills ? skills.split(",").map(s => s.trim()) : [];
      await API.put(`/jobs/${editJob._id}`, { title, company, location, salary, experience, skills: updatedSkills, description });
      setJobs(prev => prev.map(j => j._id === editJob._id ? { ...j, title, company, location, salary, experience, skills: updatedSkills, description } : j));
      toast.success("Job updated"); setShowEdit(false);
    } catch { toast.error("Update failed"); }
  };

  const viewApplicants = async (jobId) => {
    try { const res = await API.get(`/applications/job/${jobId}`); setApplicants([...res.data]); setSelectedJob(jobId); }
    catch { toast.error("Failed to load applicants"); }
  };

  const updateStatus = async (appId, status) => {
    await API.put(`/applications/${appId}`, { status });
    toast.success("Status updated"); viewApplicants(selectedJob);
  };

  useEffect(() => {
    if (selectedJob && applicantsRef.current) applicantsRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedJob]);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = jobs.map(job => ({ name: job.title.length > 12 ? job.title.slice(0, 12) + "…" : job.title, applicants: job.applicantsCount || 0 }));

  const formFields = [
    { placeholder: "Job Title *", value: title, onChange: setTitle },
    { placeholder: "Company *", value: company, onChange: setCompany },
    { placeholder: "Location", value: location, onChange: setLocation },
    { placeholder: "Salary (e.g. ₹8–12 LPA)", value: salary, onChange: setSalary },
    { placeholder: "Experience (e.g. 2–4 years)", value: experience, onChange: setExperience },
    { placeholder: "Skills (React, Node, …)", value: skills, onChange: setSkills },
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />

      <div className="max-w-7xl mx-auto space-y-6 mt-0">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Employer Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your job listings and applicants</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={[
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm",
              showForm
                ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25 shadow-md",
            ].join(" ")}
          >
            {showForm ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Cancel
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Post New Job
              </>
            )}
          </button>
        </div>

        {/* ── POST JOB FORM ── */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </span>
              Post New Job
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formFields.map((f, i) => (
                <input key={i} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} className={inp} />
              ))}
            </div>
            <textarea
              placeholder="Job Description…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className={`${inp} mt-3 resize-none`}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={postJob} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20">
                Publish Job
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Jobs"
            value={jobs.length}
            color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>}
          />
          <StatCard
            label="Total Applicants"
            value={jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0)}
            color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
          />
          <StatCard
            label="Active Jobs"
            value={jobs.filter(j => (j.applicantsCount || 0) > 0).length}
            color="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
          />
        </div>

        {/* ── CHART + QUICK STATS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Applications Overview</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "none", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    cursor={{ fill: "rgba(99,102,241,0.05)" }}
                  />
                  <Bar dataKey="applicants" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-300 dark:text-gray-600 text-sm">No data yet</div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Quick Stats</h2>
            <div className="flex-1 space-y-3">
              {[
                { label: "Hired this month", val: jobs.reduce((a, j) => a + (j.acceptedCount || 0), 0), color: "bg-emerald-500" },
                { label: "Pending reviews", val: jobs.reduce((a, j) => a + (j.applicantsCount || 0), 0), color: "bg-indigo-500" },
                { label: "Jobs posted", val: jobs.length, color: "bg-purple-500" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search jobs or companies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inp} pl-9`}
            />
          </div>
          <p className="text-xs text-gray-400 sm:ml-auto">{filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}</p>
        </div>

        {/* ── JOB TABLE ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Job Listings</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-slate-800/50">
                  {["Title", "Company", "Applicants", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filteredJobs.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-300 dark:text-gray-600">No jobs found</td></tr>
                ) : filteredJobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100">{job.title}</td>
                    <td className="px-5 py-3.5 text-sm text-indigo-500 font-medium">{job.company}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{job.applicantsCount || 0}</span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge job={job} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => viewApplicants(job._id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                          Applicants
                        </button>
                        <button onClick={() => openEdit(job)} className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => deleteJob(job._id)} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                          Delete
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
            {filteredJobs.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-300 dark:text-gray-600">No jobs found</p>
            ) : filteredJobs.map(job => (
              <div key={job._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{job.title}</p>
                    <p className="text-xs text-indigo-500 font-medium mt-0.5">{job.company}</p>
                  </div>
                  <StatusBadge job={job} />
                </div>
                <p className="text-xs text-gray-400">{job.applicantsCount || 0} applicant{job.applicantsCount !== 1 ? "s" : ""}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => viewApplicants(job._id)} className="flex-1 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                    Applicants
                  </button>
                  <button onClick={() => openEdit(job)} className="flex-1 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteJob(job._id)} className="flex-1 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── APPLICANTS ── */}
        {selectedJob && (
          <div ref={applicantsRef} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Applicants</h2>
              <button onClick={() => setSelectedJob(null)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Close</button>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {applicants.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No applicants yet</p>
              ) : applicants.map(a => (
                <div key={a._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0">
                      {a.applicant?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{a.applicant?.email}</p>
                      <span className={[
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        a.status === "accepted" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                        a.status === "rejected" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                        "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                      ].join(" ")}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <button onClick={() => updateStatus(a._id, "accepted")} className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                      Accept
                    </button>
                    <button onClick={() => updateStatus(a._id, "rejected")} className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* ── EDIT MODAL ── */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Edit Job</h2>
              <button onClick={() => setShowEdit(false)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-3">
              {formFields.map((f, i) => (
                <input key={i} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} className={inp} />
              ))}
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${inp} resize-none`} />
              <div className="flex gap-3 pt-2">
                <button onClick={updateJob} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20">
                  Update Job
                </button>
                <button onClick={() => setShowEdit(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;