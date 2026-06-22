const InterviewExperience = require("../models/InterviewExperience");

// Create Experience
exports.createExperience = async (req, res) => {
  try {
    const { companyName, role, questions, tips, result } = req.body;
    if (!companyName || !role || !questions) {
      return res.status(400).json({ message: "Company name, role, and interview questions are required" });
    }

    const experience = await InterviewExperience.create({
      companyName,
      role,
      questions,
      tips,
      result: result || "Pending",
      user: req.user._id
    });

    res.status(201).json({ message: "Interview experience posted successfully! 💬", experience });
  } catch (err) {
    res.status(500).json({ message: "Error posting interview experience" });
  }
};

// Get All Experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Error fetching interview experiences" });
  }
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify owner or admin
    if (experience.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You cannot delete this post." });
    }

    await experience.deleteOne();
    res.json({ message: "Interview experience post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting experience post" });
  }
};
