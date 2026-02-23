const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/User");

// LOGIN
router.post("/login", login);

// UPLOAD RESUME
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);

      // ✅ SAVE ONLY filename
      user.resume = req.file.filename;

      await user.save();

      res.json({ message: "Resume uploaded successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;