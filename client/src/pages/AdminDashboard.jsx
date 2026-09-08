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
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

// Mock Fallbacks matching screenshot visuals
const defaultUserGrowth = [
  { month: "Apr", Candidates: 100, Employers: 60 },
  { month: "May", Candidates: 140, Employers: 45 },
  { month: "Jun", Candidates: 165, Employers: 75 },
  { month: "Jul", Candidates: 225, Employers: 90 },
  { month: "Aug", Candidates: 260, Employers: 120 },
  { month: "Sep", Candidates: 345, Employers: 140 },
];

const defaultTrendData = [
  { month: "Apr", "Job Postings": 60, Applications: 140 },
  { month: "May", "Job Postings": 120, Applications: 290 },
  { month: "Jun", "Job Postings": 160, Applications: 350 },
  { month: "Jul", "Job Postings": 210, Applications: 410 },
  { month: "Aug", "Job Postings": 300, Applications: 510 },
  { month: "Sep", "Job Postings": 370, Applications: 700 },
];

const defaultUserDistribution = [
  { name: "Candidates", value: 72, color: "#2563eb" },
  { name: "Employers", value: 15, color: "#8b5cf6" },
  { name: "Admins", value: 3, color: "#f59e0b" },
  { name: "Others", value: 10, color: "#94a3b8" },
];

const defaultRecentUsers = [
  { name: "Priya Sharma", type: "Candidate", email: "priya@gmail.com", date: "09 Sep 2026", status: "Active" },
  { name: "Rahul Kumar", type: "Employer", email: "rahul@techcorp.com", date: "09 Sep 2026", status: "Active" },
  { name: "Ananya Singh", type: "Candidate", email: "ananya12@gmail.com", date: "08 Sep 2026", status: "Active" },
  { name: "TechCorp Ltd.", type: "Employer", email: "hr@techcorp.com", date: "08 Sep 2026", status: "Pending" },
  { name: "Neha Mehta", type: "Candidate", email: "neha.m@gmail.com", date: "07 Sep 2026", status: "Active" },
];

const defaultRecentJobs = [
  { title: "Software Engineer", company: "Google", date: "09 Sep 2026", status: "Active", logoBg: "bg-red-500", letter: "G" },
  { title: "Product Designer", company: "Microsoft", date: "08 Sep 2026", status: "Active", logoBg: "bg-blue-600", letter: "M" },
  { title: "Data Analyst", company: "Amazon", date: "08 Sep 2026", status: "Active", logoBg: "bg-amber-500", letter: "a" },
  { title: "Frontend Developer", company: "TCS", date: "07 Sep 2026", status: "Active", logoBg: "bg-sky-600", letter: "T" },
  { title: "ML Engineer", company: "Infosys", date: "07 Sep 2026", status: "Paused", logoBg: "bg-indigo-600", letter: "I" },
];

const defaultRecentApps = [
  { candidate: "Ananya Singh", job: "Data Analyst", date: "09 Sep 2026" },
  { candidate: "Rahul Kumar", job: "Software Engineer", date: "09 Sep 2026" },
  { candidate: "Priya Sharma", job: "Product Designer", date: "08 Sep 2026" },
  { candidate: "Arjun Kapoor", job: "ML Engineer", date: "08 Sep 2026" },
  { candidate: "Neha Mehta", job: "Frontend Developer", date: "07 Sep 2026" },
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/stats");
      setData(res.data);
    } catch {
      // Graceful fallback to rich presentation dataset if API fails
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = data?.stats?.totalUsers || 1248;
  const activeJobs = data?.stats?.totalJobs || 320;
  const totalApps = data?.stats?.totalApplications || 4892;
  const totalCompanies = data?.stats?.employerCount || 186;

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* ── TOP HERO HEADER BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome Back, Admin! 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Here&apos;s what&apos;s happening on your job portal today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-xs">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Tuesday, 9 Sep 2026 &bull; 12:45 PM</span>
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => toast.success("Exporting platform analytics report...")}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-300 font-semibold text-xs rounded-xl transition duration-200 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ── 4 TOP KPI METRICS CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-xs">
              👥
            </div>
            <Link to="/admin/users" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition cursor-pointer">
              &rarr;
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Total Users</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{totalUsers.toLocaleString()}</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                &nearr; +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">+132 this month</p>
          </div>
        </div>

        {/* Card 2: Active Job Listings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
              💼
            </div>
            <Link to="/admin/jobs" className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition cursor-pointer">
              &rarr;
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Active Job Listings</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{activeJobs.toLocaleString()}</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                &nearr; +18%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">+49 this month</p>
          </div>
        </div>

        {/* Card 3: Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shadow-xs">
              📄
            </div>
            <Link to="/admin/applications" className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition cursor-pointer">
              &rarr;
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Total Applications</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{totalApps.toLocaleString()}</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                &nearr; +28%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">+1,061 this month</p>
          </div>
        </div>

        {/* Card 4: Registered Companies */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shadow-xs">
              🏢
            </div>
            <Link to="/admin/users?role=employer" className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition cursor-pointer">
              &rarr;
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Registered Companies</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{totalCompanies.toLocaleString()}</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                &nearr; +10%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">+17 this month</p>
          </div>
        </div>

      </div>

      {/* ── ANALYTICS CHARTS SECTION (3 CHARTS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: User Growth Overview (Bar Chart) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Growth Overview</h3>
              <p className="text-[11px] text-slate-400">New registrations over the last 6 months</p>
            </div>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultUserGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="Candidates" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Employers" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Applications & Jobs Trend (Area Chart) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Applications & Jobs Trend</h3>
              <p className="text-[11px] text-slate-400">Monthly job posts vs applications</p>
            </div>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="Job Postings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                <Area type="monotone" dataKey="Applications" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: User Distribution (Donut Chart) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">User Distribution</h3>
            <p className="text-[11px] text-slate-400">Breakdown of registered account roles</p>
          </div>

          <div className="relative h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defaultUserDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {defaultUserDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-extrabold text-slate-900">1,248</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
            </div>
          </div>

          {/* Donut Legend List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {defaultUserDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── RECENT DATA TABLES GRID (3 CARDS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table 1: Recent Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                👤
              </span>
              <h3 className="text-sm font-bold text-slate-900">Recent Registrations</h3>
            </div>
            <Link to="/admin/users" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Joined</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaultRecentUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-bold text-slate-800">{user.name}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.type === "Candidate" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">{user.date}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Job Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                💼
              </span>
              <h3 className="text-sm font-bold text-slate-900">Recent Job Listings</h3>
            </div>
            <Link to="/admin/jobs" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-2">Job Title</th>
                  <th className="pb-2">Company</th>
                  <th className="pb-2">Posted</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaultRecentJobs.map((job, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-bold text-slate-800">{job.title}</td>
                    <td className="py-2.5 flex items-center gap-1.5">
                      <span className={`w-4 h-4 rounded-full ${job.logoBg} text-white font-extrabold text-[9px] flex items-center justify-center shrink-0`}>
                        {job.letter}
                      </span>
                      <span className="text-slate-600 text-[11px] font-medium">{job.company}</span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">{job.date}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Recent Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
                📄
              </span>
              <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
            </div>
            <Link to="/admin/applications" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-2">Candidate</th>
                  <th className="pb-2">Job Title</th>
                  <th className="pb-2 text-right">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaultRecentApps.map((app, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-bold text-slate-800">{app.candidate}</td>
                    <td className="py-2.5 text-slate-600">{app.job}</td>
                    <td className="py-2.5 text-right text-slate-400 text-[11px]">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── BOTTOM QUICK ACTIONS & PROMO BANNER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Quick Actions Bar */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">⚡</span>
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => toast.success("Redirecting to create job modal...")}
              className="p-3 bg-blue-50 hover:bg-blue-100/80 text-blue-600 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                +
              </div>
              <span>Add Job</span>
            </button>

            <button
              onClick={() => toast.success("Redirecting to add user form...")}
              className="p-3 bg-purple-50 hover:bg-purple-100/80 text-purple-600 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shadow-sm">
                👥
              </div>
              <span>Add User</span>
            </button>

            <button
              onClick={() => toast.success("Opening company verification tab...")}
              className="p-3 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm">
                🏢
              </div>
              <span>Verify Company</span>
            </button>

            <button
              onClick={() => toast.success("Opening content manager...")}
              className="p-3 bg-orange-50 hover:bg-orange-100/80 text-orange-600 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs shadow-sm">
                📄
              </div>
              <span>Manage Content</span>
            </button>
          </div>
        </div>

        {/* Promo Banner Card */}
        <div className="lg:col-span-7 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="space-y-1.5 z-10 text-center sm:text-left">
            <h3 className="text-xl font-extrabold tracking-tight">
              Empower Careers. Build the Future.
            </h3>
            <p className="text-xs text-blue-100 max-w-md">
              Manage, monitor and grow your job portal with ease.
            </p>
          </div>

          <button
            onClick={() => toast.success("Opening advanced analytics reports...")}
            className="z-10 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>View Reports</span>
            <span>&rarr;</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
