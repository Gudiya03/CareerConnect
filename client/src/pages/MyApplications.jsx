import { useEffect, useState } from "react";
import { API } from "../api/api";
import React from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [file, setFile] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // RESUME UPLOAD
  const uploadResume = async () => {
    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await API.post("/auth/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white p-6 md:p-10 transition-colors duration-300">

      {/* ===== UPLOAD SECTION ===== */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="bg-gray-100 dark:bg-slate-900 p-6 rounded-2xl border border-black dark:border-white shadow-sm hover:shadow-xl transition duration-300">

          <h2 className="text-xl font-semibold mb-2 tracking-wide">
            📄 Resume
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Upload your latest resume so employers can view it.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm w-full border border-black dark:border-white rounded-lg px-3 py-2 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <button
              onClick={uploadResume}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Upload Resume
            </button>

          </div>
        </div>
      </div>

      {/* ===== TITLE ===== */}
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-transparent bg-clip-text">
        My Applications
      </h1>

      {/* ===== EMPTY STATE ===== */}
      {applications.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
          You have not applied to any jobs yet.
        </p>
      )}

      {/* ===== APPLICATION LIST ===== */}
      <div className="max-w-4xl mx-auto space-y-6">

        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-100 dark:bg-slate-900 p-6 rounded-2xl border border-black dark:border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >

            <div className="flex justify-between items-start mb-3">

              <h2 className="text-xl font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                {app.job?.title}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  app.status === "accepted"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {app.status?.toUpperCase()}
              </span>

            </div>

            <p className="text-indigo-600 dark:text-indigo-400 mb-2 text-sm font-medium">
              {app.job?.company}
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {app.job?.description}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
};

export default MyApplications;