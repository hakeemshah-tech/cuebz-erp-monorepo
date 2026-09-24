const { body, param } = require("express-validator");

const validCategories = [
  "General Trading",
  "E-commerce",
  "Consultancy",
  "Accounting and Auditing",
  "Engineering Services",
  "Healthcare (clinics, medical centers)",
  "Education and Training",
  "Manufacturing",
  "Construction and Contracting",
  "Energy",
  "Hotels and Resorts",
  "Restaurants and Cafes",
  "Travel Agencies",
  "Entertainment",
  "Real Estate",
  "Commercial Brokerage",
  "Transportation",
  "Logistics & Freight forwarding",
  "Courier services",
  "Financial Services",
  "Technology",
];

exports.validateCreateTenant = [
  body("name").isString().withMessage("Name is required."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("company_name").isString().withMessage("Company name is required."),
  body("employees_count")
    .isIn(["0-9", "10-20", "21-50", "51-100", "101+"])
    .withMessage("Invalid employees count."),
  body("business_category")
    .isIn(validCategories)
    .withMessage("Invalid business category."),
];

exports.validateUpdateTenant = [
  param("id").isMongoId().withMessage("Invalid tenant ID."),
  body("company_name")
    .optional()
    .isString()
    .withMessage("Company name must be a string."),
  body("subscription_status")
    .optional()
    .isIn(["Active", "Expired", "Trialing", "Payment Failed", "Pending Update"])
    .withMessage("Invalid subscription status."),
  body("subscription_end_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid subscription end date."),
];

exports.validateCreateSubscription = [
  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required.")
    .isMongoId()
    .withMessage("Invalid Tenant ID."),
  body("subscriptionPlanId")
    .notEmpty()
    .withMessage("Subscription Plan ID is required.")
    .isMongoId()
    .withMessage("Invalid Subscription Plan ID."),
];

exports.validateUpdateSubscription = [
  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required.")
    .isMongoId()
    .withMessage("Invalid Tenant ID."),
  body("subscriptionPlanId")
    .notEmpty()
    .withMessage("Subscription Plan ID is required.")
    .isMongoId()
    .withMessage("Invalid Subscription Plan ID."),
];

exports.validateRenewSubscription = [
  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required.")
    .isMongoId()
    .withMessage("Invalid Tenant ID."),
  body("subscriptionPlanId")
    .notEmpty()
    .withMessage("Subscription Plan ID is required.")
    .isMongoId()
    .withMessage("Invalid Subscription Plan ID."),
];
