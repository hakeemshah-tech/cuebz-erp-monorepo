// const { body } = require("express-validator");

// const createValidateEmployee = [
//   body("employee_code")
//     .trim()
//     .notEmpty()
//     .withMessage("Employee Code is required."),
//   body("employee_type")
//     .trim()
//     .notEmpty()
//     .isIn(["Permanent", "Contract", "Part-Time", "Intern", "Other"])
//     .withMessage(
//       "Employee Type must be one of Permanent, Contract, Part-Time, Intern, or Other.",
//     ),
//   body("total_years_in_company")
//     .optional()
//     .isNumeric()
//     .withMessage("Total Years in Company must be a number."),

//   body("full_name").trim().notEmpty().withMessage("Full Name is required."),
//   body("nationality").trim().notEmpty().withMessage("Nationality is required."),
//   body("uae_contact_number")
//     .trim()
//     .notEmpty()
//     .withMessage("UAE Contact Number is required."),
//   body("home_country_contact_number")
//     .trim()
//     .notEmpty()
//     .withMessage("Home Country Contact Number is required."),
//   body("emergency_contact_number")
//     .trim()
//     .notEmpty()
//     .withMessage("Emergency Contact Number is required."),
//   body("personal_email")
//     .trim()
//     .isEmail()
//     .withMessage("A valid Personal Email is required."),
//   body("company_email")
//     .optional()
//     .trim()
//     .isEmail()
//     .withMessage("A valid Company Email is required."),
//   body("date_of_birth")
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage("Date of Birth must be a valid date."),
//   body("blood_group")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Blood Group must be a string."),
//   body("date_of_joining")
//     .notEmpty()
//     .isISO8601()
//     .toDate()
//     .withMessage("Date of Joining must be a valid date."),
//   body("department").trim().notEmpty().withMessage("Department is required."),
//   body("job_title")
//     .trim()
//     .notEmpty()
//     .withMessage("Job Title/Position is required."),
//   body("reporting_manager").optional(),
//   body("uae_address").trim().notEmpty().withMessage("UAE Address is required."),
//   body("home_country_address")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Home Country Address must be a string."),
//   body("bank_details.bank_name")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Bank Name must be a string."),
//   body("bank_details.account_number")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Account Number must be a string."),
//   body("bank_details.iban")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("IBAN must be a string."),
//   body("emergency_contact_info.name")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Emergency Contact Name must be a string."),
//   body("emergency_contact_info.relationship")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Emergency Contact Relationship must be a string."),
//   body("emergency_contact_info.contact_number")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Emergency Contact Number must be a string."),
//   body("medical_conditions")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Medical Conditions must be a string."),
//   body("comments")
//     .optional()
//     .trim()
//     .isString()
//     .withMessage("Comments must be a string."),
// ];

// const validateUploadedFiles = (req, res, next) => {
//   const requiredFiles = ["cv", "visa_copy", "emirates_id", "passport_id"];
//   const fileValidationErrors = [];

//   requiredFiles.forEach((field) => {
//     const uploadedFile = req.files[field];
//     const existingUrl = req.body[field];

//     // Check if the field has either a file or a valid URL
//     if ((!uploadedFile || uploadedFile.length === 0) && !existingUrl) {
//       fileValidationErrors.push({
//         field,
//         message: `${field.replace("_", " ")} is required.`,
//       });
//     }
//   });

//   if (fileValidationErrors.length > 0) {
//     return res.status(400).json({
//       message: "Validation failed for uploaded files.",
//       errors: fileValidationErrors,
//     });
//   }

//   next();
// };

// const updateValidateEmployee = createValidateEmployee.map((validation) =>
//   validation.optional(),
// );

// module.exports = {
//   createValidateEmployee,
//   updateValidateEmployee,
//   validateUploadedFiles,
// };

const { body } = require("express-validator");

const createValidateEmployee = [
  body("employee_code")
    .trim()
    .notEmpty()
    .withMessage("Employee Code is required."),
  body("employee_type")
    .trim()
    .notEmpty()
    .isIn(["Permanent", "Contract", "Part-Time", "Intern", "Other"])
    .withMessage(
      "Employee Type must be one of Permanent, Contract, Part-Time, Intern, or Other.",
    ),
  body("total_years_in_company")
    .optional()
    .isNumeric()
    .withMessage("Total Years in Company must be a number."),

  body("full_name").trim().notEmpty().withMessage("Full Name is required."),
  body("nationality").trim().notEmpty().withMessage("Nationality is required."),
  body("uae_contact_number")
    .trim()
    .notEmpty()
    .withMessage("UAE Contact Number is required."),
  body("home_country_contact_number")
    .trim()
    .notEmpty()
    .withMessage("Home Country Contact Number is required."),
  body("emergency_contact_number")
    .trim()
    .notEmpty()
    .withMessage("Emergency Contact Number is required."),
  body("personal_email")
    .trim()
    .isEmail()
    .withMessage("A valid Personal Email is required."),
  body("company_email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("A valid Company Email is required."),
  body("date_of_birth")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date of Birth must be a valid date."),
  body("blood_group")
    .optional()
    .trim()
    .isString()
    .withMessage("Blood Group must be a string."),
  body("date_of_joining")
    .notEmpty()
    .isISO8601()
    .toDate()
    .withMessage("Date of Joining must be a valid date."),
  body("department").trim().notEmpty().withMessage("Department is required."),
  body("job_title")
    .trim()
    .notEmpty()
    .withMessage("Job Title/Position is required."),
  body("reporting_manager").optional(),
  body("uae_address").trim().notEmpty().withMessage("UAE Address is required."),
  body("home_country_address")
    .optional()
    .trim()
    .isString()
    .withMessage("Home Country Address must be a string."),
  body("bank_details.bank_name")
    .optional()
    .trim()
    .isString()
    .withMessage("Bank Name must be a string."),
  body("bank_details.account_number")
    .optional()
    .trim()
    .isString()
    .withMessage("Account Number must be a string."),
  body("bank_details.iban")
    .optional()
    .trim()
    .isString()
    .withMessage("IBAN must be a string."),
  body("bank_details.salary_transfer_mode")
    .optional()
    .isIn(["Bank Transfer", "Cash", "Cheque"])
    .withMessage(
      "Salary Transfer Mode must be one of Bank Transfer, Cash, or Cheque.",
    ),
  body("emergency_contact_info.name")
    .optional()
    .trim()
    .isString()
    .withMessage("Emergency Contact Name must be a string."),
  body("emergency_contact_info.relationship")
    .optional()
    .trim()
    .isString()
    .withMessage("Emergency Contact Relationship must be a string."),
  body("emergency_contact_info.contact_number")
    .optional()
    .trim()
    .isString()
    .withMessage("Emergency Contact Number must be a string."),
  body("medical_conditions")
    .optional()
    .trim()
    .isString()
    .withMessage("Medical Conditions must be a string."),
  body("comments")
    .optional()
    .trim()
    .isString()
    .withMessage("Comments must be a string."),

  // Leave Fields
  body("leaves.casual.allowed")
    .optional()
    .isNumeric()
    .withMessage("Casual Leave Allowed must be a number."),

  body("leaves.casual.taken")
    .optional()
    .isNumeric()
    .withMessage("Casual Leave Taken must be a number."),

  body("leaves.sick.allowed")
    .optional()
    .isNumeric()
    .withMessage("Sick Leave Allowed must be a number."),

  body("leaves.sick.taken")
    .optional()
    .isNumeric()
    .withMessage("Sick Leave Taken must be a number."),

  body("leaves.annual.allowed")
    .optional()
    .isNumeric()
    .withMessage("Annual Leave Allowed must be a number."),

  body("leaves.annual.taken")
    .optional()
    .isNumeric()
    .withMessage("Annual Leave Taken must be a number."),

  body("leaves.total.allowed")
    .optional()
    .isNumeric()
    .withMessage("Total Leave Allowed must be a number."),

  body("leaves.total.taken")
    .optional()
    .isNumeric()
    .withMessage("Total Leave Taken must be a number."),
];

const validateUploadedFiles = (req, res, next) => {
  const requiredFiles = ["cv", "visa_copy", "emirates_id", "passport_id"];
  const fileValidationErrors = [];

  requiredFiles.forEach((field) => {
    const uploadedFile = req.files?.[field];
    const existingUrl = req.body[field];

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

const updateValidateEmployee = createValidateEmployee.map((validation) =>
  validation.optional(),
);

module.exports = {
  createValidateEmployee,
  updateValidateEmployee,
  validateUploadedFiles,
};
