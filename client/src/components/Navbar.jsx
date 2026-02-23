import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // candidate / employer

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center border-b border-gray-700">
      {/* LEFT */}
      <h1
        className="text-xl font-bold text-indigo-400 cursor-pointer"
        onClick={() => navigate("/jobs")}
      >
        Job Portal
      </h1>

      {/* RIGHT */}
      {token && (
        <div className="flex gap-6 items-center">
          {/* Candidate */}
          {role === "candidate" && (
            <>
              <Link to="/jobs" className="hover:text-indigo-400">
                Jobs
              </Link>

              <Link to="/my-applications" className="hover:text-indigo-400">
                My Applications
              </Link>
            </>
          )}

          {/* Employer */}
          {role === "employer" && (
            <>
              <Link to="/employer" className="hover:text-indigo-400">
                Dashboard
              </Link>
            </>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {!token && (
        <Link to="/login" className="text-indigo-400">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;