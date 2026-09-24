const { body } = require("express-validator");

// Validation rules for creating a vendor
const createVendorValidation = [
  body("vendor_name")
    .trim()
    .notEmpty()
    .withMessage("Vendor name is required.")
    .isLength({ max: 150 })
    .withMessage("Vendor name cannot exceed 150 characters."),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address."),

  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[0-9]{7,15}$/)
    .withMessage("Phone number must be between 7 and 15 digits."),

  body("contact_person")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Contact person name cannot exceed 100 characters."),

  body("vendor_type")
    .notEmpty()
    .withMessage("Vendor type is required.")
    .isIn([
      "Supplier",
      "Manufacturer",
      "Distributor",
      "Service Provider",
      "Other",
    ])
    .withMessage("Invalid vendor type."),

  body("trade_license_number")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Trade license number cannot exceed 50 characters."),

  body("tax_registration_number").optional().trim().isLength({ max: 20 }),
  // .matches(/^[A-Z0-9-]{5,20}$/)
  // .withMessage("Invalid tax registration number format."),

  body("bank_details.bank_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Bank name cannot exceed 100 characters."),

  body("bank_details.account_number")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Account number cannot exceed 20 characters."),

  body("bank_details.iban_number")
    .optional()
    .trim()
    .isLength({ max: 34 })
    .withMessage("IBAN number cannot exceed 34 characters."),

  body("bank_details.branch")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Branch name cannot exceed 100 characters."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters."),
];

// Validation for uploaded files (attachments)
const validateVendorUploadedFiles = (req, res, next) => {
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

// Validation rules for updating a vendor
const updateVendorValidation = createVendorValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createVendorValidation,
  updateVendorValidation,
  validateVendorUploadedFiles,
};
