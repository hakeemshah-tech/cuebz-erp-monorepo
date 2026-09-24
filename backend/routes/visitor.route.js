const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createValidateVisitor,
  updateValidateVisitor,
} = require("../validations/visitor.validator");
const visitorController = require("../controllers/visitor.controller");
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
  ensureRole(["tenant-owner", "tenant-user"], MODULES.visitorLog),
  checkTenantVerified,
);
// router.use("/tenant", ensureRole("tenant-owner"), checkTenantVerified); // Only tenant owners can manage visitors

// Routes
router.post(
  "/tenant",
  validateRequest(createValidateVisitor, true),
  visitorController.createVisitor,
);
router.get("/tenant", pagination, visitorController.getAllVisitors);
router.get("/:id/tenant", visitorController.getVisitorById);
router.put(
  "/:id/tenant",
  validateRequest(updateValidateVisitor, true),
  visitorController.updateVisitor,
);
router.delete("/:id/tenant", visitorController.deleteVisitor);

module.exports = router;
