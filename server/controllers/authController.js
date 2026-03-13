const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


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
const nodemailer = require("nodemailer");


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role,
      emailToken,
    });

    // ================= SEND EMAIL =================
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
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};


// ================= REFRESH TOKEN =================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user._id);

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Token expired" });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.json({ resetToken });

  } catch (err) {
    res.status(500).json({ message: "Forgot password error" });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token expired" });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Reset password error" });
  }
};


// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Profile fetch error" });
  }
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.education = req.body.education || user.education;
    user.experience = req.body.experience || user.experience;
    user.socialLinks = req.body.socialLinks || user.socialLinks;

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
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