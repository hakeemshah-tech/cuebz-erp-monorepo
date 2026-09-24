const { body } = require("express-validator");

// Validation rules for creating a task
const createValidateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required.")
    .isLength({ max: 100 })
    .withMessage("Task title cannot exceed 100 characters."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Task description is required."),
  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned employee is required.")
    .isMongoId()
    .withMessage("Assigned employee must be a valid ID."),
  body("priority")
    .notEmpty()
    .withMessage("Priority is required.")
    .isIn(["High", "Medium", "Low", "Urgent"])
    .withMessage("Priority must be one of High, Medium, Urgent or Low."),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid date."),
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of Pending, In Progress, or Completed."),
  body("comments")
    .optional()
    .trim()
    .isString()
    .withMessage("Comments must be a string."),
  body("attachments").optional(),
];

// Validation for uploaded files (attachments)
const validateTaskUploadedFiles = (req, res, next) => {
  const uploadedFile = req.files?.attachments;

  if (uploadedFile && Array.isArray(uploadedFile)) {
    const invalidFiles = uploadedFile.filter(
      (file) =>
        !["image/jpeg", "image/png", "application/pdf"].includes(file.mimetype),
    );

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        message: "Validation failed for uploaded attachments.",
        errors: invalidFiles.map((file) => ({
          field: "attachments",
          fileName: file.originalname,
          message: "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
        })),
      });
    }
  }

  next();
};

// Validation rules for updating a task
const updateValidateTask = createValidateTask.map((validation) =>
  validation.optional(),
);

module.exports = {
  createValidateTask,
  updateValidateTask,
  validateTaskUploadedFiles,
};
