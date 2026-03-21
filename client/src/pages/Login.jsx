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

  // ✅ NORMAL LOGIN (FINAL FIXED)
  const submit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ STORE DATA
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      // ✅ REDIRECT
      navigate(res.data.role === "employer" ? "/employer" : "/jobs");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN (FINAL FIXED)
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await API.post("/api/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });

      // ✅ STORE DATA
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("companyName", res.data.companyName || "");

      // ✅ NEW USER FLOW
      if (res.data.isNewUser) {
        localStorage.setItem("tempGoogleName", decoded.name);
        localStorage.setItem("tempGoogleEmail", decoded.email);
        localStorage.setItem("tempGoogleId", decoded.sub);
        navigate("/select-role");
        return;
      }

      // ✅ REDIRECT BASED ON ROLE
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
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0c0c14] px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-7 sm:p-8">

          <h2 className="text-2xl font-bold text-center mb-1">
            Welcome Back
          </h2>

          <div className="space-y-3 mb-5">
            <input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inp}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inp}
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-500 text-white"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="flex justify-center mt-5">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
            />
          </div>

          <p className="text-center text-sm mt-4">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;