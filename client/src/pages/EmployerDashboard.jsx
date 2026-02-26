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

    if (!title || !company) return;

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
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      console.log(err);
    }
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
    <div className="w-full min-h-screen bg-[#020617] text-white pt-24 px-10">

      <h1 className="text-4xl font-bold mb-6 text-indigo-400">
        Employer Dashboard
      </h1>

      {/* POST JOB */}
      <button
        onClick={postJob}
        className="bg-indigo-600 px-5 py-2 rounded mb-10 hover:bg-indigo-700"
      >
        Post Job
      </button>

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
        <div className="mt-16">
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
                  {/* 🔥 FIXED FIELD NAME */}
                  <p className="font-semibold">{a.applicant?.email}</p>
                  <p>Status: {a.status}</p>

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
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;