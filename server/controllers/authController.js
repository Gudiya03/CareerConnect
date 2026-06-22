const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const SystemSetting = require("../models/SystemSetting");



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
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = {
      name,
      email,
      password,
      role: role || "candidate",
      isVerified: true,
      
      // Candidate details
      phone: req.body.phone,
      bio: req.body.bio,
      location: req.body.location,
      skills: req.body.skills,
      certifications: req.body.certifications,
      languages: req.body.languages,
      socialLinks: req.body.socialLinks,
      preferences: req.body.preferences,
      education: req.body.education,
      experience: req.body.experience,
      profileImage: req.body.profileImage,

      // Employer details
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo,
      companyWebsite: req.body.companyWebsite,
      industry: req.body.industry,
      companySize: req.body.companySize,
      companyDescription: req.body.companyDescription,
      recruiterPhone: req.body.recruiterPhone,
      designation: req.body.designation,
      businessRegNo: req.body.businessRegNo,
      companyAddress: req.body.companyAddress,
    };

    const user = await User.create(userData);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: "Registered successfully",
      accessToken,
      refreshToken,
      role: user.role,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "",
      bio: user.bio || "",
    });

  } catch (err) {
    console.log("Register error:", err);
    return res.status(500).json({
      message: "Something went wrong",
    });
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
      return res.status(400).json({ message: "Verification token invalid or expired" });
    }

    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Email verification error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Seed fixed admin account if matched
    if (email === "admin@careerconnect.com" && password === "admin123") {
      let adminUser = await User.findOne({ email: "admin@careerconnect.com" });
      if (adminUser) {
        const isMatch = await adminUser.matchPassword("admin123").catch(() => false);
        if (!isMatch) {
          await User.deleteOne({ _id: adminUser._id });
          adminUser = null;
        }
      }
      if (!adminUser) {
        await User.create({
          name: "System Admin",
          email: "admin@careerconnect.com",
          password: "admin123",
          role: "admin",
          isVerified: true,
          isVerifiedRecruiter: true
        });
      }
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    // ❌ verification removed for testing

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
    console.error("LOGIN ERROR DETECTED:", err);
    res.status(500).json({ message: "Login error", error: err.message });
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
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
    user.education = req.body.education !== undefined ? req.body.education : user.education;
    user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
    user.socialLinks = req.body.socialLinks !== undefined ? req.body.socialLinks : user.socialLinks;

    // CANDIDATE
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.certifications = req.body.certifications !== undefined ? req.body.certifications : user.certifications;
    user.languages = req.body.languages !== undefined ? req.body.languages : user.languages;
    user.preferences = req.body.preferences !== undefined ? req.body.preferences : user.preferences;
    user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;

    // EMPLOYER
    user.companyName = req.body.companyName !== undefined ? req.body.companyName : user.companyName;
    user.companyWebsite = req.body.companyWebsite !== undefined ? req.body.companyWebsite : user.companyWebsite;
    user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
    user.companyLogo = req.body.companyLogo !== undefined ? req.body.companyLogo : user.companyLogo;
    user.companySize = req.body.companySize !== undefined ? req.body.companySize : user.companySize;
    user.companyDescription = req.body.companyDescription !== undefined ? req.body.companyDescription : user.companyDescription;
    user.recruiterPhone = req.body.recruiterPhone !== undefined ? req.body.recruiterPhone : user.recruiterPhone;
    user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
    user.businessRegNo = req.body.businessRegNo !== undefined ? req.body.businessRegNo : user.businessRegNo;
    user.companyAddress = req.body.companyAddress !== undefined ? req.body.companyAddress : user.companyAddress;
    user.subscriptionPlan = req.body.subscriptionPlan !== undefined ? req.body.subscriptionPlan : user.subscriptionPlan;
    user.subscriptionStatus = req.body.subscriptionStatus !== undefined ? req.body.subscriptionStatus : user.subscriptionStatus;

    await user.save();

    res.json({ message: "Profile updated successfully", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Profile update error" });
  }
};

// ================= UPLOAD RESUME =================
exports.uploadResume = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }

    if (!settings.allowCandidateResumeUpload) {
      return res.status(403).json({
        message: "Resume uploads are currently disabled by the system administrator."
      });
    }

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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // 🔗 Reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 📧 Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        html: `
          <h2>Password Reset</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetURL}" 
             style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">
             Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
        `,
      });

      return res.json({ message: "Reset link sent successfully" });

    } catch (emailErr) {
      console.log("Email error:", emailErr.message);

      // ✅ Don't break user flow
      return res.json({
        message: "Reset link generated, but email could not be sent.",
      });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Forgot password error" });
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

// ================= REFRESH TOKEN =================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user._id);

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

// ================= GET CANDIDATES =================
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" })
      .select("-password -refreshToken");
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
};