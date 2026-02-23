const JobCard = ({ job, onApply }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>

      <button
        onClick={() => onApply(job._id)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;