import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";

const JobApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/applications/job/${id}`);
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}`, { status });
      fetchApplicants();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      {applications.map((app) => (
        <div key={app._id} className="bg-gray-900 p-6 mb-6 rounded">
          <p>Email: {app.applicant?.email}</p>
          <p>Status: {app.status}</p>

          {app.applicant?.resume && (
            <a
              href={`http://localhost:5000/uploads/${app.applicant.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline"
            >
              View Resume
            </a>
          )}

          <div className="mt-4 space-x-4">
            <button
              onClick={() => updateStatus(app._id, "accepted")}
              className="bg-green-600 px-4 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => updateStatus(app._id, "rejected")}
              className="bg-red-600 px-4 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobApplicants;