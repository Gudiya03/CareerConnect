import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const inp =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all backdrop-blur-sm";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Education inputs
  const [eduDegree, setEduDegree] = useState("");
  const [eduInst, setEduInst] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");

  // Experience inputs
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      toast.success("Profile updated successfully!");
      if (profile.name) {
        localStorage.setItem("name", profile.name);
      }
      setEditMode(false);
      fetchProfile();
      window.location.reload();
    } catch {
      toast.error("Update failed");
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProfile((prev) => ({ ...prev, skills: [...(prev.skills || []), skillInput.trim()] }));
    setSkillInput("");
  };

  const removeSkill = (idx) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  const addEducation = () => {
    if (!eduDegree.trim() || !eduInst.trim()) {
      toast.error("Degree and School name are required");
      return;
    }
    const newEdu = {
      degree: eduDegree.trim(),
      institution: eduInst.trim(),
      startYear: eduStart.trim() || "N/A",
      endYear: eduEnd.trim() || "Present"
    };
    setProfile(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
    setEduDegree("");
    setEduInst("");
    setEduStart("");
    setEduEnd("");
    toast.success("Education added!");
  };

  const removeEducation = (idx) => {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== idx)
    }));
  };

  const addExperience = () => {
    if (!expTitle.trim() || !expCompany.trim()) {
      toast.error("Title and Company name are required");
      return;
    }
    const newExp = {
      title: expTitle.trim(),
      company: expCompany.trim(),
      startDate: expStart.trim() || "N/A",
      endDate: expEnd.trim() || "Present",
      description: expDesc.trim() || ""
    };
    setProfile(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }));
    setExpTitle("");
    setExpCompany("");
    setExpStart("");
    setExpEnd("");
    setExpDesc("");
    toast.success("Experience added!");
  };

  const removeExperience = (idx) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== idx)
    }));
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b]">
      <p className="text-sm text-blue-200/40">Loading…</p>
    </div>
  );

  const avatarLetter = profile.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-5 relative z-10">

        {/* HEADER CARD */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl px-5 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl font-bold flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{profile.name}</h2>
              <p className="text-sm text-blue-200/40 truncate">{profile.email}</p>
              <span className="inline-flex mt-1 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-450 capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* CANDIDATE PROFILE */}
        {profile?.role === "candidate" && (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">

            <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-100">Candidate Profile</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="px-5 sm:px-6 py-5">
              {!editMode ? (
                /* ── VIEW MODE ── */
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-1">Full Name</p>
                    <p className="text-sm text-blue-100 font-medium">
                      {profile.name}
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-1">Bio</p>
                    <p className="text-sm text-blue-100/80 leading-relaxed">
                      {profile.bio || <span className="text-blue-200/35 italic">No bio added</span>}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-1">Location</p>
                    <p className="text-sm text-blue-100/80">
                      {profile.location || <span className="text-blue-200/35 italic">Not set</span>}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-2">Skills</p>
                    {profile.skills?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-200/35 italic">No skills added</p>
                    )}
                  </div>

                  {/* Education */}
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-2">Education</p>
                    {profile.education?.length ? (
                      <div className="space-y-3">
                        {profile.education.map((edu, i) => (
                          <div key={i} className="text-sm bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white">{edu.degree}</h4>
                            <p className="text-xs text-blue-405 font-semibold">{edu.institution}</p>
                            <p className="text-[11px] text-blue-200/40 mt-1">{edu.startYear} — {edu.endYear}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-200/35 italic">No education details added</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60 mb-2">Experience</p>
                    {profile.experience?.length ? (
                      <div className="space-y-3">
                        {profile.experience.map((exp, i) => (
                          <div key={i} className="text-sm bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white">{exp.title}</h4>
                            <p className="text-xs text-blue-405 font-semibold">{exp.company}</p>
                            <p className="text-[11px] text-blue-200/40 mt-1">{exp.startDate} — {exp.endDate}</p>
                            {exp.description && (
                              <p className="text-xs text-blue-200/60 mt-1.5 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-200/35 italic">No experience details added</p>
                    )}
                  </div>
                </div>
              ) : (
                /* ── EDIT MODE ── */
                <div className="space-y-3">
                  <input
                    placeholder="Full Name"
                    value={profile.name || ""}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className={inp}
                  />

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
                      className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 transition-colors flex-shrink-0"
                    >
                      Add
                    </button>
                  </div>

                  {/* Current skills (with remove) */}
                  {profile.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s, i) => (
                        <span key={i} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                          {s}
                          <button
                            onClick={() => removeSkill(i)}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                          >
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Education Editor */}
                  <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60">Manage Education</p>
                    
                    {/* Add Edu fields */}
                    <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                      <input
                        placeholder="Degree (e.g. B.Tech Computer Science)"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        className={inp}
                      />
                      <input
                        placeholder="Institution / School Name"
                        value={eduInst}
                        onChange={(e) => setEduInst(e.target.value)}
                        className={inp}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="Start Year (e.g. 2021)"
                          value={eduStart}
                          onChange={(e) => setEduStart(e.target.value)}
                          className={inp}
                        />
                        <input
                          placeholder="End Year (e.g. 2025)"
                          value={eduEnd}
                          onChange={(e) => setEduEnd(e.target.value)}
                          className={inp}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        + Add Education to Profile
                      </button>
                    </div>

                    {/* Existing Edu list with delete */}
                    {profile.education?.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/[0.01] px-4 py-2.5 rounded-xl border border-white/5">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{edu.degree}</p>
                          <p className="text-[10px] text-blue-200/40 truncate">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xs hover:scale-105 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Experience Editor */}
                  <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/60">Manage Experience</p>
                    
                    {/* Add Exp fields */}
                    <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                      <input
                        placeholder="Job Title (e.g. Frontend Developer)"
                        value={expTitle}
                        onChange={(e) => setExpTitle(e.target.value)}
                        className={inp}
                      />
                      <input
                        placeholder="Company Name"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        className={inp}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="Start Date (e.g. June 2024)"
                          value={expStart}
                          onChange={(e) => setExpStart(e.target.value)}
                          className={inp}
                        />
                        <input
                          placeholder="End Date (e.g. Aug 2024)"
                          value={expEnd}
                          onChange={(e) => setExpEnd(e.target.value)}
                          className={inp}
                        />
                      </div>
                      <textarea
                        placeholder="Role Description & Achievements..."
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        rows={2}
                        className={`${inp} resize-none`}
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        + Add Experience to Profile
                      </button>
                    </div>

                    {/* Existing Exp list with delete */}
                    {profile.experience?.map((exp, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/[0.01] px-4 py-2.5 rounded-xl border border-white/5">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{exp.title}</p>
                          <p className="text-[10px] text-blue-200/40 truncate">{exp.company} ({exp.startDate} - {exp.endDate})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center justify-center text-xs hover:scale-105 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={saveProfile}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setEditMode(false); fetchProfile(); }}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-blue-200 text-sm font-medium hover:bg-white/5 transition-colors"
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