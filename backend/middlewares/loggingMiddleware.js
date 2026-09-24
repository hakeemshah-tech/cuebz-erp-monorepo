// middlewares/loggerMiddleware.js

const logger = require("../config/logger");

// Logging middleware function
const logRequest = (req, res, next) => {
  // Store the original send function to capture the status code
  const originalSend = res.send;

  // Capture the status code when the response is sent
  res.send = function (body) {
    const statusCode = res.statusCode;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Log the request and response details
    logger.info(
      `Request method: ${req.method}, Request URL: ${req.url}, Status: ${statusCode}, IP: ${ipAddress}, User-Agent: ${userAgent}`,
    );

    // Call the original send function to send the response
    originalSend.call(this, body);
  };

  next(); // Proceed to the next middleware or route handler
};

module.exports = logRequest;
