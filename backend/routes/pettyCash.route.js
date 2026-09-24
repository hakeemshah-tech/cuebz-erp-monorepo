const express = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");
const validateRequest = require("../middlewares/validateRequest");
const pagination = require("../middlewares/pagination");
const pettyCashController = require("../controllers/pettycash.controller");
const {
  createPettyCashValidation,
  updatePettyCashValidation,
} = require("../validations/pettycash.validator");
const uploadPettyCashFiles = require("../middlewares/fileUploads/pettyCashFileUploadMiddleware");

const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware for authentication and role-based access
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.pettyCash),
);

// Routes
router.post(
  "/tenant",
  uploadPettyCashFiles,
  validateRequest(createPettyCashValidation),
  pettyCashController.createPettyCash,
);

router.get("/tenant", pagination, pettyCashController.getAllPettyCashEntries);

router.get("/:id/tenant", pettyCashController.getPettyCashById);

router.put(
  "/:id/tenant",
  uploadPettyCashFiles,
  validateRequest(updatePettyCashValidation),
  pettyCashController.updatePettyCash,
);

router.delete("/:id/tenant", pettyCashController.deletePettyCash);

module.exports = router;
