const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    requireJobApproval: {
      type: Boolean,
      default: false
    },
    requireRecruiterVerification: {
      type: Boolean,
      default: false
    },
    maxFreeJobs: {
      type: Number,
      default: 5
    },
    allowCandidateResumeUpload: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
