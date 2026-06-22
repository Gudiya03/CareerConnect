import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
      <span className={color.text}>{icon}</span>
    </div>
    <div>
      <p className="text-xs text-gray-450 dark:text-gray-400 font-semibold mb-0.5">{label}</p>
      <h2 className="text-2xl font-bold text-gray-850 dark:text-white leading-none">{value}</h2>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
    <div>
      <h3 className="text-sm font-bold text-gray-850 dark:text-white">{title}</h3>
      <p className="text-[11px] text-gray-405 dark:text-gray-400 mt-0.5">{subtitle}</p>
    </div>
    <div className="h-64 w-full">
      {children}
    </div>
  </div>
);

const PIE_COLORS = ["#8b5cf6", "#10b981", "#ef4444", "#3b82f6", "#f59e0b"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatsAndTrends();
  }, []);

  const fetchStatsAndTrends = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/stats/trends")
      ]);
      setData(statsRes.data);
      setTrends(trendsRes.data);
    } catch {
      toast.error("Failed to load administration analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <svg className="animate-spin w-8 h-8 text-violet-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-400">Loading system summaries & charts…</p>
      </div>
    );
  }

  const { stats, recentUsers, recentJobs } = data || {};
  const { registrationTrends, jobTrends, applicationBreakdown, jobBreakdown, subscriptionBreakdown } = trends || {};

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          System Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Overall system metrics and active accounts status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Registered Users"
          value={stats?.totalUsers || 0}
          color={{ bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-600 dark:text-violet-400" }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Total Job Listings"
          value={stats?.totalJobs || 0}
          color={{ bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-600 dark:text-emerald-400" }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          }
        />
        <StatCard
          label="Total Applications"
          value={stats?.totalApplications || 0}
          color={{ bg: "bg-indigo-50 dark:bg-indigo-950/20", text: "text-indigo-600 dark:text-indigo-400" }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
      </div>

      {/* Role breakdown pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Candidates registered", value: stats?.candidateCount || 0, color: "bg-blue-500" },
          { label: "Employers registered", value: stats?.employerCount || 0, color: "bg-violet-500" },
          { label: "Administrators", value: stats?.adminCount || 0, color: "bg-indigo-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <span className="text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User registrations trend */}
        <ChartCard title="User Acquisition Trends" subtitle="Registration growth for candidates & employers over last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={registrationTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Candidates" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCandidates)" />
              <Area type="monotone" dataKey="Employers" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorEmployers)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Jobs vs Applications trend */}
        <ChartCard title="System Activity Over Time" subtitle="Comparative volumes of jobs posted vs candidate applications submitted">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="Jobs" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Pie breakdowns row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Applications pie */}
        <ChartCard title="Application Funnel Outcomes" subtitle="Proportions of accepted, rejected, and pending submittals">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={applicationBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {applicationBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Jobs status pie */}
        <ChartCard title="Job Vacancies Status" subtitle="Open recruitment status vs closed vacancies">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={jobBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {jobBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 1) % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Subscriptions pie */}
        <ChartCard title="Employer Tier Distribution" subtitle="Employers active on free tiers versus premium accounts">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subscriptionBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {subscriptionBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 3) % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Lists of recents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent users */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-850 dark:text-white">Recent Registrations</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest 5 user accounts added</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
            {recentUsers?.map((user) => (
              <div key={user._id} className="py-3 flex justify-between items-center text-sm first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-semibold truncate text-gray-800 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize
                  ${user.role === "admin" ? "bg-red-50 text-red-600 dark:bg-red-950/20" :
                    user.role === "employer" ? "bg-violet-50 text-violet-600 dark:bg-violet-950/20" :
                    "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                  }`}>
                  {user.role || "No Role"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-850 dark:text-white">Recently Posted Jobs</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest 5 vacancies submitted</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
            {recentJobs?.map((job) => (
              <div key={job._id} className="py-3 flex justify-between items-center text-sm first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-semibold truncate text-gray-800 dark:text-gray-100">{job.title}</p>
                  <p className="text-xs text-indigo-500 font-semibold truncate mt-0.5">{job.company}</p>
                </div>
                <span className="text-[10px] bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-gray-400 font-semibold px-2 py-0.5 rounded-lg">
                  📍 {job.location || "Remote"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
