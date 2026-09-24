const { body } = require("express-validator");

exports.validateCreateOrder = [
  body("tenant_id").notEmpty().withMessage("Tenant ID is required."),
  body("subscription_plan")
    .notEmpty()
    .withMessage("Subscription plan is required."),
  body("stripeInvoiceId")
    .optional()
    .isString()
    .withMessage("Stripe Invoice ID must be a string."),
  body("stripeSubscriptionId")
    .optional()
    .isString()
    .withMessage("Stripe Subscription ID must be a string."),
  body("amount").isNumeric().withMessage("Amount must be a valid number."),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string."),
  body("status")
    .isIn(["Pending", "Paid", "Failed", "Canceled"])
    .withMessage("Status must be one of Pending, Paid, Failed, or Canceled."),
  body("start_date")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date."),
  body("end_date")
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date."),
];

exports.validateUpdateOrderStatus = [
  body("status")
    .notEmpty()
    .isIn(["Pending", "Paid", "Failed", "Canceled"])
    .withMessage("Status must be one of Pending, Paid, Failed, or Canceled."),
];
