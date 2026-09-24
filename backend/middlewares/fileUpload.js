const multer = require("multer");
const AppError = require("../utils/appError");

// Memory storage for Multer (does not save files locally)
const storage = multer.memoryStorage();

/**
 * Dynamic multer middleware to handle different file types.
 * @param {string[]} allowedTypes - Array of allowed MIME types.
 * @param {number} maxFileSize - Maximum file size in bytes (default: 3MB).
 */
const createFileUploadMiddleware = (
  fieldRules,
  maxFileSize = 5 * 1024 * 1024,
) =>
  multer({
    storage: storage,
    limits: { fileSize: maxFileSize }, // File size limit
    fileFilter: (req, file, cb) => {
      const rules = fieldRules[file.fieldname];
      if (!rules || !rules.allowedTypes.includes(file.mimetype)) {
        return cb(
          new AppError(
            `Invalid file type for ${file.fieldname}. Allowed types are: ${rules?.allowedTypes.join(", ") || "none"}.`,
            400,
          ),
        );
      }
      cb(null, true);
    },
  });

module.exports = createFileUploadMiddleware;
