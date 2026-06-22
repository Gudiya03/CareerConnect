const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


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

      // ⭐ SAVE RESUME FILE PATH
      resume: req.file ? req.file.path : null
    });

    // Send email notifications
    const targetJob = await Job.findById(jobId).populate("postedBy", "name email");
    if (targetJob) {
      // 1. Recruiter Alert
      if (targetJob.postedBy && targetJob.postedBy.email) {
        sendEmail({
          to: targetJob.postedBy.email,
          subject: `New Application: ${targetJob.title}`,
          html: `
            <h3>Hello ${targetJob.postedBy.name},</h3>
            <p>You have received a new application for the position of <strong>${targetJob.title}</strong> at ${targetJob.company}.</p>
            <p>Applicant: <strong>${req.user.name}</strong> (${req.user.email})</p>
            <p>Please log in to your recruiter dashboard to audit candidate profiles and update the hiring state.</p>
          `
        });
      }

      // 2. Candidate Alert
      sendEmail({
        to: req.user.email,
        subject: `Application Confirmation: ${targetJob.title}`,
        html: `
          <h3>Hello ${req.user.name},</h3>
          <p>This email confirms that you have successfully applied for the role of <strong>${targetJob.title}</strong> at ${targetJob.company}.</p>
          <p>Recruiters are currently auditing applicants. We will notify you immediately once there is a status update.</p>
          <p>Best regards,<br/>CareerConnect Team</p>
        `
      });
    }

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

    const application = await Application.findById(appId).populate("applicant", "name email").populate("job", "title company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // Trigger Nodemailer status update email
    if (application.applicant && application.applicant.email && application.job) {
      const isAccepted = status === "accepted";
      const subject = isAccepted
        ? `Congratulations! You've been accepted for ${application.job.title}`
        : `Update on your application for ${application.job.title}`;
      
      const emailHtml = isAccepted
        ? `
          <h3>Hello ${application.applicant.name},</h3>
          <p>We have exciting news! The recruiter for <strong>${application.job.company}</strong> has updated your application status for the role of <strong>${application.job.title}</strong> to <strong>Accepted</strong>! 🎉</p>
          <p>They will contact you shortly regarding the next steps in the interview/offer process.</p>
          <p>Best regards,<br/>CareerConnect Team</p>
        `
        : `
          <h3>Hello ${application.applicant.name},</h3>
          <p>Thank you for your interest in the position of <strong>${application.job.title}</strong> at ${application.job.company}.</p>
          <p>Unfortunately, the recruiter has decided not to move forward with your application at this time. We encourage you to keep applying to other matching opportunities on the portal!</p>
          <p>Best regards,<br/>CareerConnect Team</p>
        `;

      sendEmail({
        to: application.applicant.email,
        subject,
        html: emailHtml
      });
    }

    res.json({
      message: "Status updated",
      application,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Status update error" });
  }
};