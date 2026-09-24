const fileUploadMiddleware = require("../fileUpload");

/**
 * Field-specific rules for file types
 */
const fieldRules = {
  "attachments[]": {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/plain", // .txt
      "application/zip", // .zip
    ],
  },
};

/**
 * Middleware for handling task-related file uploads
 */
const uploadTrackerFiles = fileUploadMiddleware(fieldRules).fields([
  { name: "attachments[]", maxCount: 5 }, // Allow up to 5 attachments per task
]);

module.exports = uploadTrackerFiles;
