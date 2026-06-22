import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111120] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all";

const labelClass =
  "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 block";

const EmployerSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Recruiter Profile
  const [recruiterName, setRecruiterName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [designation, setDesignation] = useState("");

  // Company Profile
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("1-10 employees");
  const [companyDescription, setCompanyDescription] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

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
          setRecruiterName(profile.name || localStorage.getItem("name") || "");
          setOfficialEmail(profile.email || localStorage.getItem("email") || "");
          setRecruiterPhone(profile.recruiterPhone || "");
          setDesignation(profile.designation || "");
          setCompanyName(profile.companyName || "");
          setCompanyLogo(profile.companyLogo || "");
          setCompanyWebsite(profile.companyWebsite || "");
          setIndustry(profile.industry || "");
          setCompanySize(profile.companySize || "11-50 employees");
          setCompanyDescription(profile.companyDescription || "");
          setBusinessRegNo(profile.businessRegNo || "");
          setCompanyAddress(profile.companyAddress || "");
        }
      } catch (err) {
        console.error("Error loading recruiter profile details for setup:", err);
      }
    };
    fetchProfileData();
  }, []);

  const submit = async () => {
    if (!companyName || !recruiterName || !designation || !businessRegNo) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const profileData = {
        name: recruiterName,
        recruiterPhone,
        designation,
        companyName,
        companyLogo,
        companyWebsite,
        industry,
        companySize,
        companyDescription,
        businessRegNo,
        companyAddress,
      };

      await API.put("/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update name in local storage if updated
      localStorage.setItem("name", recruiterName);
      localStorage.setItem("companyName", companyName);

      toast.success("Recruiter setup completed successfully 🎉");
      setTimeout(() => {
        navigate("/employer");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#060814] dark:via-[#050e18] dark:to-[#071311] px-4 py-12">
      <Toaster position="top-right" />

      {/* Glow Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-300/10 dark:bg-emerald-600/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-300/10 dark:bg-teal-600/5 blur-3xl" />
      </div>

      <div className="w-full max-w-xl">
        <div className="bg-white dark:bg-[#101920] rounded-3xl shadow-xl shadow-emerald-100/50 dark:shadow-black/60 border border-gray-100 dark:border-white/5 overflow-hidden">
          {/* Header Progress strip */}
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-8 py-7 text-white">
            <h2 className="text-xl font-bold tracking-tight">Complete Recruiter Profile</h2>
            <p className="text-emerald-100 text-xs mt-1">Configure company credentials & contact parameters</p>

            <div className="flex items-center gap-2 mt-5">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? "w-8 bg-white" : s < step ? "w-4 bg-white/60" : "w-2.5 bg-white/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-white/80 text-[11px] font-semibold uppercase tracking-wider">
                Step {step} of 2
              </span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* STEP 1: Recruiter Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Recruiter Name *</label>
                  <input
                    placeholder="e.g. Sarah Jenkins"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Official Email</label>
                  <input
                    type="email"
                    value={officialEmail}
                    className={`${inputClass} opacity-60 cursor-not-allowed`}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Designation / Role *</label>
                    <input
                      placeholder="e.g. HR Manager / Tech Recruiter"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      placeholder="e.g. +91 9876543210"
                      value={recruiterPhone}
                      onChange={(e) => setRecruiterPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer mt-6"
                >
                  Continue to Company Details
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            )}

            {/* STEP 2: Company Info & Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company Name *</label>
                    <input
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company Logo URL</label>
                    <input
                      placeholder="e.g. https://logo.url/logo.png"
                      value={companyLogo}
                      onChange={(e) => setCompanyLogo(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company Website</label>
                    <input
                      placeholder="e.g. https://acme.org"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Industry Sector</label>
                    <input
                      placeholder="e.g. Information Technology"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company Size</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className={`${inputClass} select-dropdown`}
                    >
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-500 employees">201-500 employees</option>
                      <option value="500+ employees">500+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Business Registration No. *</label>
                    <input
                      placeholder="e.g. CIN / VAT / GST Registration"
                      value={businessRegNo}
                      onChange={(e) => setBusinessRegNo(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Company Address</label>
                  <input
                    placeholder="e.g. 5th Avenue, Silicon Valley, CA"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Company Description</label>
                  <textarea
                    placeholder="Tell candidates about your company mission and culture..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Saving Company..." : "Save & Open Recruiter Dashboard"}
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

export default EmployerSetup;