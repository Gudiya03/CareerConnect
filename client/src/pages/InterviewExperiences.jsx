import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const InterviewExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    questions: "",
    tips: "",
    result: "Pending"
  });

  useEffect(() => {
    fetchExperiences();
    fetchProfile();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await API.get("/interview-experience/all");
      setExperiences(res.data);
    } catch {
      toast.error("Failed to load interview experiences");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setCurrentUser(res.data);
    } catch {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.role || !formData.questions) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post("/interview-experience/create", formData);
      toast.success(res.data.message || "Interview experience posted successfully! ✓");
      setShowModal(false);
      setFormData({
        companyName: "",
        role: "",
        questions: "",
        tips: "",
        result: "Pending"
      });
      fetchExperiences();
    } catch {
      toast.error("Failed to submit interview experience");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview experience review?")) {
      return;
    }
    try {
      await API.delete(`/interview-experience/${id}`);
      toast.success("Post deleted successfully");
      setExperiences(experiences.filter((exp) => exp._id !== id));
    } catch {
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <svg className="animate-spin w-8 h-8 text-violet-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-400">Loading interview experience logs…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Interview Experiences
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Read student experiences and share your hiring journeys</p>
        </div>
        {currentUser?.role === "candidate" && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/10 cursor-pointer"
          >
            ✍️ Post My Experience
          </button>
        )}
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-16 text-center text-gray-400">
          <span className="text-4xl block mb-2">💬</span>
          <h3 className="font-bold text-gray-800 dark:text-white">No Experiences Shared</h3>
          <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            Be the first to share your interview questions, company details, and tips with the student community.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-850 dark:text-white">
                    {exp.role} at <span className="text-indigo-500">{exp.companyName}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Shared by {exp.user?.name || "Anonymous User"} • {new Date(exp.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                    exp.result === "Selected" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" :
                    exp.result === "Rejected" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" :
                    "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                  }`}>
                    {exp.result}
                  </span>
                  {(currentUser?.role === "admin" || (currentUser && exp.user && exp.user._id === currentUser._id)) && (
                    <button
                      onClick={() => deletePost(exp._id)}
                      className="text-gray-400 hover:text-red-500 transition text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Interview Questions:</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl border border-gray-100 dark:border-slate-800/60 mt-1 whitespace-pre-line">
                    {exp.questions}
                  </p>
                </div>

                {exp.tips && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-850 dark:text-gray-250">Tips for Candidates:</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 italic">
                      💡 "{exp.tips}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SUBMISSION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#111120] border border-gray-150 dark:border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 relative space-y-5"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              ✕
            </button>
            
            <div>
              <h3 className="text-lg font-bold text-gray-850 dark:text-white">Post Interview Experience</h3>
              <p className="text-xs text-gray-400 mt-0.5">Share interview questions and preparation tips to help peers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Google"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Role / Position *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Interview Questions *</label>
              <textarea
                name="questions"
                rows="4"
                value={formData.questions}
                onChange={handleInputChange}
                required
                placeholder="List questions asked during coding rounds or tech screens..."
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Preparation Tips</label>
              <textarea
                name="tips"
                rows="2"
                value={formData.tips}
                onChange={handleInputChange}
                placeholder="What topics should applicants focus on? (e.g., DP, trees, system design)"
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Hiring Result</label>
              <select
                name="result"
                value={formData.result}
                onChange={handleInputChange}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs"
              >
                <option value="Pending">Pending Outcome</option>
                <option value="Selected">Offer Received (Selected) 🎉</option>
                <option value="Rejected">Declined (Rejected)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-50 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition shadow-md shadow-violet-500/10 cursor-pointer"
              >
                {submitting ? "Posting..." : "Publish Experience"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InterviewExperiences;
