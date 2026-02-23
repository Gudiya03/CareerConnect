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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Login
        </button>

        {/* 🔥 REGISTER LINK ADDED */}
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;