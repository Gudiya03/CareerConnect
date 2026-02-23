import { useState, useEffect } from "react";
import { API } from "../api/api";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // POST JOB
  const postJob = async () => {
    const title = prompt("Job title:");
    const company = prompt("Company:");
    const description = prompt("Description:");

    await API.post("/jobs", { title, company, description });
    fetchJobs();
  };

  // FETCH JOBS
  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  // VIEW APPLICANTS
  const viewApplicants = async (jobId) => {
    const res = await API.get(`/applications/job/${jobId}`);
    setApplicants(res.data);
    setSelectedJob(jobId);
  };

  // UPDATE STATUS
  const updateStatus = async (appId, status) => {
    await API.put(`/applications/${appId}`, { status });
    viewApplicants(selectedJob);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">
        Employer Dashboard
      </h1>

      {/* POST JOB */}
      <button
        onClick={postJob}
        className="bg-indigo-600 px-4 py-2 rounded mb-6"
      >
        Post Job
      </button>

      {/* JOB LIST */}
      {jobs.map((job) => (
        <div key={job._id} className="bg-gray-800 p-5 mb-4 rounded">
          <h2 className="text-xl">{job.title}</h2>
          <p className="text-indigo-400">{job.company}</p>

          <button
            onClick={() => viewApplicants(job._id)}
            className="mt-3 bg-green-600 px-3 py-1 rounded"
          >
            View Applicants
          </button>
        </div>
      ))}

      {/* APPLICANTS SECTION */}
      {selectedJob && (
        <div className="mt-10">
          <h2 className="text-2xl mb-4">Applicants</h2>

          {applicants.map((a) => (
            <div
              key={a._id}
              className="bg-gray-800 p-4 mb-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{a.applicant.email}</p>
                <p>Status: {a.status}</p>

                {/* 🔥 RESUME BUTTON */}
                {a.applicant?.resume && (
                  <a
                    href={`http://localhost:5000/uploads/${a.applicant.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline"
                  >
                    View Resume
                  </a>
                )}
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => updateStatus(a._id, "accepted")}
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(a._id, "rejected")}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;