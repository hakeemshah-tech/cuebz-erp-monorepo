const fileUploadMiddleware = require("../fileUpload");

/**
 * Field-specific rules for file types
 */
const fieldRules = {
  logo: {
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  },
  brand_guidelines: {
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  business_card_files: {
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  letterhead_file: {
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  company_profile: {
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  video_guidelines: {
    allowedTypes: ["video/mp4", "video/quicktime"],
  },
};

/**
 * Middleware for handling brand kit file uploads
 */
const uploadBrandKitFiles = fileUploadMiddleware(fieldRules).fields([
  { name: "logo", maxCount: 1 }, // Single file upload
  { name: "brand_guidelines", maxCount: 1 }, // Single file upload
  { name: "business_card_files", maxCount: 1 }, // Single file upload
  { name: "letterhead_file", maxCount: 1 }, // Single file upload
  { name: "company_profile", maxCount: 1 }, // Single file upload
  { name: "video_guidelines", maxCount: 1 }, // Single file upload
]);

module.exports = uploadBrandKitFiles;
