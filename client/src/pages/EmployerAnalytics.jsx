import { useEffect, useState } from "react";
import { API } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
      <span className={color.icon}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <h2 className={`text-3xl font-bold tracking-tight ${color.text}`}>{value}</h2>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate max-w-[160px]">{label}</p>
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{payload[0].value} applicants</p>
      </div>
    );
  }
  return null;
};

const EmployerAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0);
  const acceptedCandidates = jobs.reduce((acc, job) => acc + (job.acceptedCount || 0), 0);

  const chartData = jobs.map((job) => ({
    name: job.title.length > 18 ? job.title.slice(0, 18) + "…" : job.title,
    applicants: job.applicantsCount || 0,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.applicants), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm text-gray-400">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
            Recruitment overview — all time
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchJobs}
          className="self-start sm:self-auto flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Jobs"
          value={totalJobs}
          color={{
            bg: "bg-indigo-50 dark:bg-indigo-950/50",
            icon: "text-indigo-500 dark:text-indigo-400",
            text: "text-indigo-600 dark:text-indigo-400",
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          }
        />
        <StatCard
          label="Total Applicants"
          value={totalApplicants}
          color={{
            bg: "bg-emerald-50 dark:bg-emerald-950/50",
            icon: "text-emerald-500 dark:text-emerald-400",
            text: "text-emerald-600 dark:text-emerald-400",
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Accepted Candidates"
          value={acceptedCandidates}
          color={{
            bg: "bg-violet-50 dark:bg-violet-950/50",
            icon: "text-violet-500 dark:text-violet-400",
            text: "text-violet-600 dark:text-violet-400",
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Applicants per Job</h2>
            <p className="text-xs text-gray-400 mt-0.5">{chartData.length} positions tracked</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-500 flex-shrink-0" />
            <span className="text-xs text-gray-400">Applicants</span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-gray-400 gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
            </svg>
            <p className="text-sm">No job data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)", radius: 8 }} />
              <Bar dataKey="applicants" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.applicants === maxVal ? "#6366f1" : "#c7d2fe"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};

export default EmployerAnalytics;