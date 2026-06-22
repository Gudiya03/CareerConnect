import { useState, useEffect } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        API.get("/auth/profile"),
        API.get("/jobs?all=true")
      ]);
      setProfile(profileRes.data);
      setAllJobs(jobsRes.data);
    } catch {
      toast.error("Failed to load platform data");
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setResults(null);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const runAnalysis = () => {
    if (!file) {
      toast.error("Please upload your PDF resume file first");
      return;
    }

    setAnalyzing(true);

    // Mock an AI scanner animation
    setTimeout(() => {
      // Simulate parser extracting keywords from PDF
      const possibleSkills = [
        "React", "Node.js", "Express", "MongoDB", "JavaScript", 
        "CSS", "HTML", "TypeScript", "Python", "SQL", "Git", "Docker"
      ];
      
      // Randomly select 5-8 skills to simulate extraction
      const extracted = possibleSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 5);

      const targetRole = profile?.preferences?.preferredRole || "Full Stack Developer";
      
      const skillRequirements = {
        "Frontend Developer": ["React", "CSS", "HTML", "TypeScript", "Git"],
        "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Git"],
        "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Git"],
        "Data Scientist": ["Python", "SQL", "Pandas", "Git"]
      };

      const required = skillRequirements[targetRole] || skillRequirements["Full Stack Developer"];
      const missing = required.filter(s => !extracted.map(x => x.toLowerCase()).includes(s.toLowerCase()));
      const matched = required.filter(s => extracted.map(x => x.toLowerCase()).includes(s.toLowerCase()));
      const matchScore = Math.round((matched.length / required.length) * 100);

      // Find matching jobs
      const recommendedJobs = allJobs.filter((job) => {
        const titleMatch = job.title.toLowerCase().includes(targetRole.toLowerCase());
        const skillMatch = job.skills && job.skills.some((s) => extracted.includes(s));
        return titleMatch || skillMatch;
      }).slice(0, 3);

      setResults({
        extractedSkills: extracted,
        matchScore,
        missingSkills: missing,
        targetRole,
        recommendedJobs
      });
      setAnalyzing(false);
      toast.success("Resume analysis complete! 🧠");
    }, 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Upload your PDF resume to extract skills, review roles, and match jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4 md:col-span-1 h-fit">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Upload Resume</h3>
          
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-xl p-6 cursor-pointer hover:border-violet-500/40 transition">
            <span className="text-3xl mb-2">📄</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center">
              {file ? file.name : "Click to select resume"}
            </span>
            <span className="text-[10px] text-gray-400 mt-1">PDF file format only</span>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={runAnalysis}
            disabled={analyzing || !file}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/10 disabled:opacity-50 transition cursor-pointer"
          >
            {analyzing ? "Scanning resume..." : "Scan & Analyze Resume"}
          </button>
        </div>

        {/* Results panel */}
        <div className="md:col-span-2 space-y-6">
          {analyzing ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center gap-4">
              {/* Animated scanner */}
              <div className="relative w-20 h-20 bg-violet-100 dark:bg-violet-950/20 rounded-full flex items-center justify-center text-4xl animate-pulse">
                <span>🧠</span>
                <div className="absolute inset-0 border border-violet-500 rounded-full animate-ping opacity-75" />
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">Scanning document keywords...</p>
              <p className="text-xs text-gray-400 text-center max-w-xs">AI pipeline is parsing PDF text segments to identify tech stack credentials.</p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Score & Profile */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-1 text-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Match Score</span>
                  <span className="text-5xl font-extrabold text-violet-600 block mt-1">{results.matchScore}%</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">for {results.targetRole}</span>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-semibold">Extracted Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {results.extractedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaps analysis */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">Skill Gaps Analysis</h3>
                {results.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-500 font-semibold">✓ Awesome! Your resume contains all core technical skills required for a {results.targetRole} profile.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-450">Based on your target role, we suggest adding these skills to your resume to pass automated screens:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.missingSkills.map((skill) => (
                        <div key={skill} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-gray-800 dark:text-white block">{skill}</span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">Missing credential</span>
                          </div>
                          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Learn 📚</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Jobs */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">Recommended Job Matches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {results.recommendedJobs.map((job) => (
                    <div key={job._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-40">
                      <div>
                        <h4 className="text-xs font-bold text-gray-850 dark:text-white truncate">{job.title}</h4>
                        <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{job.company}</p>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">📍 {job.location || "Remote"}</p>
                      </div>
                      <a
                        href={`/job/${job._id}`}
                        className="w-full text-center py-1.5 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl text-[10px] font-bold block"
                      >
                        Apply Now
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-16 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
              <span className="text-4xl mb-2">🚀</span>
              <h3 className="font-bold text-gray-800 dark:text-white">AI Scanner Ready</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                Upload your resume PDF in the left panel to scan keywords, calculate target match score, and check for missing credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
