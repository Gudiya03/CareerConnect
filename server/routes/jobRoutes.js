// const express = require("express");
// const router = express.Router();

// const {
//   createJob,
//   getJobs,
//   getMyJobs,
// } = require("../controllers/jobController");

// const protect = require("../middleware/authMiddleware");

// router.post("/", protect, createJob);
// router.get("/", getJobs);
// router.get("/my-jobs", protect, getMyJobs);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { createJob, getJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// create job (employer only)
router.post("/", protect, createJob);

// get all jobs
router.get("/", getJobs);

module.exports = router;