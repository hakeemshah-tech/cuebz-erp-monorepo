const { body } = require("express-validator");

exports.validateTenantRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character."),
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required.")
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters long."),
];
