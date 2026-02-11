const JobSeeker = require("../models/JobSeeker")
const Job = require("../models/Job")
const JobApplicant = require("../models/JobApplicant")
const upload = require("../multerConfig");


const { sendApplicationReceivedEmail } = require("../services/emailService"); // ✅ ADD THIS LINE

// Your other imports...
const insertjobseeker = async (request, response) => {
    try 
    {
      const input = request.body;
      const jobseeker = new JobSeeker(input);
      await jobseeker.save();
      response.status(200).send('Registered Successfully');
    } 
    catch(e) 
    {
      response.status(500).send(e.message);
    }
  };

  const updatejobseekerprofile = async (request, response) => 
  {
    try 
    {
      const input = request.body;
      const email = input.email; 
      const jobseeker = await JobSeeker.findOne({ email });
      if (!jobseeker) 
      {
        response.status(200).send('Job seeker not found with the provided email id');
      }
      for (const key in input) 
      {
        if (key !== 'email' && input[key]) {
          jobseeker[key] = input[key];
        }
      }
      await jobseeker.save();
      response.status(200).send('Job Seeker Profile Updated Successfully');
    } 
    catch (e) 
    {
      response.status(500).send(e.message);
    }
  };


  const checkjobseekerlogin = async (request, response) => 
  {
     try 
     {
       const input = request.body
       const jobseeker = await JobSeeker.findOne(input)
       response.json(jobseeker)
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };

   const jobseekerprofile = async (request, response) => 
   {
      try 
      {
        const email = request.params.email
        const jobseeker = await JobSeeker.findOne({email})
        if(jobseeker)
        {
          response.json(jobseeker)
        }
        else
        {
          return response.status(200).send('Job seeker not found with the provided email id');
        }
        
      } 
      catch (error) 
      {
        response.status(500).send(error.message);
      }
    };

  const viewjobsbyjobseeker = async (request, response) => 
 {
    try 
    {
      const jobs = await Job.find();
      if(jobs.length==0)
      {
        response.status(200).send("DATA NOT FOUND");
      }
      else
      {
        response.json(jobs);
      }
    } 
    catch (error) 
    {
      response.status(500).send(error.message);
    }
  };

  const appliedjobs = async (request, response) => 
 {
    try 
    {
      const email = request.params.email
      const appliedjobs = await JobApplicant.find({"jobseekeremail":email});
      if(appliedjobs.length==0)
      {
        response.status(200).send("DATA NOT FOUND");
      }
      else
      {
        response.json(appliedjobs);
      }
    } 
    catch (error) 
    {
      response.status(500).send(error.message);
    }
  };

  const applyjob = async (request, response) => {
    try {
        const input = request.body; 
        const resumeFile = request.file;

        const alreadyapplied = await JobApplicant.findOne({
            jobid: input.jobid,
            jobseekeremail: input.jobseekeremail
        });

        if (!alreadyapplied) {
            const jobapplicant = new JobApplicant({
                jobid: input.jobid,
                jobseekeremail: input.jobseekeremail,
                resume: resumeFile ? resumeFile.filename : null
            });

            await jobapplicant.save();

            // ✅ ADD EMAIL SENDING HERE
            try {
                const job = await Job.findOne({ jobid: input.jobid });
                const jobseeker = await JobSeeker.findOne({ email: input.jobseekeremail });

                if (job && jobseeker) {
                    await sendApplicationReceivedEmail(
                        jobseeker.email,
                        jobseeker.name,
                        job.title
                    );
                    console.log("✅ Application confirmation email sent to:", jobseeker.email);
                }
            } catch (emailError) {
                console.error("❌ Email sending failed (but application saved):", emailError.message);
                // Don't fail the application if email fails
            }

            response.status(200).send("Job Applied Successfully");
        } else {
            response.status(200).send("OOPS ... You have already applied for this Job");
        }
    } catch (e) {
        console.error("❌ Error in applyjob:", e);
        response.status(500).send(e.message);
    }
  };

  const { 
    sendShortlistedEmail,
    sendRejectionEmail 
  } = require("../services/emailService");

  



  module.exports = {insertjobseeker,checkjobseekerlogin,updatejobseekerprofile,jobseekerprofile,viewjobsbyjobseeker,applyjob,appliedjobs};