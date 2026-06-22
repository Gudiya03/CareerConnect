import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all duration-200 backdrop-blur-sm";

const Login = () => {
  // Candidate Form States
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [candidateRemember, setCandidateRemember] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);

  // Recruiter Form States
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPassword, setRecruiterPassword] = useState("");
  const [recruiterRemember, setRecruiterRemember] = useState(false);
  const [recruiterLoading, setRecruiterLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (role, email, password, setLoading) => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      // Validate role
      if (res.data.role && res.data.role !== role && res.data.role !== "admin") {
        toast.error(`This account is registered as a ${res.data.role}. Please use the correct login section.`);
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      toast.success(`Welcome back, ${res.data.name}! 👋`);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "employer") {
        navigate(!res.data.companyName ? "/employer-setup" : "/employer");
      } else {
        navigate(!res.data.bio ? "/candidate-setup" : "/candidate-dashboard");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse, role) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        role,
      });

      // Validate role
      if (res.data.role && res.data.role !== role && res.data.role !== "admin") {
        toast.error(`This account is registered as a ${res.data.role === "employer" ? "recruiter" : res.data.role}. Please use the correct login section.`);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      toast.success("Login successful 🎉");

      if (res.data.isNewUser) {
        if (role === "employer") {
          navigate("/employer-setup");
        } else {
          navigate("/candidate-setup");
        }
        return;
      }

      if (res.data.role === "employer") {
        navigate(!res.data.companyName ? "/employer-setup" : "/employer");
      } else {
        navigate(!res.data.bio ? "/candidate-setup" : "/candidate-dashboard");
      }

    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#080b14] overflow-x-hidden">
      <Toaster position="top-right" />

      {/* ── LEFT SIDE: CANDIDATE LOGIN (BLUE THEME) ── */}
      <div className="flex-1 min-h-[50vh] md:min-h-screen bg-gradient-to-br from-blue-950 via-[#0a122c] to-indigo-950 flex flex-col justify-center items-center p-8 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        {/* Glow Blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative w-full max-w-sm z-10 space-y-6">
          <div className="text-center">
            {/* Candidate Illustration */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/20 mb-4 text-blue-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Candidate Login</h2>
            <p className="text-blue-200/40 text-xs mt-1">Sign in to find your dream role</p>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-[10px] text-blue-300/60 mb-1.5 font-bold uppercase tracking-wider">Email address</label>
              <input
                type="email"
                placeholder="candidate@example.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] text-blue-300/60 font-bold uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-blue-400 hover:text-blue-300 transition">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={candidatePassword}
                onChange={(e) => setCandidatePassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={candidateRemember}
                  onChange={(e) => setCandidateRemember(e.target.checked)}
                  className="rounded border-white/10 text-blue-600 bg-white/5 focus:ring-0"
                />
                Remember Me
              </label>
            </div>

            <button
              onClick={() => handleLogin("candidate", candidateEmail, candidatePassword, setCandidateLoading)}
              disabled={candidateLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98] cursor-pointer"
            >
              {candidateLoading ? "Signing in..." : "Candidate Sign In"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleLogin(res, "candidate")}
                onError={() => toast.error("Google Authentication Failed")}
              />
            </div>

            <p className="text-center text-xs text-white/30 mt-4">
              Don't have an account?{" "}
              <Link to="/register-candidate" className="text-blue-400 hover:text-blue-300 font-bold transition">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: RECRUITER LOGIN (GREEN THEME) ── */}
      <div className="flex-1 min-h-[50vh] md:min-h-screen bg-gradient-to-br from-emerald-950 via-[#061411] to-teal-950 flex flex-col justify-center items-center p-8 relative overflow-hidden">
        {/* Glow Blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-teal-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative w-full max-w-sm z-10 space-y-6">
          <div className="text-center">
            {/* Recruiter Illustration */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 mb-4 text-emerald-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Recruiter Login</h2>
            <p className="text-emerald-200/40 text-xs mt-1">Sign in to publish jobs & hire talent</p>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-[10px] text-emerald-300/60 mb-1.5 font-bold uppercase tracking-wider">Company Email</label>
              <input
                type="email"
                placeholder="recruiter@company.com"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] text-emerald-300/60 font-bold uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-emerald-400 hover:text-emerald-300 transition">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={recruiterPassword}
                onChange={(e) => setRecruiterPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recruiterRemember}
                  onChange={(e) => setRecruiterRemember(e.target.checked)}
                  className="rounded border-white/10 text-emerald-600 bg-white/5 focus:ring-0"
                />
                Remember Me
              </label>
            </div>

            <button
              onClick={() => handleLogin("employer", recruiterEmail, recruiterPassword, setRecruiterLoading)}
              disabled={recruiterLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(5,150,105,0.3)] active:scale-[0.98] cursor-pointer"
            >
              {recruiterLoading ? "Signing in..." : "Recruiter Sign In"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleLogin(res, "employer")}
                onError={() => toast.error("Google Authentication Failed")}
              />
            </div>

            <p className="text-center text-xs text-white/30 mt-4">
              Don't have an account?{" "}
              <Link to="/register-recruiter" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;