const { body } = require("express-validator");

const createEventValidation = [
  body("title").notEmpty().withMessage("Event title is required"),

  body("description").optional(),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

const updateEventValidation = createEventValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createEventValidation,
  updateEventValidation,
};
