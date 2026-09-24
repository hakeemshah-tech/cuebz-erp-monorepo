const express = require("express");
const {
  logout,
  refreshToken,
  registerTenant,
  verifyTenantOtp,
  getCurrentUser,
  approveTenant,
  forgotPasswordRequest,
  verifyPasswordResetOtp,
  resendPasswordResetOtp,
  resetPasswordWithToken,
} = require("../controllers/auth.controller");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const { superAdminLogin, tenantOwnerLogin } = require("../config/passport");
const validateRequest = require("../middlewares/validateRequest");
const { validateCreateTenant } = require("../validations/tenant.validator");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const validateSubscription = require("../middlewares/validateSubscription");
const ensureRole = require("../middlewares/ensureRole");
const { forgotPasswordLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

// Super Admin Login
router.post("/super-admin/login", superAdminLogin);

// Tenant Owner Login
router.post("/tenant-owner/login", tenantOwnerLogin);

// Logout route
router.post("/logout", ensureAuthenticated, logout);
router.post("/refresh", refreshToken);

// Register route (for tenant-owner registration)
router.post(
  "/tenant-owner/register",
  validateRequest(validateCreateTenant),
  registerTenant,
);

// Otp verification Tenant
router.post("/tenant-owner/verify-otp", verifyTenantOtp);

// Getting Current logged user info
router.get(
  "/profile",
  ensureAuthenticated,
  checkTenantVerified,
  // validateSubscription,
  getCurrentUser,
);

router.patch(
  "/tenants/:tenantId/approve",
  ensureAuthenticated,
  ensureRole(["super-admin"]),
  approveTenant,
);

router.post("/password/forgot", forgotPasswordLimiter, forgotPasswordRequest);
router.post(
  "/password/verify-otp",
  forgotPasswordLimiter,
  verifyPasswordResetOtp,
);
router.post(
  "/password/resend-otp",
  forgotPasswordLimiter,
  resendPasswordResetOtp,
);
router.post("/password/reset", resetPasswordWithToken);

module.exports = router;
