const fileUploadMiddleware = require("../fileUpload");

/**
 * Field-specific rules for file types
 */
const fieldRules = {
  trade_license: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  moa: { allowedTypes: ["image/jpeg", "image/png", "application/pdf"] },
  aoa: { allowedTypes: ["image/jpeg", "image/png", "application/pdf"] },
  emigration_card: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  certificate_of_incorporation: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  shareholder_agreement: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  tenancy_contract_or_ejari: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  vat_registration_certificate: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  corporate_tax_certificate: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  business_plan_document: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  power_of_attorney: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  insurance_policies: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  employee_handbook_or_hr_policies: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  intellectual_property_registrations: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  trade_mark_certificate: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  iso_certification: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  bank_statement: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },

  // Multiple file fields
  passport_copies: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  visa_residence_permits: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  company_policies: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  contract_templates: {
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
};

// Middleware for handling document file uploads
const uploadDocumentFiles = fileUploadMiddleware(fieldRules).fields([
  // ✅ Single file uploads
  { name: "trade_license", maxCount: 1 },
  { name: "moa", maxCount: 1 },
  { name: "aoa", maxCount: 1 },
  { name: "emigration_card", maxCount: 1 },
  { name: "certificate_of_incorporation", maxCount: 1 },
  { name: "shareholder_agreement", maxCount: 1 },
  { name: "tenancy_contract_or_ejari", maxCount: 1 },
  { name: "vat_registration_certificate", maxCount: 1 },
  { name: "corporate_tax_certificate", maxCount: 1 },
  { name: "business_plan_document", maxCount: 1 },
  { name: "power_of_attorney", maxCount: 1 },
  { name: "insurance_policies", maxCount: 1 },
  { name: "employee_handbook_or_hr_policies", maxCount: 1 },
  { name: "intellectual_property_registrations", maxCount: 1 },
  { name: "trade_mark_certificate", maxCount: 1 },
  { name: "iso_certification", maxCount: 1 },
  { name: "bank_statement", maxCount: 1 },

  // ✅ Multiple file uploads
  { name: "passport_copies", maxCount: 10 }, // Supports multiple passport copies
  { name: "visa_residence_permits", maxCount: 10 }, // Multiple visa permits
  { name: "company_policies", maxCount: 10 }, // Multiple company policies
  { name: "contract_templates", maxCount: 10 }, // Multiple contract templates
]);

module.exports = uploadDocumentFiles;
