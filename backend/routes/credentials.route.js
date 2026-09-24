const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkCredentialSession = require("../middlewares/checkCredientialSession");
// const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const credentialController = require("../controllers/credientials.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// ✅ Middleware: Ensure Authentication
router.use(ensureAuthenticated, validateSubscription);

// ✅ Middleware: Ensure Role-Based Access & Tenant Verification
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.credentials),
  checkTenantVerified,
);

// ✅ Generate OTP if Session Expired (Manually Request)
router.post(
  "/tenant/generate-otp",
  credentialController.generateCredentialsOTP,
);

// ✅ Verify OTP & Start Secure 15-Minute Session
router.post("/tenant/verify-otp", credentialController.verifyCredentialsOTP);

// ✅ Get All Credentials (Requires Active Session)
router.get(
  "/tenant",
  pagination,
  checkCredentialSession,
  credentialController.getCredentials,
);

// ✅ Check Session Status for Frontend Polling
router.get("/tenant/session-status", credentialController.checkSessionStatus);

// ✅ Upsert Credentials (Requires Active Session)
router.post(
  "/tenant",
  //   validateRequest(true),
  checkCredentialSession,
  credentialController.upsertCredential,
);

// ✅ Delete Credential by Platform (Requires Active Session)
router.delete(
  "/:platform/tenant",
  checkCredentialSession,
  credentialController.deleteCredential,
);

module.exports = router;
