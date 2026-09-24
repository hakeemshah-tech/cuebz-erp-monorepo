const { body } = require("express-validator");

const createValidateAsset = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Asset Name is required.")
    .isLength({ max: 100 })
    .withMessage("Asset Name cannot exceed 100 characters."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required.")
    .isLength({ max: 100 })
    .withMessage("Category cannot exceed 100 characters."),

  body("serial_number")
    .trim()
    .notEmpty()
    .withMessage("Serial Number is required.")
    .isLength({ max: 100 })
    .withMessage("Serial Number cannot exceed 100 characters."),

  body("purchase_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Purchase Date must be a valid ISO8601 date."),

  body("warranty_expiration")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Warranty Expiry Date must be a valid ISO8601 date."),

  body("assigned_to")
    .optional()
    .isMongoId()
    .withMessage("Assigned To must be a valid MongoDB ObjectId."),

  body("status")
    .isIn(["Available", "In Use", "Under Maintenance", "Retired"])
    .withMessage(
      "Status must be one of 'Available', 'In Use', 'Under Maintenance', or 'Retired'.",
    )
    .optional()
    .default("Available"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string.")
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters."),
];

const updateValidateAsset = createValidateAsset.map((validation) =>
  validation.optional(),
);

module.exports = { createValidateAsset, updateValidateAsset };
