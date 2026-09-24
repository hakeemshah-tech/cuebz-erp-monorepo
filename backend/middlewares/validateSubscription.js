const Tenant = require("../models/Tenant.schema");

const validateSubscription = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.user.tenant_id._id);

    if (
      !tenant ||
      (tenant.subscription_status !== "Active" &&
        tenant.subscription_status !== "Trialing")
    ) {
      return res.status(403).json({
        error: "Access denied: Subscription is inactive or expired.",
        subscription_error: true,
      });
    }
    return next();
  } catch (error) {
    console.error("Error validating subscription:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = validateSubscription;
