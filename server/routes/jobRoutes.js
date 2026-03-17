const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  updateJob,
  saveJob
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

// CREATE JOB
router.post("/", protect, createJob);

// GET ALL JOBS
router.get("/", getJobs);

// ⭐ SAVE / UNSAVE JOB (must come before :id)
router.post("/save/:id", protect, saveJob);

// GET SINGLE JOB
router.get("/:id", getJobById);

// DELETE JOB
router.delete("/:id", protect, deleteJob);

// UPDATE JOB
router.put("/:id", protect, updateJob);

module.exports = router;