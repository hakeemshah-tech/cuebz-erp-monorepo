const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadQuotationFiles = require("../middlewares/fileUploads/quotationFileUploadMiddleware");
const {
  createQuotationValidation,
  updateQuotationValidation,
} = require("../validations/quotation.validator");
const quotationController = require("../controllers/quotation.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);

// Middleware to ensure proper role and tenant verification
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.quotationManagement),
  checkTenantVerified,
);

// Routes
// Create Quotation
router.post(
  "/tenant",
  uploadQuotationFiles, // Middleware to handle file uploads
  validateRequest(createQuotationValidation), // Middleware to validate quotation creation payload
  quotationController.createQuotation,
);

// Get all Quotations with filters and pagination
router.get(
  "/tenant",
  pagination, // Middleware for pagination
  quotationController.getAllQuotations,
);

// Get Quotation by ID
router.get("/:id/tenant", quotationController.getQuotationById);

// Update Quotation
router.put(
  "/:id/tenant",
  uploadQuotationFiles, // Middleware to handle file uploads
  validateRequest(updateQuotationValidation), // Middleware to validate quotation update payload
  quotationController.updateQuotation,
);

// Send Quotation Email
// router.post("/:id/send-email/tenant", quotationController.sendQuotationEmail);

// Delete Quotation
router.delete("/:id/tenant", quotationController.deleteQuotation);

module.exports = router;
