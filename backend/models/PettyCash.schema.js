const mongoose = require("mongoose");

const PettyCashSchema = new mongoose.Schema(
  {
    transaction_type: {
      type: String,
      enum: ["Add", "Expense"],
      required: true,
    },
    transaction_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero."],
    },
    purpose: {
      type: String,
      required: true,
    },
    attachment: {
      type: String, // URL for a file attachment (optional, such as receipt images)
      default: null,
    },
    remarks: {
      type: String,
      maxlength: 500,
      default: "",
    },
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("PettyCash", PettyCashSchema);
