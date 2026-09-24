/* eslint-disable no-unused-vars */

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // Handle express-validator errors
  if (err.name === "Error" && err.message) {
    // If the error message contains the validation messages
    if (err.statusCode === 400) {
      statusCode = 400;
      message = err.message; // Use the error message from validation
    }
  }

  // Handle Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate field value: ${field} already exists.`;
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle Invalid ObjectId error (CastError)
  if (err.name === "CastError") {
    statusCode = 400;
    console.log(err, "CASTTTTT");
    message = `Invalid ${err.path}: ${err.value}.`;
    errors = { [err.path]: err.value };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
