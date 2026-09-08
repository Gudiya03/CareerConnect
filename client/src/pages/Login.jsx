import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import { getDashboardForRole } from "../components/PrivateRoute";

const Login = () => {
  const [activeRole, setActiveRole] = useState("candidate"); // "candidate" or "employer"
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (token && role) {
      navigate(getDashboardForRole(role), { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      // Validate role
      if (res.data.role && res.data.role !== activeRole && res.data.role !== "admin") {
        toast.error(
          `This account is registered as a ${res.data.role === "employer" ? "recruiter" : res.data.role}. Please switch tabs.`
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || activeRole);
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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        role: activeRole,
      });

      // Validate role
      if (res.data.role && res.data.role !== activeRole && res.data.role !== "admin") {
        toast.error(
          `This account is registered as a ${res.data.role === "employer" ? "recruiter" : res.data.role}. Please switch tabs.`
        );
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role || activeRole);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      toast.success("Login successful 🎉");

      if (res.data.isNewUser) {
        if (activeRole === "employer") {
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
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-600">
      <Toaster position="top-right" />

      {/* ── TOP HEADER / NAVBAR ── */}
      <header className="w-full bg-white border-b border-slate-100 px-6 lg:px-12 py-4 flex items-center justify-between z-20">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Double bubble icon matching CareerConnect logo */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full opacity-90 transition-transform group-hover:scale-105"></span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-sky-400 rounded-full opacity-80 transition-transform group-hover:scale-105"></span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Career<span className="text-blue-600">Connect</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">
            Jobs
          </Link>
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">
            Companies
          </Link>
          <Link to="/career-tools" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link to="/career-tools" className="hover:text-blue-600 transition-colors">
            Resources
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-slate-500">Already have an account?</span>
          <Link
            to="/login"
            className="px-5 py-1.5 rounded-full border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT (SPLIT SCREEN) ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        
        {/* ── LEFT HERO PANEL (BLUE THEME & GRAPHICS) ── */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#ebf3fe] via-[#f0f6ff] to-[#e4effe] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle background glow accents */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Top text content */}
          <div className="relative z-10 max-w-xl">
            <span className="text-[11px] font-bold tracking-[0.2em] text-blue-600 uppercase mb-3 block">
              YOUR NEXT OPPORTUNITY AWAITS
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-4">
              Find Your <br />
              <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
              Connect with top companies, explore thousands of job opportunities, and build a brighter future with CareerConnect.
            </p>

            {/* Feature highlights list */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Explore Opportunities</h4>
                  <p className="text-xs text-slate-500">Job openings from top companies</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Connect with Recruiters</h4>
                  <p className="text-xs text-slate-500">Get noticed by hiring managers</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Grow Your Career</h4>
                  <p className="text-xs text-slate-500">Learn, apply and achieve more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustrative Center Graphics (3D Tilted floating cards & Paper airplane) */}
          <div className="relative my-6 lg:my-0 flex items-center justify-center min-h-[220px]">
            {/* Paper Airplane & Dotted Arc line */}
            <svg className="absolute w-full h-full max-w-lg pointer-events-none" viewBox="0 0 400 200" fill="none">
              <path
                d="M 60 160 Q 180 80 320 30"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.6"
              />
            </svg>

            {/* Paper Airplane icon at top end of curve */}
            <div className="absolute right-12 top-2 text-blue-600 animate-bounce transition-transform duration-1000">
              <svg className="w-8 h-8 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>

            {/* Floating Card 1: Your Dream Job */}
            <div className="absolute left-10 top-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-blue-500/10 border border-white/80 w-44 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">Your<br />Dream Job</h5>
              <div className="space-y-1">
                <div className="h-1.5 bg-slate-200 rounded-full w-3/4"></div>
                <div className="h-1.5 bg-slate-100 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Floating Card 2: Top Companies */}
            <div className="absolute right-16 top-16 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-emerald-500/10 border border-white/80 w-40 transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">Top<br />Companies</h5>
              <div className="space-y-1">
                <div className="h-1.5 bg-slate-200 rounded-full w-2/3"></div>
                <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
              </div>
            </div>

            {/* Floating Card 3: Build Your Future */}
            <div className="absolute left-28 bottom-2 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-purple-500/10 border border-white/80 w-44 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">Build<br />Your Future</h5>
              <div className="space-y-1">
                <div className="h-1.5 bg-slate-200 rounded-full w-4/5"></div>
                <div className="h-1.5 bg-slate-100 rounded-full w-1/2"></div>
              </div>
            </div>

          </div>

          {/* Bottom Footer Quote */}
          <div className="relative z-10 pt-6">
            <div className="w-10 h-1 bg-blue-600 rounded-full mb-3"></div>
            <p className="text-xs italic text-slate-500 font-medium">
              &quot;Better Careers. Brighter Tomorrows.&quot;
            </p>
          </div>
        </div>

        {/* ── RIGHT LOGIN CARD CONTAINER ── */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-12 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-md space-y-6">

            {/* ── ROLE SWITCHER TABS ── */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveRole("candidate")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeRole === "candidate"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Candidate Login
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("employer")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeRole === "employer"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Recruiter Login
              </button>
            </div>

            {/* Title Section */}
            <div className="text-center pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Sign in to your CareerConnect account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span>Remember Me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-full overflow-hidden flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google Authentication Failed")}
                  text="signin_with"
                  shape="circle"
                  width="360"
                />
              </div>
            </div>

            {/* Register Footer Link */}
            <p className="text-center text-xs text-slate-500 pt-2">
              Don&apos;t have an account?{" "}
              <Link
                to={activeRole === "candidate" ? "/register-candidate" : "/register-recruiter"}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;