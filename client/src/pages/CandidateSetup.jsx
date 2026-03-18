import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const CandidateSetup = () => {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      await API.put(
        "/auth/profile",
        { bio, location, skills: skills.split(",").map((s) => s.trim()).filter(Boolean) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile setup complete 🚀");
      navigate("/jobs");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const skillTags = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4 py-10">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-indigo-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Header strip */}
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Complete Your Profile</h2>
                <p className="text-indigo-100 text-xs">Help employers find you faster</p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all ${step === 1 ? "w-6 bg-white" : "w-3 bg-white/40"}`}
                />
              ))}
              <span className="ml-2 text-white/70 text-xs">Step 1 of 3</span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-7 space-y-5">

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Short Bio
              </label>
              <textarea
                rows={3}
                placeholder="Tell employers a bit about yourself, your background, and goals..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Location
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  placeholder="e.g. San Francisco, CA"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Skills <span className="text-gray-400 normal-case font-normal">(comma separated)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </span>
                <input
                  placeholder="React, Node.js, Python..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              {/* Live skill tags preview */}
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skillTags.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50 transition-all duration-150 active:scale-[0.98] text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  Save & Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can update your profile anytime from settings
        </p>
      </div>
    </div>
  );
};

export default CandidateSetup;