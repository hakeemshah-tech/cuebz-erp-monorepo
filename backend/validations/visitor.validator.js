// const { body } = require("express-validator");

// const createValidateVisitor = [
//   body("visitor_name")
//     .trim()
//     .notEmpty()
//     .withMessage("Visitor name is required."),
//   body("visitor_company")
//     .trim()
//     .notEmpty()
//     .withMessage("Visitor company is required."),
//   // body("person_visiting").trim().optional(),
//   body("visitor_type")
//     .isIn(["Customer", "Vendor", "Interview", "Other"])
//     .withMessage("Visitor type is invalid."),
//   body("visitor_contact_number")
//     .trim()
//     .notEmpty()
//     .withMessage("Visitor contact number is required."),
//   body("purpose_of_visit")
//     .trim()
//     .notEmpty()
//     .withMessage("Purpose of visit is required."),
//   body("reminder_action_date").optional(),
//   body("date")
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage("Date must be a valid date."),
//   body("follow_up_comment")
//     .optional()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage("Follow-up comment cannot exceed 500 characters."),
// ];

// const updateValidateVisitor = [
//   body("visitor_name").optional().trim(),
//   body("visitor_company").optional().trim(),
//   body("visitor_type")
//     .optional()
//     .isIn(["Customer", "Vendor", "Interview", "Other"])
//     .withMessage("Visitor type is invalid."),
//   body("visitor_contact_number").optional().trim(),
//   // body("person_visiting").optional().trim(),
//   body("purpose_of_visit").optional().trim(),
//   body("reminder_action_date").optional(),
//   body("date")
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage("Date must be a valid date."),
//   body("follow_up_comment")
//     .optional()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage("Follow-up comment cannot exceed 500 characters."),
// ];

// module.exports = { createValidateVisitor, updateValidateVisitor };

const { body } = require("express-validator");

const allowedVisitorTypes = [
  "Customer",
  "Lead",
  "Vendor",
  "Job Seeker",
  "Interview",
  "Payment Followup",
  "Other",
];

const allowedModels = ["Customer", "Vendor"];

const createValidateVisitor = [
  body("visitor_name")
    .trim()
    .notEmpty()
    .withMessage("Visitor name is required."),

  body("visitor_company")
    .trim()
    .notEmpty()
    .withMessage("Visitor company is required."),

  body("visitor_type")
    .isIn(allowedVisitorTypes)
    .withMessage("Visitor type is invalid."),

  body("visitor_contact_number")
    .trim()
    .notEmpty()
    .withMessage("Visitor contact number is required."),

  body("purpose_of_visit")
    .trim()
    .notEmpty()
    .withMessage("Purpose of visit is required."),

  body("person_visiting")
    .optional()
    .trim()
    .isString()
    .withMessage("Person visiting must be a string (ObjectId)."),

  body("person_visiting_model")
    .optional()
    .isIn(allowedModels)
    .withMessage("Person visiting model must be Customer or Vendor."),

  body("reminder_action_date")
    .isString()
    .optional()
    .withMessage("Reminder action date must be a valid date."),

  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid date."),

  body("follow_up_comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Follow-up comment cannot exceed 500 characters."),
];

const updateValidateVisitor = [
  body("visitor_name").optional().trim(),

  body("visitor_company").optional().trim(),

  body("visitor_type")
    .optional()
    .isIn(allowedVisitorTypes)
    .withMessage("Visitor type is invalid."),

  body("visitor_contact_number").optional().trim(),

  body("purpose_of_visit").optional().trim(),

  body("person_visiting")
    .optional()
    .trim()
    .isString()
    .withMessage("Person visiting must be a string (ObjectId)."),

  body("person_visiting_model")
    .optional()
    .isIn(allowedModels)
    .withMessage("Person visiting model must be Customer or Vendor."),

  body("reminder_action_date")
    .optional()
    .isISO8601()
    .withMessage("Reminder action date must be a valid date."),

  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid date."),

  body("follow_up_comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Follow-up comment cannot exceed 500 characters."),
];

module.exports = {
  createValidateVisitor,
  updateValidateVisitor,
};
