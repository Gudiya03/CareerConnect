const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
{
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  // ✅ ADD THIS (IMPORTANT)
  googleId: {
    type: String,
  },

  role: {
    type: String,
    enum: ["candidate", "employer", "admin"],
    default: "candidate",
  },

  resume: {
    type: String
  },

  // ================= CANDIDATE PROFILE =================
  bio: {
    type: String,
  },

  location: {
    type: String,
  },

  profileImage: {
    type: String,
  },

  skills: [
    {
      type: String,
    }
  ],

  education: [
    {
      degree: String,
      institution: String,
      startYear: String,
      endYear: String,
    }
  ],

  experience: [
    {
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String,
    }
  ],

  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
  },

  // ================= EMPLOYER PROFILE =================
  companyName: {
    type: String,
  },

  companyWebsite: {
    type: String,
  },

  industry: {
    type: String,
  },

  // ================= AUTH =================
  isVerified: {
    type: Boolean,
    default: false,
  },

  emailToken: {
    type: String,
  },

  resetToken: {
    type: String,
  },

  resetTokenExpire: {
    type: Date,
  },

  refreshToken: {
    type: String,
  },

},
{ timestamps: true }
);


// 🔥 PASSWORD HASHING
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);