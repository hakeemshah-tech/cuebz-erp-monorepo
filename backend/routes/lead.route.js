const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createLeadValidation,
  updateLeadValidation,
} = require("../validations/lead.validator");
const leadController = require("../controllers/lead.controller");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.leadManagement),
  checkTenantVerified,
);

// Routes
router.post(
  "/tenant",
  validateRequest(createLeadValidation, true),
  leadController.createLead,
);

router.get("/tenant", pagination, leadController.getAllLeads);

router.get("/:id/tenant", leadController.getLeadById);

router.put(
  "/:id/tenant",
  validateRequest(updateLeadValidation, true),
  leadController.updateLead,
);

router.delete("/:id/tenant", leadController.deleteLead);

module.exports = router;
