const { default: mongoose } = require("mongoose");

// TODO: Every tenant have multiple organization
const TenantSchema = new mongoose.Schema({
  company_name: { type: String, required: true, unique: true },
  tenant_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscription_plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
  },
  subscription_start_date: { type: Date }, // default will be starting trailing just after tenant creation
  subscription_end_date: { type: Date }, // after 20 days after account tenant creation...
  current_period_start: { type: Date }, // Current period start date (newly added)
  subscription_status: {
    type: String,
    enum: [
      "PendingApproval",
      "Trialing",
      "Active",
      "Expired",
      "Payment Failed",
      "Pending Update",
    ],
    default: "PendingApproval",
  },
  stripeCustomerId: { type: String }, // only if the tenant subscribed => Stripe customer ID
  stripeSubscriptionId: { type: String }, // only if the tenant subscribed => Stripe subscription ID
});

module.exports = mongoose.model("Tenant", TenantSchema);

// TenantSchema.pre("remove", async function (next) {
//   await User.deleteMany({ tenant_id: this._id }); // Delete all users for this tenant
//   //   await SubscriptionOrder.deleteMany({ tenant_id: this._id }); // Delete related subscription orders
//   // Add more related collections if needed
//   next();
// });
