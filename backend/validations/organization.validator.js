const { body } = require("express-validator");

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

exports.validateOrganization = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),
  body("employees_count")
    .isIn(["0-9", "10-20", "21-50", "51-100", "101+"])
    .withMessage("Invalid employees count."),
  body("business_category")
    .isIn(validCategories)
    .withMessage("Invalid business category."),
];
