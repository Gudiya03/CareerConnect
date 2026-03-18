const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  uploadResume,
  getProfile,
  updateProfile,
  googleLogin,
  setRole,
  forgotPassword,   // ✅ ADD
  resetPassword   // ✅ ADD
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ================= AUTH =================
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.put("/set-role", setRole);

// ================= VERIFY =================
router.get("/verify-email/:token", verifyEmail);

// ================= PROFILE =================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ================= RESUME =================
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;