import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await API.get(`/auth/verify-email/${token}`);
        alert("Email verified successfully");
        navigate("/login");
      } catch (err) {
        alert("Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-indigo-950/50 border border-gray-100 dark:border-gray-800 px-8 py-10 text-center">

          {/* Spinner */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50">
              <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Verifying your email
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Please wait, this will only take a moment…
          </p>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;