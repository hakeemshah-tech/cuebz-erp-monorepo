const { validationResult } = require("express-validator");

/**
 * Middleware to validate the request and enforce strict allowed fields
 * @param {Array} validations - Array of validation rules
 * @param {boolean} isStrict - Enforce strict allowed fields in both req.body and req.query
 */
const validateRequest = (validations, isStrict = false) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Collect validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Enforce strict allowed fields if enabled
    if (isStrict) {
      // Extract allowed fields from the validations
      const allowedFields = validations.map(
        (validation) => validation.builder.fields[0],
      );

      // Check for any extra fields in req.body and req.query
      const extraFieldsInBody = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key),
      );
      const extraFieldsInQuery = Object.keys(req.query).filter(
        (key) => !allowedFields.includes(key),
      );

      if (extraFieldsInBody.length > 0 || extraFieldsInQuery.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid fields detected. ${
            extraFieldsInBody.length > 0
              ? `Body: ${extraFieldsInBody.join(", ")}. `
              : ""
          }${
            extraFieldsInQuery.length > 0
              ? `Query: ${extraFieldsInQuery.join(", ")}.`
              : ""
          }`,
          allowedFields,
        });
      }
    }

    next(); // Proceed to the next middleware/route handler
  };
};

module.exports = validateRequest;
