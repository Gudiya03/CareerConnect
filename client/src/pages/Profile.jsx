import { useEffect, useState } from "react";
import { API } from "../api/api";

const inp =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const fetchProfile = async () => {
    try { const res = await API.get("/auth/profile"); setProfile(res.data); }
    catch (err) { console.log(err); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      alert("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch { alert("Update failed"); }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProfile((prev) => ({ ...prev, skills: [...(prev.skills || []), skillInput.trim()] }));
    setSkillInput("");
  };

  const removeSkill = (idx) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0c0c14]">
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  );

  const avatarLetter = profile.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0c0c14] text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-5">

        {/* HEADER CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm px-5 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xl font-bold flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{profile.name}</h2>
              <p className="text-sm text-gray-400 truncate">{profile.email}</p>
              <span className="inline-flex mt-1 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* CANDIDATE PROFILE */}
        {profile?.role === "candidate" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="px-5 sm:px-6 py-4 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Candidate Profile</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="px-5 sm:px-6 py-5">
              {!editMode ? (
                /* ── VIEW MODE ── */
                <div className="space-y-4">
                  {/* Bio */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Bio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {profile.bio || <span className="text-gray-300 dark:text-gray-600 italic">No bio added</span>}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {profile.location || <span className="text-gray-300 dark:text-gray-600 italic">Not set</span>}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Skills</p>
                    {profile.skills?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 dark:text-gray-600 italic">No skills added</p>
                    )}
                  </div>
                </div>
              ) : (
                /* ── EDIT MODE ── */
                <div className="space-y-3">
                  <textarea
                    placeholder="Tell employers about yourself…"
                    value={profile.bio || ""}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    className={`${inp} resize-none`}
                  />

                  <input
                    placeholder="Location"
                    value={profile.location || ""}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className={inp}
                  />

                  {/* Skill add */}
                  <div className="flex gap-2">
                    <input
                      placeholder="Add a skill (e.g. React)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      className={`${inp} flex-1`}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors flex-shrink-0"
                    >
                      Add
                    </button>
                  </div>

                  {/* Current skills (with remove) */}
                  {profile.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s, i) => (
                        <span key={i} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                          {s}
                          <button
                            onClick={() => removeSkill(i)}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                          >
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

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
        )}
      </div>
    </div>
  );
};

export default Profile;