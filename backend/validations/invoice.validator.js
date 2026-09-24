const { body } = require("express-validator");

// Validation rules for creating an invoice
const createInvoiceValidation = [
  // Invoice Number (Required)
  body("invoice_number")
    .trim()
    .notEmpty()
    .withMessage("Invoice number is required.")
    .isLength({ max: 50 })
    .withMessage("Invoice number cannot exceed 50 characters."),

  // Quotation Reference (Required)
  body("quotation_id")
    .trim()
    .notEmpty()
    .withMessage("Quotation ID is required.")
    .isMongoId()
    .withMessage("Invalid Quotation ID format."),

  // Invoice Date (Required)
  body("invoice_date")
    .notEmpty()
    .withMessage("Invoice date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Invalid invoice date format."),

  // Due Date (Required)
  body("due_date")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Invalid due date format."),

  // Invoice Status (Required)
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Invoice status is required.")
    .isIn(["Unpaid", "Paid", "Cancelled", "Refunded"])
    .withMessage("Invalid invoice status."),

  // Attachments (Optional)
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array."),

  // Payment Receipt (Optional)
  body("payment_receipt")
    .optional()
    .isObject()
    .withMessage("Payment receipt must be an object.")
    .custom((receipt) => {
      if (receipt.file_name && typeof receipt.file_name !== "string") {
        throw new Error("Payment receipt file name must be a string.");
      }
      if (receipt.file_url && typeof receipt.file_url !== "string") {
        throw new Error("Payment receipt file URL must be a string.");
      }
      return true;
    }),
];

// Validation for uploaded files (attachments & payment receipts)
const validateInvoiceUploadedFiles = (req, res, next) => {
  const uploadedFiles = req.files?.["attachments[]"];
  const paymentReceipt = req.files?.["payment_receipt"];

  const validMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (uploadedFiles && Array.isArray(uploadedFiles)) {
    const invalidFiles = uploadedFiles.filter(
      (file) => !validMimeTypes.includes(file.mimetype),
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

  if (paymentReceipt && !validMimeTypes.includes(paymentReceipt.mimetype)) {
    return res.status(400).json({
      message: "Invalid payment receipt file type.",
      errors: [
        {
          field: "payment_receipt",
          fileName: paymentReceipt.originalname,
          message: "Only JPEG, PNG, and PDF are allowed.",
        },
      ],
    });
  }

  next();
};

// Validation rules for updating an invoice
const updateInvoiceValidation = createInvoiceValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createInvoiceValidation,
  updateInvoiceValidation,
  validateInvoiceUploadedFiles,
};
