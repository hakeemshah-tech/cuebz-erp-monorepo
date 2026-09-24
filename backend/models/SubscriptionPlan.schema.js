const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Plan name (e.g., "Basic", "Pro")
    description: { type: String }, // Optional description of the plan
    price: { type: Number, required: true }, // Price in default currency (e.g., AED)
    interval: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },
    interval_count: {
      type: String,
      enum: ["1", "3", "6"],
      required: true,
    },
    features: {
      max_organization: { type: Number, required: true }, // Max number of organizations allowed
      max_users: { type: Number, default: 10 }, // Default max users
    },
    trial_duration: { type: Number, default: 20 }, // Trial duration in days
    stripeProductId: { type: String, required: true }, // Stripe product ID
    stripePriceId: { type: String, required: true }, // Stripe price ID
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // Plan status
  },
  { timestamps: true },
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
