const mongoose = require("mongoose");

const SubscriptionOrderSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    subscription_plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    stripeInvoiceId: { type: String }, // Stripe invoice ID for reference
    stripeSubscriptionId: { type: String }, // Stripe subscription ID
    amount: { type: Number, required: true }, // Amount charged (in the smallest currency unit)
    currency: { type: String, default: "aed" }, // Currency (default to AED)
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Canceled"],
      required: true,
    },
    start_date: { type: Date, required: true }, // Start date of the billing period
    end_date: { type: Date, required: true }, // End date of the billing period
    created_at: { type: Date, default: Date.now }, // Timestamp when the order was created
  },
  { timestamps: true }, // Includes createdAt and updatedAt fields
);

module.exports = mongoose.model("SubscriptionOrder", SubscriptionOrderSchema);
