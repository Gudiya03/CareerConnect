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
    <div className="w-full min-h-screen bg-[#020617] text-white">

      {/* NAVBAR */}
      {/* <div className="w-full flex justify-between items-center px-10 py-5 bg-[#0b132b]">
        <h1 className="text-3xl font-bold text-indigo-400">Career Connect</h1>

        <div className="flex gap-6">
          <button className="text-indigo-400">Jobs</button>
          <button>My Applications</button>
          <button
            onClick={()=>{
              localStorage.clear();
              window.location.href="/";
            }}
            className="bg-black px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div> */}

      {/* CONTENT */}
      <div className="w-full px-10 py-10">

        <h2 className="text-5xl font-bold mb-8">Jobs</h2>

        <input
          placeholder="Search job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[500px] p-3 mb-10 rounded-lg bg-[#1e293b]"
        />

        <div className="
          w-full
          grid
          gap-8
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        ">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-[#0b132b] p-6 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-indigo-400">{job.company}</p>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {job.description}
              </p>

              <button
                onClick={() => applyJob(job._id)}
                disabled={appliedJobs.includes(job._id)}
                className={`mt-6 w-full py-2 rounded-lg ${
                  appliedJobs.includes(job._id)
                    ? "bg-green-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {appliedJobs.includes(job._id) ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Jobs;