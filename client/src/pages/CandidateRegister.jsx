import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

const labelClass =
  "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 block";

const CandidateRegister = () => {
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
        role: "candidate",
      });

      // Validate role
      if (res.data.role && res.data.role !== "candidate" && res.data.role !== "admin") {
        toast.error(`This email is registered as a ${res.data.role === "employer" ? "recruiter" : res.data.role}. Please login/register in the correct section.`);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || "candidate");
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", "");

      toast.success("Google Authentication Successful 🎉");

      if (res.data.isNewUser || !res.data.bio) {
        setTimeout(() => {
          navigate("/candidate-setup");
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/candidate-dashboard");
        }, 1000);
      }

    } catch (err) {
      console.error(err);
      toast.error("Google authentication failed");
    }
  };

  // Step 1: Account Setup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Contact & Preferences
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [workType, setWorkType] = useState("Remote");

  // Step 3: Professional Info
  const [skills, setSkills] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const submit = async () => {
    if (!name || !email || !password || !confirmPassword) {
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

      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const signupData = {
        name,
        email,
        password,
        role: "candidate",
        phone,
        profileImage,
        bio,
        location,
        skills: skillsArray,
        socialLinks: { linkedin, github, portfolio },
        preferences: { preferredRole, preferredLocation, expectedSalary, workType }
      };

      const res = await API.post("/auth/register", signupData);

      // Save tokens for auto-login
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", "");

      toast.success("Candidate Registered successfully 🎉");
      setTimeout(() => {
        navigate("/candidate-setup");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-[#080b14] dark:via-[#090e22] dark:to-[#0f0e26] px-4 py-12">
      <Toaster position="top-right" />

      <div className="w-full max-w-xl">
        <div className="bg-white dark:bg-[#121424] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          
          {/* Header strip */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-7 text-white">
            <h2 className="text-xl font-bold tracking-tight">Candidate Signup</h2>
            <p className="text-blue-100 text-xs mt-1">Join the leading tech talent ecosystem</p>

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
            {/* STEP 1: Account Creation */}
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
                  <label className={labelClass}>Full Name *</label>
                  <input
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
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

                <button
                  onClick={() => {
                    if (!name || !email || !password || !confirmPassword) {
                      toast.error("Please fill in all fields");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer mt-6"
                >
                  Next: Preferences
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            )}

            {/* STEP 2: Preferences */}
            {step === 2 && (
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
                      placeholder="e.g. London, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Expected Salary</label>
                    <input
                      placeholder="e.g. £45,000 / year"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Preferred Role</label>
                    <input
                      placeholder="e.g. UI Developer"
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Work Type Preference</label>
                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-800 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Next: Social Links
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Professional Info */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Core Skills (comma separated)</label>
                  <input
                    placeholder="e.g. React, Redux, Node.js, Git"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Portfolio Website</label>
                  <input
                    placeholder="https://myportfolio.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-800 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Complete Signup & Login"}
                  </button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 font-semibold hover:underline">Sign In</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
