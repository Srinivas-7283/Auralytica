const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const {
    aiLimiter,
    heavyAILimiter,
    chatLimiter,
    generationLimiter
} = require('../middleware/rateLimiter');

/**
 * AI Routes - All AI-powered endpoints
 * Rate limiting applied based on operation type
 */

/* ===============================
   JOB SEEKER ROUTES
================================ */

// Resume Optimizer - Heavy operation
router.post('/optimize-resume', heavyAILimiter, aiController.optimizeResume);

// Smart Job Matching - Heavy operation
router.post('/match-jobs', heavyAILimiter, aiController.matchJobs);

// Cover Letter Generator - Generation operation
router.post('/generate-cover-letter', generationLimiter, aiController.generateCoverLetter);

// Mock Interview - Chat operation
router.post('/mock-interview', chatLimiter, aiController.conductMockInterview);

// Career Path Advisor - Standard AI operation
router.post('/career-path', aiLimiter, aiController.careerPathAdvisor);

/* ===============================
   RECRUITER ROUTES
================================ */

// Job Description Generator - Generation operation
router.post('/generate-job-description', generationLimiter, aiController.generateJobDescription);

// AI Resume Screening - Heavy operation (replaces keyword screening)
router.post('/screen-resumes', heavyAILimiter, aiController.aiScreenResumes);

// Interview Question Generator - Generation operation
router.post('/generate-interview-questions', generationLimiter, aiController.generateInterviewQuestions);

// Email Response Generator - Generation operation
router.post('/generate-email', generationLimiter, aiController.generateEmail);

// Candidate Comparison - Heavy operation
router.post('/compare-candidates', heavyAILimiter, aiController.compareCandidates);

// Bias Checker - Standard AI operation
router.post('/check-bias', aiLimiter, aiController.checkJobDescriptionBias);

/* ===============================
   ANALYTICS ROUTES
================================ */

// Predictive Analytics - Standard AI operation
router.post('/predict-success', aiLimiter, aiController.predictCandidateSuccess);

// Hiring Trends Analyzer - Heavy operation
router.post('/analyze-trends', heavyAILimiter, aiController.analyzeHiringTrends);

// Platform Assistant Chatbot - Chat operation
router.post('/assistant', chatLimiter, aiController.platformAssistant);

/* ===============================
   HEALTH CHECK
================================ */

router.get('/health', (req, res) => {
    const openaiService = require('../services/openaiService');
    res.json({
        status: 'OK',
        aiConfigured: openaiService.isConfigured(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
