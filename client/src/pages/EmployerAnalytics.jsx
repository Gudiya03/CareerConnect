import { useEffect, useState } from "react";
import { API } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const EmployerAnalytics = () => {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Stats
  const totalJobs = jobs.length;

  const totalApplicants = jobs.reduce(
    (acc, job) => acc + (job.applicantsCount || 0),
    0
  );

  const acceptedCandidates = jobs.reduce(
    (acc, job) => acc + (job.acceptedCount || 0),
    0
  );

  // Chart Data
  const chartData = jobs.map((job) => ({
    name: job.title,
    applicants: job.applicantsCount || 0
  }));

  return (
    <div className="space-y-8">

      {/* TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Analytics
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Recruitment analytics overview
        </p>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Jobs
          </p>

          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {totalJobs}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Applicants
          </p>

          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
            {totalApplicants}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Accepted Candidates
          </p>

          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {acceptedCandidates}
          </h2>
        </div>

      </div>

      {/* CHART */}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">

        <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
          Applicants per Job
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="applicants" fill="#6366f1" />
          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default EmployerAnalytics;