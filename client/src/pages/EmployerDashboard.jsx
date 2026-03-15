import { useState, useEffect, useRef } from "react";

import { API } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import toast, { Toaster } from "react-hot-toast";

const EmployerDashboard = () => {

const [jobs,setJobs] = useState([]);
const [applicants,setApplicants] = useState([]);
const [selectedJob,setSelectedJob] = useState(null);

const [showForm,setShowForm] = useState(false);
const [showEdit,setShowEdit] = useState(false);

const [search,setSearch] = useState("");

const [editJob,setEditJob] = useState(null);

const [title,setTitle] = useState("");
const [company,setCompany] = useState("");
const [location,setLocation] = useState("");
const [salary,setSalary] = useState("");
const [experience,setExperience] = useState("");
const [skills,setSkills] = useState("");
const [description,setDescription] = useState("");

const applicantsRef = useRef(null);

/* ================= FETCH JOBS ================= */

const fetchJobs = async ()=>{
  try{
    const res = await API.get("/jobs");
    setJobs(res.data);
  }catch(err){
    console.error(err);
  }
};

useEffect(()=>{
  fetchJobs();
},[]);

/* ================= POST JOB ================= */

const postJob = async () => {

  try {

    if (!title || !company) {
      toast.error("Title and company required");
      return;
    }

    await API.post("/jobs", {
      title,
      company,
      location,
      salary,
      jobType:"Full-Time",
      experience,
      skills: skills ? skills.split(",") : [],
      description
    });

    toast.success("Job posted successfully");

    setTitle("");
    setCompany("");
    setLocation("");
    setSalary("");
    setExperience("");
    setSkills("");
    setDescription("");

    setShowForm(false);

    fetchJobs();

  } catch (err) {

    toast.error("Job post failed");

  }

};

/* ================= DELETE JOB ================= */

const deleteJob = async(id)=>{

try{

await API.delete(`/jobs/${id}`);

toast.success("Job deleted");

setJobs(jobs.filter(j=>j._id !== id));

}catch(err){

toast.error("Delete failed")

}

};

/* ================= OPEN EDIT ================= */

const openEdit = (job)=>{

setEditJob(job);

setTitle(job.title);
setCompany(job.company);
setLocation(job.location);
setSalary(job.salary);
setExperience(job.experience);
setSkills(job.skills?.join(","));
setDescription(job.description);

setShowEdit(true);

};

/* ================= UPDATE JOB ================= */

const updateJob = async()=>{

try{

await API.put(`/jobs/${editJob._id}`,{
title,
company,
location,
salary,
experience,
skills: skills.split(","),
description
});

toast.success("Job updated");

setShowEdit(false);

fetchJobs();

}catch(err){

toast.error("Update failed")

}

};

/* ================= VIEW APPLICANTS ================= */

const viewApplicants = async(jobId)=>{

try{

const res = await API.get(`/applications/job/${jobId}`);

setApplicants([...res.data]);
setSelectedJob(jobId);

}catch(err){

toast.error("Failed to load applicants");

}

};

/* ================= UPDATE STATUS ================= */

const updateStatus = async(appId,status)=>{

await API.put(`/applications/${appId}`,{status});

toast.success("Status updated");

viewApplicants(selectedJob);

};

useEffect(()=>{
if(selectedJob && applicantsRef.current){
applicantsRef.current.scrollIntoView({behavior:"smooth"});
}
},[selectedJob]);

/* ================= SEARCH FILTER ================= */

const filteredJobs = jobs.filter((job)=>
job.title.toLowerCase().includes(search.toLowerCase()) ||
job.company.toLowerCase().includes(search.toLowerCase())
);

/* ================= CHART DATA ================= */

const chartData = jobs.map(job=>({
name: job.title,
applicants: job.applicantsCount || 0
}));

return (

<div className="min-h-screen flex bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white">


<Toaster/>

{/* MAIN CONTENT */}

<div className="flex-1 pt-12 px-4 md:px-8 space-y-8 max-w-7xl mx-auto w-full">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

<div>

<h1 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
Employer Dashboard
</h1>

<p className="text-gray-500 dark:text-gray-400">
Manage jobs and applicants
</p>

</div>

<button
onClick={()=>setShowForm(!showForm)}
className="bg-indigo-600 px-6 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
>
Post Job
</button>

</div>

{/* POST JOB FORM */}

{showForm && (

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">

<h2 className="text-xl font-semibold mb-4">
Post New Job
</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
placeholder="Job Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<input
placeholder="Company"
value={company}
onChange={(e)=>setCompany(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<input
placeholder="Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<input
placeholder="Salary"
value={salary}
onChange={(e)=>setSalary(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<input
placeholder="Experience"
value={experience}
onChange={(e)=>setExperience(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<input
placeholder="Skills (React,Node)"
value={skills}
onChange={(e)=>setSkills(e.target.value)}
className="p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

</div>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="w-full mt-4 p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

<button
onClick={postJob}
className="mt-4 bg-indigo-600 px-6 py-2 rounded text-white hover:bg-indigo-700 transition"
>
Publish Job
</button>

</div>

)}

{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
<p className="text-gray-500 text-sm">Total Jobs</p>
<h2 className="text-3xl font-bold">{jobs.length}</h2>
</div>

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
<p className="text-gray-500 text-sm">Applicants</p>
<h2 className="text-3xl font-bold">
{jobs.reduce((acc,j)=>acc+(j.applicantsCount||0),0)}
</h2>
</div>

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
<p className="text-gray-500 text-sm">Active Jobs</p>
<h2 className="text-3xl font-bold">{jobs.length}</h2>
</div>

</div>

{/* SEARCH */}

<input
placeholder="Search jobs..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full md:w-96 p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
/>

{/* ANALYTICS */}

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Applications Overview
</h2>

<ResponsiveContainer width="100%" height={250}>
<BarChart data={chartData}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="applicants" fill="#6366f1"/>
</BarChart>
</ResponsiveContainer>

</div>

{/* JOB TABLE */}

<div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto shadow-sm">

<table className="w-full">

<thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">

<tr>
<th className="p-4 text-left">Title</th>
<th className="p-4 text-left">Company</th>
<th className="p-4 text-left">Applicants</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Actions</th>
</tr>

</thead>

<tbody>

{filteredJobs.map(job => (

<tr key={job._id} className="border-t border-gray-200 dark:border-slate-700">

<td className="p-4 font-semibold">{job.title}</td>

<td className="p-4 text-indigo-500">{job.company}</td>

<td className="p-4">{job.applicantsCount || 0}</td>

<td className="p-4">

<span
className={`text-xs px-2 py-1 rounded ${
job.acceptedCount > 0
? "bg-purple-600 text-white"
: job.applicantsCount > 0
? "bg-green-600 text-white"
: "bg-yellow-500 text-black"
}`}
>
{job.acceptedCount > 0 ? "Hiring" : job.applicantsCount > 0 ? "Active" : "Open"}
</span>

</td>

<td className="p-4 space-x-2">

<button
onClick={()=>viewApplicants(job._id)}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Applicants
</button>

<button
onClick={()=>openEdit(job)}
className="bg-blue-600 text-white px-3 py-1 rounded"
>
Edit
</button>

<button
onClick={()=>deleteJob(job._id)}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* APPLICANTS */}

{selectedJob && (

<div ref={applicantsRef} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Applicants
</h2>

{applicants.map(a => (

<div key={a._id} className="flex justify-between items-center bg-gray-100 dark:bg-slate-800 p-4 rounded mb-3">

<div>

<p className="font-semibold">{a.applicant?.email}</p>

<span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
{a.status}
</span>

</div>

<div className="space-x-2">

<button
onClick={()=>updateStatus(a._id,"accepted")}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Accept
</button>

<button
onClick={()=>updateStatus(a._id,"rejected")}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Reject
</button>

</div>

</div>

))}

</div>

)}

</div>
</div>

);
};

export default EmployerDashboard;