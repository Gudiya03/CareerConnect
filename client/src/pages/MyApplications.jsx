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
    <div className="w-full min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white p-10">

      {/* UPLOAD SECTION */}
      <div className="mb-10 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 max-w-xl">

  <h2 className="text-lg font-semibold mb-2">
    Resume
  </h2>

  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
    Upload your latest resume so employers can view it.
  </p>

  <div className="flex flex-col md:flex-row gap-3 md:items-center">

    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="text-sm"
    />

    <button
      onClick={uploadResume}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
    >
      Upload Resume
    </button>

  </div>

</div>

      <h1 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
        My Applications
      </h1>

      {applications.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          You have not applied to any jobs yet.
        </p>
      )}

      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl mb-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-semibold">{app.job?.title}</h2>

          <p className="text-indigo-500 mb-2">{app.job?.company}</p>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {app.job?.description}
          </p>

          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              app.status === "accepted"
                ? "bg-green-600 text-white"
                : app.status === "rejected"
                ? "bg-red-600 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {app.status?.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MyApplications;