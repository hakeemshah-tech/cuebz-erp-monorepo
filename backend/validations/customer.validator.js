const { body } = require("express-validator");

const createCustomerValidation = [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 150 })
    .withMessage("Full name cannot exceed 150 characters"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),
  body("address.street")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Street cannot exceed 255 characters"),
  body("address.city")
    .optional()
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters"),
  body("address.state")
    .optional()
    .isLength({ max: 100 })
    .withMessage("State cannot exceed 100 characters"),
  body("address.postal_code")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Postal code cannot exceed 20 characters"),
  body("address.country")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for date of birth"),

  body("customer_type")
    .notEmpty()
    .withMessage("Customer type is required")
    .isIn(["Individual", "Business"])
    .withMessage("Invalid customer type"),

  body("organization_name")
    .optional()
    .isLength({ max: 150 })
    .withMessage("Organization name cannot exceed 150 characters"),

  body("assigned_to")
    .optional()
    .isMongoId()
    .withMessage("Invalid assigned_to ID"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

const updateCustomerValidation = createCustomerValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createCustomerValidation,
  updateCustomerValidation,
};
