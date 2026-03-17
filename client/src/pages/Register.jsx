import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ================= NORMAL REGISTER =================
  const submit = async () => {

    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try{

      await API.post("/auth/register",{
        name,
        email,
        password
      });

      alert("Registration successful 🎉");

      // ✅ SAVE TEMP DATA
      localStorage.setItem("tempName", name);
      localStorage.setItem("tempEmail", email);

      // 👉 GO TO ROLE PAGE
      navigate("/select-role");

    }catch(err){
      alert(err.response?.data?.message || "Register failed");
    }
  };

  // ================= GOOGLE REGISTER =================
  const handleGoogleRegister = async (credentialResponse) => {

    const decoded = jwtDecode(credentialResponse.credential);

    // ✅ SAVE TEMP GOOGLE DATA
    localStorage.setItem("tempGoogleName", decoded.name);
    localStorage.setItem("tempGoogleEmail", decoded.email);
    localStorage.setItem("tempGoogleId", decoded.sub);

    navigate("/select-role");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={(e)=>setPassword(e.target.value)}
          />
          <span
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          Register
        </button>

        <div className="text-center my-4">OR</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={()=>alert("Google failed")}
          />
        </div>

        <p className="text-center mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;