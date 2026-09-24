const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createCallLogValidation,
  updateCallLogValidation,
} = require("../validations/callLog.validator");
const callLogController = require("../controllers/callLog.controller");
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
  ensureRole(["tenant-owner", "tenant-user"], MODULES.callLog),
  checkTenantVerified,
);

// Routes
router.post(
  "/tenant",
  validateRequest(createCallLogValidation, true),
  callLogController.createCallLog,
);
router.get("/tenant", pagination, callLogController.getCallLogs);
router.get("/:id/tenant", callLogController.getCallLogById);
router.put(
  "/:id/tenant",
  validateRequest(updateCallLogValidation, true),
  callLogController.updateCallLog,
);
router.delete("/:id/tenant", callLogController.deleteCallLog);

module.exports = router;
