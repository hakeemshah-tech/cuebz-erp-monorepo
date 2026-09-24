const fileUploadMiddleware = require("../fileUpload");

/**
 * Field-specific rules for file types
 */
const fieldRules = {
  image: {
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
};

// ✅ Change `.fields()` to `.single()`
const uploadNewsUpdateFiles = fileUploadMiddleware(fieldRules).single("image");

module.exports = uploadNewsUpdateFiles;
