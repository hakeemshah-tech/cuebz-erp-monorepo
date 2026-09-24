const { body } = require("express-validator");

// Validation rules for creating a quotation
const createQuotationValidation = [
  // Proposal Number (Required)
  body("proposal_number")
    .trim()
    .notEmpty()
    .withMessage("Proposal number is required.")
    .isLength({ max: 50 })
    .withMessage("Proposal number cannot exceed 50 characters."),

  body("customer_id")
    .trim()
    .notEmpty()
    .withMessage("Customer ID is required.")
    .isMongoId()
    .withMessage("Invalid Customer ID."),

  // Proposal Date (Required)
  body("proposal_date")
    .notEmpty()
    .withMessage("Proposal date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Invalid proposal date format."),

  // Proposal Expiry Date (Optional)
  body("proposal_expiry_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid proposal expiry date format."),

  // Proposal Title (Required)
  body("proposal_title")
    .trim()
    .notEmpty()
    .withMessage("Proposal title is required.")
    .isLength({ max: 200 })
    .withMessage("Proposal title cannot exceed 200 characters."),

  // Proposal Details (Required)
  body("proposal_details")
    .trim()
    .notEmpty()
    .withMessage("Proposal details are required.")
    .isLength({ max: 1000 })
    .withMessage("Proposal details cannot exceed 1000 characters."),

  // Items (Required)
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required.")
    .custom((items) => {
      for (const item of items) {
        if (!item.item_name || item.item_name.length > 100) {
          throw new Error(
            "Item name is required and cannot exceed 100 characters.",
          );
        }
        if (item.quantity <= 0) {
          throw new Error("Item quantity must be greater than 0.");
        }
        if (item.unit_price < 0) {
          throw new Error("Item unit price cannot be negative.");
        }
        if (!item.total_price || item.total_price < 0) {
          throw new Error(
            "Item total price is required and cannot be negative.",
          );
        }
      }
      return true;
    }),

  // Subtotal (Required)
  body("subtotal")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number."),

  // VAT (Optional)
  body("vat")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("VAT must be a positive number."),

  // Total Amount (Required)
  body("total_amount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number."),

  // Payment Terms (Required)
  body("payment_terms")
    .trim()
    .notEmpty()
    .withMessage("Payment terms are required.")
    .isLength({ max: 300 })
    .withMessage("Payment terms cannot exceed 300 characters."),

  // Status (Required)
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["Draft", "Sent", "Accepted", "Rejected"])
    .withMessage("Invalid status value."),

  // Comments (Optional)
  body("comments")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comments cannot exceed 1000 characters."),

  // Terms and Conditions (Required)
  body("termsCondition")
    .trim()
    .notEmpty()
    .withMessage("Terms and conditions are required.")
    .isLength({ max: 2000 })
    .withMessage("Terms and conditions cannot exceed 2000 characters."),
];

// Validation for uploaded files (attachments)
const validateQuotationUploadedFiles = (req, res, next) => {
  const uploadedFiles = req.files?.["attachments[]"];

  if (uploadedFiles && Array.isArray(uploadedFiles)) {
    const invalidFiles = uploadedFiles.filter(
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

// Validation rules for updating a quotation
const updateQuotationValidation = createQuotationValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createQuotationValidation,
  updateQuotationValidation,
  validateQuotationUploadedFiles,
};
