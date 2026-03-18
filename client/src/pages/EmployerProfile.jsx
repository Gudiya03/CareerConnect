import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const inp =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all";

const EmployerProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    companyWebsite: "",
    location: "",
    industry: "",
    bio: "",
  });
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      toast.success("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  };

  const initials = profile.companyName?.trim()?.charAt(0)?.toUpperCase() || "C";

  /* Info row used in view mode */
  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-gray-50 dark:border-slate-800 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-700 dark:text-gray-200">{value || <span className="text-gray-300 dark:text-gray-600 italic">Not set</span>}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Company Profile
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your company information</p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* ── VIEW MODE ── */}
        {!editMode && (
          <>
            {/* Company hero banner */}
            <div className="bg-gradient-to-r from-indigo-500/8 to-indigo-400/5 dark:from-indigo-500/10 dark:to-transparent px-5 sm:px-6 py-5 border-b border-gray-50 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xl font-bold flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {profile.companyName || "Company Name"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">{profile.industry || "Industry not set"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="px-5 sm:px-6 py-1">
              <InfoRow label="Website" value={profile.companyWebsite} />
              <InfoRow label="Location" value={profile.location} />
              <InfoRow label="Industry" value={profile.industry} />
            </div>

            {/* About */}
            {(profile.bio || true) && (
              <div className="px-5 sm:px-6 py-4 border-t border-gray-50 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">About</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profile.bio || <span className="text-gray-300 dark:text-gray-600 italic">No description added yet.</span>}
                </p>
              </div>
            )}
          </>
        )}

        {/* ── EDIT MODE ── */}
        {editMode && (
          <div className="px-5 sm:px-6 py-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Edit Company Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Company Name"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className={inp}
              />
              <input
                placeholder="Industry"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className={inp}
              />
              <input
                placeholder="Website URL"
                value={profile.companyWebsite}
                onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
                className={inp}
              />
              <input
                placeholder="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className={inp}
              />
            </div>

            <textarea
              placeholder="About your company…"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className={`${inp} resize-none`}
            />

            <div className="flex gap-3 pt-1">
              <button
                onClick={saveProfile}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setEditMode(false); fetchProfile(); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;