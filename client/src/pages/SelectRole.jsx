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

      if (googleEmail) {
        res = await API.post("/auth/google", { name: googleName, email: googleEmail, googleId, role });
        localStorage.removeItem("tempGoogleName");
        localStorage.removeItem("tempGoogleEmail");
        localStorage.removeItem("tempGoogleId");
      } else if (normalEmail) {
        res = await API.put("/auth/set-role", { email: normalEmail, role });
        localStorage.removeItem("tempName");
        localStorage.removeItem("tempEmail");
      } else {
        alert("Session expired, please register again");
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

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

  const roles = [
    {
      key: "candidate",
      label: "Candidate",
      description: "Find jobs that match your skills and goals",
      emoji: "👤",
      gradient: "from-indigo-500 to-violet-500",
      shadow: "shadow-indigo-200 dark:shadow-indigo-950/50",
      ring: "focus-visible:ring-indigo-400",
    },
    {
      key: "employer",
      label: "Employer",
      description: "Post jobs and hire the best talent",
      emoji: "🏢",
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-200 dark:shadow-violet-950/50",
      ring: "focus-visible:ring-violet-400",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4 py-10">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-indigo-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Choose Your Role</h2>
            <p className="text-indigo-100 text-xs mt-0.5">Select how you want to use the platform</p>
          </div>

          {/* Role buttons */}
          <div className="px-8 py-7 space-y-4">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleSelect(role.key)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-semibold shadow-lg ${role.shadow} hover:opacity-90 active:scale-[0.98] transition-all duration-150 text-left`}
              >
                <span className="text-2xl leading-none">{role.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">{role.label}</p>
                  <p className="text-xs text-white/70 font-normal mt-0.5 leading-snug">{role.description}</p>
                </div>
                <svg className="ml-auto flex-shrink-0 opacity-70" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectRole;