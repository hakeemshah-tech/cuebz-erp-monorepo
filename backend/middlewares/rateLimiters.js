// middlewares/rateLimiters.js
const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15m
  max: 20, // 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { forgotPasswordLimiter };
