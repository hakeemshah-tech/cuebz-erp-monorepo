const { body } = require("express-validator");

const createValidateRoleAssignment = [
  body("employee_id")
    .isMongoId()
    .notEmpty()
    .withMessage("A valid Employee ID is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("name").trim().notEmpty().withMessage("Name is Required"),
  body("accessible_modules")
    .isArray({ min: 1 })
    .withMessage("At least one module must be assigned.")
    .optional(),
];

const validateSetPassword = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("otp").isString().notEmpty().withMessage("OTP is required."),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

const updateValidateRoleAndModules = [
  body("userId").isMongoId().withMessage("A valid user ID is required."),
  body("name").trim().optional(),
  body("accessible_modules")
    .isArray()
    .optional()
    .withMessage("Accessible modules must be an array."),
];

// Validation for Resending OTP
const validateResendVerification = [
  body("email").isEmail().withMessage("A valid email is required."),
];

module.exports = {
  createValidateRoleAssignment,
  validateSetPassword,
  updateValidateRoleAndModules,
  validateResendVerification,
};
