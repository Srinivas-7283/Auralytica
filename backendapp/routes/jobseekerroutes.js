// job seeker routes

const jobseekercontroller = require("../controllers/jobseekercontroller");
const upload = require("../multerConfig");
const { chatWithAI } = require("../controllers/chatbotcontroller");

const express = require("express");
const jobseekerrouter = express.Router();
const aibotcontroller = require("../controllers/chatbotcontroller");
jobseekerrouter.post("/insertjobseeker", jobseekercontroller.insertjobseeker);
jobseekerrouter.post("/checkjobseekerlogin", jobseekercontroller.checkjobseekerlogin);
jobseekerrouter.put("/updatejobseekerprofile", jobseekercontroller.updatejobseekerprofile);
jobseekerrouter.get("/jobseekerprofile/:email", jobseekercontroller.jobseekerprofile);

jobseekerrouter.get("/viewjobsbyjobseeker", jobseekercontroller.viewjobsbyjobseeker);

// ✅ Resume upload stays here
jobseekerrouter.post(
  "/applyjob",
  upload.single("resume"),
  jobseekercontroller.applyjob
);
jobseekerrouter.post(
  "/ai-chat",
  upload.single("resume"),
  aibotcontroller.chatWithAI
);
jobseekerrouter.post("/chat", chatWithAI);

jobseekerrouter.get("/appliedjobs/:email", jobseekercontroller.appliedjobs);

module.exports = jobseekerrouter;
