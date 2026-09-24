const mongoose = require("mongoose");

const ChequeTrackingSchema = new mongoose.Schema(
  {
    cheque_number: { type: String, required: true },
    cheque_date: { type: Date, required: true },
    amount: { type: Number, required: true },
    bank_name: { type: String, required: true },
    payee_name: { type: String },
    payeer_name: { type: String },
    purpose: { type: String, required: true },
    cheque_status: {
      type: String,
      enum: ["Issued", "Received", "Cleared", "Bounced"],
      required: true,
    },
    reminder_date: { type: Date, required: true },
    reminder_status: {
      type: String,
      enum: ["pending", "sent", "cancelled"],
      default: "pending",
    },
    attachments: { type: [String], default: [] }, // URLs for uploaded cheque images
    additional_notes: { type: String },
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cheque_type: {
      type: String,
      enum: ["Incoming", "Outgoing"],
      required: true,
    },
  },
  { timestamps: true },
);

ChequeTrackingSchema.index({ reminder_status: 1, reminder_date: 1 });
module.exports = mongoose.model("ChequeTracking", ChequeTrackingSchema);
