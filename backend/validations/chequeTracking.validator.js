// const { body } = require("express-validator");

// const createChequeValidation = [
//   body("cheque_number")
//     .notEmpty()
//     .withMessage("Cheque number is required.")
//     .isString()
//     .withMessage("Cheque number must be a string."),

//   body("cheque_date")
//     .notEmpty()
//     .withMessage("Cheque date is required.")
//     .isISO8601()
//     .withMessage("Cheque date must be a valid date."),

//   body("amount")
//     .notEmpty()
//     .withMessage("Amount is required.")
//     .isFloat({ gt: 0 })
//     .withMessage("Amount must be greater than zero."),

//   body("bank_name")
//     .notEmpty()
//     .withMessage("Bank name is required.")
//     .isString()
//     .withMessage("Bank name must be a string."),

//   body("payeer_name")
//     .notEmpty()
//     .withMessage("Payer name is required.")
//     .isString()
//     .withMessage("Payer name must be a string."),

//   body("payee_name")
//     .notEmpty()
//     .withMessage("Payee name is required.")
//     .isString()
//     .withMessage("Payee name must be a string."),

//   body("purpose")
//     .notEmpty()
//     .withMessage("Purpose is required.")
//     .isString()
//     .withMessage("Purpose must be a string."),

//   body("cheque_status")
//     .notEmpty()
//     .withMessage("Cheque status is required.")
//     .isIn(["Issued", "Received", "Cleared", "Bounced"])
//     .withMessage("Invalid cheque status."),

//   body("reminder_date")
//     .notEmpty()
//     .withMessage("Reminder date is required.")
//     .isISO8601()
//     .withMessage("Reminder date must be a valid date."),

//   body("attachments")
//     .optional()
//     .isArray()
//     .withMessage("Attachments must be an array.")
//     .custom((attachments) => {
//       if (
//         attachments.some((url) => !url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/))
//       ) {
//         throw new Error("Each attachment must be a valid URL.");
//       }
//       return true;
//     }),
// ];

// const updateChequeValidation = [
//   // Use the same rules as `createChequeValidation` but make all fields optional
//   body("cheque_number")
//     .optional()
//     .isString()
//     .withMessage("Cheque number must be a string."),

//   body("cheque_date")
//     .optional()
//     .isISO8601()
//     .withMessage("Cheque date must be a valid date."),

//   body("amount")
//     .optional()
//     .isFloat({ gt: 0 })
//     .withMessage("Amount must be greater than zero."),

//   body("bank_name")
//     .optional()
//     .isString()
//     .withMessage("Bank name must be a string."),

//   body("payee_name")
//     .optional()
//     .isString()
//     .withMessage("Payee name must be a string."),

//   body("payeer_name")
//     .optional()
//     .isString()
//     .withMessage("Payer name must be a string."),

//   body("purpose")
//     .optional()
//     .isString()
//     .withMessage("Purpose must be a string."),

//   body("cheque_status")
//     .optional()
//     .isIn(["Issued", "Received", "Cleared", "Bounced"])
//     .withMessage("Invalid cheque status."),

//   body("reminder_date")
//     .optional()
//     .isISO8601()
//     .withMessage("Reminder date must be a valid date."),

//   body("attachments")
//     .optional()
//     .isArray()
//     .withMessage("Attachments must be an array.")
//     .custom((attachments) => {
//       if (
//         attachments.some((url) => !url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/))
//       ) {
//         throw new Error("Each attachment must be a valid URL.");
//       }
//       return true;
//     }),
// ];

// module.exports = { createChequeValidation, updateChequeValidation };

const { body } = require("express-validator");

const createChequeValidation = [
  body("cheque_number")
    .notEmpty()
    .withMessage("Cheque number is required.")
    .isString()
    .withMessage("Cheque number must be a string."),

  body("cheque_date")
    .notEmpty()
    .withMessage("Cheque date is required.")
    .isISO8601()
    .withMessage("Cheque date must be a valid date."),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero."),

  body("bank_name")
    .notEmpty()
    .withMessage("Bank name is required.")
    .isString()
    .withMessage("Bank name must be a string."),

  body("payeer_name").optional(),
  // .notEmpty()
  // .withMessage("Payer name is required.")
  // .isString()
  // .withMessage("Payer name must be a string."),

  body("payee_name").optional(),
  // .withMessage("Payee name is required.")
  // .isString()
  // .withMessage("Payee name must be a string."),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required.")
    .isString()
    .withMessage("Purpose must be a string."),

  // ✅ NEW FIELD
  body("cheque_type")
    .notEmpty()
    .withMessage("Cheque type is required.")
    .isIn(["Incoming", "Outgoing"])
    .withMessage("Cheque type must be Incoming or Outgoing."),

  body("cheque_status")
    .notEmpty()
    .withMessage("Cheque status is required.")
    .isIn(["Issued", "Received", "Cleared", "Bounced"])
    .withMessage("Invalid cheque status."),

  body("reminder_date")
    .notEmpty()
    .withMessage("Reminder date is required.")
    .isISO8601()
    .withMessage("Reminder date must be a valid date."),

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

const updateChequeValidation = [
  body("cheque_number")
    .optional()
    .isString()
    .withMessage("Cheque number must be a string."),

  body("cheque_date")
    .optional()
    .isISO8601()
    .withMessage("Cheque date must be a valid date."),

  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero."),

  body("bank_name")
    .optional()
    .isString()
    .withMessage("Bank name must be a string."),

  body("payee_name").optional(),
  // .isString()
  // .withMessage("Payee name must be a string."),

  body("payeer_name").optional(),
  // .isString()
  // .withMessage("Payer name must be a string."),

  body("purpose")
    .optional()
    .isString()
    .withMessage("Purpose must be a string."),

  // ✅ NEW FIELD
  body("cheque_type")
    .optional()
    .isIn(["Incoming", "Outgoing"])
    .withMessage("Cheque type must be Incoming or Outgoing."),

  body("cheque_status")
    .optional()
    .isIn(["Issued", "Received", "Cleared", "Bounced"])
    .withMessage("Invalid cheque status."),

  body("reminder_date")
    .optional()
    .isISO8601()
    .withMessage("Reminder date must be a valid date."),

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

module.exports = { createChequeValidation, updateChequeValidation };
