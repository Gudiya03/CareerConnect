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

  // 🔥 RESUME UPLOAD FIXED
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
    <div className="min-h-screen bg-black text-white p-10">

      {/* UPLOAD SECTION */}
      <div className="mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />

        <button
          onClick={uploadResume}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Upload Resume
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-indigo-400">
        My Applications
      </h1>

      {applications.length === 0 && (
        <p className="text-gray-400">You have not applied to any jobs yet.</p>
      )}

      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-gray-900 p-6 rounded-xl mb-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold">{app.job?.title}</h2>

          <p className="text-indigo-400 mb-2">{app.job?.company}</p>

          <p className="text-gray-400 mb-4">{app.job?.description}</p>

          <span
            className={`px-3 py-1 rounded text-sm ${
              app.status === "accepted"
                ? "bg-green-600"
                : app.status === "rejected"
                ? "bg-red-600"
                : "bg-yellow-600"
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