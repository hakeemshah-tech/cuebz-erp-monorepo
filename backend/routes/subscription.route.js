const express = require("express");
const {
  createStripePlan,
  getAllSubscriptionPlans,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  createStripeCheckout,
  stripeWebhook,
  stripeCustomerBillingPortal,
} = require("../controllers/subscription.controller");
const validateRequest = require("../middlewares/validateRequest");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");
const {
  validateSubscriptionPlan,
} = require("../validations/subscription.validator");

const router = express.Router();

// Route for subscription plan
// TODO: Write authentication logic for super-admin-user
router.post(
  "/plans",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  validateRequest(validateSubscriptionPlan),
  createStripePlan,
);

router.get(
  "/plans",
  ensureAuthenticated,
  ensureRole(["super-admin", "tenant-owner"]),
  getAllSubscriptionPlans,
);

router.get(
  "/plans/:id",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  getSubscriptionPlanById,
);

router.delete(
  "/plans/:id",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  deleteSubscriptionPlan,
);

// Create Checkout

router.post(
  "/plans/create-checkout",
  ensureAuthenticated,
  ensureRole(["tenant-owner"]),
  createStripeCheckout,
);

router.post(
  "/billing-portal",
  ensureAuthenticated,
  ensureRole(["tenant-owner"]),
  stripeCustomerBillingPortal,
);

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  stripeWebhook,
);

module.exports = router;
