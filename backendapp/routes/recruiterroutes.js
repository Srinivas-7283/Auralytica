// recruiter routes

const recruitercontroller = require("../controllers/recruitercontroller");

const express = require("express");
const recruiterrouter = express.Router();

// Existing routes
recruiterrouter.post("/checkrecruiterlogin", recruitercontroller.checkrecruiterlogin);
recruiterrouter.post("/addjob", recruitercontroller.addjob);
recruiterrouter.get("/viewjobs/:runame", recruitercontroller.viewjobs);
recruiterrouter.get("/viewjobapplicants/:runame", recruitercontroller.viewjobapplicants);
recruiterrouter.post("/changejobstatus", recruitercontroller.changejobstatus);
recruiterrouter.post("/screenresumes", recruitercontroller.screenApplicants);

recruiterrouter.get("/viewjobbyid/:jobid", recruitercontroller.viewJobById);
recruiterrouter.get("/viewjobseekerbyemail/:email", recruitercontroller.viewJobSeekerByEmail);

// ✅ New routes - Changed 'router' to 'recruiterrouter'
recruiterrouter.post("/shortlist-candidate", recruitercontroller.shortlistCandidate);
recruiterrouter.post("/reject-candidate", recruitercontroller.rejectCandidate);

module.exports = recruiterrouter;