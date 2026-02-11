const mongoose = require('mongoose');
const moment = require('moment-timezone');

const jobApplicantSchema = new mongoose.Schema({
    applicantId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateRandomId()
    },
    resumeScore: {
        type: Number,
        default: 0
    },
    shortlisted: {
        type: Boolean,
        default: false
    },

    // this value will be taken from Job model
    jobid: {
        type: Number,
        required: true
    },

    // this value will be taken from Job Seeker model
    jobseekeremail: {
        type: String,
        required: true
    },

    jobStatus: {
        type: String,
        required: true,
        default: "APPLIED"
    },

    // ✅ ADD THIS FIELD
    resume: {
        type: String
    },
    screenedAt: {
        type: String,
        default: null
    },


    appliedTime: {
        type: String,
        default: () =>
            moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss A')
    },

    // ✅ AI-RELATED FIELDS
    aiScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    aiRecommendation: {
        type: String,
        enum: ['STRONG_MATCH', 'GOOD_MATCH', 'MAYBE', 'REJECT', null],
        default: null
    },
    aiStrengths: [{
        type: String
    }],
    aiConcerns: [{
        type: String
    }],
    suggestedQuestions: [{
        type: String
    }],
    coverLetter: {
        type: String,
        default: null
    },
    aiGeneratedInsights: {
        type: Object,
        default: {}
    }

});

const JobApplicant = mongoose.model('JobApplicant', jobApplicantSchema);

function generateRandomId() {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return "J" + randomNumber;
}

module.exports = JobApplicant;
