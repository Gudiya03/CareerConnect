const JobCard = ({ job, onApply }) => {
  return (
    <div className="group relative bg-white dark:bg-[#13131f] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(99,102,241,0.13)] hover:border-indigo-200 dark:hover:border-indigo-500/25">

      {/* Top accent bar */}
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* ── TOP ROW: logo + badge ── */}
      <div className="flex items-start justify-between gap-3 mb-4">

        {/* Company logo */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-400/15 border border-indigo-500/15 dark:border-indigo-400/20 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 text-base font-bold"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {job.company?.charAt(0).toUpperCase() || "J"}
        </div>

        {/* Job type badge */}
        <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 whitespace-nowrap flex-shrink-0">
          {job.jobType || job.type || "Full-time"}
        </span>
      </div>

      {/* ── TITLE + COMPANY ── */}
      <h2 className="text-[16px] sm:text-[17px] font-bold text-gray-900 dark:text-[#f0eeff] tracking-tight leading-snug mb-1"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        {job.title}
      </h2>
      <p className="text-[13px] font-medium text-indigo-500 dark:text-indigo-400 mb-4">
        {job.company}
      </p>

      {/* ── META: location / experience / date ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">

        {job.location && (
          <span className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
        )}

        {job.experience && (
          <span className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            {job.experience}
          </span>
        )}

        {job.postedAt && (
          <span className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {job.postedAt}
          </span>
        )}
      </div>

      {/* Skills chips (if present) */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.06] text-gray-400">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-4" />

      {/* ── FOOTER: salary + apply ── */}
      <div className="flex items-center justify-between gap-3">

        {/* Salary */}
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 truncate">
            {job.salary || "Competitive"}
            {job.salary && <span className="text-[12px] font-normal text-gray-400 ml-1">/ yr</span>}
          </p>
        </div>

        {/* Apply button */}
        <button
          onClick={() => onApply(job._id)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white text-[13px] font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-indigo-500/35 active:translate-y-0 transition-all duration-150 whitespace-nowrap flex-shrink-0"
        >
          Apply Now
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-0.5 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default JobCard;