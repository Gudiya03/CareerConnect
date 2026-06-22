import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@careerconnect.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Credentials cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        toast.error("Access Denied: This account does not possess administrator privileges.");
        setLoading(false);
        return;
      }

      // Store in local storage
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      toast.success("Security Clearance Granted. Opening console... 🔐");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Authentication failed. Check terminal credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-100 font-sans px-4">
      <Toaster position="top-right" />
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0,transparent_55%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Top decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs font-mono text-slate-500 ml-2">secure_admin_login.sh</span>
        </div>

        {/* Brand Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>🛡️</span> Admin Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">Authorized access points only. All sessions audited.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Admin Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-xs font-mono bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all duration-200"
                placeholder="admin@careerconnect.com"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Security Token / Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔑</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-xs font-mono bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Info Box about fixed credentials */}
          <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl">
            <p className="text-[10px] text-indigo-400 leading-normal font-semibold">
              💡 Pre-filled credentials represent the master admin account. Click login to dynamically activate and register this profile.
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating console..." : "Initialize Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
