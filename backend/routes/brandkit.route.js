const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createBrandKitValidation,
  updateBrandKitValidation,
} = require("../validations/brandKit.validator");
const brandKitController = require("../controllers/brandkit.controller");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadBrandKitFiles = require("../middlewares/fileUploads/uploadBrandKitFiles");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.brandKit),
  checkTenantVerified,
);

// Routes
router.post(
  "/tenant",
  uploadBrandKitFiles,
  validateRequest(createBrandKitValidation),
  brandKitController.upsertBrandKit,
);

router.get("/tenant", pagination, brandKitController.getBrandKit);

router.put(
  "/:id/tenant",
  uploadBrandKitFiles,
  validateRequest(updateBrandKitValidation, true),
  brandKitController.upsertBrandKit,
);

router.delete("/:id/tenant", brandKitController.deleteBrandKit);

module.exports = router;
