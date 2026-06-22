import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    requireJobApproval: false,
    requireRecruiterVerification: false,
    maxFreeJobs: 5,
    allowCandidateResumeUpload: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/settings");
      setSettings(res.data);
    } catch {
      toast.error("Failed to load system settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.put("/admin/settings", settings);
      toast.success(res.data.message || "Settings updated successfully! ✓");
      setSettings(res.data.settings);
    } catch {
      toast.error("Failed to save settings changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <svg className="animate-spin w-8 h-8 text-violet-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-400">Loading system policies…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Control system-wide policies and job board constraints</p>
      </div>

      <form onSubmit={saveSettings} className="space-y-6">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-850 dark:text-gray-100 uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-800/80">
            Policy Gates
          </h3>

          {/* Require Job Approval */}
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Require Job Moderation
              </label>
              <p className="text-xs text-gray-450 dark:text-gray-455">
                New job postings will start as unapproved and remain hidden until an administrator audits and approves them.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("requireJobApproval")}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex-shrink-0 cursor-pointer ${
                settings.requireJobApproval ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  settings.requireJobApproval ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Require Recruiter Verification */}
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Require Verified Recruiters
              </label>
              <p className="text-xs text-gray-455">
                Employers cannot publish any job openings until their recruiter accounts are manually verified and approved by the admin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("requireRecruiterVerification")}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex-shrink-0 cursor-pointer ${
                settings.requireRecruiterVerification ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  settings.requireRecruiterVerification ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Allow Resume Uploads */}
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Allow Candidate Resume Uploads
              </label>
              <p className="text-xs text-gray-455">
                Candidates can upload resume files (PDF/Doc) when applying to job listings. Disable this to restrict to profile bios only.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("allowCandidateResumeUpload")}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex-shrink-0 cursor-pointer ${
                settings.allowCandidateResumeUpload ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  settings.allowCandidateResumeUpload ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <h3 className="text-sm font-bold text-gray-850 dark:text-gray-100 uppercase tracking-wider pt-4 pb-3 border-b border-gray-50 dark:border-slate-800/80">
            System Constraints
          </h3>

          {/* Max Free Jobs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="space-y-0.5 max-w-md">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Maximum Free Jobs Limit
              </label>
              <p className="text-xs text-gray-455">
                The absolute limit on the number of active job postings allowed for free-tier employer accounts.
              </p>
            </div>
            <input
              type="number"
              name="maxFreeJobs"
              min="1"
              max="100"
              value={settings.maxFreeJobs}
              onChange={handleChange}
              className="w-full sm:w-28 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-center font-bold text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving settings...
              </span>
            ) : (
              "Save Settings Policy"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
