const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    proposal_number: { type: String, unique: true, required: true }, // Auto-generated
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    }, // Reference to Customer

    proposal_date: { type: Date, required: true }, // Proposal Issued Date
    proposal_expiry_date: { type: Date }, // Expiry Date

    proposal_title: { type: String, required: true, maxlength: 200 }, // Title
    proposal_details: { type: String, required: true, maxlength: 1000 }, // Description

    items: [
      {
        item_name: { type: String, required: true, maxlength: 100 },
        description: { type: String, maxlength: 500 },
        quantity: { type: Number, required: true, min: 1 },
        unit_price: { type: Number, required: true, min: 0 },
        total_price: { type: Number, required: true },
      },
    ], // Quotation Items

    subtotal: { type: Number, required: true }, // Subtotal Before VAT
    vat: { type: Number, default: 0 }, // VAT (5% Default)
    total_amount: { type: Number, required: true }, // Final Quotation Total

    payment_terms: { type: String, required: true, maxlength: 300 }, // Payment Terms
    termsCondition: { type: String, required: true }, // Terms & Conditions

    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected"],
      required: true,
    }, // Quotation Status

    comments: { type: String, maxlength: 1000 }, // Additional Comments

    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    }, // Tenant Reference

    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    }, // Organization Reference

    attachments: [
      {
        file_name: { type: String, maxlength: 150 },
        file_url: { type: String, maxlength: 500 },
      },
    ], // File Attachments
  },
  { timestamps: true },
);

module.exports = mongoose.model("Quotation", QuotationSchema);
