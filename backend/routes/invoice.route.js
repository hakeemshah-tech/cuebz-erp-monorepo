const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadInvoiceFiles = require("../middlewares/fileUploads/invoiceFileUploadMiddleware");
const {
  createInvoiceValidation,
  updateInvoiceValidation,
} = require("../validations/invoice.validator");
const invoiceController = require("../controllers/invoice.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// ✅ Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);

// ✅ Middleware to ensure proper role and tenant verification
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.invoiceManagement),
  checkTenantVerified,
);

// ✅ Create Invoice
router.post(
  "/tenant",
  uploadInvoiceFiles, // Middleware to handle file uploads
  validateRequest(createInvoiceValidation), // Middleware to validate invoice creation payload
  invoiceController.createInvoice,
);

// ✅ Get all Invoices with filters and pagination
router.get(
  "/tenant",
  pagination, // Middleware for pagination
  invoiceController.getAllInvoices,
);

// ✅ Get Invoice by ID
router.get("/:id/tenant", invoiceController.getInvoiceById);

// ✅ Update Invoice
router.put(
  "/:id/tenant",
  uploadInvoiceFiles, // Middleware to handle file uploads
  validateRequest(updateInvoiceValidation), // Middleware to validate invoice update payload
  invoiceController.updateInvoice,
);

// ✅ Delete Invoice
router.delete("/:id/tenant", invoiceController.deleteInvoice);

module.exports = router;
