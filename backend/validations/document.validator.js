const { body } = require("express-validator");

/**
 * Validation rules for creating a document
 */
const createDocumentValidation = [
  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required.")
    .isIn(["1", "2"])
    .withMessage("Section must be either '1' or '2'."),

  body("trade_license")
    .optional()
    .trim()
    .isString()
    .withMessage("Trade License must be a valid string."),

  body("moa")
    .optional()
    .trim()
    .isString()
    .withMessage("Memorandum of Association must be a valid string."),

  body("aoa")
    .optional()
    .trim()
    .isString()
    .withMessage("Articles of Association must be a valid string."),

  body("emigration_card")
    .optional()
    .trim()
    .isString()
    .withMessage("Emigration Card must be a valid string."),

  body("certificate_of_incorporation")
    .optional()
    .trim()
    .isString()
    .withMessage("Certificate of Incorporation must be a valid string."),

  body("shareholder_agreement")
    .optional()
    .trim()
    .isString()
    .withMessage("Shareholder Agreement must be a valid string."),

  body("tenancy_contract_or_ejari")
    .optional()
    .trim()
    .isString()
    .withMessage("Tenancy Contract or Ejari must be a valid string."),

  body("passport_copies")
    .optional()
    .isArray()
    .withMessage("Passport Copies must be an array of URLs."),

  body("visa_residence_permits")
    .optional()
    .isArray()
    .withMessage("Visa/Residence Permits must be an array of URLs."),

  body("vat_registration_certificate")
    .optional()
    .trim()
    .isString()
    .withMessage("VAT Registration Certificate must be a valid string."),

  body("corporate_tax_certificate")
    .optional()
    .trim()
    .isString()
    .withMessage(
      "Corporate Tax Registration Certificate must be a valid string.",
    ),

  body("business_plan_document")
    .optional()
    .trim()
    .isString()
    .withMessage("Business Plan Document must be a valid string."),

  body("bank_statements")
    .optional()
    .isArray()
    .withMessage(
      "Bank Statements must be an array of month-wise document URLs.",
    ),

  body("power_of_attorney")
    .optional()
    .trim()
    .isString()
    .withMessage("Power of Attorney must be a valid string."),

  body("insurance_policies")
    .optional()
    .trim()
    .isString()
    .withMessage("Insurance Policies must be a valid string."),

  body("employee_handbook_or_hr_policies")
    .optional()
    .trim()
    .isString()
    .withMessage("Employee Handbook/HR Policies must be a valid string."),

  body("company_policies")
    .optional()
    .isArray()
    .withMessage("Company Policies must be an array of document URLs."),

  body("contract_templates")
    .optional()
    .isArray()
    .withMessage("Contract Templates must be an array of document URLs."),

  body("intellectual_property_registrations")
    .optional()
    .trim()
    .isString()
    .withMessage("Intellectual Property Registrations must be a valid string."),

  body("trade_mark_certificate")
    .optional()
    .trim()
    .isString()
    .withMessage("Trade Mark Registration Certificate must be a valid string."),

  body("iso_certification")
    .optional()
    .trim()
    .isString()
    .withMessage("ISO Certification must be a valid string."),

  body("audited_financial_statements")
    .optional()
    .isArray()
    .withMessage(
      "Audited Financial Statements must be an array of year-wise document URLs.",
    ),

  body("comments")
    .optional()
    .trim()
    .isString()
    .withMessage("Comments must be a valid string."),
];

/**
 * Middleware to validate uploaded files
 */
const validateUploadedFiles = (req, res, next) => {
  const requiredFiles = ["trade_license", "moa", "aoa", "emigration_card"];
  const fileValidationErrors = [];

  requiredFiles.forEach((field) => {
    const uploadedFile = req.files[field];
    const existingUrl = req.body[field];

    // Ensure that at least one form of the document is present (either file upload or existing URL)
    if ((!uploadedFile || uploadedFile.length === 0) && !existingUrl) {
      fileValidationErrors.push({
        field,
        message: `${field.replace("_", " ")} is required.`,
      });
    }
  });

  if (fileValidationErrors.length > 0) {
    return res.status(400).json({
      message: "Validation failed for uploaded files.",
      errors: fileValidationErrors,
    });
  }

  next();
};

/**
 * Validation rules for updating a document
 */
const updateDocumentValidation = createDocumentValidation.map((validation) =>
  validation.optional(),
);

module.exports = {
  createDocumentValidation,
  updateDocumentValidation,
  validateUploadedFiles,
};
