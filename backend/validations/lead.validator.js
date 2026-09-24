// const { body } = require("express-validator");

// const createLeadValidation = [
//   // Lead Source (Required)
//   body("lead_source")
//     .trim()
//     .notEmpty()
//     .withMessage("Lead Source is required.")
//     .isLength({ max: 100 })
//     .withMessage("Lead Source cannot exceed 100 characters."),

//   // Company Name (Optional)
//   body("company_name")
//     .optional()
//     .trim()
//     .isLength({ max: 150 })
//     .withMessage("Company Name cannot exceed 150 characters."),

//   // Contact Person (Required)
//   body("contact_person")
//     .trim()
//     .notEmpty()
//     .withMessage("Contact Person is required.")
//     .isLength({ max: 100 })
//     .withMessage("Contact Person cannot exceed 100 characters."),

//   // Contact Number (Required)
//   body("contact_number")
//     .trim()
//     .notEmpty()
//     .withMessage("Contact Number is required.")
//     .isLength({ min: 7, max: 15 })
//     .withMessage("Contact Number must be between 7 and 15 digits.")
//     .matches(/^[0-9]+$/)
//     .withMessage("Contact Number must contain only digits."),

//   // Email Address (Required)
//   body("email")
//     .trim()
//     .notEmpty()
//     .withMessage("Email Address is required.")
//     .isEmail()
//     .withMessage("Invalid Email Address format."),

//   // Address Fields (Optional)
//   body("address.street")
//     .optional()
//     .trim()
//     .isLength({ max: 255 })
//     .withMessage("Street address cannot exceed 255 characters."),
//   body("address.city")
//     .optional()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage("City name cannot exceed 100 characters."),
//   body("address.state")
//     .optional()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage("State name cannot exceed 100 characters."),
//   body("address.postal_code")
//     .optional()
//     .trim()
//     .isLength({ max: 20 })
//     .withMessage("Postal Code cannot exceed 20 characters."),
//   body("address.country")
//     .optional()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage("Country name cannot exceed 100 characters."),

//   // Lead Status (Required)
//   body("lead_status")
//     .trim()
//     .notEmpty()
//     .withMessage("Lead Status is required.")
//     .isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"])
//     .withMessage(
//       "Lead Status must be one of 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', or 'Lost'.",
//     ),

//   // Lead Score (Optional)
//   body("lead_score")
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("Lead Score must be between 0 and 100."),

//   // Next Steps (Required)
//   body("next_steps")
//     .trim()
//     .notEmpty()
//     .withMessage("Next Steps/Action Items are required.")
//     .isLength({ max: 500 })
//     .withMessage("Next Steps cannot exceed 500 characters."),

//   // Assigned To (Required)
//   body("assigned_to")
//     .trim()
//     .notEmpty()
//     .withMessage("Assigned Employee is required.")
//     .isMongoId()
//     .withMessage("Assigned To must be a valid MongoDB ObjectId."),

//   // Comments (Optional)
//   body("comments")
//     .optional()
//     .trim()
//     .isLength({ max: 1000 })
//     .withMessage("Comments cannot exceed 1000 characters."),

//   // Customer Reference (Optional)
//   body("customer_reference")
//     .optional()
//     .isMongoId()
//     .withMessage("Customer Reference must be a valid MongoDB ObjectId."),
// ];

// const updateLeadValidation = createLeadValidation.map((rule) =>
//   rule.optional(),
// );

// module.exports = { createLeadValidation, updateLeadValidation };

const { body } = require("express-validator");

// Custom validator for nested address fields
const validateAddress = (value) => {
  if (!value) return true; // Optional address field

  const { street, city, state, postal_code, country } = value;

  if (street && street.length > 255) {
    throw new Error("Street address cannot exceed 255 characters.");
  }
  if (city && city.length > 100) {
    throw new Error("City name cannot exceed 100 characters.");
  }
  if (state && state.length > 100) {
    throw new Error("State name cannot exceed 100 characters.");
  }
  if (postal_code && postal_code.length > 20) {
    throw new Error("Postal code cannot exceed 20 characters.");
  }
  if (country && country.length > 100) {
    throw new Error("Country name cannot exceed 100 characters.");
  }

  return true;
};

const createLeadValidation = [
  // Lead Source (Required)
  body("lead_source")
    .trim()
    .notEmpty()
    .withMessage("Lead Source is required.")
    .isIn([
      "Website Inquiry",
      "Referral",
      "Social Media",
      "Cold Call",
      "Email Campaign",
      "Trade Show/Exhibition",
      "Networking Event",
      "Google Ads/Search Ads",
      "Content Marketing",
      "Organic Search (SEO)",
      "Print Media",
      "Partner/Reseller",
      "Walk-in",
      "Webinar/Event",
      "LinkedIn Outreach",
      "Advertising (TV/Radio)",
      "Product Demo/Trial",
      "Flyer/Brochure",
      "Sales Outreach",
      "Word of Mouth",
      "SMS Marketing",
      "Customer Re-engagement",
      "CRM Database",
    ])
    .withMessage("Invalid Lead Source."),

  // Company Name (Optional)
  body("company_name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Company Name cannot exceed 150 characters."),

  body("lead_identifier_name")
    .notEmpty()
    .withMessage("Lead Identifer Name is Required")
    .trim(),

  // Contact Person (Required)
  body("contact_person")
    .trim()
    .notEmpty()
    .withMessage("Contact Person is required.")
    .isLength({ max: 100 })
    .withMessage("Contact Person cannot exceed 100 characters."),

  // Contact Number (Required)
  body("contact_number")
    .trim()
    .notEmpty()
    .withMessage("Contact Number is required.")
    .isLength({ min: 7, max: 15 })
    .withMessage("Contact Number must be between 7 and 15 digits.")
    .matches(/^[0-9]+$/)
    .withMessage("Contact Number must contain only digits."),

  // Email Address (Required)
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email Address is required.")
    .isEmail()
    .withMessage("Invalid Email Address format."),

  // Address Fields (Optional)
  // Address (Nested validation)
  body("address").optional().custom(validateAddress),
  // body("address.street")
  //   .optional()
  //   .trim()
  //   .isLength({ max: 255 })
  //   .withMessage("Street address cannot exceed 255 characters."),
  // body("address.city")
  //   .optional()
  //   .trim()
  //   .isLength({ max: 100 })
  //   .withMessage("City name cannot exceed 100 characters."),
  // body("address.state")
  //   .optional()
  //   .trim()
  //   .isLength({ max: 100 })
  //   .withMessage("State name cannot exceed 100 characters."),
  // body("address.postal_code")
  //   .optional()
  //   .trim()
  //   .isLength({ max: 20 })
  //   .withMessage("Postal Code cannot exceed 20 characters."),
  // body("address.country")
  //   .optional()
  //   .trim()
  //   .isLength({ max: 100 })
  //   .withMessage("Country name cannot exceed 100 characters."),

  // Lead Status (Required)
  body("lead_status")
    .trim()
    .notEmpty()
    .withMessage("Lead Status is required.")
    .isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"])
    .withMessage(
      "Lead Status must be one of 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', or 'Lost'.",
    ),

  // Lead Score (Optional)
  body("lead_score")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Lead Score must be between 0 and 100."),

  // Next Steps (Required)
  body("next_steps")
    .trim()
    .notEmpty()
    .withMessage("Next Steps/Action Items are required.")
    .isLength({ max: 500 })
    .withMessage("Next Steps cannot exceed 500 characters."),

  // Assigned To (Required)
  body("assigned_to")
    .trim()
    .optional()
    .isMongoId()
    .withMessage("Assigned To must be a valid MongoDB ObjectId."),

  // Comments (Optional)
  body("comments")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comments cannot exceed 1000 characters."),

  // Customer Reference (Optional)
  body("customer_reference")
    .optional()
    .isMongoId()
    .withMessage("Customer Reference must be a valid MongoDB ObjectId."),
];

const updateLeadValidation = createLeadValidation.map((rule) =>
  rule.optional(),
);

module.exports = { createLeadValidation, updateLeadValidation };
