const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createExperience,
  getAllExperiences,
  deleteExperience
} = require("../controllers/interviewExperienceController");

// Public viewing of experience boards
router.get("/all", getAllExperiences);

// Protected posts
router.post("/create", protect, createExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;
