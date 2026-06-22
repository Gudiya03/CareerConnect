import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all";

const labelClass =
  "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 block";

const RecruiterRegister = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        role: "employer",
      });

      // Validate role
      if (res.data.role && res.data.role !== "employer" && res.data.role !== "admin") {
        toast.error(`This email is registered as a ${res.data.role === "employer" ? "recruiter" : res.data.role}. Please login/register in the correct section.`);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || "employer");
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      toast.success("Google Authentication Successful 🎉");

      if (res.data.isNewUser || !res.data.companyName) {
        setTimeout(() => {
          navigate("/employer-setup");
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/employer");
        }, 1000);
      }

    } catch (err) {
      console.error(err);
      toast.error("Google authentication failed");
    }
  };

  // Step 1: Recruiter Contact Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [designation, setDesignation] = useState("");

  // Step 2: Company Info & Verification
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("11-50 employees");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const submit = async () => {
    if (!name || !email || !password || !confirmPassword || !companyName || !businessRegNo) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const signupData = {
        name,
        email,
        password,
        role: "employer",
        recruiterPhone,
        designation,
        companyName,
        companyLogo,
        companyWebsite,
        industry,
        companySize,
        businessRegNo,
        companyAddress,
        companyDescription
      };

      const res = await API.post("/auth/register", signupData);

      // Save tokens for auto-login
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName);

      toast.success("Recruiter Account Registered successfully 🎉");
      setTimeout(() => {
        navigate("/employer-setup");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#060814] dark:via-[#050e18] dark:to-[#071311] px-4 py-12">
      <Toaster position="top-right" />

      <div className="w-full max-w-xl">
        <div className="bg-white dark:bg-[#101920] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          
          {/* Header strip */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-7 text-white">
            <h2 className="text-xl font-bold tracking-tight">Recruiter Signup</h2>
            <p className="text-emerald-100 text-xs mt-1">Hire top vetted technical talent instantly</p>

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
            {/* STEP 1: Recruiter Contact Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    onError={() => toast.error("Google Authentication Failed")}
                    text="signup_with"
                  />
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/5" />
                  <span className="text-gray-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/5" />
                </div>

                <div>
                  <label className={labelClass}>Recruiter Full Name *</label>
                  <input
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Official Email Address *</label>
                  <input
                    type="email"
                    placeholder="sarah.jenkins@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password *</label>
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password *</label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Designation / Role *</label>
                    <input
                      placeholder="e.g. Head of Talent"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <input
                      placeholder="e.g. +91 9876543210"
                      value={recruiterPhone}
                      onChange={(e) => setRecruiterPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!name || !email || !password || !confirmPassword || !designation) {
                      toast.error("Please fill in all required fields");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer mt-6"
                >
                  Next: Company Info
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            )}

            {/* STEP 2: Company Profile & Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company Name *</label>
                    <input
                      placeholder="e.g. Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company Logo URL</label>
                    <input
                      placeholder="e.g. https://logo.png"
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
                      placeholder="e.g. https://acme.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Industry Sector</label>
                    <input
                      placeholder="e.g. Tech Services"
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
                      className={inputClass}
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
                      placeholder="CIN / Corporate ID"
                      value={businessRegNo}
                      onChange={(e) => setBusinessRegNo(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Company HQ Address</label>
                  <input
                    placeholder="e.g. London, UK"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Company Description</label>
                  <textarea
                    placeholder="Brief description about company goals and vision..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-800 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Complete Signup & Login"}
                  </button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-500 font-semibold hover:underline">Sign In</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegister;
