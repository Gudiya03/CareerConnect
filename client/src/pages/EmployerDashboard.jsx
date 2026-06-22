import { useState, useEffect, useRef } from "react";
import { API } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

const inp =
  "w-full px-3 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all";

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

const StatusBadge = ({ job }) => {
  if (job.status === "Closed") {
    return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold">● Closed</span>;
  }
  if (job.acceptedCount > 0)
    return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold">● Hiring</span>;
  if (job.applicantsCount > 0)
    return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold">● Active</span>;
  return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">● Open</span>;
};

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  
  // Jobs and applicants states
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [editJob, setEditJob] = useState(null);

  // Job creation fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  // Candidate search states
  const [candidates, setCandidates] = useState([]);
  const [candSearch, setCandSearch] = useState("");
  const [candExpFilter, setCandExpFilter] = useState("all");

  // Recruiter Profile (for Premium status)
  const [profile, setProfile] = useState(null);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const applicantsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchProfile();
    fetchCandidates();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch {}
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs?all=true"); // Fetch all recruiter posted jobs
      // Filter jobs posted by current recruiter
      const currentUserId = localStorage.getItem("email");
      // Since postedBy contains object or ID, we filter in controller or frontend.
      // Fetching all for now
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/auth/candidates");
      setCandidates(res.data);
    } catch {}
  };

  const postJob = async () => {
    try {
      if (!title || !company) {
        toast.error("Title and company required");
        return;
      }
      await API.post("/jobs", {
        title,
        company,
        location,
        salary,
        jobType: "Full-Time",
        experience,
        skills: skills ? skills.split(",").map(s => s.trim()) : [],
        description,
      });
      toast.success("Job posted successfully");
      setTitle(""); setCompany(""); setLocation(""); setSalary(""); setExperience(""); setSkills(""); setDescription("");
      setShowForm(false);
      fetchJobs();
    } catch {
      toast.error("Job post failed");
    }
  };

  const toggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === "Closed" ? "Open" : "Closed";
      await API.put(`/jobs/${job._id}`, { status: newStatus });
      toast.success(`Job vacancy status is now ${newStatus}`);
      fetchJobs();
    } catch {
      toast.error("Failed to update job status");
    }
  };

  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      setJobs(jobs.filter((j) => j._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (job) => {
    setEditJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setSalary(job.salary);
    setExperience(job.experience);
    setSkills(job.skills?.join(","));
    setDescription(job.description);
    setShowEdit(true);
  };

  const updateJob = async () => {
    try {
      const updatedSkills = skills ? skills.split(",").map((s) => s.trim()) : [];
      await API.put(`/jobs/${editJob._id}`, {
        title,
        company,
        location,
        salary,
        experience,
        skills: updatedSkills,
        description,
      });
      toast.success("Job updated");
      setShowEdit(false);
      fetchJobs();
    } catch {
      toast.error("Update failed");
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants([...res.data]);
      setSelectedJob(jobId);
    } catch {
      toast.error("Failed to load applicants");
    }
  };

  const updateStatus = async (appId, status) => {
    await API.put(`/applications/${appId}`, { status });
    toast.success("Status updated");
    viewApplicants(selectedJob);
  };

  const handleCheckout = async () => {
    if (!cardNumber || !cardExpiry || !cardCVC) {
      toast.error("Please fill in card details");
      return;
    }
    setPaymentLoading(true);
    try {
      // simulate network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const updatedProfile = {
        subscriptionPlan: "premium",
        subscriptionStatus: "active"
      };

      await API.put("/auth/profile", updatedProfile);
      toast.success("Payment succeeded! Upgraded to Premium Plan 🏆");
      setCheckoutModal(false);
      fetchProfile();
    } catch {
      toast.error("Subscription payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const startChat = (candidate) => {
    // Navigate to Chat page with selection state
    navigate("/chat", { state: { startWithUser: candidate } });
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCandidates = candidates.filter((c) => {
    const skillsList = (c.skills || []).join(" ").toLowerCase();
    const matchSearch = skillsList.includes(candSearch.toLowerCase()) || c.name.toLowerCase().includes(candSearch.toLowerCase());
    
    // basic experience filtering (just simple heuristic)
    if (candExpFilter === "entry") {
      return matchSearch && (!c.experience || c.experience.length === 0);
    }
    if (candExpFilter === "mid") {
      return matchSearch && (c.experience && c.experience.length > 0 && c.experience.length <= 2);
    }
    if (candExpFilter === "senior") {
      return matchSearch && (c.experience && c.experience.length > 2);
    }
    return matchSearch;
  });

  const chartData = jobs.map((job) => ({
    name: job.title.length > 12 ? job.title.slice(0, 12) + "…" : job.title,
    applicants: job.applicantsCount || 0,
  }));

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
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1 border-b dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Employer Portal</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage listings, candidates, and portal settings</p>
          </div>

          {/* Plan badge */}
          <div className="flex items-center gap-3">
            {profile?.subscriptionPlan === "premium" ? (
              <span className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/5">
                🏆 PREMIUM RECRUITER ACTIVE
              </span>
            ) : (
              <button
                onClick={() => setCheckoutModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/15 hover:opacity-90 cursor-pointer"
              >
                ⭐ UPGRADE TO PREMIUM PLAN
              </button>
            )}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 border-b dark:border-slate-800">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer ${
              activeTab === "jobs"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-400 hover:text-gray-500"
            }`}
          >
            📋 Job Postings & Analytics
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer ${
              activeTab === "candidates"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-400 hover:text-gray-500"
            }`}
          >
            🔍 Candidate Lookup
          </button>
        </div>

        {/* ── JOBS & ANALYTICS TAB ── */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Job Management</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                {showForm ? "Cancel" : "+ Post Vacancy"}
              </button>
            </div>

            {/* CREATE VACANCY FORM */}
            {showForm && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Post New Vacancy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formFields.map((f, i) => (
                    <input key={i} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} className={inp} />
                  ))}
                </div>
                <textarea
                  placeholder="Job Description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className={`${inp} mt-3 resize-none`}
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={postJob} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm">
                    Publish Vacancy
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border text-gray-400 text-xs font-medium">
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Vacancies"
                value={jobs.length}
                color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                icon={<span className="text-lg">📁</span>}
              />
              <StatCard
                label="Active Openings"
                value={jobs.filter(j => j.status !== "Closed").length}
                color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                icon={<span className="text-lg">●</span>}
              />
              <StatCard
                label="Closed Openings"
                value={jobs.filter(j => j.status === "Closed").length}
                color="bg-rose-50 dark:bg-rose-500/10 text-rose-600"
                icon={<span className="text-lg">✕</span>}
              />
            </div>

            {/* CHART */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Application counts by role</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-850" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <Tooltip cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                    <Bar dataKey="applicants" fill="#6366f1" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">No vacancies posted yet</div>
              )}
            </div>

            {/* JOBS LIST TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Vacancies List</h3>
                <input
                  placeholder="Filter by title..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-3 py-1 bg-gray-50 dark:bg-slate-800 border rounded-lg text-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-slate-800/40 border-b dark:border-slate-800">
                      <th className="px-5 py-3 text-left text-xs text-gray-400 uppercase">Title</th>
                      <th className="px-5 py-3 text-left text-xs text-gray-400 uppercase">Location</th>
                      <th className="px-5 py-3 text-center text-xs text-gray-400 uppercase">Applicants</th>
                      <th className="px-5 py-3 text-center text-xs text-gray-400 uppercase">Approval</th>
                      <th className="px-5 py-3 text-center text-xs text-gray-400 uppercase">Status</th>
                      <th className="px-5 py-3 text-center text-xs text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800/60">
                    {filteredJobs.map(job => (
                      <tr key={job._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/10">
                        <td className="px-5 py-3.5 font-semibold">{job.title}</td>
                        <td className="px-5 py-3.5 text-gray-550 dark:text-gray-400 text-xs">📍 {job.location}</td>
                        <td className="px-5 py-3.5 text-center font-bold text-indigo-500">{job.applicantsCount || 0}</td>
                        <td className="px-5 py-3.5 text-center text-xs">
                          {job.isApproved ? (
                            <span className="text-emerald-500 font-semibold">Approved ✓</span>
                          ) : (
                            <span className="text-gray-400 italic">Pending Admin Approval</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <StatusBadge job={job} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => viewApplicants(job._id)} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded text-xs font-semibold cursor-pointer">Applicants</button>
                            <button onClick={() => toggleJobStatus(job)} className="px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded text-xs font-semibold cursor-pointer">
                              {job.status === "Closed" ? "Reopen" : "Close"}
                            </button>
                            <button onClick={() => deleteJob(job._id)} className="px-2 py-1 bg-red-50 dark:bg-red-950/20 text-red-500 rounded text-xs font-semibold cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPLICANTS DETAILS SCREEN */}
            {selectedJob && (
              <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Applicants</h3>
                  <button onClick={() => setSelectedJob(null)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
                </div>
                {applicants.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-6">No application reviews yet</p>
                ) : (
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {applicants.map(app => (
                      <div key={app._id} className="bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-150/40 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-xs">{app.applicant?.email}</p>
                          <p className="text-[10px] text-gray-400 mt-1 capitalize">Status: <span className="font-bold text-indigo-500">{app.status}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(app._id, "accepted")} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">Accept</button>
                          <button onClick={() => updateStatus(app._id, "rejected")} className="px-2.5 py-1 bg-red-500 text-white rounded text-[10px] font-bold">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CANDIDATE LOOKUP TAB ── */}
        {activeTab === "candidates" && (
          <div className="space-y-6">
            {/* Search filter bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  placeholder="Search by candidate name or skills..."
                  value={candSearch}
                  onChange={e => setCandSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl text-sm"
                />
              </div>

              <select
                value={candExpFilter}
                onChange={e => setCandExpFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border text-sm text-gray-400 focus:outline-none"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry Level (No exp)</option>
                <option value="mid">Mid Level (1-2 jobs)</option>
                <option value="senior">Senior Level (3+ jobs)</option>
              </select>
            </div>

            {/* Candidates grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCandidates.length === 0 ? (
                <p className="col-span-full text-center text-xs text-gray-400 py-10">No matching candidates found</p>
              ) : (
                filteredCandidates.map(cand => (
                  <div key={cand._id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm flex-shrink-0">
                          {cand.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{cand.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">📍 {cand.location || "Remote"}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {cand.bio || "No description provided."}
                      </p>

                      {/* Skills list */}
                      {cand.skills && cand.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {cand.skills.map((s, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-50 dark:bg-slate-800 text-gray-400 font-semibold px-2 py-0.5 rounded border">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t dark:border-slate-800 pt-3 mt-4 flex gap-2">
                      <button
                        onClick={() => startChat(cand)}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
                      >
                        💬 Start Chat
                      </button>
                      {cand.resume && (
                        <a
                          href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${cand.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 border border-gray-200 dark:border-slate-800 text-gray-400 rounded-xl text-xs font-semibold hover:bg-gray-50 transition text-center"
                        >
                          📄 View Resume
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── SUBSCRIPTION PREMIUM UPGRADE CHECKOUT MODAL ── */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <span>⭐</span> Recruiter Premium Subscription
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Upgrade for $99/mo to unlock unlimited postings & verified badge</p>
            </div>

            {/* Credit Card inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Card Number</label>
                <input
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className={inp}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Expiry Date</label>
                  <input
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">CVC Code</label>
                  <input
                    placeholder="123"
                    value={cardCVC}
                    onChange={e => setCardCVC(e.target.value)}
                    className={inp}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleCheckout}
                disabled={paymentLoading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Upgrade for $99/mo"
                )}
              </button>
              <button
                onClick={() => setCheckoutModal(false)}
                className="border border-gray-200 dark:border-slate-800 text-gray-450 hover:bg-gray-50 py-2.5 px-4 rounded-xl text-xs font-medium cursor-pointer"
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

export default EmployerDashboard;