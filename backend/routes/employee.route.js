const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
  createValidateEmployee,
  updateValidateEmployee,
  validateUploadedFiles,
} = require("../validations/employee.validator");
const employeeController = require("../controllers/employee.controller");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadEmployeeFiles = require("../middlewares/fileUploads/employeeFileUploadMiddleware");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.employees),
  checkTenantVerified,
);
// Routes
router.post(
  "/tenant",
  uploadEmployeeFiles, // Middleware to handle file uploads
  validateUploadedFiles, // Middleware to validate uploaded files
  validateRequest(createValidateEmployee),
  employeeController.createEmployee,
);

router.get("/tenant", pagination, employeeController.getAllEmployees);
router.get("/:id/tenant", employeeController.getEmployeeById);

router.put(
  "/:id/tenant",
  uploadEmployeeFiles, // Middleware to handle file uploads
  validateUploadedFiles, // Middleware to validate uploaded files
  validateRequest(updateValidateEmployee),
  employeeController.updateEmployee,
);

router.delete("/:id/tenant", employeeController.deleteEmployee);

module.exports = router;
