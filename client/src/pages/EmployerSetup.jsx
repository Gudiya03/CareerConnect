import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const Field = ({ label, optional, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
      {optional && (
        <span className="normal-case font-normal text-gray-400">(optional)</span>
      )}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

const EmployerSetup = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    if (!companyName) {
      alert("Company name is required");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      await API.put(
        "/auth/profile",
        { companyName, companyWebsite, location, industry, bio: description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile setup complete 🚀");
      navigate("/employer");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR DATA:", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4 py-10">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-indigo-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Header strip */}
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Setup Your Company</h2>
                <p className="text-indigo-100 text-xs">Tell candidates about your organisation</p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full ${step === 1 ? "w-6 bg-white" : "w-3 bg-white/40"}`}
                />
              ))}
              <span className="ml-2 text-white/70 text-xs">Step 1 of 3</span>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-7 space-y-5">

            <Field label="Company Name">
              <input
                value={companyName}
                placeholder="e.g. Acme Corp"
                className={inputClass}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Field>

            <Field label="Website" optional>
              <input
                value={companyWebsite}
                placeholder="https://yourcompany.com"
                className={inputClass}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location">
                <input
                  value={location}
                  placeholder="e.g. New York, NY"
                  className={inputClass}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Field>
              <Field label="Industry">
                <input
                  value={industry}
                  placeholder="e.g. IT, Finance"
                  className={inputClass}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Description" optional>
              <textarea
                value={description}
                rows={3}
                placeholder="Brief description of your company, culture, and mission..."
                className={`${inputClass} resize-none`}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can update your company profile anytime from settings
        </p>
      </div>
    </div>
  );
};

export default EmployerSetup;