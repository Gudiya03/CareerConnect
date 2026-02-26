import { useState, useEffect, useRef } from "react";
import { API } from "../api/api";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const applicantsRef = useRef(null);

  // FETCH JOBS
  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  // VIEW APPLICANTS
  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 SCROLL AFTER RENDER (important)
  useEffect(() => {
    if (selectedJob && applicantsRef.current) {
      applicantsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedJob]);

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white pt-24 px-10">
      <h1 className="text-4xl font-bold mb-6 text-indigo-400">
        Employer Dashboard
      </h1>

      {/* JOB LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-indigo-400">{job.company}</p>

            <button
              onClick={() => viewApplicants(job._id)}
              className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              View Applicants
            </button>
          </div>
        ))}
      </div>

      {/* APPLICANTS SECTION */}
      {selectedJob && (
        <div ref={applicantsRef} className="mt-20">
          <h2 className="text-3xl mb-6">Applicants</h2>

          {applicants.length === 0 && (
            <p className="text-gray-400">No applicants yet</p>
          )}

          <div className="space-y-4">
            {applicants.map((a) => (
              <div
                key={a._id}
                className="bg-gray-900 p-5 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{a.applicant?.email}</p>
                  <p>Status: {a.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;