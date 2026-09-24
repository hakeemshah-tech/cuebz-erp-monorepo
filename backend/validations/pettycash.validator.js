const { body } = require("express-validator");

const createPettyCashValidation = [
  body("transaction_type")
    .notEmpty()
    .withMessage("Transaction type is required.")
    .isIn(["Add", "Expense"])
    .withMessage("Transaction type must be either 'Add' or 'Expense'."),

  body("transaction_date")
    .notEmpty()
    .withMessage("Transaction date is required.")
    .isISO8601()
    .withMessage("Transaction date must be a valid date."),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero."),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required.")
    .isString()
    .withMessage("Purpose must be a string.")
    .isLength({ max: 500 })
    .withMessage("Purpose cannot exceed 500 characters."),

  body("remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string.")
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters."),

  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array.")
    .custom((attachments) => {
      if (
        attachments.some((url) => !url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/))
      ) {
        throw new Error("Each attachment must be a valid URL.");
      }
      return true;
    }),
];

const updatePettyCashValidation = [
  body("transaction_type")
    .optional()
    .isIn(["Add", "Expense"])
    .withMessage("Transaction type must be either 'Add' or 'Expense'."),

  body("transaction_date")
    .optional()
    .isISO8601()
    .withMessage("Transaction date must be a valid date."),

  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero."),

  body("purpose")
    .optional()
    .isString()
    .withMessage("Purpose must be a string.")
    .isLength({ max: 500 })
    .withMessage("Purpose cannot exceed 500 characters."),

  body("remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string.")
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters."),

  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array.")
    .custom((attachments) => {
      if (
        attachments.some((url) => !url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/))
      ) {
        throw new Error("Each attachment must be a valid URL.");
      }
      return true;
    }),
];

module.exports = { createPettyCashValidation, updatePettyCashValidation };
