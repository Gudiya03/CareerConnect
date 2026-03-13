import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // FIXED TOKEN
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <h1
          className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/jobs")}
        >
          CareerConnect
        </h1>

        {/* RIGHT SIDE */}
        {token ? (
          <div className="flex items-center gap-6 text-sm">

            {role === "candidate" && (
              <>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-indigo-400 transition"
                >
                  Jobs
                </Link>

                <Link
                  to="/my-applications"
                  className="text-gray-300 hover:text-indigo-400 transition"
                >
                  Applications
                </Link>

                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-indigo-400 transition"
                >
                  Profile
                </Link>
              </>
            )}

            {role === "employer" && (
              <Link
                to="/employer"
                className="text-gray-300 hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;