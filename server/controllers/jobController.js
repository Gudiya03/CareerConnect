// const Job = require("../models/Job");

// // GET ALL JOBS
// const getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // CREATE JOB
// const createJob = async (req, res) => {
//   const { title, company, location, description } = req.body;

//   const job = await Job.create({
//     title,
//     company,
//     location,
//     description,
//     createdBy: req.user, // optional
//   });

//   res.status(201).json(job);
// };

// // 🔥 ADD THIS FUNCTION
// const getMyJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ createdBy: req.user });
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   getJobs,
//   createJob,
//   getMyJobs,
// };


const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const { title, company, description } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      postedBy: req.user.id,
    });

    res.json(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error posting job" });
  }
};

// GET JOBS
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};