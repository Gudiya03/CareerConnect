import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gray-900 text-white border-b border-gray-700">
      <div className="w-full flex justify-between items-center px-6 py-4">

        {/* LEFT */}
        <h1
          className="text-2xl font-bold text-indigo-400 cursor-pointer"
          onClick={() => navigate("/jobs")}
        >
          Job Portal
        </h1>

        {/* RIGHT */}
        {token && (
          <div className="flex gap-6 items-center">
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

            {role === "employer" && (
              <Link to="/employer" className="hover:text-indigo-400">
                Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
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
      </div>
    </nav>
  );
};

export default Navbar;