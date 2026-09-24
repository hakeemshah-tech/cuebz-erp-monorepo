const winston = require("winston");

// Create a custom log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Include timestamp in each log
    logFormat, // Custom log format
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }), // Console output
    new winston.transports.File({ filename: "logs/app.log" }), // File output for persistence
  ],
});

// Optional: If you want to log errors to a separate file
logger.add(
  new winston.transports.File({
    level: "error",
    filename: "logs/error.log",
  }),
);

module.exports = logger;
