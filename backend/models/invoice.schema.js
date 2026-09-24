const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    invoice_number: { type: String, unique: true, required: true }, // Auto-generated Invoice Number
    quotation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      required: true,
    }, // Reference to Quotation

    invoice_date: { type: Date, required: true }, // Invoice Issued Date
    due_date: { type: Date, required: true }, // Due Date for Payment

    status: {
      type: String,
      enum: ["Unpaid", "Paid", "Cancelled", "Refunded"],
      default: "Unpaid",
      required: true,
    }, // Invoice Status

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
    ], // Invoice Attachments (e.g., PDF copy)

    payment_receipt: {
      file_name: { type: String, maxlength: 150 },
      file_url: { type: String, maxlength: 500 },
    }, // Payment Receipt (If Paid)
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
