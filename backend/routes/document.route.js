const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const uploadDocumentFiles = require("../middlewares/fileUploads/documentFileUploadMiddleware");
const documentController = require("../controllers/document.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// ✅ Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);

// ✅ Middleware to ensure proper role and tenant verification
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.documentManagement),
  checkTenantVerified,
);

// ✅ Upsert Document (Create or Update)
router.post(
  "/tenant",
  // uploadDocumentFiles, // Middleware to handle file uploads
  documentController.upsertDocument,
);

// ✅ Get Document by Tenant and Organization ID
router.get("/tenant", documentController.getDocument);

module.exports = router;
