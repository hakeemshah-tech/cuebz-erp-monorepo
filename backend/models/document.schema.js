// const mongoose = require("mongoose");

// const DocumentSchema = new mongoose.Schema(
//   {
//     tenant_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tenant",
//       required: true,
//     }, // Tenant ID (Required)
//     organization_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     }, // Organization ID (Required)

//     section_1: {
//       trade_license: { type: String }, // Trade License
//       moa: { type: String }, // Memorandum of Association (MoA)
//       aoa: { type: String }, // Articles of Association (AoA)
//       emigration_card: { type: String }, // Emigration Card
//       certificate_of_incorporation: { type: String }, // Certificate of Incorporation
//       shareholder_agreement: { type: String }, // Shareholder Agreement (if applicable)
//       tenancy_contract_or_ejari: { type: String }, // Tenancy Contract / Ejari Certificate
//       passport_copies: [{ type: String }], // Passport Copies (shareholders/directors)
//       visa_residence_permits: [{ type: String }], // Visa/Residence Permits
//       vat_registration_certificate: { type: String }, // VAT Registration Certificate
//       corporate_tax_certificate: { type: String }, // Corporate TAX Registration Certificate
//     },

//     section_2: {
//       business_plan_document: { type: String }, // Business Plan Document
//       bank_statement: { type: String }, // Bank Statements (Month wise)
//       power_of_attorney: { type: String }, // Power of Attorney (POA)
//       insurance_policies: { type: String }, // Insurance Policies
//       employee_handbook_or_hr_policies: { type: String }, // Employee Handbook / HR Policies
//       company_policies: [{ type: String }], // Company Policies (List)
//       contract_templates: [{ type: String }], // Contracts & Agreements Templates
//       intellectual_property_registrations: { type: String }, // Intellectual Property Registrations
//       trade_mark_certificate: { type: String }, // Trade Mark Registration Certificate (if applicable)
//       iso_certification: { type: String }, // ISO Certification
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Document", DocumentSchema);

const mongoose = require("mongoose");

const documentWithExpirySchema = {
  file: { type: String },
  expiry_date: { type: Date },
};

const DocumentSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    section_1: {
      trade_license: documentWithExpirySchema,
      moa: documentWithExpirySchema,
      aoa: documentWithExpirySchema,
      emigration_card: documentWithExpirySchema,
      certificate_of_incorporation: documentWithExpirySchema,
      shareholder_agreement: documentWithExpirySchema,
      tenancy_contract_or_ejari: documentWithExpirySchema,
      passport_copies: [{ ...documentWithExpirySchema }],
      visa_residence_permits: [{ ...documentWithExpirySchema }],
      vat_registration_certificate: documentWithExpirySchema,
      corporate_tax_certificate: documentWithExpirySchema,
    },

    section_2: {
      business_plan_document: documentWithExpirySchema,
      bank_statement: documentWithExpirySchema,
      power_of_attorney: documentWithExpirySchema,
      insurance_policies: documentWithExpirySchema,
      employee_handbook_or_hr_policies: documentWithExpirySchema,
      company_policies: [{ ...documentWithExpirySchema }],
      contract_templates: [{ ...documentWithExpirySchema }],
      intellectual_property_registrations: documentWithExpirySchema,
      trade_mark_certificate: documentWithExpirySchema,
      iso_certification: documentWithExpirySchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", DocumentSchema);
