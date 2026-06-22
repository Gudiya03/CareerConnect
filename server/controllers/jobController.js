
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const SystemSetting = require("../models/SystemSetting");
const jwt = require("jsonwebtoken");




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

    // Fetch system settings
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }

    // 1. Check recruiter verification setting
    if (settings.requireRecruiterVerification) {
      const user = await User.findById(req.user.id);
      if (!user || !user.isVerifiedRecruiter) {
        return res.status(403).json({
          message: "Access denied. Your recruiter account must be verified by an administrator before posting jobs."
        });
      }
    }

    // 2. Check maximum free job postings limit
    const user = await User.findById(req.user.id);
    if (user && user.subscriptionPlan === "free") {
      const activeJobsCount = await Job.countDocuments({ postedBy: req.user.id });
      if (activeJobsCount >= settings.maxFreeJobs) {
        return res.status(403).json({
          message: `Job posting limit reached. Free accounts are limited to ${settings.maxFreeJobs} jobs. Please upgrade to Premium.`
        });
      }
    }

    // 3. Determine initial approval status
    const isApproved = !settings.requireJobApproval;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      description,
      postedBy: req.user.id,
      isApproved
    });

    res.json(job);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error posting job" });
  }
};


// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    // Manually check for auth token to identify user role
    const authHeader = req.headers.authorization;
    let currentUser = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUser = await User.findById(decoded.id);
      } catch (e) {
        // ignore jwt decode errors
      }
    }

    let query = {};

    if (currentUser && currentUser.role === "admin") {
      // Admins see everything
      if (req.query.all === "true") {
        query = {};
      } else if (req.query.approved === "false") {
        query = { isApproved: false };
      } else {
        query = { isApproved: true };
      }
    } else if (currentUser && currentUser.role === "employer") {
      // Employers see only their own jobs
      query = { postedBy: currentUser._id };
    } else {
      // Candidates and guests see only approved jobs from verified recruiters or admins
      query = { isApproved: true };

      const allowedPosters = await User.find({
        $or: [
          { role: "admin" },
          { role: "employer", isVerifiedRecruiter: true }
        ]
      }).select("_id");
      const allowedPosterIds = allowedPosters.map((u) => u._id);
      query.postedBy = { $in: allowedPosterIds };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

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


// GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id).populate("postedBy", "name email role companyName isVerifiedRecruiter");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Restrict access if the recruiter is unverified and user is not owner/admin
    const poster = job.postedBy;
    if (poster && poster.role === "employer" && !poster.isVerifiedRecruiter) {
      const authHeader = req.headers.authorization;
      let currentUser = null;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          currentUser = await User.findById(decoded.id);
        } catch (e) {
          // ignore
        }
      }

      const isOwner = currentUser && currentUser._id.toString() === poster._id.toString();
      const isAdmin = currentUser && currentUser.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message: "This job is currently unavailable as the recruiter's account is pending verification."
        });
      }
    }

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

    res.json({
      ...job._doc,
      applicantsCount,
      acceptedCount,
      pendingCount
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
};


// SAVE / UNSAVE JOB
exports.saveJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const userId = req.user.id.toString();

    if (!job.savedBy) {
      job.savedBy = [];
    }

    const alreadySaved = job.savedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadySaved) {

      job.savedBy = job.savedBy.filter(
        (id) => id.toString() !== userId
      );

      await job.save();

      return res.json({ saved: false });

    } else {

      job.savedBy.push(userId);

      await job.save();

      return res.json({ saved: true });

    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save job error" });
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
    job.jobType = req.body.jobType || job.jobType;
    job.experience = req.body.experience || job.experience;
    job.description = req.body.description || job.description;
    job.skills = req.body.skills || job.skills;
    job.status = req.body.status || job.status;

    await job.save();

    res.json(job);

  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
};

