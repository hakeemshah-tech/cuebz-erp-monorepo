const express = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");
const validateRequest = require("../middlewares/validateRequest");
const pagination = require("../middlewares/pagination");
const chequeTrackingController = require("../controllers/checkTracker.controller");
const {
  createChequeValidation,
  updateChequeValidation,
} = require("../validations/chequeTracking.validator");
const uploadCheckTrackerFiles = require("../middlewares/fileUploads/checkTrackerFileUploadMiddleware");

const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware for authentication and role-based access
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.chequeTracker),
);

// Routes
router.post(
  "/tenant",
  uploadCheckTrackerFiles,
  validateRequest(createChequeValidation),
  chequeTrackingController.createChequeTracking,
);

router.get("/tenant", pagination, chequeTrackingController.getAllCheques);

router.get("/:id/tenant", chequeTrackingController.getChequeById);

router.put(
  "/:id/tenant",
  uploadCheckTrackerFiles,
  validateRequest(updateChequeValidation),
  chequeTrackingController.updateChequeTracking,
);

router.delete("/:id/tenant", chequeTrackingController.deleteChequeTracking);

module.exports = router;
