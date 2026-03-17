import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

const SelectRole = () => {

  const navigate = useNavigate();

  const handleSelect = async (role) => {

    const googleName = localStorage.getItem("tempGoogleName");
    const googleEmail = localStorage.getItem("tempGoogleEmail");
    const googleId = localStorage.getItem("tempGoogleId");

    const normalName = localStorage.getItem("tempName");
    const normalEmail = localStorage.getItem("tempEmail");

    try {

      let res;

      // ===== GOOGLE USER =====
      if (googleEmail) {

        res = await API.post("/auth/google", {
          name: googleName,
          email: googleEmail,
          googleId,
          role
        });

        localStorage.removeItem("tempGoogleName");
        localStorage.removeItem("tempGoogleEmail");
        localStorage.removeItem("tempGoogleId");

      }

      // ===== NORMAL USER =====
      else if (normalEmail) {

        res = await API.put("/auth/set-role", {
          email: normalEmail,
          role
        });

        localStorage.removeItem("tempName");
        localStorage.removeItem("tempEmail");

      } else {
        alert("Session expired, please register again");
        return;
      }

      // ===== SAVE USER =====
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      // ===== REDIRECT =====
      if (role === "employer") {
        navigate("/employer-setup");
      } else {
        navigate("/candidate-setup");
      }

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[350px]">

        <h2 className="text-2xl font-bold mb-6">
          Choose Your Role
        </h2>

        <div className="flex flex-col gap-4">

          <button
            onClick={() => handleSelect("candidate")}
            className="py-3 bg-indigo-500 text-white rounded"
          >
            👤 Candidate
          </button>

          <button
            onClick={() => handleSelect("employer")}
            className="py-3 bg-purple-600 text-white rounded"
          >
            🏢 Employer
          </button>

        </div>

      </div>

    </div>
  );
};

export default SelectRole;