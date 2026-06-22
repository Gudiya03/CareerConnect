const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  verifyRecruiter,
  approveJob,
  toggleUserBlock,
  getSettings,
  updateSettings,
  getStatsTrends,
  editUserProfile,
  createSystemUser,
  bulkUserAction,
  editJob,
  bulkJobAction,
  updateApplicationStatus,
  deleteApplication,
  bulkApplicationAction
} = require("../controllers/adminController");

// Protect all routes and restrict to admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Stats & Settings routes
router.get("/stats", getDashboardStats);
router.get("/stats/trends", getStatsTrends);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Users routes
router.get("/users", getAllUsers);
router.post("/users/create", createSystemUser);
router.post("/users/bulk-action", bulkUserAction);
router.put("/users/:id", updateUserRole);
router.put("/users/:id/edit", editUserProfile);
router.delete("/users/:id", deleteUser);
router.put("/verify-recruiter/:id", verifyRecruiter);
router.put("/toggle-block/:id", toggleUserBlock);

// Jobs routes
router.get("/jobs", getAllJobs);
router.post("/jobs/bulk-action", bulkJobAction);
router.put("/jobs/:id/edit", editJob);
router.delete("/jobs/:id", deleteJob);
router.put("/approve-job/:id", approveJob);

// Applications routes
router.get("/applications", getAllApplications);
router.post("/applications/bulk-action", bulkApplicationAction);
router.put("/applications/:id", updateApplicationStatus);
router.delete("/applications/:id", deleteApplication);

module.exports = router;

