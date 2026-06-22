import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all";

const labelClass =
  "text-[10px] font-bold uppercase tracking-wider text-blue-300/60 mb-1.5 block";

const CandidateSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = res.data;
        if (profile) {
          setPhone(profile.phone || "");
          setProfileImage(profile.profileImage || "");
          setBio(profile.bio || "");
          setLocation(profile.location || "");
          if (profile.preferences) {
            setPreferredRole(profile.preferences.preferredRole || "");
            setPreferredLocation(profile.preferences.preferredLocation || "");
            setExpectedSalary(profile.preferences.expectedSalary || "");
            setWorkType(profile.preferences.workType || "Remote");
          }
          if (profile.skills) {
            setSkills(profile.skills.join(", "));
          }
          if (profile.certifications) {
            setCertifications(profile.certifications);
          }
          if (profile.languages) {
            setLanguages(profile.languages);
          }
          if (profile.socialLinks) {
            setLinkedin(profile.socialLinks.linkedin || "");
            setGithub(profile.socialLinks.github || "");
            setPortfolio(profile.socialLinks.portfolio || "");
          }
          if (profile.education) {
            setEducation(profile.education);
          }
          if (profile.experience) {
            setExperience(profile.experience);
          }
        }
      } catch (err) {
        console.error("Error loading profile details for setup:", err);
      }
    };
    fetchProfileData();
  }, []);

  // Step 1: Personal Info & Preferences
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [workType, setWorkType] = useState("Remote");

  // Step 2: Professional Details
  const [skills, setSkills] = useState("");
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [langInput, setLangInput] = useState("");
  const [languages, setLanguages] = useState([]);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Step 3: Education & Experience
  const [education, setEducation] = useState([]);
  const [eduDegree, setEduDegree] = useState("");
  const [eduInst, setEduInst] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");

  const [experience, setExperience] = useState([]);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // Array Add/Remove functions
  const addCert = () => {
    if (!certInput.trim()) return;
    setCertifications([...certifications, certInput.trim()]);
    setCertInput("");
  };

  const removeCert = (idx) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
  };

  const addLang = () => {
    if (!langInput.trim()) return;
    setLanguages([...languages, langInput.trim()]);
    setLangInput("");
  };

  const removeLang = (idx) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };

  const addEdu = () => {
    if (!eduDegree.trim() || !eduInst.trim()) {
      toast.error("Degree and institution are required");
      return;
    }
    setEducation([
      ...education,
      { degree: eduDegree.trim(), institution: eduInst.trim(), startYear: eduStart.trim() || "N/A", endYear: eduEnd.trim() || "Present" },
    ]);
    setEduDegree("");
    setEduInst("");
    setEduStart("");
    setEduEnd("");
  };

  const removeEdu = (idx) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const addExp = () => {
    if (!expTitle.trim() || !expCompany.trim()) {
      toast.error("Job title and company name are required");
      return;
    }
    setExperience([
      ...experience,
      { title: expTitle.trim(), company: expCompany.trim(), startDate: expStart.trim() || "N/A", endDate: expEnd.trim() || "Present", description: expDesc.trim() },
    ]);
    setExpTitle("");
    setExpCompany("");
    setExpStart("");
    setExpEnd("");
    setExpDesc("");
  };

  const removeExp = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const profileData = {
        phone,
        profileImage,
        bio,
        location,
        skills: skillsArray,
        certifications,
        languages,
        socialLinks: { linkedin, github, portfolio },
        preferences: { preferredRole, preferredLocation, expectedSalary, workType },
        education,
        experience,
      };

      await API.put("/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile registration complete 🚀");
      setTimeout(() => {
        navigate("/candidate-dashboard");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile configuration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden px-4 py-12">
      <Toaster position="top-right" />

      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-[#0f172a]/30 backdrop-blur-xl border border-blue-500/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Progress strip */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-8 py-7 text-white">
            <h2 className="text-xl font-bold tracking-tight">Complete Candidate Profile</h2>
            <p className="text-blue-200/50 text-xs mt-1">Configure your personal, professional and preference settings</p>

            <div className="flex items-center gap-2 mt-5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? "w-8 bg-white" : s < step ? "w-4 bg-white/60" : "w-2.5 bg-white/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-white/80 text-[11px] font-semibold uppercase tracking-wider">
                Step {step} of 3
              </span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* STEP 1: Personal Info & Preferences */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Profile Photo URL</label>
                    <input
                      placeholder="e.g. https://avatar.url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Home Location</label>
                    <input
                      placeholder="e.g. Bangalore, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Short Professional Bio</label>
                    <input
                      placeholder="e.g. Passionate web developer with experience in React"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h3 className="text-xs font-bold text-blue-300/80 uppercase tracking-wider mb-3">Job Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Preferred Role</label>
                      <input
                        placeholder="e.g. Software Engineer"
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Preferred Location</label>
                      <input
                        placeholder="e.g. Bangalore / Remote"
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelClass}>Expected Salary</label>
                      <input
                        placeholder="e.g. ₹12,000,000 / annum"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Work Type Preference</label>
                      <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className={`${inputClass} select-dropdown`}
                      >
                        <option value="Remote" className="bg-[#0f172a] text-white">Remote</option>
                        <option value="Hybrid" className="bg-[#0f172a] text-white">Hybrid</option>
                        <option value="Onsite" className="bg-[#0f172a] text-white">Onsite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer mt-6"
                >
                  Continue to Skills & Links
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            )}

            {/* STEP 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Skills (comma separated)</label>
                  <input
                    placeholder="e.g. React, Node.js, Mongoose, Python"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Certifications Dynamic List */}
                  <div>
                    <label className={labelClass}>Certifications</label>
                    <div className="flex gap-2">
                      <input
                        placeholder="e.g. AWS Cloud"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        onClick={addCert}
                        className="px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/20 transition"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {certifications.map((cert, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {cert}
                          <button onClick={() => removeCert(i)} className="hover:text-red-400 font-bold">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Dynamic List */}
                  <div>
                    <label className={labelClass}>Languages</label>
                    <div className="flex gap-2">
                      <input
                        placeholder="e.g. English"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        onClick={addLang}
                        className="px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/20 transition"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {languages.map((lang, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {lang}
                          <button onClick={() => removeLang(i)} className="hover:text-red-400 font-bold">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-4">
                  <h3 className="text-xs font-bold text-blue-300/80 uppercase tracking-wider">Social Links</h3>
                  <div>
                    <label className={labelClass}>LinkedIn Profile</label>
                    <input
                      placeholder="e.g. https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub Profile</label>
                    <input
                      placeholder="e.g. https://github.com/username"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio Website</label>
                    <input
                      placeholder="e.g. https://myportfolio.com"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-white/10 text-blue-200 font-semibold rounded-xl text-sm hover:bg-white/5 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                  >
                    Continue to Work History
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Education & Experience */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Education section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-blue-300/80 uppercase tracking-wider border-b border-white/5 pb-1">Education History</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Degree (e.g. B.S. CS)" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} className={inputClass} />
                    <input placeholder="School / University" value={eduInst} onChange={(e) => setEduInst(e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Start Year" value={eduStart} onChange={(e) => setEduStart(e.target.value)} className={inputClass} />
                    <input placeholder="End Year" value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} className={inputClass} />
                  </div>
                  <button onClick={addEdu} className="w-full py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition cursor-pointer">
                    + Add Education Row
                  </button>

                  <div className="space-y-2">
                    {education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <div>
                          <p className="font-bold text-white">{edu.degree}</p>
                          <p className="text-blue-200/40 mt-0.5">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                        </div>
                        <button onClick={() => removeEdu(i)} className="text-rose-500 hover:text-rose-450 font-bold px-2 transition">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-blue-300/80 uppercase tracking-wider border-b border-white/5 pb-1">Work Experience</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Job Title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} className={inputClass} />
                    <input placeholder="Company Name" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Start Date" value={expStart} onChange={(e) => setExpStart(e.target.value)} className={inputClass} />
                    <input placeholder="End Date" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} className={inputClass} />
                  </div>
                  <textarea placeholder="Job Description & Impact..." value={expDesc} onChange={(e) => setExpDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                  <button onClick={addExp} className="w-full py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition cursor-pointer">
                    + Add Experience Row
                  </button>

                  <div className="space-y-2">
                    {experience.map((exp, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <div>
                          <p className="font-bold text-white">{exp.title}</p>
                          <p className="text-blue-200/40 mt-0.5">{exp.company} ({exp.startDate} - {exp.endDate})</p>
                        </div>
                        <button onClick={() => removeExp(i)} className="text-rose-500 hover:text-rose-450 font-bold px-2 transition">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-white/10 text-blue-200 font-semibold rounded-xl text-sm hover:bg-white/5 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Completing Profile..." : "Submit & Start Searching"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSetup;