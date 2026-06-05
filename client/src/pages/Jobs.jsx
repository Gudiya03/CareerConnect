import { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Jobs = () => {

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

  // ⭐ NEW STATES
  const [savedJobs, setSavedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await API.get("/auth/profile");
      const uid = profileRes.data._id;
      setCurrentUserId(uid);
      setUserSkills(profileRes.data.skills || []);

      const jobsRes = await API.get("/jobs");
      setJobs(jobsRes.data);

      const saved = jobsRes.data
        .filter((job) => job.savedBy && job.savedBy.includes(uid))
        .map((job) => job._id);
      setSavedJobs(saved);
    } catch (err) {
      console.log("Error loading user profile or jobs");
    }

    try {
      const appsRes = await API.get("/applications/my");
      const jobIds = appsRes.data.map((app) => app.job?._id);
      setAppliedJobs(jobIds);
    } catch {}
  };

  // ⭐ SAVE JOB TO SERVER
  const toggleSave = async (id) => {
    try {
      const res = await API.post(`/jobs/save/${id}`);
      if (res.data.saved) {
        setSavedJobs([...savedJobs, id]);
        toast.success("Job saved successfully!");
      } else {
        setSavedJobs(savedJobs.filter(j => j !== id));
        toast.success("Job removed from saved!");
      }
    } catch {
      toast.error("Failed to update saved status");
    }
  };

  // ⭐ MATCH % (CASE-INSENSITIVE)
  const getMatch = (jobSkills = []) => {
    if (!jobSkills.length || !userSkills.length) return 0;

    const matched = jobSkills.filter(skill =>
      userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );

    return Math.round((matched.length / jobSkills.length) * 100);
  };

  const openApplyModal = (jobId) => {
    setSelectedJob(jobId);
    setShowModal(true);
  };

  const applyJob = async () => {
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      await API.post(`/applications/${selectedJob}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setAppliedJobs([...appliedJobs, selectedJob]);
      setShowModal(false);
      setResume(null);
      toast.success("Applied successfully!");

    } catch (err) {
      toast.error(err.response?.data?.message || "Apply error");
    }
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (

    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white">
      <Toaster position="top-right" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">

        {/* 🔥 PREMIUM HEADER */}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl mb-10 border flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">Find Your Dream Job</h1>
            <p className="text-gray-500 text-sm">
              Personalized for you
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Profile Strength</p>
            <p className="text-lg font-bold text-indigo-500">
              {userSkills.length * 20}%
            </p>
          </div>

        </div>

        {/* SEARCH */}

        <div className="mb-10 flex flex-col md:flex-row gap-4 md:items-center">

          <input
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[420px] p-4 rounded-xl bg-gray-100 dark:bg-slate-800 border focus:ring-2 focus:ring-indigo-500"
          />

          <div className="text-gray-500">
            {filteredJobs.length} jobs found
          </div>

        </div>

        {/* JOB GRID */}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {filteredJobs.map((job) => {

            const match = getMatch(job.skills);

            return (

              <div
                key={job._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between"
              >

                <div>

                  {/* TITLE + SAVE */}
                  <div className="flex justify-between items-center">

                    <h3 className="text-lg font-semibold">
                      {job.title}
                    </h3>

                    <button onClick={() => toggleSave(job._id)}>
                      {savedJobs.includes(job._id) ? "❤️" : "🤍"}
                    </button>

                  </div>

                  <p className="text-indigo-500 text-sm font-medium">
                    {job.company}
                  </p>

                  <p className="text-xs text-gray-400 mb-2">
                    Posted {timeAgo(job.createdAt)}
                  </p>

                  {/* MATCH */}
                  <p className="text-sm mb-2">
                    Match:{" "}
                    <span className="text-green-500 font-semibold">
                      {match}%
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs mb-4">

                    📍 {job.location}
                    <br></br><br></br>

                    💰 {job.salary}

                  </div>

                  <p className="text-sm line-clamp-3">
                    {job.description}
                  </p>

                </div>

                <div className="flex flex-col gap-3 mt-6">

                  <button
                    onClick={() => openApplyModal(job._id)}
                    disabled={appliedJobs.includes(job._id)}
                    className={`w-full py-2 rounded-lg ${
                      appliedJobs.includes(job._id)
                        ? "bg-green-600 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    }`}
                  >
                    {appliedJobs.includes(job._id)
                      ? "Applied ✓"
                      : "Apply Now"}
                  </button>

                  <Link to={`/job/${job._id}`}>
                    <button className="w-full py-2 border rounded-lg">
                      View Details
                    </button>
                  </Link>

                </div>

              </div>

            );
          })}

        </div>

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-semibold mb-4">
              Upload Resume
            </h2>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="mb-4"
            />

            <div className="flex gap-3">

              <button
                onClick={applyJob}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Jobs;