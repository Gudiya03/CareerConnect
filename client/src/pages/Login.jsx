import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= NORMAL LOGIN =================

  const submit = async () => {

    if(!email || !password){
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try{

      const res = await API.post("/auth/login",{email,password});

      localStorage.setItem("accessToken",res.data.accessToken);
      localStorage.setItem("refreshToken",res.data.refreshToken);
      localStorage.setItem("role",res.data.role);

      // ✅ ROLE BASED REDIRECT
      if(res.data.role === "employer"){
        navigate("/employer");
      }else{
        navigate("/jobs");
      }

    }catch(err){
      alert(err.response?.data?.message || "Login failed");
    }

    setLoading(false);

  };


  // ================= GOOGLE LOGIN =================

  const handleGoogleLogin = async (credentialResponse) => {

    const decoded = jwtDecode(credentialResponse.credential);

    try{

      const res = await API.post("/auth/google",{
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub
      });

      // ✅ SAVE USER DATA
      localStorage.setItem("accessToken",res.data.accessToken);
      localStorage.setItem("refreshToken",res.data.refreshToken);
      localStorage.setItem("role",res.data.role);

      localStorage.setItem("name",res.data.name);
      localStorage.setItem("email",res.data.email);
      localStorage.setItem("companyName",res.data.companyName || "");

      // ================= NEW USER =================
      if(res.data.isNewUser){

        localStorage.setItem("tempGoogleName", decoded.name);
        localStorage.setItem("tempGoogleEmail", decoded.email);
        localStorage.setItem("tempGoogleId", decoded.sub);

        navigate("/select-role");
        return;
      }

      // ================= EXISTING USER =================

      if(res.data.role === "employer"){

        // 👉 अगर company setup नहीं किया
        if(!res.data.companyName){
          navigate("/employer-setup");
        }else{
          navigate("/employer");
        }

      }else{

        // 👉 candidate setup check
        if(!res.data.bio){
          navigate("/candidate-setup");
        }else{
          navigate("/jobs");
        }

      }

    }catch(err){
      console.log(err);
      alert("Google login failed");
    }

  };


  return (

    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT LOGIN */}

      <div className="flex items-center justify-center bg-gray-100 dark:bg-[#020617] p-6">

        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">

          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-white">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Login to continue to Career Connect
          </p>

          {/* EMAIL */}

          <input
            placeholder="Email address"
            className="w-full p-3 mb-4 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setEmail(e.target.value)}
          />

          {/* PASSWORD */}

          <div className="relative">

            <input
              type={showPassword ? "text":"password"}
              placeholder="Password"
              className="w-full p-3 mb-4 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e)=>setPassword(e.target.value)}
            />

            <span
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈":"👁"}
            </span>

          </div>

          {/* LOGIN BUTTON */}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition mb-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* DIVIDER */}

          <div className="flex items-center gap-3 mb-4">

            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>

            <span className="text-gray-500 text-sm">OR</span>

            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>

          </div>

          {/* GOOGLE LOGIN */}

          <div className="flex justify-center mb-4">

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={()=>alert("Google login failed")}
              theme="outline"
              size="large"
              width="300"
            />

          </div>

          {/* REGISTER LINK */}

          <p className="text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="hidden md:flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white">

        <div className="text-center px-10">

          <h1 className="text-5xl font-bold mb-4">
            Career Connect
          </h1>

          <p className="text-lg opacity-90">
            Find your dream job and connect with top companies.
          </p>

        </div>

      </div>

    </div>

  );

};

export default Login;