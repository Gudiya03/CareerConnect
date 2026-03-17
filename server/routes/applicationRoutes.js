
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const applicationController = require("../controllers/applicationController");

// APPLY TO JOB (WITH RESUME UPLOAD)
router.post("/:id", protect, upload.single("resume"), applicationController.applyJob);

// GET MY APPLICATIONS
router.get("/my", protect, applicationController.getMyApplications);

// GET APPLICANTS FOR JOB
router.get("/job/:id", protect, applicationController.getJobApplications);

// UPDATE STATUS
router.put("/:id", protect, applicationController.updateStatus);

module.exports = router;

