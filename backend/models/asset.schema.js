const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    }, // Multi-tenancy support

    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    }, // Organization reference

    name: {
      type: String,
      required: true,
      trim: true,
    }, // Asset Name (e.g., Laptop, Printer, Smart TV)

    category: {
      type: String,
      required: true,
      enum: [
        "Laptop",
        "Printer",
        "Smart TV",
        "Monitor",
        "Projector",
        "Phone",
        "Furniture",
        "Other",
      ],
    }, // Asset Category

    serial_number: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    }, // Unique Serial Number for the Asset

    purchase_date: {
      type: Date,
      required: true,
    }, // Date when the asset was purchased

    warranty_expiration: {
      type: Date,
      required: true,
    }, // Warranty Expiration Date

    status: {
      type: String,
      enum: ["In Use", "Available", "Under Maintenance", "Disposed"],
      default: "Available",
    }, // Asset Status

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null, // Null if the asset is unassigned
    }, // Employee who is assigned the asset

    notes: {
      type: String,
      trim: true,
    }, // Additional Notes (e.g., condition, previous issues)
  },
  { timestamps: true },
);

module.exports = mongoose.model("Asset", AssetSchema);
