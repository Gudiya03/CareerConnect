
import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const EmployerApplicants = () => {

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  // fetch applicants
  const fetchApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setSelectedJob(jobId);
    } catch {
      toast.error("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // update status
  const updateStatus = async (id, status) => {
    try {

      await API.put(`/applications/${id}`, { status });

      toast.success("Status updated");

      if (selectedJob) {
        fetchApplicants(selectedJob);
      }

    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Applicants
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Select a job to view applicants
        </p>
      </div>

      {/* JOB SELECT */}

      <div className="flex gap-4 flex-wrap">

        {jobs.map((job) => (
          <button
            key={job._id}
            onClick={() => fetchApplicants(job._id)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white transition"
          >
            {job.title}
          </button>
        ))}

      </div>

      {/* APPLICANTS TABLE */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto">

        <table className="w-full">

          {/* HEADER */}

          <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-400">

            <tr>
              <th className="p-4 text-left">Candidate</th>
              <th className="p-4 text-left">Resume</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>

          </thead>

          {/* BODY */}

          <tbody>

            {applicants.length === 0 ? (

              <tr>
                <td className="p-6 text-gray-500 dark:text-gray-400" colSpan="4">
                  No applicants yet
                </td>
              </tr>

            ) : (

              applicants.map((app) => (

                <tr
                  key={app._id}
                  className="border-t border-gray-200 dark:border-slate-700"
                >

                  {/* EMAIL */}

                  <td className="p-4 text-gray-800 dark:text-gray-200">
                    {app.applicant?.email}
                  </td>

                  {/* RESUME */}

                  <td className="p-4">

                    {app.resume ? (

                      <a
                        href={`${import.meta.env.VITE_API_URL.replace("/api","")}/${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Download Resume
                      </a>

                    ) : (

                      <span className="text-gray-400">
                        No Resume
                      </span>

                    )}

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded text-xs font-medium
                      ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white"
                      }`}
                    >
                      {app.status}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4 space-x-2">

                    <button
                      onClick={() => updateStatus(app._id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Reject
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default EmployerApplicants;

