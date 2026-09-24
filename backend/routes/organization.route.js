const express = require("express");
const router = express.Router();
const {
  createOrganization,
  getOrganizations,
} = require("../controllers/organization.controller");
const ensureRole = require("../middlewares/ensureRole");
const {
  validateOrganization,
} = require("../validations/organization.validator");
const validateRequest = require("../middlewares/validateRequest");
const validateSubscription = require("../middlewares/validateSubscription");

router.post(
  "/tenant",
  ensureRole(["tenant-owner"]),
  validateSubscription,
  validateRequest(validateOrganization),
  createOrganization,
);

router.get(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"]),
  getOrganizations,
);

module.exports = router;
