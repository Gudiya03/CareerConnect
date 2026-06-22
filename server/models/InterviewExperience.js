const mongoose = require("mongoose");

const interviewExperienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    questions: {
      type: String,
      required: true
    },
    tips: {
      type: String
    },
    result: {
      type: String,
      enum: ["Selected", "Rejected", "Pending"],
      default: "Pending"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewExperience", interviewExperienceSchema);
