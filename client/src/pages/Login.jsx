import { useState } from "react";
import { API } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await API.post("/auth/login",{email,password});

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if(res.data.user.role === "employer"){
        navigate("/employer");
      } else {
        navigate("/jobs");
      }

    } catch(err){
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white"
            placeholder="Password"
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            Login
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold">
              Register
            </Link>
          </p>
        </div>

      </div>

      {/* RIGHT SIDE FULL SCREEN */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700 text-white">

        <div className="text-center px-10">
          <h1 className="text-5xl font-bold mb-4">Career Connect</h1>
          <p className="text-lg opacity-90">
            Find your dream job and connect with top companies.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;