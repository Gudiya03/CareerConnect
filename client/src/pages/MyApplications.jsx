import { useEffect, useState } from "react";
import { API } from "../api/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchApplications = async () => {
    try { const res = await API.get("/applications/my"); setApplications(res.data); }
    catch (err) { console.log(err); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const uploadResume = async () => {
    if (!file) { alert("Select file first"); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await API.post("/auth/upload-resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Resume uploaded successfully");
      setFile(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload failed");
    }
    setUploading(false);
  };

  const StatusBadge = ({ status }) => {
    const map = {
      accepted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${map[status] || "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0c0c14] text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">

        {/* RESUME UPLOAD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Resume</h2>
          <p className="text-xs text-gray-400 mb-4">Upload your latest resume so employers can view it.</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 text-sm text-gray-500 dark:text-gray-400 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-500/10 dark:file:text-indigo-400 hover:file:bg-indigo-100 transition"
            />
            <button
              onClick={uploadResume}
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20 disabled:opacity-60 flex-shrink-0"
            >
              {uploading ? "Uploading…" : "Upload Resume"}
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Applications</h1>
          <p className="text-sm text-gray-400 mt-0.5">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
        </div>

        {/* EMPTY */}
        {applications.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-300 dark:text-gray-600">You haven't applied to any jobs yet.</p>
          </div>
        )}

        {/* APPLICATION LIST */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{app.job?.title}</h2>
                  <p className="text-sm font-medium text-indigo-500 mt-0.5">{app.job?.company}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {app.job?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;