const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const JobApplicant = require("../models/JobApplicant");
const JobSeeker = require("../models/JobSeeker");
const fs = require("fs");


let pdfParse;
try {
  const pdfModule = require("pdf-parse");
  
  console.log("📦 Raw import type:", typeof pdfModule);
  
  if (typeof pdfModule === 'function') {
    pdfParse = pdfModule;
  } else if (pdfModule && typeof pdfModule.default === 'function') {
    pdfParse = pdfModule.default;
  } else if (pdfModule && typeof pdfModule.pdf === 'function') {
    pdfParse = pdfModule.pdf;
  } else {
    throw new Error("Could not find pdf-parse function in module exports");
  }
  
  console.log("✅ pdf-parse loaded successfully, type:", typeof pdfParse);
} catch (err) {
  console.error("❌ Failed to load pdf-parse:", err.message);
  console.error("❌ Try running: npm uninstall pdf-parse && npm install pdf-parse@1.1.1");
  process.exit(1);
}

const natural = require("natural");

const checkrecruiterlogin = async (request, response) => {
  try {
    const input = request.body;
    const recruiter = await Recruiter.findOne(input);
    response.json(recruiter);
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const addjob = async (request, response) => {
  try {
    const input = request.body;
    const job = new Job(input);
    await job.save();
    response.status(200).send("Job Posted Successfully");
  } catch (e) {
    console.log(e.message);
    response.status(500).send(e.message);
  }
};

const viewjobs = async (request, response) => {
  try {
    const runame = request.params.runame;
    const jobs = await Job.find({ "recruiter.username": runame });
    if (jobs.length == 0) {
      response.status(200).send("DATA NOT FOUND");
    } else {
      response.json(jobs);
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const viewjobapplicants = async (request, response) => {
  try {
    const runame = request.params.runame;
    const jobs = await Job.find({ "recruiter.username": runame });

    if (jobs.length === 0) {
      return response.status(200).send("No jobs found for this recruiter");
    } else {
      const jobIds = jobs.map((job) => job.jobid);
      const jobApplicants = await JobApplicant.find({
        jobid: { $in: jobIds },
      });

      if (jobApplicants.length === 0) {
        return response
          .status(200)
          .send("No job applicants found for this job");
      } else {
        const JobSeeker = require("../models/JobSeeker");

        const applicantsWithDetails = await Promise.all(
          jobApplicants.map(async (applicant) => {
            const jobSeeker = await JobSeeker.findOne({
              email: applicant.jobseekeremail,
            });
            return {
              ...applicant.toObject(),
              jobseekercontact: jobSeeker ? jobSeeker.contact : "N/A",
            };
          })
        );

        response.json(applicantsWithDetails);
      }
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const changejobstatus = async (req, res) => {
  try {
    const { applicantId, status } = req.body;

    // Find by applicantId field (J981348), not MongoDB _id
    const application = await JobApplicant.findOne({ applicantId: applicantId });
    
    if (!application) {
      return res.status(404).send("Application not found");
    }

    // Update status
    application.jobStatus = status;
    
    // Update shortlisted flag
    if (status === "SELECTED") {
      application.shortlisted = true;
    }
    
    await application.save();

    // ✅ SEND EMAILS BASED ON STATUS
    try {
      const job = await Job.findOne({ jobid: application.jobid });
      const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

      if (job && jobseeker) {
        if (status === "SELECTED") {
          await sendShortlistedEmail(
            jobseeker.email,
            jobseeker.name,
            job.title
          );
          console.log("✅ Shortlist email sent to:", jobseeker.email);
        } else if (status === "REJECTED") {
          await sendRejectionEmail(
            jobseeker.email,
            jobseeker.name,
            job.title
          );
          console.log("✅ Rejection email sent to:", jobseeker.email);
        }
      } else {
        console.log("⚠️ Job or JobSeeker not found for email");
      }
    } catch (emailError) {
      console.error("❌ Email sending failed (but status updated):", emailError.message);
      // Don't fail the status update if email fails
    }

    res.send("Status updated successfully");
  } catch (err) {
    console.error("❌ Error in changejobstatus:", err);
    res.status(500).send("Failed to update status");
  }
};


const screenApplicants = async (req, res) => {
  console.log("🔵 Screen resumes API hit");
  console.log("🔍 pdfParse function check:", typeof pdfParse);

  try {
    const { jobid, skills, minScore } = req.body;
    console.log("Job ID:", jobid);
    console.log("Skills to screen:", skills);
    console.log("Minimum score:", minScore);

    const applicants = await JobApplicant.find({ jobid });
    console.log("Applicants found:", applicants.length);

    // ✅ Convert skills to lowercase for matching
    const requestedSkills = skills.map(s => s.toLowerCase().trim());
    console.log("🎯 Normalized skills:", requestedSkills);

    for (let applicant of applicants) {
      console.log("\n📄 Processing Applicant:", applicant.applicantId);

      if (!applicant.resume) {
        console.log("❌ No resume for applicant");
        applicant.resumeScore = 0;
        applicant.shortlisted = false;
        applicant.screenedAt = new Date().toISOString();
        await applicant.save();
        continue;
      }

      const filePath = `upload/${applicant.resume}`;
      console.log("📁 Reading file:", filePath);

      if (!fs.existsSync(filePath)) {
        console.log("❌ File not found");
        applicant.resumeScore = 0;
        applicant.shortlisted = false;
        applicant.screenedAt = new Date().toISOString();
        await applicant.save();
        continue;
      }

      if (!applicant.resume.toLowerCase().endsWith(".pdf")) {
        console.log("⚠️ Skipping non-PDF resume:", applicant.resume);
        applicant.resumeScore = 0;
        applicant.shortlisted = false;
        applicant.screenedAt = new Date().toISOString();
        await applicant.save();
        continue;
      }

      const buffer = fs.readFileSync(filePath);
      console.log("📦 Buffer size:", buffer.length, "bytes");

      let pdfData;
      try {
        if (typeof pdfParse !== 'function') {
          throw new Error(`pdfParse is ${typeof pdfParse}, not a function`);
        }
        
        pdfData = await pdfParse(buffer);
        console.log("✅ PDF parsed successfully");
        console.log("📊 Pages:", pdfData.numpages);
        console.log("📝 Text length:", pdfData.text?.length || 0, "characters");
      } catch (err) {
        console.log("⚠️ PDF parse failed:", err.message);
        applicant.resumeScore = 0;
        applicant.shortlisted = false;
        applicant.screenedAt = new Date().toISOString();
        await applicant.save();
        continue;
      }

      const text = pdfData.text || "";

      if (!text || text.trim().length === 0) {
        console.log("⚠️ PDF has no extractable text");
        applicant.resumeScore = 0;
        applicant.shortlisted = false;
        applicant.screenedAt = new Date().toISOString();
        await applicant.save();
        continue;
      }

      console.log("----- ORIGINAL RESUME TEXT (first 300 chars) -----");
      console.log(text.substring(0, 300));

     
      const normalizedText = text.toLowerCase();

      console.log("----- NORMALIZED TEXT (first 300 chars) -----");
      console.log(normalizedText.substring(0, 300));

      
      let score = 0;
      let matchedSkills = [];

      requestedSkills.forEach(skill => {
        if (normalizedText.includes(skill)) {
          score += 2; // Each matched skill = 2 points
          matchedSkills.push(skill);
          console.log(`✅ Matched skill: ${skill}`);
        }
      });

      
      const expMatch = text.match(/(\d+(\.\d+)?)\s*(years?|yrs?)/i);
      if (expMatch) {
        const years = parseFloat(expMatch[1]);
        score += 2;
        console.log(`✅ Found ${years} years of experience (+2 points)`);
      }

      
      const minimumScore = minScore || 5;

      
      applicant.resumeScore = score;
      applicant.shortlisted = score >= minimumScore;
      applicant.screenedAt = new Date().toISOString();
      await applicant.save();

      console.log(`\n✅ Applicant ${applicant.applicantId} scored ${score} points`);
      console.log(`   Matched skills: ${matchedSkills.join(", ") || "None"}`);
      console.log(`   Minimum required: ${minimumScore}`);
      console.log(`   Shortlisted: ${applicant.shortlisted ? "YES ⭐" : "NO"}`);
      console.log("─".repeat(60));
    }

    res.status(200).send("Resume screening completed successfully");
  } catch (err) {
    console.error("🔥 SCREENING ERROR:", err);
    res.status(500).send("Screening failed: " + err.message);
  }
};

  const { sendShortlistedEmail, sendRejectionEmail } =
  require("../services/emailService");


const shortlistCandidate = async (req, res) => {
  try {
    const { applicantId } = req.body;  // ✅ Use applicantId instead of applicationId

    const application = await JobApplicant.findOne({ applicantId });

    if (!application) {
      return res.status(404).send("Application not found");
    }

    // Update status
    application.jobStatus = "SHORTLISTED";
    application.shortlisted = true;
    await application.save();

    // Get job and jobseeker details
    const job = await Job.findOne({ jobid: application.jobid });
    const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

    // Send email
    await sendShortlistedEmail(
      jobseeker.email,
      jobseeker.name,
      job.title
    );

    res.send("Candidate shortlisted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to shortlist");
  }
};

const rejectCandidate = async (req, res) => {
  try {
    const { applicantId } = req.body;

    const application = await JobApplicant.findOne({ applicantId });

    if (!application) {
      return res.status(404).send("Application not found");
    }

    application.jobStatus = "REJECTED";
    await application.save();

    const job = await Job.findOne({ jobid: application.jobid });
    const jobseeker = await JobSeeker.findOne({ email: application.jobseekeremail });

    await sendRejectionEmail(
      jobseeker.email,
      jobseeker.name,
      job.title
    );

    res.send("Candidate rejected");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to reject");
  }
};

const viewJobById = async (req, res) => {
  try {
    const { jobid } = req.params;
    const job = await Job.findOne({ jobid });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.json(job);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const viewJobSeekerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const jobseeker = await JobSeeker.findOne({ email });

    if (!jobseeker) {
      return res.status(404).send("Jobseeker not found");
    }

    res.json(jobseeker);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  checkrecruiterlogin,
  addjob,
  viewjobs,
  viewjobapplicants,
  changejobstatus,
  screenApplicants,
  shortlistCandidate,
  rejectCandidate,
  viewJobById,
  viewJobSeekerByEmail
};