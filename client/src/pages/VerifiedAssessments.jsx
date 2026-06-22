import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const formInput =
  "w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all";

const VerifiedAssessments = () => {
  const [profile, setProfile] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const assessmentTopics = {
    JavaScript: {
      skill: "JavaScript",
      questions: [
        {
          type: "mcq",
          q: "What will `console.log(typeof NaN)` output in JavaScript?",
          options: ["number", "NaN", "undefined", "object"],
          ans: 0
        },
        {
          type: "mcq",
          q: "Which method is used to remove the last element from an array?",
          options: ["shift()", "pop()", "slice()", "push()"],
          ans: 1
        },
        {
          type: "code",
          q: "Write a function `reverseString(str)` that returns the reversed string. Example: reverseString('hello') should return 'olleh'.",
          verify: (code) => {
            try {
              // Simple sandboxed eval to verify function behavior
              const fn = new Function(`
                ${code}
                return typeof reverseString === 'function' && reverseString('hello') === 'olleh';
              `);
              return fn();
            } catch {
              return false;
            }
          }
        }
      ]
    },
    Python: {
      skill: "Python",
      questions: [
        {
          type: "mcq",
          q: "Which data type in Python is mutable?",
          options: ["tuple", "string", "list", "int"],
          ans: 2
        },
        {
          type: "mcq",
          q: "How do you start a comments block in Python?",
          options: ["//", "#", "/*", "<!--"],
          ans: 1
        },
        {
          type: "code",
          q: "Write a Python-style expression or JS function `isEven(num)` that returns true if a number is even, and false otherwise.",
          verify: (code) => {
            try {
              const fn = new Function(`
                ${code}
                return typeof isEven === 'function' && isEven(4) === true && isEven(7) === false;
              `);
              return fn();
            } catch {
              return false;
            }
          }
        }
      ]
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch {}
  };

  const startAssessment = (topic) => {
    setActiveTopic(topic);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setCodeAnswer("");
    setScore(0);
    setFinished(false);
  };

  const handleNext = () => {
    const topicData = assessmentTopics[activeTopic];
    const currentQ = topicData.questions[currentIdx];

    let isCorrect = false;
    if (currentQ.type === "mcq") {
      if (selectedOpt === currentQ.ans) isCorrect = true;
    } else if (currentQ.type === "code") {
      isCorrect = currentQ.verify(codeAnswer);
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentIdx + 1 < topicData.questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setCodeAnswer("");
    } else {
      calculateFinalResults(isCorrect ? score + 1 : score);
    }
  };

  const calculateFinalResults = async (finalScore) => {
    setFinished(true);
    const topicData = assessmentTopics[activeTopic];
    const totalQ = topicData.questions.length;
    const pct = Math.round((finalScore / totalQ) * 100);

    if (pct >= 66) { // Passed 2 out of 3 questions
      const passedSkill = topicData.skill;
      const currentSkills = profile?.skills || [];
      
      if (!currentSkills.map(s => s.toLowerCase()).includes(passedSkill.toLowerCase())) {
        try {
          setSubmitting(true);
          const updatedSkills = [...currentSkills, passedSkill];
          await API.put("/auth/profile/update", { skills: updatedSkills });
          toast.success(`Congratulations! You passed and unlocked the "${passedSkill}" skill badge! 🏆`);
          fetchProfile();
        } catch {
          toast.error("Failed to update profile skills badge");
        } finally {
          setSubmitting(false);
        }
      } else {
        toast.success("Assessment passed! You already have this skill badge on your profile.");
      }
    } else {
      toast.error("Assessment failed. Score at least 66% to unlock the skill badge.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Skill Assessments
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Take verified MCQ and programming tests to earn official profile skill badges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Topics */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4 md:col-span-1 h-fit">
          <h3 className="text-sm font-bold text-gray-850 dark:text-white">Topics Catalog</h3>
          <div className="space-y-2">
            {Object.keys(assessmentTopics).map((topic) => {
              const hasBadge = profile?.skills?.map(s => s.toLowerCase()).includes(assessmentTopics[topic].skill.toLowerCase());
              return (
                <button
                  key={topic}
                  onClick={() => startAssessment(topic)}
                  disabled={activeTopic === topic && !finished}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex justify-between items-center transition cursor-pointer ${
                    activeTopic === topic && !finished
                      ? "bg-violet-600 text-white border-violet-500"
                      : "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 hover:border-violet-500/20 text-gray-800 dark:text-white"
                  }`}
                >
                  <span>{topic} Test</span>
                  {hasBadge ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Verified Badge</span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Unlock Badge</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assessment board */}
        <div className="md:col-span-2">
          {activeTopic ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
              {finished ? (
                <div className="text-center py-10 space-y-4">
                  <span className="text-5xl">
                    {Math.round((score / assessmentTopics[activeTopic].questions.length) * 100) >= 66 ? "🎉" : "😢"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-850 dark:text-white">Assessment Finished</h3>
                  <p className="text-sm">
                    Your Score: <span className="font-extrabold text-violet-600">{score}</span> / {assessmentTopics[activeTopic].questions.length} questions
                  </p>
                  <p className="text-xs text-gray-450 max-w-xs mx-auto">
                    {Math.round((score / assessmentTopics[activeTopic].questions.length) * 100) >= 66
                      ? "Excellent! You passed the assessment and unlocked the official skills badge on your profile card."
                      : "You did not score the minimum 66% required to unlock the badge. Review the topic and try again later."}
                  </p>
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Back to Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress info */}
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800/80">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Question {currentIdx + 1} of {assessmentTopics[activeTopic].questions.length}
                    </span>
                    <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">
                      {activeTopic} Assessment
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {assessmentTopics[activeTopic].questions[currentIdx].q}
                    </h3>

                    {/* MCQ Option render */}
                    {assessmentTopics[activeTopic].questions[currentIdx].type === "mcq" && (
                      <div className="space-y-2.5">
                        {assessmentTopics[activeTopic].questions[currentIdx].options.map((opt, idx) => (
                          <label
                            key={idx}
                            className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition cursor-pointer select-none ${
                              selectedOpt === idx
                                ? "bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-400"
                                : "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-850/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="radio"
                              name="mcq"
                              checked={selectedOpt === idx}
                              onChange={() => setSelectedOpt(idx)}
                              className="accent-violet-600"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Programming Code Editor render */}
                    {assessmentTopics[activeTopic].questions[currentIdx].type === "code" && (
                      <div className="space-y-3">
                        <textarea
                          rows="6"
                          value={codeAnswer}
                          onChange={(e) => setCodeAnswer(e.target.value)}
                          placeholder="// Write JavaScript code function here... \nfunction reverseString(str) {\n  \n}"
                          className={`${formInput} font-mono`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-slate-800/80">
                    <button
                      onClick={handleNext}
                      disabled={
                        assessmentTopics[activeTopic].questions[currentIdx].type === "mcq"
                          ? selectedOpt === null
                          : !codeAnswer.trim()
                      }
                      className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-violet-500/10 disabled:opacity-50 cursor-pointer"
                    >
                      {currentIdx + 1 === assessmentTopics[activeTopic].questions.length
                        ? "Finish Assessment"
                        : "Next Question"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-16 text-center text-gray-400">
              <span className="text-4xl block mb-2">🏆</span>
              <h3 className="font-bold text-gray-800 dark:text-white">Verified Skill Assessments</h3>
              <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed">
                Select a topic from the left catalog to start the verified MCQ and programming tests. Pass to unlock official skill badges on your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedAssessments;
