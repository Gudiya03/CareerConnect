
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";

const JobDetails = () => {

  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {

      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);

    } catch {
      alert("Failed to load job");
    }
  };

  // APPLY WITH RESUME
  const applyJob = async () => {

    if (!resume) {
      alert("Please upload your resume first");
      return;
    }

    try {

      const formData = new FormData();
      formData.append("resume", resume);

      await API.post(`/applications/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setApplied(true);

    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading job...
      </div>
    );
  }

  return (

    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white">

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* JOB HEADER */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-8 border border-gray-200 dark:border-slate-700">

          <h1 className="text-3xl font-bold mb-2">
            {job.title}
          </h1>

          <p className="text-indigo-500 font-medium mb-4">
            {job.company}
          </p>

          {/* JOB META */}

          <div className="flex flex-wrap gap-3 mb-6 text-sm">

            {job.location && (
              <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">
                📍 {job.location}
              </span>
            )}

            {job.salary && (
              <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">
                💰 {job.salary}
              </span>
            )}

            {job.experience && (
              <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">
                🧠 {job.experience}
              </span>
            )}

            {job.jobType && (
              <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">
                💼 {job.jobType}
              </span>
            )}

          </div>

          {/* RESUME UPLOAD */}

          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Upload Resume (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="border p-2 rounded w-full"
            />

          </div>

          {/* APPLY BUTTON */}

          <button
            onClick={applyJob}
            disabled={applied}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              applied
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
            }`}
          >
            {applied ? "Applied ✓" : "Apply Now"}
          </button>

        </div>

        {/* JOB STATS */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700">
            <h3 className="text-lg font-semibold">
              Applicants
            </h3>
            <p className="text-2xl font-bold text-indigo-500 mt-2">
              {job.applicantsCount || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700">
            <h3 className="text-lg font-semibold">
              Accepted
            </h3>
            <p className="text-2xl font-bold text-green-500 mt-2">
              {job.acceptedCount || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700">
            <h3 className="text-lg font-semibold">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-500 mt-2">
              {job.pendingCount || 0}
            </p>
          </div>

        </div>

      </div>

    </div>

  );

};

export default JobDetails;

