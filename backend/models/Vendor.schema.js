const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
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
    vendor_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone_number: {
      type: String,
      required: true,
      match: [/^[0-9]{7,15}$/, "Phone number must be between 7 and 15 digits"],
    },
    contact_person: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    address: {
      street: { type: String, trim: true, maxlength: 255 },
      city: { type: String, trim: true, maxlength: 100 },
      state: { type: String, trim: true, maxlength: 100 },
      postal_code: { type: String, trim: true, maxlength: 20 },
      country: { type: String, trim: true, maxlength: 100, default: "UAE" },
    },
    services_offered: [
      {
        type: String,
        trim: true,
      },
    ],
    vendor_type: {
      type: String,
      enum: [
        "Supplier",
        "Manufacturer",
        "Distributor",
        "Service Provider",
        "Other",
      ],
      required: true,
    },
    trade_license_number: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    tax_registration_number: {
      type: String,
      trim: true,
      maxlength: 20,
      //   match: [/^[A-Z0-9-]{5,20}$/, "Invalid tax registration number format"],
      required: false, // Optional for UAE
    },
    bank_details: {
      bank_name: { type: String, trim: true },
      account_number: { type: String, trim: true },
      iban_number: { type: String, trim: true, maxlength: 34 },
      branch: { type: String, trim: true },
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    attachments: [
      {
        file_name: { type: String, trim: true },
        file_url: { type: String, trim: true },
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt` fields
  },
);

module.exports = mongoose.model("Vendor", VendorSchema);
