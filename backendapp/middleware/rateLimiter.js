const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for AI endpoints to prevent abuse and control costs
 */

// General AI endpoint limiter - 100 requests per hour per user
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    message: {
        error: 'Too many AI requests from this account. Please try again after an hour.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use email from request body or IP as fallback
        return req.body.userEmail || req.body.email || req.ip;
    },
    handler: (req, res) => {
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'You have made too many AI requests. Please try again later.',
            retryAfter: '1 hour'
        });
    }
});

// Heavy operation limiter (resume screening, job matching) - 20 per hour
const heavyAILimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        error: 'Too many heavy AI operations. Please try again after an hour.',
        retryAfter: '1 hour'
    },
    keyGenerator: (req) => {
        return req.body.userEmail || req.body.email || req.ip;
    }
});

// Chat/conversation limiter - 200 messages per hour
const chatLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: {
        error: 'Too many chat messages. Please try again after an hour.',
        retryAfter: '1 hour'
    },
    keyGenerator: (req) => {
        return req.body.userEmail || req.body.email || req.ip;
    }
});

// Generation limiter (cover letters, emails, JDs) - 50 per hour
const generationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: {
        error: 'Too many generation requests. Please try again after an hour.',
        retryAfter: '1 hour'
    },
    keyGenerator: (req) => {
        return req.body.userEmail || req.body.email || req.ip;
    }
});

module.exports = {
    aiLimiter,
    heavyAILimiter,
    chatLimiter,
    generationLimiter
};
