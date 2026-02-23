const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const applicationController = require("../controllers/applicationController");

// APPLY TO JOB
router.post("/:id", protect, applicationController.applyJob);

// GET MY APPLICATIONS (student)
router.get("/my", protect, applicationController.getMyApplications);

// GET APPLICANTS FOR JOB (employer)
router.get("/job/:id", protect, applicationController.getJobApplications);

// UPDATE STATUS (accept/reject)
router.put("/:id", protect, applicationController.updateStatus);

module.exports = router;