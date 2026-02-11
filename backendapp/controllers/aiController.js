const openaiService = require('../services/openaiService');
const Job = require('../models/Job');
const JobApplicant = require('../models/JobApplicant');
const JobSeeker = require('../models/JobSeeker');
const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * AI Controller - Handles all AI-powered features
 * Contains 14 AI endpoints for job seekers, recruiters, and analytics
 */

/* ===============================
   JOB SEEKER FEATURES (5)
================================ */

/**
 * 1. AI Resume Optimizer
 * Analyzes resume and provides ATS score, improvements, and tailored suggestions
 */
const optimizeResume = async (req, res) => {
    try {
        const { resumeText, targetJobDescription, userEmail } = req.body;

        if (!resumeText || resumeText.trim().length < 100) {
            return res.status(400).json({ error: 'Resume text is required (minimum 100 characters)' });
        }

        const prompt = `
You are an expert resume consultant and ATS (Applicant Tracking System) specialist. Analyze this resume thoroughly.

Resume:
${openaiService.truncateToTokens(resumeText, 2000)}

${targetJobDescription ? `Target Job Description:\n${openaiService.truncateToTokens(targetJobDescription, 1000)}` : ''}

Provide a comprehensive analysis in JSON format:
{
  "atsScore": 0-100,
  "overallAssessment": "brief summary",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    {"issue": "specific issue", "suggestion": "how to fix", "priority": "HIGH|MEDIUM|LOW"}
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionsToAdd": ["section1", "section2"],
  "sectionsToRemove": ["section1"],
  "formattingIssues": ["issue1", "issue2"],
  "tailoredSuggestions": ["suggestion1", "suggestion2"],
  "actionItems": ["action1", "action2", "action3"]
}

Be specific, actionable, and professional.
`;

        const analysis = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2000, temperature: 0.5 }
        );

        console.log(`✅ Resume optimized for user: ${userEmail}`);
        res.json({ success: true, analysis });

    } catch (error) {
        console.error('❌ Resume optimization error:', error.message);
        res.status(500).json({ error: error.message || 'Resume optimization failed' });
    }
};

/**
 * 2. Smart Job Matching
 * AI-powered job recommendations based on resume and preferences
 */
const matchJobs = async (req, res) => {
    try {
        const { resumeText, skills, experience, preferences, userEmail } = req.body;

        if (!resumeText && !skills) {
            return res.status(400).json({ error: 'Resume text or skills are required' });
        }

        // Fetch all available jobs
        const allJobs = await Job.find().limit(100);

        if (allJobs.length === 0) {
            return res.json({ success: true, matches: [] });
        }

        const jobDescriptions = allJobs.map(job => ({
            id: job.jobid,
            title: job.title,
            company: job.company,
            description: job.description.substring(0, 300),
            requirements: job.requirements.substring(0, 200),
            location: job.location,
            salary: job.salary,
            jobtype: job.jobtype
        }));

        const prompt = `
You are an expert job matching AI. Analyze this candidate profile and match them with the best jobs.

Candidate Profile:
- Skills: ${skills ? skills.join(', ') : 'See resume'}
- Experience: ${experience || 'See resume'}
- Preferences: ${preferences || 'None specified'}
- Resume Summary: ${resumeText ? openaiService.truncateToTokens(resumeText, 1000) : 'Not provided'}

Available Jobs (${allJobs.length} total):
${JSON.stringify(jobDescriptions, null, 2)}

Provide top 5 best matches in JSON format:
{
  "matches": [
    {
      "jobId": 123456,
      "jobTitle": "title",
      "company": "company name",
      "matchScore": 0-100,
      "matchReasons": ["reason1", "reason2", "reason3"],
      "skillGaps": ["gap1", "gap2"],
      "applicationTips": ["tip1", "tip2"],
      "salaryFit": "Above/Below/At expectations",
      "cultureFit": "assessment"
    }
  ]
}

Rank by best overall fit considering skills, experience, and preferences.
`;

        const result = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2500, temperature: 0.6 }
        );

        console.log(`✅ Job matching completed for user: ${userEmail}`);
        res.json({ success: true, ...result });

    } catch (error) {
        console.error('❌ Job matching error:', error.message);
        res.status(500).json({ error: error.message || 'Job matching failed' });
    }
};

/**
 * 3. Cover Letter Generator
 * Creates personalized cover letters for specific jobs
 */
const generateCoverLetter = async (req, res) => {
    try {
        const { jobTitle, company, jobDescription, resumeText, tone, userEmail, userName } = req.body;

        if (!jobTitle || !company) {
            return res.status(400).json({ error: 'Job title and company are required' });
        }

        const prompt = `
Generate a compelling, personalized cover letter for this job application.

Position: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription ? openaiService.truncateToTokens(jobDescription, 800) : 'Not provided'}

Candidate Information:
Name: ${userName || '[Your Name]'}
Resume Summary: ${resumeText ? openaiService.truncateToTokens(resumeText, 1000) : 'Not provided'}

Tone: ${tone || 'Professional and enthusiastic'}

Requirements:
- Address specific job requirements from the description
- Highlight 2-3 relevant achievements from resume
- Show genuine interest in the company
- Keep it concise (250-350 words)
- Include specific examples
- Professional formatting
- Strong opening and closing

Format the letter properly with:
[Your Name]
[Your Email]
[Date]

[Hiring Manager]
${company}

Dear Hiring Manager,

[Body paragraphs]

Sincerely,
${userName || '[Your Name]'}
`;

        const coverLetter = await openaiService.simpleChat(prompt, {
            model: openaiService.premiumModel,
            max_tokens: 1000,
            temperature: 0.8
        });

        console.log(`✅ Cover letter generated for ${userEmail} - ${jobTitle} at ${company}`);
        res.json({ success: true, coverLetter });

    } catch (error) {
        console.error('❌ Cover letter generation error:', error.message);
        res.status(500).json({ error: error.message || 'Cover letter generation failed' });
    }
};

/**
 * 4. Enhanced Mock Interview
 * Conducts interactive mock interviews with real-time feedback
 */
const conductMockInterview = async (req, res) => {
    try {
        const { jobRole, interviewType, conversationHistory, userEmail } = req.body;

        if (!jobRole || !interviewType) {
            return res.status(400).json({ error: 'Job role and interview type are required' });
        }

        const systemPrompt = `
You are an experienced ${interviewType} interviewer conducting an interview for a ${jobRole} position.

Instructions:
- Ask ONE question at a time
- After the candidate answers, provide brief feedback (2-3 sentences)
- Rate their answer: Excellent/Good/Needs Improvement
- Ask follow-up questions based on their responses
- After 5 Q&A exchanges, provide overall assessment
- Evaluate: Technical accuracy, Communication, Problem-solving, Culture fit

Interview Types:
- Technical: Focus on technical skills, coding, problem-solving
- Behavioral: Use STAR method, past experiences
- HR: Culture fit, motivation, career goals
- Case Study: Business scenarios, analytical thinking

Be professional but encouraging. Point out both strengths and areas for improvement.
`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || [])
        ];

        const response = await openaiService.chat(messages, {
            model: openaiService.premiumModel,
            max_tokens: 600,
            temperature: 0.7
        });

        const questionCount = (conversationHistory || []).filter(m => m.role === 'assistant').length;
        const continueMock = questionCount < 6; // 5 questions + final feedback

        console.log(`✅ Mock interview response generated for ${userEmail} - ${jobRole}`);
        res.json({
            success: true,
            message: response,
            continueMock,
            questionNumber: questionCount + 1
        });

    } catch (error) {
        console.error('❌ Mock interview error:', error.message);
        res.status(500).json({ error: error.message || 'Mock interview failed' });
    }
};

/**
 * 5. Career Path Advisor
 * Provides personalized career development guidance
 */
const careerPathAdvisor = async (req, res) => {
    try {
        const { currentRole, skills, goals, timeframe, experience, userEmail } = req.body;

        if (!currentRole || !goals) {
            return res.status(400).json({ error: 'Current role and career goals are required' });
        }

        const prompt = `
You are a professional career counselor. Create a personalized career development plan.

Current Situation:
- Current Role: ${currentRole}
- Experience: ${experience || 'Not specified'}
- Skills: ${skills ? skills.join(', ') : 'Not specified'}
- Career Goals: ${goals}
- Timeframe: ${timeframe || '2-3 years'}

Provide a comprehensive career plan in JSON format:
{
  "careerPath": [
    {
      "step": 1,
      "targetRole": "role name",
      "timeline": "6-12 months",
      "requiredSkills": ["skill1", "skill2"],
      "certifications": ["cert1", "cert2"],
      "expectedSalaryRange": "$X - $Y",
      "keyActions": ["action1", "action2"]
    }
  ],
  "skillDevelopmentPlan": [
    {"skill": "skill name", "priority": "HIGH|MEDIUM|LOW", "learningPath": "how to learn"}
  ],
  "certifications": [
    {"name": "cert name", "provider": "provider", "estimatedCost": "$X", "timeToComplete": "X months"}
  ],
  "industryTrends": ["trend1", "trend2"],
  "potentialPivots": ["alternative career path 1", "alternative career path 2"],
  "networking": ["networking tip 1", "networking tip 2"],
  "immediateActions": ["action1", "action2", "action3"]
}

Be realistic, data-driven, and actionable.
`;

        const careerPlan = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2000, temperature: 0.6 }
        );

        console.log(`✅ Career path advice generated for ${userEmail}`);
        res.json({ success: true, careerPlan });

    } catch (error) {
        console.error('❌ Career path advisor error:', error.message);
        res.status(500).json({ error: error.message || 'Career path advice failed' });
    }
};

/* ===============================
   RECRUITER FEATURES (6)
================================ */

/**
 * 6. Job Description Generator
 * Creates compelling job descriptions from basic inputs
 */
const generateJobDescription = async (req, res) => {
    try {
        const {
            jobTitle,
            department,
            seniorityLevel,
            keyResponsibilities,
            requiredSkills,
            companyDescription,
            location,
            salary,
            userEmail
        } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: 'Job title is required' });
        }

        const prompt = `
Create a compelling, professional job description that attracts top talent.

Position Details:
- Job Title: ${jobTitle}
- Department: ${department || 'Not specified'}
- Seniority Level: ${seniorityLevel || 'Not specified'}
- Location: ${location || 'Not specified'}
- Salary Range: ${salary || 'Competitive'}

Key Responsibilities:
${keyResponsibilities || 'To be defined based on role'}

Required Skills:
${requiredSkills ? requiredSkills.join(', ') : 'To be defined based on role'}

Company:
${companyDescription || 'Dynamic and growing organization'}

Generate a complete job description with these sections:

## Job Summary
[Engaging 2-3 sentence overview]

## About the Role
[Detailed role description]

## Key Responsibilities
[5-7 specific, actionable bullet points]

## Required Qualifications
[Must-have skills, education, experience]

## Preferred Qualifications
[Nice-to-have skills and experience]

## What We Offer
[Benefits, growth opportunities, culture]

## How to Apply
[Application instructions]

Requirements:
- Use inclusive, bias-free language
- Make it scannable with clear sections
- Include SEO keywords for job boards
- Professional yet engaging tone
- ATS-friendly formatting
- Highlight unique selling points
`;

        const jobDescription = await openaiService.simpleChat(prompt, {
            model: openaiService.premiumModel,
            max_tokens: 1500,
            temperature: 0.7
        });

        console.log(`✅ Job description generated by ${userEmail} for ${jobTitle}`);
        res.json({ success: true, jobDescription });

    } catch (error) {
        console.error('❌ Job description generation error:', error.message);
        res.status(500).json({ error: error.message || 'Job description generation failed' });
    }
};

/**
 * 7. AI Resume Screening (Replaces keyword matching)
 * Intelligent evaluation of resumes with detailed insights
 */
const aiScreenResumes = async (req, res) => {
    try {
        const { jobid, jobDescription, requiredSkills, minExperience, userEmail } = req.body;

        if (!jobid) {
            return res.status(400).json({ error: 'Job ID is required' });
        }

        // Fetch applicants for this job
        const applicants = await JobApplicant.find({ jobid }).limit(50);

        if (applicants.length === 0) {
            return res.json({ success: true, message: 'No applicants found for this job', screened: 0 });
        }

        // Fetch job details if description not provided
        let jdText = jobDescription;
        if (!jdText) {
            const job = await Job.findOne({ jobid });
            if (job) {
                jdText = `${job.title}\n${job.description}\n${job.requirements}`;
            }
        }

        const screenedResults = [];
        let screenedCount = 0;

        for (const applicant of applicants) {
            try {
                // Skip if no resume
                if (!applicant.resume) {
                    applicant.aiScore = 0;
                    applicant.aiRecommendation = 'REJECT';
                    applicant.aiConcerns = ['No resume uploaded'];
                    applicant.shortlisted = false;
                    applicant.screenedAt = new Date().toISOString();
                    await applicant.save();
                    continue;
                }

                // Read and parse resume
                const resumePath = `upload/${applicant.resume}`;
                if (!fs.existsSync(resumePath)) {
                    applicant.aiScore = 0;
                    applicant.aiRecommendation = 'REJECT';
                    applicant.aiConcerns = ['Resume file not found'];
                    applicant.shortlisted = false;
                    applicant.screenedAt = new Date().toISOString();
                    await applicant.save();
                    continue;
                }

                const buffer = fs.readFileSync(resumePath);
                const pdfData = await pdfParse(buffer);
                const resumeText = pdfData.text;

                if (!resumeText || resumeText.trim().length < 100) {
                    applicant.aiScore = 0;
                    applicant.aiRecommendation = 'REJECT';
                    applicant.aiConcerns = ['Resume has no extractable text'];
                    applicant.shortlisted = false;
                    applicant.screenedAt = new Date().toISOString();
                    await applicant.save();
                    continue;
                }

                // AI Evaluation
                const prompt = `
You are an expert technical recruiter. Evaluate this candidate's resume objectively.

Job Description:
${openaiService.truncateToTokens(jdText || 'General position', 1000)}

Required Skills: ${requiredSkills ? requiredSkills.join(', ') : 'See job description'}
Minimum Experience: ${minExperience || 'Not specified'} years

Candidate Resume:
${openaiService.truncateToTokens(resumeText, 2500)}

Provide evaluation in JSON format:
{
  "overallScore": 0-100,
  "technicalSkillsMatch": 0-100,
  "experienceMatch": 0-100,
  "educationMatch": 0-100,
  "cultureFitIndicators": ["indicator1", "indicator2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "STRONG_MATCH|GOOD_MATCH|MAYBE|REJECT",
  "interviewQuestions": ["question1", "question2", "question3"],
  "reasoning": "Brief explanation of the recommendation"
}

Be thorough, objective, and professional.
`;

                const evaluation = await openaiService.chatJSON(
                    [{ role: 'user', content: prompt }],
                    { model: openaiService.premiumModel, max_tokens: 1200, temperature: 0.3 }
                );

                // Update applicant with AI insights
                applicant.aiScore = evaluation.overallScore;
                applicant.aiRecommendation = evaluation.recommendation;
                applicant.aiStrengths = evaluation.strengths;
                applicant.aiConcerns = evaluation.concerns;
                applicant.suggestedQuestions = evaluation.interviewQuestions;
                applicant.shortlisted = evaluation.overallScore >= 70;
                applicant.screenedAt = new Date().toISOString();
                applicant.aiGeneratedInsights = {
                    technicalSkillsMatch: evaluation.technicalSkillsMatch,
                    experienceMatch: evaluation.experienceMatch,
                    educationMatch: evaluation.educationMatch,
                    cultureFitIndicators: evaluation.cultureFitIndicators,
                    reasoning: evaluation.reasoning
                };

                await applicant.save();

                screenedResults.push({
                    applicantId: applicant.applicantId,
                    name: applicant.jobseekername,
                    score: evaluation.overallScore,
                    recommendation: evaluation.recommendation
                });

                screenedCount++;
                console.log(`✅ Screened: ${applicant.applicantId} - Score: ${evaluation.overallScore}`);

            } catch (innerError) {
                console.error(`❌ Error screening applicant ${applicant.applicantId}:`, innerError.message);
                // Continue with next applicant
            }
        }

        console.log(`✅ AI screening completed by ${userEmail} - ${screenedCount} applicants screened`);
        res.json({
            success: true,
            message: `AI screening completed for ${screenedCount} applicants`,
            screened: screenedCount,
            results: screenedResults
        });

    } catch (error) {
        console.error('❌ AI resume screening error:', error.message);
        res.status(500).json({ error: error.message || 'AI resume screening failed' });
    }
};

/**
 * 8. Interview Question Generator
 * Creates tailored interview questions for specific candidates
 */
const generateInterviewQuestions = async (req, res) => {
    try {
        const { applicantId, jobDescription, resumeText, interviewRound, userEmail } = req.body;

        if (!applicantId && !resumeText) {
            return res.status(400).json({ error: 'Applicant ID or resume text is required' });
        }

        let candidateResume = resumeText;

        // Fetch resume if applicantId provided
        if (applicantId && !candidateResume) {
            const applicant = await JobApplicant.findOne({ applicantId });
            if (applicant && applicant.resume) {
                const resumePath = `upload/${applicant.resume}`;
                if (fs.existsSync(resumePath)) {
                    const buffer = fs.readFileSync(resumePath);
                    const pdfData = await pdfParse(buffer);
                    candidateResume = pdfData.text;
                }
            }
        }

        const prompt = `
Generate targeted interview questions for ${interviewRound || 'first'} round interview.

Job Description:
${jobDescription ? openaiService.truncateToTokens(jobDescription, 1000) : 'General technical position'}

Candidate's Resume:
${candidateResume ? openaiService.truncateToTokens(candidateResume, 1500) : 'Not provided'}

Generate 10 interview questions in JSON format:
{
  "questions": [
    {
      "question": "The interview question",
      "category": "Technical|Behavioral|Situational|Culture Fit",
      "difficulty": "Easy|Medium|Hard",
      "purpose": "Why you're asking this",
      "redFlags": ["red flag 1", "red flag 2"],
      "greenFlags": ["green flag 1", "green flag 2"],
      "followUp": "Suggested follow-up question"
    }
  ]
}

Distribution:
- 40% Technical (based on resume projects and skills)
- 30% Behavioral (using STAR method)
- 20% Situational (role-specific scenarios)
- 10% Culture fit

Make questions specific to this candidate's background.
`;

        const result = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2500, temperature: 0.7 }
        );

        console.log(`✅ Interview questions generated by ${userEmail} for applicant ${applicantId}`);
        res.json({ success: true, ...result });

    } catch (error) {
        console.error('❌ Interview question generation error:', error.message);
        res.status(500).json({ error: error.message || 'Interview question generation failed' });
    }
};

/**
 * 9. Email Response Generator
 * Generates professional emails for various recruitment scenarios
 */
const generateEmail = async (req, res) => {
    try {
        const { emailType, candidateName, jobTitle, context, companyName, userEmail } = req.body;

        if (!emailType || !candidateName) {
            return res.status(400).json({ error: 'Email type and candidate name are required' });
        }

        const emailTemplates = {
            rejection: 'Polite rejection email after interview',
            screening_call: 'Invitation for phone screening',
            interview_invite: 'Interview invitation with details',
            offer: 'Job offer letter',
            follow_up: 'Interview follow-up and next steps',
            application_received: 'Application confirmation',
            schedule_change: 'Interview reschedule notification'
        };

        const prompt = `
Write a professional ${emailTemplates[emailType] || emailType} email.

Details:
- Candidate Name: ${candidateName}
- Position: ${jobTitle || 'Not specified'}
- Company: ${companyName || 'Our company'}
- Context: ${context || 'Standard communication'}

Requirements:
- Professional yet warm and personable tone
- Specific to this candidate and situation
- Include clear next steps (if applicable)
- Maintain positive employer brand
- 150-250 words
- Proper email formatting with subject line

Format:
Subject: [Subject line]

Dear ${candidateName},

[Email body]

Best regards,
[Hiring Team]
${companyName || 'Company Name'}
`;

        const emailContent = await openaiService.simpleChat(prompt, {
            model: 'gpt-4',
            max_tokens: 600,
            temperature: 0.8
        });

        console.log(`✅ Email generated by ${userEmail} - Type: ${emailType}`);
        res.json({ success: true, emailContent, emailType });

    } catch (error) {
        console.error('❌ Email generation error:', error.message);
        res.status(500).json({ error: error.message || 'Email generation failed' });
    }
};

/**
 * 10. Candidate Comparison Tool
 * Compares multiple candidates side-by-side with AI analysis
 */
const compareCandidates = async (req, res) => {
    try {
        const { candidateIds, jobDescription, evaluationCriteria, userEmail } = req.body;

        if (!candidateIds || candidateIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 candidate IDs are required for comparison' });
        }

        if (candidateIds.length > 5) {
            return res.status(400).json({ error: 'Maximum 5 candidates can be compared at once' });
        }

        // Fetch candidate data
        const candidates = await JobApplicant.find({
            applicantId: { $in: candidateIds }
        });

        if (candidates.length < 2) {
            return res.status(404).json({ error: 'Not enough candidates found' });
        }

        const candidateProfiles = [];

        for (const candidate of candidates) {
            let resumeText = 'Resume not available';

            if (candidate.resume) {
                const resumePath = `upload/${candidate.resume}`;
                if (fs.existsSync(resumePath)) {
                    try {
                        const buffer = fs.readFileSync(resumePath);
                        const pdfData = await pdfParse(buffer);
                        resumeText = pdfData.text.substring(0, 2000);
                    } catch (e) {
                        console.error(`Error reading resume for ${candidate.applicantId}`);
                    }
                }
            }

            candidateProfiles.push({
                id: candidate.applicantId,
                name: candidate.jobseekername,
                email: candidate.jobseekeremail,
                currentScore: candidate.aiScore || candidate.resumeScore || 0,
                resumeSummary: resumeText.substring(0, 1000),
                aiStrengths: candidate.aiStrengths || [],
                aiConcerns: candidate.aiConcerns || []
            });
        }

        const prompt = `
Compare these candidates objectively for the position. Provide data-driven analysis.

Job Description:
${jobDescription ? openaiService.truncateToTokens(jobDescription, 1000) : 'General position'}

Evaluation Criteria:
${evaluationCriteria ? evaluationCriteria.join(', ') : 'Technical skills, Experience, Culture fit, Communication'}

Candidates:
${JSON.stringify(candidateProfiles, null, 2)}

Provide comprehensive comparison in JSON format:
{
  "comparisonTable": [
    {
      "criterion": "criterion name",
      "candidates": [
        {"id": "candidateId", "score": 0-10, "notes": "brief note"}
      ]
    }
  ],
  "candidateAnalysis": [
    {
      "candidateId": "id",
      "candidateName": "name",
      "rank": 1,
      "overallScore": 0-100,
      "topStrengths": ["strength1", "strength2", "strength3"],
      "keyDifferentiators": ["differentiator1", "differentiator2"],
      "concerns": ["concern1", "concern2"],
      "riskAssessment": "LOW|MEDIUM|HIGH",
      "interviewFocusAreas": ["area1", "area2"]
    }
  ],
  "recommendation": {
    "firstChoice": "candidateId",
    "reasoning": "detailed explanation",
    "alternativeChoice": "candidateId",
    "alternativeReasoning": "explanation"
  }
}

Be objective, unbiased, and thorough.
`;

        const comparison = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2500, temperature: 0.4 }
        );

        console.log(`✅ Candidate comparison completed by ${userEmail} - ${candidates.length} candidates`);
        res.json({ success: true, comparison });

    } catch (error) {
        console.error('❌ Candidate comparison error:', error.message);
        res.status(500).json({ error: error.message || 'Candidate comparison failed' });
    }
};

/**
 * 11. Bias Checker
 * Analyzes job descriptions for bias and suggests improvements
 */
const checkJobDescriptionBias = async (req, res) => {
    try {
        const { jobDescription, userEmail } = req.body;

        if (!jobDescription || jobDescription.trim().length < 50) {
            return res.status(400).json({ error: 'Job description is required (minimum 50 characters)' });
        }

        const prompt = `
Analyze this job description for potential bias and exclusionary language that might discourage diverse candidates.

Job Description:
${openaiService.truncateToTokens(jobDescription, 2000)}

Check for:
1. Gender-coded words (masculine/feminine bias)
2. Age bias indicators
3. Cultural assumptions
4. Unnecessary requirements that exclude diverse talent
5. Ableist language
6. Socioeconomic bias
7. Educational elitism

Provide analysis in JSON format:
{
  "biasScore": 0-100,
  "overallAssessment": "brief summary",
  "biasCategories": [
    {
      "category": "Gender|Age|Cultural|Ability|Socioeconomic|Education",
      "severity": "HIGH|MEDIUM|LOW",
      "problematicPhrases": ["phrase1", "phrase2"],
      "suggestedReplacements": ["replacement1", "replacement2"],
      "explanation": "why this is problematic"
    }
  ],
  "inclusiveRewrite": "Rewritten version of biased sections",
  "recommendations": ["recommendation1", "recommendation2"],
  "positiveAspects": ["what's already good"]
}

Be thorough and educational. Score: 0 = no bias, 100 = highly biased.
`;

        const biasAnalysis = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2000, temperature: 0.3 }
        );

        console.log(`✅ Bias check completed by ${userEmail} - Score: ${biasAnalysis.biasScore}`);
        res.json({ success: true, biasAnalysis });

    } catch (error) {
        console.error('❌ Bias check error:', error.message);
        res.status(500).json({ error: error.message || 'Bias check failed' });
    }
};

/* ===============================
   ANALYTICS FEATURES (3)
================================ */

/**
 * 12. Predictive Analytics
 * Predicts candidate success probability
 */
const predictCandidateSuccess = async (req, res) => {
    try {
        const { applicantId, jobid, userEmail } = req.body;

        if (!applicantId || !jobid) {
            return res.status(400).json({ error: 'Applicant ID and Job ID are required' });
        }

        const applicant = await JobApplicant.findOne({ applicantId });
        const job = await Job.findOne({ jobid });
        const jobseeker = await JobSeeker.findOne({ email: applicant?.jobseekeremail });

        if (!applicant || !job) {
            return res.status(404).json({ error: 'Applicant or job not found' });
        }

        // Get historical successful hires (mock data for now)
        const historicalData = {
            successfulHires: 45,
            avgTenure: '2.5 years',
            topSuccessFactors: ['Strong technical skills', 'Cultural alignment', 'Growth mindset']
        };

        const prompt = `
Predict this candidate's likelihood of success in the role based on available data.

Role Requirements:
- Title: ${job.title}
- Company: ${job.company}
- Requirements: ${job.requirements.substring(0, 500)}
- Type: ${job.jobtype}

Candidate Profile:
- Name: ${jobseeker?.fullname || 'Unknown'}
- Email: ${jobseeker?.email || applicant.jobseekeremail}
- Location: ${jobseeker?.location || 'Unknown'}
- AI Score: ${applicant.aiScore || 'Not scored'}
- Strengths: ${applicant.aiStrengths?.join(', ') || 'Not analyzed'}

Historical Success Patterns:
${JSON.stringify(historicalData, null, 2)}

Provide prediction in JSON format:
{
  "successProbability": 0-100,
  "confidence": "HIGH|MEDIUM|LOW",
  "keySuccessFactors": ["factor1", "factor2", "factor3"],
  "potentialChallenges": ["challenge1", "challenge2"],
  "onboardingRecommendations": ["rec1", "rec2", "rec3"],
  "estimatedTimeToProductivity": "X months",
  "retentionRisk": "LOW|MEDIUM|HIGH",
  "retentionRiskFactors": ["factor1", "factor2"],
  "developmentAreas": ["area1", "area2"],
  "reasoning": "Detailed explanation of the prediction"
}

Be realistic and data-driven.
`;

        const prediction = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 1500, temperature: 0.4 }
        );

        console.log(`✅ Success prediction completed by ${userEmail} for ${applicantId}`);
        res.json({ success: true, prediction });

    } catch (error) {
        console.error('❌ Predictive analytics error:', error.message);
        res.status(500).json({ error: error.message || 'Predictive analytics failed' });
    }
};

/**
 * 13. Hiring Trends Analyzer
 * Analyzes hiring patterns and provides insights
 */
const analyzeHiringTrends = async (req, res) => {
    try {
        const { recruiterUsername, timeframe, userEmail } = req.body;

        if (!recruiterUsername) {
            return res.status(400).json({ error: 'Recruiter username is required' });
        }

        // Fetch recruiter's jobs and applicants
        const jobs = await Job.find({ 'recruiter.username': recruiterUsername });
        const jobIds = jobs.map(j => j.jobid);
        const applicants = await JobApplicant.find({ jobid: { $in: jobIds } });

        if (jobs.length === 0) {
            return res.json({
                success: true,
                message: 'No hiring data available yet',
                insights: null
            });
        }

        // Calculate metrics
        const totalApplicants = applicants.length;
        const selectedApplicants = applicants.filter(a => a.jobStatus === 'SELECTED').length;
        const rejectedApplicants = applicants.filter(a => a.jobStatus === 'REJECTED').length;
        const avgScore = applicants.reduce((sum, a) => sum + (a.aiScore || a.resumeScore || 0), 0) / totalApplicants;

        // Extract skills from jobs
        const allSkills = jobs.flatMap(j => j.roles || []);
        const skillCounts = {};
        allSkills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
        const topSkills = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

        const data = {
            totalJobs: jobs.length,
            totalApplicants,
            selectedApplicants,
            rejectedApplicants,
            conversionRate: ((selectedApplicants / totalApplicants) * 100).toFixed(2) + '%',
            avgCandidateScore: avgScore.toFixed(1),
            topSkillsRequested: topSkills,
            timeframe: timeframe || 'All time'
        };

        const prompt = `
Analyze this hiring data and provide actionable insights for improving the recruitment process.

Hiring Metrics:
${JSON.stringify(data, null, 2)}

Provide comprehensive analysis in JSON format:
{
  "summary": "Brief overview of hiring performance",
  "keyPatterns": ["pattern1", "pattern2", "pattern3"],
  "strengths": ["strength1", "strength2"],
  "bottlenecks": ["bottleneck1", "bottleneck2"],
  "timeToHireInsights": "Analysis of hiring speed",
  "candidateQualityTrend": "Improving|Stable|Declining",
  "skillsGapAnalysis": ["gap1", "gap2"],
  "recommendations": [
    {
      "area": "area name",
      "issue": "current issue",
      "recommendation": "what to do",
      "expectedImpact": "expected outcome",
      "priority": "HIGH|MEDIUM|LOW"
    }
  ],
  "marketInsights": ["insight1", "insight2"],
  "actionItems": ["action1", "action2", "action3"]
}

Be specific, data-driven, and actionable.
`;

        const insights = await openaiService.chatJSON(
            [{ role: 'user', content: prompt }],
            { model: openaiService.premiumModel, max_tokens: 2000, temperature: 0.6 }
        );

        console.log(`✅ Hiring trends analyzed for ${recruiterUsername}`);
        res.json({ success: true, data, insights });

    } catch (error) {
        console.error('❌ Hiring trends analysis error:', error.message);
        res.status(500).json({ error: error.message || 'Hiring trends analysis failed' });
    }
};

/**
 * 14. Platform Assistant Chatbot
 * General AI assistant for platform navigation and help
 */
const platformAssistant = async (req, res) => {
    try {
        const { question, userRole, conversationHistory, userEmail } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const systemPrompt = `
You are Auralytica's AI assistant, helping users navigate and use the job portal platform effectively.

User Role: ${userRole || 'General user'}

You can help with:
- Platform navigation and features
- Job application process
- Resume tips and best practices
- Interview preparation
- Account settings and profile management
- Subscription plans and pricing
- Technical troubleshooting
- General career advice

Guidelines:
- Be helpful, friendly, and professional
- Provide clear, concise answers
- If you don't know something, guide them to contact support
- Don't make up features that don't exist
- Encourage users to explore AI features
- Keep responses under 200 words

Available AI Features:
- Resume Optimizer
- Smart Job Matching
- Cover Letter Generator
- Mock Interview Practice
- Career Path Advisor
- Job Description Generator (Recruiters)
- AI Resume Screening (Recruiters)
- Interview Question Generator (Recruiters)
- Candidate Comparison (Recruiters)
`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || []),
            { role: 'user', content: question }
        ];

        const answer = await openaiService.chat(messages, {
            model: openaiService.defaultModel,
            max_tokens: 400,
            temperature: 0.7
        });

        console.log(`✅ Platform assistant responded to ${userEmail || 'anonymous'}`);
        res.json({ success: true, answer });

    } catch (error) {
        console.error('❌ Platform assistant error:', error.message);
        res.status(500).json({ error: error.message || 'Platform assistant failed' });
    }
};

/* ===============================
   EXPORTS
================================ */

module.exports = {
    // Job Seeker Features
    optimizeResume,
    matchJobs,
    generateCoverLetter,
    conductMockInterview,
    careerPathAdvisor,

    // Recruiter Features
    generateJobDescription,
    aiScreenResumes,
    generateInterviewQuestions,
    generateEmail,
    compareCandidates,
    checkJobDescriptionBias,

    // Analytics Features
    predictCandidateSuccess,
    analyzeHiringTrends,
    platformAssistant
};
