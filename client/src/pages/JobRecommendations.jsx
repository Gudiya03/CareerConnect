import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const JobRecommendations = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const [profileRes, jobsRes] = await Promise.all([
        API.get("/auth/profile"),
        API.get("/jobs?all=true")
      ]);
      setProfile(profileRes.data);
      
      const userSkills = profileRes.data.skills || [];
      const userPrefRole = profileRes.data.preferences?.preferredRole || "";
      
      // Calculate matches
      const scoredJobs = jobsRes.data.map((job) => {
        let score = 0;
        const jobSkills = job.skills || [];

        // 1. Skill Match
        if (userSkills.length > 0 && jobSkills.length > 0) {
          const matchedSkills = jobSkills.filter((skill) =>
            userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
          );
          score += (matchedSkills.length / jobSkills.length) * 60; // 60% weight
        }

        // 2. Role Preference Match
        if (userPrefRole && job.title.toLowerCase().includes(userPrefRole.toLowerCase())) {
          score += 40; // 40% weight
        }

        return {
          ...job,
          matchPercentage: Math.round(score > 100 ? 100 : score)
        };
      })
      .filter((job) => job.isApproved && job.matchPercentage > 15) // Limit to approved and reasonable matches
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

      setJobs(scoredJobs);
    } catch {
      toast.error("Failed to load recommended jobs");
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
        <p className="text-sm text-gray-400">Filtering recommended jobs based on your skills…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Recommended Jobs
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">vacancies compiled specifically to match your verified skills stack</p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-16 text-center text-gray-400">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="font-bold text-gray-800 dark:text-white">No Recommendations</h3>
          <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            Add more core technical skills or fill out your dashboard preferences to unlock tailored job recommendations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[230px]">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-850 dark:text-white truncate">{job.title}</h3>
                    <p className="text-xs text-indigo-500 font-semibold mt-0.5 truncate">{job.company}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase flex-shrink-0 ${
                    job.matchPercentage >= 70 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" :
                    job.matchPercentage >= 40 ? "bg-violet-50 text-violet-600 dark:bg-violet-950/20" :
                    "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                  }`}>
                    {job.matchPercentage}% Match
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                  <span>📍 {job.location || "Remote"}</span>
                  <span>💼 {job.experience || "0-1 Years"}</span>
                  <span>💰 {job.salary || "Not disclosed"}</span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {job.skills && job.skills.slice(0, 3).map((skill, index) => {
                    const hasSkill = profile?.skills?.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
                    return (
                      <span
                        key={index}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          hasSkill
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                            : "bg-gray-50 text-gray-400 dark:bg-slate-800/40"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                  {job.skills && job.skills.length > 3 && (
                    <span className="text-[10px] text-gray-400 font-bold px-1 py-0.5">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 dark:border-slate-800/80 mt-auto flex items-center gap-2">
                <a
                  href={`/job/${job._id}`}
                  className="flex-1 text-center py-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-violet-500/10 block"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
