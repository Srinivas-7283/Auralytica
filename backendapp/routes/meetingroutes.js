const express = require("express");
const router = express.Router();

const {
  createMeeting,
  getRecruiterMeetings,
  getApplicantMeetings,
  getMeeting,
  updateMeetingStatus,
  cancelMeeting,
  joinMeeting,
  leaveMeeting
} = require("../controllers/meetingcontroller");

router.post("/create", createMeeting);
router.get("/recruiter", getRecruiterMeetings);
router.get("/applicant", getApplicantMeetings);
router.post("/join", joinMeeting);
router.post("/leave", leaveMeeting);
router.get("/:meetingRoom", getMeeting);
router.put("/update-status", updateMeetingStatus);
router.put("/cancel", cancelMeeting);

module.exports = router;