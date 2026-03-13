const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
  uploadResume,
  getProfile,          // ✅ added
  updateProfile        // ✅ added
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// ================= REGISTER =================
router.post("/register", register);


// ================= VERIFY EMAIL =================
router.get("/verify-email/:token", verifyEmail);


// ================= LOGIN =================
router.post("/login", login);


// ================= REFRESH TOKEN =================
router.post("/refresh-token", refreshToken);


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", forgotPassword);


// ================= RESET PASSWORD =================
router.post("/reset-password/:token", resetPassword);


// ================= PROFILE =================
router.get("/profile", protect, getProfile);      // ✅ GET PROFILE
router.put("/profile", protect, updateProfile);  // ✅ UPDATE PROFILE


// ================= UPLOAD RESUME =================
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;