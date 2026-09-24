const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createValidateAsset,
  updateValidateAsset,
} = require("../validations/asset.validator");
const assetController = require("../controllers/asset.controller");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// ✅ Middleware to check authentication
router.use("/tenant", ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.assetManagement),
  checkTenantVerified,
);

// ✅ Routes
router.post(
  "/tenant",
  validateRequest(createValidateAsset, true),
  assetController.createAsset,
);
router.get("/tenant", pagination, assetController.getAssets);
router.get("/:id/tenant", assetController.getAssetById);
router.put(
  "/:id/tenant",
  validateRequest(updateValidateAsset, true),
  assetController.updateAsset,
);
router.delete("/:id/tenant", assetController.deleteAsset);

module.exports = router;
