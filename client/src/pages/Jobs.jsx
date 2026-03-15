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
    } catch {}
  };

  const applyJob = async (id) => {
    try {
      await API.post(`/applications/${id}`);
      setAppliedJobs([...appliedJobs, id]);
    } catch (err) {
      alert(err.response?.data?.message || "Apply error");
    }
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

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">

        {/* HERO */}

        <div className="mb-12">

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Find Your Dream Job
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover opportunities from top companies
          </p>

        </div>

        {/* SEARCH */}

        <div className="mb-10 flex flex-col md:flex-row gap-4 md:items-center">

          <input
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full md:w-[420px]
              p-4
              rounded-xl
              bg-gray-100
              dark:bg-slate-800
              border border-gray-300
              dark:border-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />

          <div className="text-gray-500 dark:text-gray-400 flex items-center">
            {filteredJobs.length} jobs found
          </div>

        </div>

        {/* JOB GRID */}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {filteredJobs.length > 0 ? (

            filteredJobs.map((job) => (

  <div
    key={job._id}
    className="
    bg-white
    dark:bg-slate-900
    p-6
    rounded-2xl
    border border-gray-200
    dark:border-slate-700
    shadow-sm
    hover:shadow-xl
    hover:-translate-y-1
    transition
    duration-300
    flex
    flex-col
    justify-between
    "
  >

    {/* TOP SECTION */}

    <div>

      {/* TITLE */}

      <h3 className="text-xl font-semibold mb-1">
        {job.title}
      </h3>

      {/* COMPANY */}

      <p className="text-indigo-500 text-sm font-medium mb-3">
        {job.company}
      </p>

      {/* META INFO */}

      <div className="flex flex-wrap gap-2 text-xs mb-4">

        {job.location && (
          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
            📍 {job.location}
          </span>
        )}

        {job.salary && (
          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
            💰 {job.salary}
          </span>
        )}

        {job.experience && (
          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
            🧠 {job.experience}
          </span>
        )}

      </div>

      {/* DESCRIPTION */}

      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
        {job.description}
      </p>

    </div>

    {/* APPLY BUTTON */}

    <button
      onClick={() => applyJob(job._id)}
      disabled={appliedJobs.includes(job._id)}
      className={`mt-6 w-full py-2.5 rounded-lg font-medium transition ${
        appliedJobs.includes(job._id)
          ? "bg-green-600 text-white cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
      }`}
    >

      {appliedJobs.includes(job._id)
        ? "Applied ✓"
        : "Apply Now"}

    </button>

  </div>

))

          ) : (

            <div className="col-span-full text-center py-20">

              <h2 className="text-2xl text-gray-500 dark:text-gray-400 mb-2">
                No jobs found
              </h2>

              <p className="text-gray-400 dark:text-gray-500">
                Try searching with a different keyword
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Jobs;