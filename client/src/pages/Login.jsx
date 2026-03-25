import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const inp =
  "w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all duration-200 backdrop-blur-sm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ NORMAL LOGIN
  const submit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending:", { email, password });

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Response:", res.data);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      navigate(res.data.role === "employer" ? "/employer" : "/jobs");

    } catch (err) {
      console.log("FULL ERROR:", err.response);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });

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
        navigate("/select-role");
        return;
      }

      if (res.data.role === "employer") {
        navigate(!res.data.companyName ? "/employer-setup" : "/employer");
      } else {
        navigate(!res.data.bio ? "/candidate-setup" : "/jobs");
      }

    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background ambient blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CareerConnect</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Email address</label>
              <input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inp}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-white/50 font-medium tracking-wide uppercase">Password</label>
                <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition">Forgot password?</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inp}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Signing in…
              </span>
            ) : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
            />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;