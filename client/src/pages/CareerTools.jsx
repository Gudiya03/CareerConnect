import { useState, useEffect } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const CareerTools = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  
  // Quiz states
  const [quizTopic, setQuizTopic] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile details");
    }
  };

  // ── 1. AI RESUME ANALYZER LOGIC ──
  const getResumeAnalysis = () => {
    if (!profile) return { score: 0, recommendations: [] };

    let score = 25; // base score for registering
    const recommendations = [];

    if (profile.bio && profile.bio.length > 50) {
      score += 15;
    } else {
      recommendations.push("Expand your professional bio to at least 50 characters to showcase your background.");
    }

    if (profile.skills && profile.skills.length >= 5) {
      score += 20;
    } else {
      recommendations.push("List at least 5 core technical skills to improve your match rate.");
    }

    if (profile.education && profile.education.length > 0) {
      score += 15;
    } else {
      recommendations.push("Add your academic credentials (degree & university) to verify educational history.");
    }

    if (profile.experience && profile.experience.length > 0) {
      score += 15;
    } else {
      recommendations.push("Include at least one past work experience or personal project.");
    }

    if (profile.socialLinks?.linkedin && profile.socialLinks?.github) {
      score += 10;
    } else {
      recommendations.push("Link your GitHub and LinkedIn profiles to increase credibility for recruiters.");
    }

    return { score, recommendations };
  };

  // ── 2. AI SKILL GAP ANALYSIS LOGIC ──
  const skillRequirementsMap = {
    "Frontend Developer": ["React", "CSS", "HTML", "TypeScript", "Redux", "Webpack"],
    "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Redis", "Docker"],
    "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Git"],
    "Data Scientist": ["Python", "Pandas", "SQL", "Machine Learning", "Scikit-Learn", "Tableau"],
  };

  const getSkillGapAnalysis = () => {
    if (!profile) return { missing: [], matchPercentage: 0 };
    const required = skillRequirementsMap[targetRole] || [];
    const current = (profile.skills || []).map(s => s.toLowerCase());

    const missing = required.filter(s => !current.includes(s.toLowerCase()));
    const matchedCount = required.length - missing.length;
    const matchPercentage = required.length > 0 ? Math.round((matchedCount / required.length) * 100) : 0;

    const resourceSuggestions = {
      "React": "Meta Frontend Certificate on Coursera / React Docs",
      "TypeScript": "Understanding TypeScript on Udemy / Official TS Handbook",
      "Redux": "Modern Redux Toolkit Guide on Redux.js.org",
      "Node.js": "Node.js Complete Guide by Academind / Node.js Dev Center",
      "MongoDB": "MongoDB Basics Course on MongoDB Atlas Academy",
      "Docker": "Docker Mastery on Udemy / Docker Official Reference docs",
      "Python": "Python for Everybody Specialization on Coursera",
      "Machine Learning": "Stanford Machine Learning by Andrew Ng on Coursera",
      "SQL": "Complete SQL Bootcamp on Udemy / SQLbolt interactive lessons"
    };

    return {
      missing: missing.map(skill => ({
        name: skill,
        resource: resourceSuggestions[skill] || "Interactive tutorials on FreeCodeCamp / YouTube Crash Courses"
      })),
      matchPercentage
    };
  };

  // ── 3. AI INTERVIEW PREP DATA ──
  const interviewQuestions = [
    {
      topic: "React",
      q: "What is the virtual DOM and how does React reconciliation work?",
      a: "The virtual DOM is a lightweight JS representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it (diffing) with the previous virtual DOM tree, and updates only the changed nodes in the real DOM (reconciliation) for maximum performance."
    },
    {
      topic: "Node.js",
      q: "Explain the Event Loop in Node.js.",
      a: "Node.js runs on a single thread event loop. It executes non-blocking I/O operations by delegating tasks to the system kernel or Libuv's thread pool. The phases include timers, pending callbacks, poll (retrieves new I/O events), check (setImmediate), and close callbacks."
    },
    {
      topic: "System Design",
      q: "How does horizontal scaling differ from vertical scaling?",
      a: "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing machine. Horizontal scaling (scaling out) means adding more machines/servers to your pool, utilizing load balancers to distribute traffic, which provides better fault tolerance."
    }
  ];

  // ── 4. QUIZZES DATA ──
  const quizzes = {
    JavaScript: [
      { q: "Which of the following is correct about features of JavaScript?", options: ["It is a lightweight, interpreted programming language", "It is designed for creating network-centric applications", "All of the above", "None of the above"], ans: 2 },
      { q: "How can you get the type of a arguments passed to a function?", options: ["using typeof operator", "using getType function", "Both of the above", "None of the above"], ans: 0 },
      { q: "Which built-in method returns the calling string value converted to upper case?", options: ["toUpper()", "toUpperCase()", "changeCase(upper)", "None of the above"], ans: 1 },
      { q: "Which of the following function of Array object joins all elements of an array into a string?", options: ["concat()", "join()", "pop()", "map()"], ans: 1 },
      { q: "Which of the following is correct about undefined in JavaScript?", options: ["It is a primitive value", "It represents the absence of value", "typeof undefined is undefined", "All of the above"], ans: 3 }
    ],
    CSS: [
      { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], ans: 1 },
      { q: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["In the <body> section", "At the end of the document", "In the <head> section", "In the <meta> tags"], ans: 2 },
      { q: "Which CSS property controls the text size?", options: ["font-size", "text-size", "font-style", "size"], ans: 0 },
      { q: "How do you display hyperlinks without an underline?", options: ["a {text-decoration:none;}", "a {text-decoration:no-underline;}", "a {underline:none;}", "a {text-underline:none;}"], ans: 0 },
      { q: "Which CSS property is used to change the background color?", options: ["color", "bg-color", "background-color", "bgColor"], ans: 2 }
    ]
  };

  const startQuiz = (topic) => {
    setQuizTopic(topic);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    const currentQuiz = quizzes[quizTopic];
    if (selectedAnswer === currentQuiz[currentQuestionIdx].ans) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIdx + 1 < currentQuiz.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const { score: resumeScore, recommendations } = getResumeAnalysis();
  const { missing: gapSkills, matchPercentage } = getSkillGapAnalysis();

  return (
    <div className="w-full min-h-screen bg-[#080d22] bg-gradient-to-br from-[#080d22] via-[#040817] to-[#0c0e2b] text-white transition-colors duration-200 relative overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      <Toaster position="top-right" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 relative z-10">

        {/* Header banner */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            AI Career <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Tools</span> 👋
          </h1>
          <p className="text-blue-200/40 text-xs mt-1 max-w-xl">
            Leverage intelligence modules to audit your resume strength, track technical skill gaps, review interview question banks, and complete verified skill assessments.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-4">
          {[
            { id: "resume", label: "🔍 AI Resume Analyzer" },
            { id: "gap", label: "📊 Skill Gap Analysis" },
            { id: "interview", label: "❓ AI Interview Prep" },
            { id: "assess", label: "🏆 Skill Assessments" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-blue-200/40 hover:text-blue-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 1. AI RESUME ANALYZER TAB ── */}
        {activeTab === "resume" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl text-center flex flex-col justify-center items-center">
              <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider mb-2">Resume Score</p>
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-white/5">
                <span className="text-4xl font-extrabold text-blue-400">{resumeScore}</span>
                <span className="text-xs text-blue-200/40 absolute bottom-6 font-semibold">/ 100</span>
              </div>
              <p className="text-xs text-blue-200/40 mt-4 leading-relaxed max-w-[200px]">
                Scores are determined by profile sections completeness, social attachments and tech skills density.
              </p>
            </div>

            <div className="md:col-span-2 bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>💡</span> Improvement Recommendations
              </h3>
              {recommendations.length === 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-4 rounded-xl text-xs font-semibold">
                  ✓ Excellent job! Your profile details are fully complete and optimized.
                </div>
              ) : (
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-blue-200/50">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ── 2. AI SKILL GAP ANALYSIS TAB ── */}
        {activeTab === "gap" && (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Track Skills Against Roles</h3>
                <p className="text-xs text-blue-200/40 mt-0.5">Check matching percentage and study maps for standard roles</p>
              </div>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {Object.keys(skillRequirementsMap).map(role => (
                  <option key={role} value={role} className="bg-[#0f172a] text-white">{role}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-y border-white/5 py-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-wider mb-1">Match Rate</p>
                <h2 className="text-4xl font-extrabold text-emerald-400">{matchPercentage}%</h2>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <p className="text-xs text-blue-200/40">Match score progress bar:</p>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${matchPercentage}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-blue-300/80 uppercase tracking-wider">Recommended Study Paths</h4>
              {gapSkills.length === 0 ? (
                <p className="text-xs text-emerald-400 font-semibold">✓ You have all the matching skills required for a {targetRole} role!</p>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {gapSkills.map((skill, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full">
                          {skill.name}
                        </span>
                        <p className="text-xs text-blue-200/40 mt-2">
                          Missing in your profile. Recommended learning resource:
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-white mt-2 font-mono">
                        📖 {skill.resource}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 3. AI INTERVIEW PREP TAB ── */}
        {activeTab === "interview" && (
          <div className="space-y-4">
            {interviewQuestions.map((q, idx) => (
              <div key={idx} className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">
                    {q.topic}
                  </span>
                  <span className="text-[10px] text-blue-200/40 font-semibold font-mono">Mock QA Card</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">Q: {q.q}</h4>
                
                {/* Details collapsible answer */}
                <details className="group border-t border-white/5 pt-3">
                  <summary className="list-none flex justify-between items-center text-xs font-semibold text-blue-400 cursor-pointer select-none">
                    <span>Show Model Answer</span>
                    <span className="group-open:rotate-180 transition-transform duration-200">▼</span>
                  </summary>
                  <p className="text-xs text-blue-200/50 mt-2 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-dashed border-white/5">
                    {q.a}
                  </p>
                </details>
              </div>
            ))}
          </div>
        )}

        {/* ── 4. SKILL ASSESSMENTS TAB ── */}
        {activeTab === "assess" && (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
            {!quizTopic ? (
              /* Topic list */
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Verify Your Skills</h3>
                  <p className="text-xs text-blue-200/40 mt-0.5">Take a quick 5-question test. Pass to earn a verified skill badge on your profile!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(quizzes).map(topic => (
                    <div key={topic} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">{topic} Core Assessment</h4>
                        <p className="text-xs text-blue-200/40 mt-0.5">5 questions • 80% passing score</p>
                      </div>
                      <button
                        onClick={() => startQuiz(topic)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : quizFinished ? (
              /* Quiz Score summary */
              <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
                <span className="text-5xl block">🎉</span>
                <h3 className="text-lg font-bold text-white">Assessment Complete</h3>
                <p className="text-xs text-blue-200/40">
                  You scored <span className="font-bold text-blue-400 text-sm">{quizScore} / 5</span> correct answers.
                </p>

                {quizScore >= 4 ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-4 rounded-xl text-xs font-bold space-y-1">
                    <p>✓ Congratulations! You Passed!</p>
                    <p className="text-[10px] font-normal text-emerald-400/75">Verified "{quizTopic}" badge has been unlocked for your dashboard.</p>
                  </div>
                ) : (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-xs font-bold">
                    ✗ Passing score is 80% (4/5). Please study and try again later.
                  </div>
                )}

                <button
                  onClick={() => setQuizTopic(null)}
                  className="w-full py-2.5 border border-white/10 text-blue-200 rounded-xl text-xs font-bold hover:bg-white/5 transition cursor-pointer"
                >
                  Exit Assessment
                </button>
              </div>
            ) : (
              /* Quiz Questions loop */
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{quizTopic} Assessment</h3>
                  <span className="text-xs text-blue-200/40 font-semibold">Question {currentQuestionIdx + 1} of 5</span>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <p className="text-sm font-semibold text-white">
                    {quizzes[quizTopic][currentQuestionIdx].q}
                  </p>
                </div>

                <div className="space-y-2">
                  {quizzes[quizTopic][currentQuestionIdx].options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-colors
                        ${selectedAnswer === idx
                          ? "border-blue-500/30 bg-blue-500/5 text-white"
                          : "border-white/5 hover:bg-white/5 text-blue-200/70"
                        }`}
                    >
                      <input
                        type="radio"
                        name="quiz-opt"
                        checked={selectedAnswer === idx}
                        onChange={() => setSelectedAnswer(idx)}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setQuizTopic(null)}
                    className="flex-1 py-2.5 border border-white/10 text-blue-200 rounded-xl text-xs font-semibold hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel Quiz
                  </button>
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
                  >
                    {currentQuestionIdx === 4 ? "Submit Test" : "Next Question"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CareerTools;
