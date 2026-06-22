import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | 'create' | null
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit / Create Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bio: "",
    role: "candidate",
    isBlocked: false,
    isVerifiedRecruiter: false,
    subscriptionPlan: "free",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    companyDescription: "",
    recruiterPhone: "",
    designation: "",
    businessRegNo: "",
    companyAddress: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  // Bulk Action Helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map((u) => u._id));
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
    if (action === "delete" && !window.confirm(`Are you sure you want to permanently delete these ${selectedIds.length} users?`)) {
      return;
    }

    try {
      const res = await API.post("/admin/users/bulk-action", { ids: selectedIds, action });
      toast.success(res.data.message || "Bulk action executed successfully!");
      fetchUsers();
    } catch {
      toast.error("Failed to execute bulk action");
    }
  };

  // Crud actions
  const verifyRecruiter = async (userId) => {
    try {
      await API.put(`/admin/verify-recruiter/${userId}`);
      toast.success("Recruiter verified successfully! ✓");
      setUsers(users.map(u => u._id === userId ? { ...u, isVerifiedRecruiter: true } : u));
    } catch {
      toast.error("Failed to verify recruiter");
    }
  };

  const toggleBlockStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/toggle-block/${userId}`);
      const updatedUser = res.data.user;
      toast.success(`Account ${updatedUser.isBlocked ? "suspended" : "activated"} successfully`);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: updatedUser.isBlocked } : u));
    } catch {
      toast.error("Failed to update suspension status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This will also remove any jobs they posted or applications they submitted!")) {
      return;
    }
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u._id !== userId));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setActiveModal("view");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      role: user.role || "candidate",
      isBlocked: user.isBlocked || false,
      isVerifiedRecruiter: user.isVerifiedRecruiter || false,
      subscriptionPlan: user.subscriptionPlan || "free",
      companyName: user.companyName || "",
      companyWebsite: user.companyWebsite || "",
      companySize: user.companySize || "",
      industry: user.industry || "",
      companyDescription: user.companyDescription || "",
      recruiterPhone: user.recruiterPhone || "",
      designation: user.designation || "",
      businessRegNo: user.businessRegNo || "",
      companyAddress: user.companyAddress || ""
    });
    setActiveModal("edit");
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      bio: "",
      role: "candidate",
      isBlocked: false,
      isVerifiedRecruiter: false,
      subscriptionPlan: "free",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      companyDescription: "",
      recruiterPhone: "",
      designation: "",
      businessRegNo: "",
      companyAddress: ""
    });
    setActiveModal("create");
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
      const res = await API.put(`/admin/users/${selectedUser._id}/edit`, formData);
      toast.success(res.data.message || "User profile updated successfully!");
      setActiveModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user profile");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/users/create", formData);
      toast.success(res.data.message || "User account created successfully! ✓");
      setActiveModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user account");
    }
  };

  const exportCandidatesCSV = () => {
    const candidates = users.filter(u => u.role === "candidate");
    if (candidates.length === 0) {
      toast.error("No candidate records found to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Location", "Skills"];
    const rows = candidates.map(c => [
      c.name || "",
      c.email || "",
      c.phone || "",
      c.location || "",
      (c.skills || []).join("; ")
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareerConnect_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Candidate database exported successfully! 📁");
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Control registered accounts and system roles</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/10 cursor-pointer"
          >
            ➕ Add System User
          </button>
          <button
            onClick={exportCandidatesCSV}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition cursor-pointer"
          >
            📥 Export Candidates CSV
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        >
          <option value="all">All Roles</option>
          <option value="candidate">Candidates</option>
          <option value="employer">Employers</option>
          <option value="admin">Administrators</option>
        </select>
        <span className="text-xs text-gray-400 font-medium sm:ml-auto">{filteredUsers.length} accounts found</span>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-violet-500/10 dark:bg-violet-500/5 border border-violet-500/20 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
              {selectedIds.length} user account{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkAction("activate")}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-emerald-600 transition cursor-pointer"
            >
              Bulk Activate
            </button>
            <button
              onClick={() => handleBulkAction("suspend")}
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-amber-600 transition cursor-pointer"
            >
              Bulk Suspend
            </button>
            <button
              onClick={() => handleBulkAction("verify-recruiter")}
              className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold hover:bg-indigo-600 transition cursor-pointer"
            >
              Bulk Verify Recruiters
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
            <p className="text-sm text-gray-400">Loading user list…</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-slate-800/50 border-b border-gray-150 dark:border-slate-800/80">
                  <th className="px-4 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Role</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40">
                {filteredUsers.map((user) => {
                  const isSelected = selectedIds.includes(user._id);
                  return (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition ${
                        isSelected ? "bg-violet-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(user._id)}
                          className="rounded accent-violet-600 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(user)}
                            className="hover:text-violet-600 hover:underline text-left cursor-pointer"
                          >
                            {user.name}
                          </button>
                          {user.isVerifiedRecruiter && (
                            <span className="text-emerald-500 text-xs font-bold" title="Verified Recruiter">✓</span>
                          )}
                          {user.isBlocked && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded text-[9px] font-bold">
                              Suspended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg ${
                          user.role === "admin" ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" :
                          user.role === "employer" ? "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400" :
                          "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openViewModal(user)}
                            className="px-2 py-1 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 transition text-xs font-semibold cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="px-2 py-1 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded hover:bg-violet-100 transition text-xs font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          {user.role === "employer" && !user.isVerifiedRecruiter && (
                            <button
                              onClick={() => verifyRecruiter(user._id)}
                              className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-100 transition text-xs font-semibold cursor-pointer"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => toggleBlockStatus(user._id)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              user.isBlocked
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600"
                            }`}
                          >
                            {user.isBlocked ? "Activate" : "Suspend"}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
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

      {/* VIEW USER MODAL */}
      {activeModal === "view" && selectedUser && (
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
              <div className="flex items-center gap-4 pb-4 border-b border-gray-50 dark:border-slate-800/80">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-850 dark:text-white flex items-center gap-2">
                    {selectedUser.name}
                    <span className="text-xs px-2 py-0.5 bg-violet-100 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-full font-bold uppercase">
                      {selectedUser.role}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              {/* Basic Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Phone</span>
                  <p className="text-sm font-semibold mt-0.5 text-gray-700 dark:text-gray-200">
                    {selectedUser.phone || "Not Provided"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Location</span>
                  <p className="text-sm font-semibold mt-0.5 text-gray-700 dark:text-gray-200">
                    📍 {selectedUser.location || "Not Provided"}
                  </p>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Biography</span>
                  <p className="text-sm mt-0.5 text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    "{selectedUser.bio}"
                  </p>
                </div>
              )}

              {/* CANDIDATE SPECIFIC FIELDS */}
              {selectedUser.role === "candidate" && (
                <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800/80">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Candidate Profile Details</h4>
                  
                  {/* Skills badge */}
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-semibold">Skills Set</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedUser.skills && selectedUser.skills.length > 0 ? (
                        selectedUser.skills.map((skill, index) => (
                          <span key={index} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  {selectedUser.education && selectedUser.education.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Education History</span>
                      <div className="space-y-3 mt-2">
                        {selectedUser.education.map((edu, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800/60">
                            <p className="font-semibold text-sm">{edu.degree}</p>
                            <p className="text-xs text-indigo-500 font-semibold">{edu.institution}</p>
                            <p className="text-[10px] text-gray-400 mt-1">🗓️ {edu.startYear} - {edu.endYear}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedUser.experience && selectedUser.experience.length > 0 && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Work Experience</span>
                      <div className="space-y-3 mt-2">
                        {selectedUser.experience.map((exp, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800/60">
                            <p className="font-semibold text-sm">{exp.title}</p>
                            <p className="text-xs text-indigo-500 font-semibold">{exp.company}</p>
                            <p className="text-[10px] text-gray-400 mt-1">🗓️ {exp.startDate} - {exp.endDate || "Present"}</p>
                            {exp.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume view */}
                  {selectedUser.resume && (
                    <div className="pt-2">
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${selectedUser.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
                      >
                        📄 Download/View Resume
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* EMPLOYER SPECIFIC FIELDS */}
              {selectedUser.role === "employer" && (
                <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800/80">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Company Profile Info</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Company Name</span>
                      <p className="text-sm font-semibold text-indigo-500">{selectedUser.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Website</span>
                      {selectedUser.companyWebsite ? (
                        <p className="text-sm mt-0.5">
                          <a
                            href={selectedUser.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:underline font-semibold"
                          >
                            {selectedUser.companyWebsite} 🔗
                          </a>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Not Provided</p>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Industry Sector</span>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedUser.industry || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Company Size</span>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedUser.companySize || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Designation</span>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedUser.designation || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Business Registration No.</span>
                      <p className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">{selectedUser.businessRegNo || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Subscription Plan</span>
                      <span className={`inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        selectedUser.subscriptionPlan === "premium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {selectedUser.subscriptionPlan}
                      </span>
                    </div>
                  </div>

                  {selectedUser.companyDescription && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Company Overview</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-slate-800/30 p-3 rounded-xl mt-1">
                        {selectedUser.companyDescription}
                      </p>
                    </div>
                  )}

                  {selectedUser.companyAddress && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Headquarters Address</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">📍 {selectedUser.companyAddress}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER PROFILE MODAL */}
      {activeModal === "edit" && selectedUser && (
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
              <h3 className="text-lg font-bold text-gray-850 dark:text-white">Edit User Profile</h3>
              <p className="text-xs text-gray-400 mt-0.5">Modify system flags and account metadata</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Profile Bio</label>
              <textarea
                name="bio"
                rows="2"
                value={formData.bio}
                onChange={handleFormChange}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">System Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-2 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                >
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Subscription Plan</label>
                <select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-2 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                >
                  <option value="free">Free Plan</option>
                  <option value="premium">Premium Plan</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2 justify-center">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="isBlocked"
                    checked={formData.isBlocked}
                    onChange={handleFormChange}
                    className="accent-violet-600 rounded"
                  />
                  Suspended / Blocked
                </label>
                {formData.role === "employer" && (
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      name="isVerifiedRecruiter"
                      checked={formData.isVerifiedRecruiter}
                      onChange={handleFormChange}
                      className="accent-violet-600 rounded"
                    />
                    Verified Recruiter
                  </label>
                )}
              </div>
            </div>

            {/* Recruiter Details Fields */}
            {formData.role === "employer" && (
              <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800/80">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Company Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Website URL</label>
                    <input
                      type="text"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Company Size</label>
                    <input
                      type="text"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Recruiter Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Business Reg No.</label>
                    <input
                      type="text"
                      name="businessRegNo"
                      value={formData.businessRegNo}
                      onChange={handleFormChange}
                      className="w-full mt-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

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
                Save Profile Updates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {activeModal === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateSubmit}
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
              <h3 className="text-lg font-bold text-gray-850 dark:text-white">Create System User</h3>
              <p className="text-xs text-gray-400 mt-0.5">Register a new candidate, recruiter, or admin account directly</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter full name"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="name@example.com"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                  placeholder="••••••••"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">System Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm text-gray-800 dark:text-white"
                >
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>
            </div>

            {formData.role === "employer" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Subscription Tier</label>
                  <select
                    name="subscriptionPlan"
                    value={formData.subscriptionPlan}
                    onChange={handleFormChange}
                    className="w-full mt-1.5 px-2 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                  >
                    <option value="free">Free Tier</option>
                    <option value="premium">Premium Tier</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200 select-none">
                    <input
                      type="checkbox"
                      name="isVerifiedRecruiter"
                      checked={formData.isVerifiedRecruiter}
                      onChange={handleFormChange}
                      className="accent-violet-600 rounded"
                    />
                    Pre-verify Recruiter Status
                  </label>
                </div>
              </div>
            )}

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
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
