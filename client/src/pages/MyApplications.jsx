import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadResume = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await API.post("/auth/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Resume uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const StatusBadge = ({ status }) => {
    const map = {
      accepted: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
      rejected: "bg-rose-500/10 border border-rose-500/20 text-rose-450",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${map[status] || "bg-amber-500/10 border border-amber-500/20 text-amber-405"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <Toaster position="top-right" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 relative z-10 space-y-8">

        {/* Header */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">My Applications</h1>
            <p className="text-blue-200/40 text-xs mt-1">Check the status of your applications and resume updates</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider">Submitted:</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-bold rounded-full border border-blue-500/20">
              {applications.length}
            </span>
          </div>
        </div>

        {/* RESUME UPLOAD */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300/80 mb-1">Resume</h2>
          <p className="text-xs text-blue-200/40 mb-4">Upload your latest resume so employers can view it.</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 text-xs text-blue-200/50 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 hover:file:text-blue-300 transition"
            />
            <button
              onClick={uploadResume}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all duration-150 shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-60 flex-shrink-0"
            >
              {uploading ? "Uploading…" : "Upload Resume"}
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {applications.length === 0 && (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-xl">
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-lg font-bold text-white mb-2">No applications yet</h3>
            <p className="text-xs text-blue-200/40 mb-0 leading-relaxed">
              Browse jobs and start applying to see your active application pipeline here.
            </p>
          </div>
        )}

        {/* APPLICATION LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white leading-snug truncate">{app.job?.title}</h2>
                    <p className="text-[10px] font-semibold text-blue-400 mt-0.5">{app.job?.company}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                <p className="text-xs text-blue-200/40 leading-relaxed line-clamp-3">
                  {app.job?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;