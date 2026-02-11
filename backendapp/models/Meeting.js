const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  recruiterId: {
    type: String,
    required: true
  },
  applicantId: {
    type: String,
    required: true
  },
  jobId: {
    type: Number,  // ✅ Changed from ObjectId to Number to match your custom jobid
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobApplicant",  // ✅ Fixed ref name
    required: true
  },
  meetingTitle: {
    type: String,
    required: true
  },
  meetingRoom: {
    type: String,
    required: true,
    unique: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled"],
    default: "scheduled"
  },
  recruiterJoined: {
    type: Boolean,
    default: false
  },
  applicantJoined: {
    type: Boolean,
    default: false
  },
  actualStartTime: Date,
  actualEndTime: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Meeting", meetingSchema);