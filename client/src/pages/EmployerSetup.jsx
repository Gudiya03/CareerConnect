import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const EmployerSetup = () => {

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const submit = async () => {

    if (!companyName) {
      alert("Company name is required");
      return;
    }

    try {

      // ✅ DEBUG TOKEN
      const token = localStorage.getItem("accessToken");
      console.log("TOKEN:", token);

      await API.put(
        "/auth/profile",
        {
          companyName,
          companyWebsite,
          location,
          industry,
          bio: description
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ IMPORTANT
          }
        }
      );

      alert("Profile setup complete 🚀");

      navigate("/employer");

    } catch (err) {

      console.log("FULL ERROR:", err);
      console.log("ERROR DATA:", err.response?.data);

      const message =
        err.response?.data?.message || "Something went wrong";

      alert(message); // ✅ REAL ERROR SHOW

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Setup Your Company
        </h2>

        <input
          placeholder="Company Name"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setCompanyName(e.target.value)}
        />

        <input
          placeholder="Website (optional)"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setCompanyWebsite(e.target.value)}
        />

        <input
          placeholder="Location"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          placeholder="Industry (e.g. IT, Finance, Healthcare)"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setIndustry(e.target.value)}
        />

        <textarea
          placeholder="Company Description"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e)=>setDescription(e.target.value)}
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

export default EmployerSetup;