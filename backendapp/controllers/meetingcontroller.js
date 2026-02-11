const Meeting = require("../models/Meeting");

const JobApplicant = require("../models/JobApplicant");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");
const { sendShortlistedEmail } = require("../services/emailService");

// ✅ Create Meeting
const createMeeting = async (req, res) => {
  try {
    const {
      recruiterId,
      applicantId,
      jobId,
      applicationId,
      meetingTitle,
      scheduledDate,
      duration
    } = req.body;

    // Generate unique room name
    const meetingRoom = `interview-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const meeting = new Meeting({
      recruiterId,
      applicantId,
      jobId,
      applicationId,
      meetingTitle,
      meetingRoom,
      scheduledDate,
      duration: duration || 60,
      status: "scheduled"
    });

    await meeting.save();

    // Update application status
    await JobApplicant.findByIdAndUpdate(applicationId, {
      jobStatus: "INTERVIEW-SCHEDULED"
    });

    // Get applicant and job details
    const application = await JobApplicant.findById(applicationId);
    const job = await Job.findOne({ jobid: application.jobid });
    const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

    // Send email with meeting link
    const meetingLink = `http://localhost:3000/meeting/${meetingRoom}`;
    await sendShortlistedEmail(
      jobseeker.email,
      jobseeker.name,
      job.title,
      meetingLink
    );

    res.json({
      success: true,
      meeting,
      meetingLink
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create meeting");
  }
};

// ✅ Get Meetings for Recruiter
const getRecruiterMeetings = async (req, res) => {
  try {
    const { recruiterId } = req.query;

    const meetings = await Meeting.find({ recruiterId })
      .sort({ scheduledDate: -1 });

    // Populate job and applicant details manually
    const populatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const application = await JobApplicant.findById(meeting.applicationId);
        const job = await Job.findOne({ jobid: application.jobid });
        const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

        return {
          ...meeting.toObject(),
          jobId: job,
          applicantId: jobseeker
        };
      })
    );

    res.json(populatedMeetings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch meetings");
  }
};

// ✅ Get Meetings for Job Seeker
const getApplicantMeetings = async (req, res) => {
  try {
    const { applicantId } = req.query;

    const meetings = await Meeting.find({ applicantId })
      .sort({ scheduledDate: -1 });

    // Populate job details
    const populatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const application = await JobApplicant.findById(meeting.applicationId);
        const job = await Job.findOne({ jobid: application.jobid });

        return {
          ...meeting.toObject(),
          jobId: job
        };
      })
    );

    res.json(populatedMeetings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch meetings");
  }
};

// ✅ Get Single Meeting
const getMeeting = async (req, res) => {
  try {
    const { meetingRoom } = req.params;

    const meeting = await Meeting.findOne({ meetingRoom });

    if (!meeting) {
      return res.status(404).send("Meeting not found");
    }

    // Get application, job, and jobseeker details
    const application = await JobApplicant.findById(meeting.applicationId);
    const job = await Job.findOne({ jobid: application.jobid });
    const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

    res.json({
      ...meeting.toObject(),
      jobId: job,
      applicantId: jobseeker
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch meeting");
  }
};

// ✅ Update Meeting Status
const updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId, status, notes } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { status, notes },
      { new: true }
    );

    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update meeting");
  }
};

// ✅ Cancel Meeting
const cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { status: "cancelled" },
      { new: true }
    );

    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to cancel meeting");
  }
};

// ✅ Join Meeting (Mark participant as joined)
const joinMeeting = async (req, res) => {
  try {
    const { meetingRoom, userType } = req.body;

    const update = {};
    if (userType === "recruiter") {
      update.recruiterJoined = true;
      update.status = "ongoing";
      update.actualStartTime = new Date();
    } else if (userType === "jobseeker") {
      update.applicantJoined = true;
    }

    const meeting = await Meeting.findOneAndUpdate(
      { meetingRoom },
      update,
      { new: true }
    );

    if (!meeting) return res.status(404).send("Meeting not found");

    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to join meeting");
  }
};

// ✅ Leave Meeting (Mark participant as left)
const leaveMeeting = async (req, res) => {
  try {
    const { meetingRoom, userType } = req.body;

    const update = {};
    if (userType === "recruiter") {
      update.recruiterJoined = false;
    } else if (userType === "jobseeker") {
      update.applicantJoined = false;
    }

    const meeting = await Meeting.findOneAndUpdate(
      { meetingRoom },
      update,
      { new: true }
    );

    // If both left, optionally mark as completed after some time or via manual trigger
    // For now, just track status

    res.json(meeting || { success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to leave meeting");
  }
};

module.exports = {
  createMeeting,
  getRecruiterMeetings,
  getApplicantMeetings,
  getMeeting,
  updateMeetingStatus,
  cancelMeeting,
  joinMeeting,
  leaveMeeting
};