const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadVendorFiles = require("../middlewares/fileUploads/vendorFileUploadMiddleware");
const {
  createVendorValidation,
  updateVendorValidation,
} = require("../validations/vendor.validator");
const vendorController = require("../controllers/vendor.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);

// Middleware to ensure proper role and tenant verification
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.vendorManagement),
  checkTenantVerified,
);

// Routes
// Create Vendor
router.post(
  "/tenant",
  uploadVendorFiles, // Middleware to handle file uploads
  validateRequest(createVendorValidation), // Middleware to validate vendor creation payload
  vendorController.createVendor,
);

// Get all Vendors with filters and pagination
router.get(
  "/tenant",
  pagination, // Middleware for pagination
  vendorController.getAllVendors,
);

// Get Vendor by ID
router.get("/:id/tenant", vendorController.getVendorById);

// Update Vendor
router.put(
  "/:id/tenant",
  uploadVendorFiles, // Middleware to handle file uploads
  validateRequest(updateVendorValidation), // Middleware to validate vendor update payload
  vendorController.updateVendor,
);

// Delete Vendor
router.delete("/:id/tenant", vendorController.deleteVendor);

module.exports = router;
