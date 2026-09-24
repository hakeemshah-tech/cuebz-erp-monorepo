const { body } = require("express-validator");

const createCallLogValidation = [
  body("caller_name")
    .trim()
    .notEmpty()
    .withMessage("Caller Name is required.")
    .isLength({ max: 100 })
    .withMessage("Caller Name cannot exceed 100 characters."),
  body("caller_company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Caller Company cannot exceed 100 characters."),
  body("visitor_type")
    .trim()
    .notEmpty()
    .isIn(["Customer", "Vendor", "Interview", "Other"])
    .withMessage("Visitor Type is invalid."),
  body("caller_contact_number")
    .trim()
    .notEmpty()
    .withMessage("Caller Contact Number is required.")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact Number must be between 10 and 15 digits."),
  body("purpose_of_call")
    .trim()
    .notEmpty()
    .withMessage("Purpose of Call is required.")
    .isLength({ max: 500 })
    .withMessage("Purpose of Call cannot exceed 500 characters."),
  body("call_handled_by")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Call Handled By cannot exceed 100 characters."),
  body("date_time")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date and Time must be a valid ISO8601 date."),
  body("reminder_action_date").optional(),
  body("follow_up_comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Follow-up comment cannot exceed 500 characters."),
];

const updateCallLogValidation = [
  body("caller_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Caller Name cannot exceed 100 characters."),
  body("caller_company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Caller Company cannot exceed 100 characters."),
  body("visitor_type")
    .optional()
    .trim()
    .isIn(["Customer", "Vendor", "Interview", "Other"])
    .withMessage("Visitor Type is invalid."),
  body("caller_contact_number")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact Number must be between 10 and 15 digits."),
  body("purpose_of_call")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Purpose of Call cannot exceed 500 characters."),
  body("call_handled_by")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Call Handled By cannot exceed 100 characters."),
  body("date_time")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date and Time must be a valid ISO8601 date."),
  body("reminder_action_date").optional(),
  body("tenant_id")
    .optional()
    .isMongoId()
    .withMessage("Tenant ID must be a valid MongoDB ObjectId."),
  body("organization_id")
    .optional()
    .isMongoId()
    .withMessage("Organization ID must be a valid MongoDB ObjectId."),
  body("reminder_action_date").optional(),
  body("follow_up_comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Follow-up comment cannot exceed 500 characters."),
];

module.exports = { createCallLogValidation, updateCallLogValidation };
