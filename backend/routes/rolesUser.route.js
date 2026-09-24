// const express = require("express");
// const ensureRole = require("../middlewares/ensureRole");
// const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
// const validateRequest = require("../middlewares/validateRequest");
// const pagination = require("../middlewares/pagination");
// const {
//   createValidateRoleAssignment,
//   validateSetPassword,
//   updateValidateRoleAndModules,
// } = require("../validations/rolesUser.validator");
// const roleController = require("../controllers/rolesUser.controller");

// const router = express.Router();

// // Middleware to check authentication
// router.use("/tenant", ensureAuthenticated);
// router.use("/tenant", ensureRole("tenant-owner")); // Only tenant owners can manage roles and users

// // Routes

// // Assign a role and modules to a user by email
// router.post(
//   "/tenant/assign-role",
//   validateRequest(createValidateRoleAssignment, true),
//   roleController.assignRole,
// );

// // Verify OTP and set password for a new user
// router.post(
//   "/tenant/set-password",
//   validateRequest(validateSetPassword, true),
//   roleController.verifyOtpAndSetPassword,
// );

// // Get all users with filtering and pagination
// router.get("/tenant", pagination, roleController.getAllUsers);

// // Update role and modules for an existing user
// router.put(
//   "/tenant/update-role",
//   validateRequest(updateValidateRoleAndModules, true),
//   roleController.updateUserRoleAndModules,
// );

// module.exports = router;

const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const validateRequest = require("../middlewares/validateRequest");
const pagination = require("../middlewares/pagination");
const {
  createValidateRoleAssignment,
  validateSetPassword,
  updateValidateRoleAndModules,
  validateResendVerification,
} = require("../validations/rolesUser.validator");
const roleController = require("../controllers/rolesUser.controller");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Verify OTP and set password for a new user
router.post(
  "/tenant/set-password",
  validateRequest(validateSetPassword, true),
  roleController.verifyOtpAndSetPassword,
);

router.post(
  "/tenant/resend-verification",
  validateRequest(validateResendVerification, true),
  roleController.resendVerification,
);

// Middleware to check authentication
router.use("/tenant", ensureAuthenticated, validateSubscription);
router.use("/tenant", ensureRole("tenant-owner"), checkTenantVerified); // Only tenant owners can manage employees

// Routes

// Assign a role and modules to a user by email
router.post(
  "/tenant/assign-role",
  validateRequest(createValidateRoleAssignment, true),
  roleController.assignRole,
);

// Get all users with filtering and pagination
router.get("/tenant", pagination, roleController.getAllUsers);

// Get user by ID
router.get("/tenant/:id", roleController.getUserById);

// Update role and modules for an existing user
router.put(
  "/tenant/update-role",
  validateRequest(updateValidateRoleAndModules, true),
  roleController.updateUserRoleAndModules,
);

// Delete a user by ID
router.delete("/tenant/:id", roleController.deleteUser);

module.exports = router;
