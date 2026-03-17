import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const CandidateSetup = () => {

  const [bio,setBio] = useState("");
  const [location,setLocation] = useState("");
  const [skills,setSkills] = useState("");

  const navigate = useNavigate();

  const submit = async () => {

    try{

      const token = localStorage.getItem("accessToken"); // ✅ GET TOKEN

      await API.put("/auth/profile",
        {
          bio,
          location,
          skills: skills.split(",")
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ IMPORTANT FIX
          }
        }
      );

      alert("Profile setup complete 🚀");

      navigate("/jobs");

    }catch(err){
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save profile");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>

        <textarea
          placeholder="Short bio about you..."
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setBio(e.target.value)}
        />

        <input
          placeholder="Location"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          placeholder="Skills (React, Node, Java...)"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setSkills(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg"
        >
          Save & Continue
        </button>

      </div>

    </div>

  );

};

export default CandidateSetup;