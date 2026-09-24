const rateLimit = require("express-rate-limit");

// Apply stricter limits on login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Max 10 requests in 5 minutes
  message: {
    statusCode: 400,
    message: "Too many login attempts, please try again later.",
  },
});

// Apply normal limits for other routes
const normalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests in 15 minutes
  message: {
    statusCode: 400,
    message: "Too many requests, please try again later.",
  },
});

module.exports = { loginLimiter, normalLimiter };
