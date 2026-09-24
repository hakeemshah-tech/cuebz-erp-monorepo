const express = require("express");
const router = express.Router();
const {
  createTenantByAdmin,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  createTenantSubscription,
  updateTenantSubscription,
  renewTenantSubscription,
} = require("../controllers/tenant.controller");
const { param } = require("express-validator");
const ensureRole = require("../middlewares/ensureRole");
const validateRequest = require("../middlewares/validateRequest");
const {
  validateCreateTenant,
  validateUpdateTenant,
  validateCreateSubscription,
  validateUpdateSubscription,
  validateRenewSubscription,
} = require("../validations/tenant.validator");
const pagination = require("../middlewares/pagination");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

router.use("/admin", ensureAuthenticated, ensureRole(["super-admin"])); // Apply role-based restriction

// Create a tenant
router.post(
  "/admin",
  validateRequest(validateCreateTenant),
  createTenantByAdmin,
);

// Get all tenants
router.get("/admin", pagination, getAllTenants);

// Get tenant by ID
router.get(
  "/:id/admin",
  [param("id").isMongoId().withMessage("Invalid tenant ID.")],
  getTenantById,
);

// Update tenant
router.put("/:id/admin", validateRequest(validateUpdateTenant), updateTenant);

// Delete tenant
router.delete(
  "/:id/admin",
  [param("id").isMongoId().withMessage("Invalid tenant ID.")],
  deleteTenant,
);

// Routes for subscription management
router.post(
  "/admin/create-subscription",
  validateRequest(validateCreateSubscription),
  createTenantSubscription,
);

router.put(
  "/admin/update-subscription",
  validateRequest(validateUpdateSubscription),
  updateTenantSubscription,
);

router.post(
  "/admin/renew-subscription",
  validateRequest(validateRenewSubscription),
  renewTenantSubscription,
);

module.exports = router;
