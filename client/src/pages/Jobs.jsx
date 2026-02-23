import { useEffect, useState } from "react";
import { API } from "../api/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  const fetchMyApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      const jobIds = res.data.map((app) => app.job?._id);
      setAppliedJobs(jobIds);
    } catch (err) {
      console.log(err);
    }
  };

  const applyJob = async (id) => {
    try {
      await API.post(`/applications/${id}`);
      alert("Applied successfully");
      setAppliedJobs([...appliedJobs, id]);
    } catch (err) {
      alert(err.response?.data?.message || "Apply error");
    }
  };

  // 🔎 SAFE FILTER
  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Jobs</h1>

      {/* SEARCH BAR */}
      <input
        placeholder="Search job or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-3 mb-8 w-full max-w-md bg-gray-800 rounded"
      />

      {/* ❌ NO RESULT MESSAGE */}
      {filteredJobs.length === 0 && (
        <p className="text-gray-400">No jobs found</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-gray-900 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-indigo-400">{job.company}</p>
            <p className="text-gray-400">{job.description}</p>

            <button
              onClick={() => applyJob(job._id)}
              disabled={appliedJobs.includes(job._id)}
              className={`mt-4 px-4 py-2 rounded ${
                appliedJobs.includes(job._id)
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {appliedJobs.includes(job._id) ? "Applied ✅" : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;