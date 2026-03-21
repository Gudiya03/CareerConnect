const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ================= TOKEN GENERATORS =================
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: null, // ✅ role later set होगा
      emailToken,
    });

    // EMAIL SEND
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyURL = `${process.env.FRONTEND_URL}/verify/${emailToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email - Career Connect",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyURL}">${verifyURL}</a>
      `,
    });

    res.json({
      message: "Registered successfully. Check your email to verify.",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register error" });
  }
};

// ================= SET ROLE =================
exports.setRole = async (req, res) => {
  try {

    const { email, role } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      role: user.role,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Set role error" });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });

    if (!user) {
      return res.json({ message: "Email already verified" });
    }

    user.isVerified = true;
    user.emailToken = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Verify your email first" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      role: user.role,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "",
      bio: user.bio || "",
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, role } = req.body;

    // 🔍 Find user
    let user = await User.findOne({ email });

    let isNewUser = false;

    // ================= NEW USER =================
    if (!user) {
      isNewUser = true;

      user = new User({
        name,
        email,
        googleId, // ✅ store googleId separately (better practice)
        password: googleId + Date.now(), // ✅ dummy unique password
        role: null,
        isVerified: true,
      });

      await user.save();
    }

    // ================= SET ROLE =================
    if (role && !user.role) {
      user.role = role;
      await user.save();
    }

    // ================= TOKENS =================
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // ================= RESPONSE =================
    res.status(200).json({
      accessToken,
      refreshToken,
      role: user.role,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "",
      bio: user.bio || "",
      isNewUser,
    });

  } catch (err) {
    console.log("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

// ================= PROFILE =================
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password -refreshToken");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Profile fetch error" });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    // COMMON
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.education = req.body.education || user.education;
    user.experience = req.body.experience || user.experience;
    user.socialLinks = req.body.socialLinks || user.socialLinks;

    // EMPLOYER
    user.companyName = req.body.companyName || user.companyName;
    user.companyWebsite = req.body.companyWebsite || user.companyWebsite;
    user.industry = req.body.industry || user.industry;

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Profile update error" });
  }
};

// ================= UPLOAD RESUME =================
exports.uploadResume = async (req, res) => {
  try {

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user._id);

    user.resume = req.file.filename;

    await user.save();

    res.json({ message: "Resume uploaded successfully" });

  } catch (err) {
    res.status(500).json({ message: "Resume upload error" });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<a href="${resetURL}">Reset Password</a>`,
    });

    res.json({ message: "Reset link sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending email" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    console.log("USER FOUND:", user); // 👈 DEBUG

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = req.body.password;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Reset password error" });
  }
};