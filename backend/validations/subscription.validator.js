const { body } = require("express-validator");

exports.validateSubscriptionPlan = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0."),
  body("interval")
    .notEmpty()
    .withMessage("Interval is required.")
    .isIn(["day", "week", "month", "year"])
    .withMessage("Interval must be one of: day, week, month, year."),
  body("interval_count")
    .notEmpty()
    .withMessage("Interval count is required.")
    .isIn(["1", "3", "6"])
    .withMessage("Interval count must be one of: 1, 3, 6."),
  body("trial_duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Trial duration must be a positive integer."),
];
