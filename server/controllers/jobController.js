const Job = require("../models/Job");
const Application = require("../models/Application");


// CREATE JOB
exports.createJob = async (req, res) => {
  try {

    const {
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      description
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      description,
      postedBy: req.user.id
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

    const jobs = await Job.find().sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {

        const applicantsCount = await Application.countDocuments({
          job: job._id
        });

        const acceptedCount = await Application.countDocuments({
          job: job._id,
          status: "accepted"
        });

        const pendingCount = await Application.countDocuments({
          job: job._id,
          status: "pending"
        });

        return {
          ...job._doc,
          applicantsCount,
          acceptedCount,
          pendingCount
        };

      })
    );

    res.json(jobsWithCounts);

  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};



// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting job" });
  }
};
// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.title = req.body.title || job.title;
    job.company = req.body.company || job.company;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    job.experience = req.body.experience || job.experience;
    job.description = req.body.description || job.description;
    job.skills = req.body.skills || job.skills;

    await job.save();

    res.json(job);

  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
};

