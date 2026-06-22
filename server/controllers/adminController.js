const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SystemSetting = require("../models/SystemSetting");

// ================= STATS =================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const candidateCount = await User.countDocuments({ role: "candidate" });
    const employerCount = await User.countDocuments({ role: "employer" });
    const adminCount = await User.countDocuments({ role: "admin" });

    const recentUsers = await User.find().select("-password").sort({ createdAt: -1 }).limit(5);
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        candidateCount,
        employerCount,
        adminCount
      },
      recentUsers,
      recentJobs
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

// ================= USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!["candidate", "employer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cascading delete
    if (user.role === "employer") {
      const jobs = await Job.find({ postedBy: user._id });
      for (const job of jobs) {
        await Application.deleteMany({ job: job._id });
      }
      await Job.deleteMany({ postedBy: user._id });
    }

    await Application.deleteMany({ applicant: user._id });
    await user.deleteOne();
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ================= JOBS =================
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job" });
  }
};

// ================= APPLICATIONS =================
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// ================= SPECIFIC GATES & BLOCKS =================
exports.verifyRecruiter = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isVerifiedRecruiter = true;
    await user.save();
    res.json({ message: "Recruiter account approved successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error verifying recruiter" });
  }
};

exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.isApproved = true;
    await job.save();
    res.json({ message: "Job post approved successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error approving job" });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User account ${user.isBlocked ? "blocked" : "unblocked"} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: "Error toggling user block status" });
  }
};

// ================= SETTINGS =================
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching system settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = new SystemSetting({});
    }
    if (req.body.requireJobApproval !== undefined) settings.requireJobApproval = req.body.requireJobApproval;
    if (req.body.requireRecruiterVerification !== undefined) settings.requireRecruiterVerification = req.body.requireRecruiterVerification;
    if (req.body.maxFreeJobs !== undefined) settings.maxFreeJobs = req.body.maxFreeJobs;
    if (req.body.allowCandidateResumeUpload !== undefined) settings.allowCandidateResumeUpload = req.body.allowCandidateResumeUpload;

    await settings.save();
    res.json({ message: "Settings updated successfully", settings });
  } catch (err) {
    res.status(500).json({ message: "Error updating settings" });
  }
};

// ================= STATS TRENDS =================
exports.getStatsTrends = async (req, res) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      });
    }

    const registrationTrends = await Promise.all(
      months.map(async (m) => {
        const candidates = await User.countDocuments({
          role: "candidate",
          createdAt: { $gte: m.start, $lte: m.end }
        });
        const employers = await User.countDocuments({
          role: "employer",
          createdAt: { $gte: m.start, $lte: m.end }
        });
        return {
          month: m.name,
          Candidates: candidates,
          Employers: employers,
          Total: candidates + employers
        };
      })
    );

    const jobTrends = await Promise.all(
      months.map(async (m) => {
        const jobs = await Job.countDocuments({
          createdAt: { $gte: m.start, $lte: m.end }
        });
        const applications = await Application.countDocuments({
          createdAt: { $gte: m.start, $lte: m.end }
        });
        return {
          month: m.name,
          Jobs: jobs,
          Applications: applications
        };
      })
    );

    const appStatusPending = await Application.countDocuments({ status: "pending" });
    const appStatusAccepted = await Application.countDocuments({ status: "accepted" });
    const appStatusRejected = await Application.countDocuments({ status: "rejected" });

    const jobStatusOpen = await Job.countDocuments({ status: "Open" });
    const jobStatusClosed = await Job.countDocuments({ status: "Closed" });

    const subFree = await User.countDocuments({ role: "employer", subscriptionPlan: "free" });
    const subPremium = await User.countDocuments({ role: "employer", subscriptionPlan: "premium" });

    res.json({
      registrationTrends,
      jobTrends,
      applicationBreakdown: [
        { name: "Pending", value: appStatusPending },
        { name: "Accepted", value: appStatusAccepted },
        { name: "Rejected", value: appStatusRejected }
      ],
      jobBreakdown: [
        { name: "Open", value: jobStatusOpen },
        { name: "Closed", value: jobStatusClosed }
      ],
      subscriptionBreakdown: [
        { name: "Free Tier", value: subFree },
        { name: "Premium Tier", value: subPremium }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching statistical trends" });
  }
};

// ================= USER OPERATIONS =================
exports.editUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      email,
      phone,
      location,
      bio,
      role,
      isVerifiedRecruiter,
      subscriptionPlan,
      isBlocked
    } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (role !== undefined) user.role = role;
    if (isVerifiedRecruiter !== undefined) user.isVerifiedRecruiter = isVerifiedRecruiter;
    if (subscriptionPlan !== undefined) user.subscriptionPlan = subscriptionPlan;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;

    // Employer profile elements
    if (req.body.companyName !== undefined) user.companyName = req.body.companyName;
    if (req.body.companyWebsite !== undefined) user.companyWebsite = req.body.companyWebsite;
    if (req.body.companySize !== undefined) user.companySize = req.body.companySize;
    if (req.body.industry !== undefined) user.industry = req.body.industry;
    if (req.body.companyDescription !== undefined) user.companyDescription = req.body.companyDescription;
    if (req.body.recruiterPhone !== undefined) user.recruiterPhone = req.body.recruiterPhone;
    if (req.body.designation !== undefined) user.designation = req.body.designation;
    if (req.body.businessRegNo !== undefined) user.businessRegNo = req.body.businessRegNo;
    if (req.body.companyAddress !== undefined) user.companyAddress = req.body.companyAddress;

    await user.save();
    res.json({ message: "User profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error editing user profile" });
  }
};

exports.createSystemUser = async (req, res) => {
  try {
    const { name, email, password, role, isVerifiedRecruiter, subscriptionPlan } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password, // Password hashing happens inside User pre-save middleware
      role,
      isVerifiedRecruiter: isVerifiedRecruiter || false,
      subscriptionPlan: subscriptionPlan || "free",
      isVerified: true
    });

    res.status(201).json({ message: "User created successfully", user: { id: newUser._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: "Error creating system user" });
  }
};

exports.bulkUserAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !action) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    if (action === "suspend") {
      await User.updateMany({ _id: { $in: ids } }, { isBlocked: true });
      return res.json({ message: "Selected users suspended successfully" });
    } else if (action === "activate") {
      await User.updateMany({ _id: { $in: ids } }, { isBlocked: false });
      return res.json({ message: "Selected users activated successfully" });
    } else if (action === "verify-recruiter") {
      await User.updateMany({ _id: { $in: ids }, role: "employer" }, { isVerifiedRecruiter: true });
      return res.json({ message: "Selected employers verified successfully" });
    } else if (action === "delete") {
      // Cascading delete
      for (const id of ids) {
        const user = await User.findById(id);
        if (user) {
          if (user.role === "employer") {
            const jobs = await Job.find({ postedBy: user._id });
            for (const job of jobs) {
              await Application.deleteMany({ job: job._id });
            }
            await Job.deleteMany({ postedBy: user._id });
          }
          await Application.deleteMany({ applicant: user._id });
          await user.deleteOne();
        }
      }
      return res.json({ message: "Selected users and associated records deleted successfully" });
    } else {
      return res.status(400).json({ message: "Unsupported user bulk action" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error executing bulk user action" });
  }
};

// ================= JOB OPERATIONS =================
exports.editJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const {
      title,
      company,
      location,
      salary,
      experience,
      jobType,
      description,
      status,
      skills,
      isApproved
    } = req.body;

    if (title !== undefined) job.title = title;
    if (company !== undefined) job.company = company;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (experience !== undefined) job.experience = experience;
    if (jobType !== undefined) job.jobType = jobType;
    if (description !== undefined) job.description = description;
    if (status !== undefined) job.status = status;
    if (skills !== undefined) job.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    if (isApproved !== undefined) job.isApproved = isApproved;

    await job.save();
    res.json({ message: "Job listing updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error editing job listing" });
  }
};

exports.bulkJobAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !action) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    if (action === "approve") {
      await Job.updateMany({ _id: { $in: ids } }, { isApproved: true });
      return res.json({ message: "Selected jobs approved successfully" });
    } else if (action === "reject") {
      await Job.updateMany({ _id: { $in: ids } }, { isApproved: false });
      return res.json({ message: "Selected jobs unapproved successfully" });
    } else if (action === "close") {
      await Job.updateMany({ _id: { $in: ids } }, { status: "Closed" });
      return res.json({ message: "Selected jobs marked as closed" });
    } else if (action === "open") {
      await Job.updateMany({ _id: { $in: ids } }, { status: "Open" });
      return res.json({ message: "Selected jobs marked as open" });
    } else if (action === "delete") {
      await Application.deleteMany({ job: { $in: ids } });
      await Job.deleteMany({ _id: { $in: ids } });
      return res.json({ message: "Selected job listings deleted successfully" });
    } else {
      return res.status(400).json({ message: "Unsupported job bulk action" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error executing bulk job action" });
  }
};

// ================= APPLICATION OPERATIONS =================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();
    res.json({ message: "Application status updated successfully", application });
  } catch (err) {
    res.status(500).json({ message: "Error updating application status" });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.deleteOne();
    res.json({ message: "Application deleted successfully from audit" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting application" });
  }
};

exports.bulkApplicationAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !action) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    if (action === "accept") {
      await Application.updateMany({ _id: { $in: ids } }, { status: "accepted" });
      return res.json({ message: "Selected applications accepted" });
    } else if (action === "reject") {
      await Application.updateMany({ _id: { $in: ids } }, { status: "rejected" });
      return res.json({ message: "Selected applications rejected" });
    } else if (action === "delete") {
      await Application.deleteMany({ _id: { $in: ids } });
      return res.json({ message: "Selected applications deleted successfully" });
    } else {
      return res.status(400).json({ message: "Unsupported application bulk action" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error executing bulk application action" });
  }
};
