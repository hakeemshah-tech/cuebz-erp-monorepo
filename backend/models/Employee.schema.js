const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema(
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
    employee_code: { type: String, required: true }, // Employee ID / Code
    employee_type: {
      type: String,
      enum: ["Permanent", "Contract", "Part-Time", "Intern", "Other"],
      required: true,
    }, // Employee Type
    total_years_in_company: { type: Number }, // Total Years in Company

    full_name: { type: String, required: true },
    nationality: { type: String, required: true },
    uae_contact_number: { type: String, required: true },
    home_country_contact_number: { type: String, required: true },
    emergency_contact_number: { type: String, required: true },
    personal_email: { type: String, required: true },
    company_email: { type: String },
    date_of_birth: { type: Date },
    blood_group: { type: String },
    emirates_id: { type: String, required: true },
    passport_id: { type: String, required: true },
    visa_copy: { type: String, required: true },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true },
    job_title: { type: String, required: true },
    reporting_manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    uae_address: { type: String, required: true },
    home_country_address: { type: String },
    cv: { type: String, required: true },
    photo: { type: String },
    bank_details: {
      bank_name: { type: String },
      account_number: { type: String },
      iban: { type: String },
      salary_transfer_mode: {
        type: String,
        enum: ["Bank Transfer", "Cash", "Cheque"],
        default: "Bank Transfer",
      },
    },
    emergency_contact_info: {
      name: { type: String },
      relationship: { type: String },
      contact_number: { type: String },
    },
    medical_conditions: { type: String },
    comments: { type: String },

    // 🟢 NEW: Leave tracking fields
    leaves: {
      casual: {
        allowed: { type: Number, default: 0 },
        taken: { type: Number, default: 0 },
      },
      sick: {
        allowed: { type: Number, default: 0 },
        taken: { type: Number, default: 0 },
      },
      annual: {
        allowed: { type: Number, default: 0 },
        taken: { type: Number, default: 0 },
      },
      total: {
        allowed: { type: Number, default: 0 },
        taken: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", EmployeeSchema);
