import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const inp =
  "w-full px-3.5 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* Normal login */
  const submit = async () => {
    if (!email || !password) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "employer" ? "/employer" : "/jobs");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  /* Google login */
  const handleGoogleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const res = await API.post("/auth/google", { name: decoded.name, email: decoded.email, googleId: decoded.sub });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      if (res.data.isNewUser) {
        localStorage.setItem("tempGoogleName", decoded.name);
        localStorage.setItem("tempGoogleEmail", decoded.email);
        localStorage.setItem("tempGoogleId", decoded.sub);
        navigate("/select-role"); return;
      }

      if (res.data.role === "employer") {
        navigate(!res.data.companyName ? "/employer-setup" : "/employer");
      } else {
        navigate(!res.data.bio ? "/candidate-setup" : "/jobs");
      }
    } catch { alert("Google login failed"); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── LEFT: Login form ── */}
      <div className="flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0c0c14] px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-7 sm:p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 shadow-md shadow-indigo-500/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white tracking-tight mb-1">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-gray-400 mb-7">
            Sign in to continue to CareerConnect
          </p>

          {/* Email */}
          <div className="space-y-3 mb-5">
            <input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inp}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inp} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
              
            </div>
            
          {/* 🔥 FORGOT PASSWORD ADDED */}
          <div className="flex justify-end mb-4">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-indigo-500 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>
          </div>

          {/* Login button */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
          </div>

          {/* Google */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
              theme="outline"
              size="large"
              width="300"
            />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 font-semibold hover:text-indigo-600 hover:underline underline-offset-2 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Brand panel (hidden on mobile) ── */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-500 text-white px-10">
        <div className="text-center max-w-sm">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            CareerConnect
          </h1>
          <p className="text-base lg:text-lg text-indigo-100 leading-relaxed">
            Find your dream job and connect with top companies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;