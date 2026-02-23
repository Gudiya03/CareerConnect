const Application = require("../models/Application");


// ============================
// APPLY TO JOB (CANDIDATE)
// ============================
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // prevent duplicate apply
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      status: "pending",
    });

    res.json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    console.log("APPLY ERROR:", error);
    res.status(500).json({ message: "Apply error" });
  }
};



// ============================
// GET MY APPLICATIONS (CANDIDATE)
// ============================
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      applicant: req.user._id,
    }).populate("job");

    res.json(apps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching applications" });
  }
};



// ============================
// GET APPLICANTS FOR A JOB (EMPLOYER)
// ============================
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "email resume");

    res.json(applications);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching applicants" });
  }
};



// ============================
// UPDATE STATUS (EMPLOYER)
// ============================
exports.updateStatus = async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body; // accepted / rejected

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Status updated",
      application,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Status update error" });
  }
};