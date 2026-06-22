import { useState, useEffect } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const formInput =
  "w-full px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";

const formLabel = "text-[10px] font-bold uppercase tracking-wider text-blue-300/60 mb-1.5 block";

const ResumeBuilder = () => {
  // Form State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    languages: [],
    socialLinks: { linkedin: "", github: "", portfolio: "" }
  });

  // Editor states
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const [edu, setEdu] = useState({ degree: "", institution: "", startYear: "", endYear: "" });
  const [exp, setExp] = useState({ title: "", company: "", startDate: "", endDate: "", description: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        bio: res.data.bio || "",
        skills: res.data.skills || [],
        education: res.data.education || [],
        experience: res.data.experience || [],
        certifications: res.data.certifications || [],
        languages: res.data.languages || [],
        socialLinks: res.data.socialLinks || { linkedin: "", github: "", portfolio: "" }
      });
    } catch {
      toast.error("Failed to load profile details");
    }
  };

  // Add items
  const addItem = (type, value, setInput) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    setInput("");
  };

  const removeItem = (type, idx) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx)
    }));
  };

  const addEdu = () => {
    if (!edu.degree || !edu.institution) return;
    setProfile(prev => ({ ...prev, education: [...prev.education, edu] }));
    setEdu({ degree: "", institution: "", startYear: "", endYear: "" });
  };

  const addExp = () => {
    if (!exp.title || !exp.company) return;
    setProfile(prev => ({ ...prev, experience: [...prev.experience, exp] }));
    setExp({ title: "", company: "", startDate: "", endDate: "", description: "" });
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden print:bg-white print:text-black">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none print:hidden" />

      <Toaster position="top-right" />

      {/* Main print wrapper */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 print:p-0 relative z-10">
        
        {/* Header - hide on print */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl mb-8 flex justify-between items-center print:hidden shadow-xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Interactive Resume Builder</h1>
            <p className="text-blue-200/40 text-xs mt-1">Design and export your professional resume to PDF instantly</p>
          </div>
          <button
            onClick={exportPDF}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition cursor-pointer flex items-center gap-2"
          >
            <span>📥</span> Export to PDF / Print
          </button>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel: Form Editors (hide on print) */}
          <div className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-2xl border border-white/5 space-y-6 print:hidden shadow-xl max-h-[82vh] overflow-y-auto">
            <h2 className="text-sm font-bold text-blue-300/80 uppercase tracking-wider mb-2">Resume Details</h2>

            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">1. Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={formLabel}>Full Name</label>
                  <input
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className={formInput}
                  />
                </div>
                <div>
                  <label className={formLabel}>Contact Email</label>
                  <input
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className={formInput}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={formLabel}>Phone Number</label>
                  <input
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className={formInput}
                  />
                </div>
                <div>
                  <label className={formLabel}>Location</label>
                  <input
                    value={profile.location}
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                    className={formInput}
                  />
                </div>
              </div>

              <div>
                <label className={formLabel}>Professional Summary</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={2}
                  className={`${formInput} resize-none`}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">2. Social Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={formLabel}>LinkedIn</label>
                  <input
                    value={profile.socialLinks.linkedin}
                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                    className={formInput}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={formLabel}>GitHub</label>
                  <input
                    value={profile.socialLinks.github}
                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                    className={formInput}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={formLabel}>Portfolio</label>
                  <input
                    value={profile.socialLinks.portfolio}
                    onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, portfolio: e.target.value } })}
                    className={formInput}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Skills & Certs */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">3. Skills, Certs & Languages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Skills */}
                <div>
                  <label className={formLabel}>Add Skill</label>
                  <div className="flex gap-1">
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      className={`${formInput} text-xs`}
                      onKeyDown={e => e.key === "Enter" && addItem("skills", skillInput, setSkillInput)}
                    />
                    <button onClick={() => addItem("skills", skillInput, setSkillInput)} className="px-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-bold rounded-lg">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.skills.map((s, i) => (
                      <span key={i} className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-405 px-2 py-0.5 rounded flex items-center gap-1">
                        {s} <button onClick={() => removeItem("skills", i)} className="hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className={formLabel}>Add Cert</label>
                  <div className="flex gap-1">
                    <input
                      value={certInput}
                      onChange={e => setCertInput(e.target.value)}
                      className={`${formInput} text-xs`}
                      onKeyDown={e => e.key === "Enter" && addItem("certifications", certInput, setCertInput)}
                    />
                    <button onClick={() => addItem("certifications", certInput, setCertInput)} className="px-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-bold rounded-lg">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.certifications.map((c, i) => (
                      <span key={i} className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-405 px-2 py-0.5 rounded flex items-center gap-1">
                        {c} <button onClick={() => removeItem("certifications", i)} className="hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className={formLabel}>Add Language</label>
                  <div className="flex gap-1">
                    <input
                      value={langInput}
                      onChange={e => setLangInput(e.target.value)}
                      className={`${formInput} text-xs`}
                      onKeyDown={e => e.key === "Enter" && addItem("languages", langInput, setLangInput)}
                    />
                    <button onClick={() => addItem("languages", langInput, setLangInput)} className="px-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-bold rounded-lg">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.languages.map((l, i) => (
                      <span key={i} className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-405 px-2 py-0.5 rounded flex items-center gap-1">
                        {l} <button onClick={() => removeItem("languages", i)} className="hover:text-red-400">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education History */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">4. Education</h3>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Degree" value={edu.degree} onChange={e => setEdu({ ...edu, degree: e.target.value })} className={formInput} />
                <input placeholder="Institution" value={edu.institution} onChange={e => setEdu({ ...edu, institution: e.target.value })} className={formInput} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Start Year" value={edu.startYear} onChange={e => setEdu({ ...edu, startYear: e.target.value })} className={formInput} />
                <input placeholder="End Year" value={edu.endYear} onChange={e => setEdu({ ...edu, endYear: e.target.value })} className={formInput} />
              </div>
              <button onClick={addEdu} className="w-full py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-bold rounded-lg">+ Add Education</button>
              
              <div className="space-y-1">
                {profile.education.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-white/[0.01] border border-white/5 p-2 rounded">
                    <span className="text-blue-200/50">{e.degree} at {e.institution} ({e.startYear}-{e.endYear})</span>
                    <button onClick={() => setProfile({ ...profile, education: profile.education.filter((_, i) => i !== idx) })} className="text-rose-500 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience History */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">5. Experience</h3>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Job Title" value={exp.title} onChange={e => setExp({ ...exp, title: e.target.value })} className={formInput} />
                <input placeholder="Company" value={exp.company} onChange={e => setExp({ ...exp, company: e.target.value })} className={formInput} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Start Date" value={exp.startDate} onChange={e => setExp({ ...exp, startDate: e.target.value })} className={formInput} />
                <input placeholder="End Date" value={exp.endDate} onChange={e => setExp({ ...exp, endDate: e.target.value })} className={formInput} />
              </div>
              <textarea placeholder="Job Description..." value={exp.description} onChange={e => setExp({ ...exp, description: e.target.value })} rows={2} className={`${formInput} resize-none`} />
              <button onClick={addExp} className="w-full py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-bold rounded-lg">+ Add Experience</button>

              <div className="space-y-1">
                {profile.experience.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-white/[0.01] border border-white/5 p-2 rounded">
                    <span className="truncate text-blue-200/50">{e.title} at {e.company}</span>
                    <button onClick={() => setProfile({ ...profile, experience: profile.experience.filter((_, i) => i !== idx) })} className="text-rose-500 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Styled Document Live Preview (Shown in print mode also) */}
          <div className="bg-white text-black p-8 sm:p-12 shadow-2xl border border-white/10 aspect-[1/1.41] max-w-full rounded-2xl print:shadow-none print:border-none print:p-0 select-text font-serif">
            
            {/* Header */}
            <div className="text-center border-b pb-5 mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-1">{profile.name || "YOUR NAME"}</h1>
              <p className="text-xs text-gray-500 flex flex-wrap justify-center gap-3 font-sans">
                {profile.email && <span>📧 {profile.email}</span>}
                {profile.phone && <span>📞 {profile.phone}</span>}
                {profile.location && <span>📍 {profile.location}</span>}
              </p>

              {/* Social links */}
              {(profile.socialLinks.linkedin || profile.socialLinks.github || profile.socialLinks.portfolio) && (
                <p className="text-[10px] text-gray-400 flex flex-wrap justify-center gap-4 mt-1 font-sans">
                  {profile.socialLinks.linkedin && <span>🔗 LinkedIn: {profile.socialLinks.linkedin}</span>}
                  {profile.socialLinks.github && <span>🔗 GitHub: {profile.socialLinks.github}</span>}
                  {profile.socialLinks.portfolio && <span>🔗 Portfolio: {profile.socialLinks.portfolio}</span>}
                </p>
              )}
            </div>

            {/* Content Body */}
            <div className="space-y-5">
              {/* Objective */}
              {profile.bio && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Professional Summary</h2>
                  <p className="text-xs leading-relaxed text-gray-700 font-normal">{profile.bio}</p>
                </div>
              )}

              {/* Experience */}
              {profile.experience.length > 0 && (
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Work Experience</h2>
                  <div className="space-y-3">
                    {profile.experience.map((e, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between font-bold text-gray-800">
                          <span>{e.title}</span>
                          <span className="font-medium text-gray-500 font-sans">{e.startDate} — {e.endDate}</span>
                        </div>
                        <div className="italic text-gray-600 mb-1">{e.company}</div>
                        {e.description && <p className="text-gray-700 leading-relaxed font-sans">{e.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education.length > 0 && (
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Education</h2>
                  <div className="space-y-2">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="text-xs flex justify-between">
                        <div>
                          <span className="font-bold text-gray-800">{edu.degree}</span>
                          <span className="text-gray-600 italic"> — {edu.institution}</span>
                        </div>
                        <span className="text-gray-500 font-sans">{edu.startYear} — {edu.endYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Key Skills</h2>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium">
                    {profile.skills.join(" • ")}
                  </p>
                </div>
              )}

              {/* Certifications & Languages */}
              <div className="grid grid-cols-2 gap-6">
                {profile.certifications.length > 0 && (
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Certifications</h2>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 font-sans">
                      {profile.certifications.map((c, idx) => <li key={idx}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {profile.languages.length > 0 && (
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest font-sans border-b pb-0.5">Languages</h2>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 font-sans">
                      {profile.languages.map((l, idx) => <li key={idx}>{l}</li>)}
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Styled Print media css injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-white.text-black, .bg-white.text-black * {
            visibility: visible;
          }
          .bg-white.text-black {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
