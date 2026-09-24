const fileUploadMiddleware = require("../fileUpload");

/**
 * Field-specific rules for file types
 */
const fieldRules = {
  photo: { allowedTypes: ["image/jpeg", "image/png", "image/gif"] },
  cv: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ],
  },
  visa_copy: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ],
  },
  emirates_id: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ],
  },
  passport_id: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ],
  },
};

// Middleware for handling employee file uploads
const uploadEmployeeFiles = fileUploadMiddleware(fieldRules).fields([
  { name: "photo", maxCount: 1 }, // Single file for "photo"
  { name: "cv", maxCount: 1 }, // Single file for "cv"
  { name: "visa_copy", maxCount: 1 }, // Single file for "visa_copy"
  { name: "emirates_id", maxCount: 1 }, // Single file for "emirates_id"
  { name: "passport_id", maxCount: 1 }, // Single file for "emirates_id"
]);

module.exports = uploadEmployeeFiles;
