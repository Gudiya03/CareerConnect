import { Link } from "react-router-dom";

const Register = () => {
  const options = [
    {
      to: "/register-candidate",
      title: "Register as Candidate",
      description: "Discover tech opportunities, complete coding assessments, build your profile, and apply with ease.",
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      borderColor: "hover:border-blue-500/40",
      btnColor: "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20",
    },
    {
      to: "/register-recruiter",
      title: "Register as Recruiter",
      description: "Post vacancies, track applicant profiles, schedule virtual interviews, and manage premium pipeline plans.",
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      borderColor: "hover:border-emerald-500/40",
      btnColor: "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-2xl text-center space-y-8 z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Join CareerConnect</h1>
          <p className="text-white/40 text-xs">Choose the option that aligns with your goals to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer border-transparent ${opt.borderColor}`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  {opt.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{opt.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{opt.description}</p>
                </div>
              </div>

              <Link to={opt.to} className="block mt-6">
                <button className={`w-full py-3 rounded-xl text-white font-semibold text-xs transition duration-200 shadow-md ${opt.btnColor} cursor-pointer`}>
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/30">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;