import { useEffect, useState } from "react";
import { API } from "../api/api";
import toast from "react-hot-toast";

const EmployerJobs = () => {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");

      setJobs(jobs.filter((job) => job._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Jobs
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Manage all posted jobs here
        </p>
      </div>

      {/* JOB TABLE */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto">

        <table className="w-full">

          {/* HEADER */}

          <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-400">

            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Applicants</th>
              <th className="p-4 text-left">Actions</th>
            </tr>

          </thead>

          {/* BODY */}

          <tbody>

            {jobs.length === 0 ? (

              <tr>
                <td colSpan="5" className="p-6 text-gray-500 dark:text-gray-400">
                  No jobs posted yet
                </td>
              </tr>

            ) : (

              jobs.map((job) => (

                <tr
                  key={job._id}
                  className="border-t border-gray-200 dark:border-slate-700"
                >

                  <td className="p-4 font-semibold text-gray-800 dark:text-white">
                    {job.title}
                  </td>

                  <td className="p-4 text-indigo-600 dark:text-indigo-400">
                    {job.company}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-300">
                    {job.location}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-300">
                    {job.applicantsCount || 0}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => deleteJob(job._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Delete
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

export default EmployerJobs;