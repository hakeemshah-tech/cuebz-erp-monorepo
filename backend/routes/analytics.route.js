const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const analyticController = require("../controllers/analytics.controller");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use("/tenant", ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"]),
  checkTenantVerified,
);

router.get("/tenant", pagination, analyticController.getAnalyticsOverview);

module.exports = router;
