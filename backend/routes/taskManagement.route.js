const express = require("express");
const ensureRole = require("../middlewares/ensureRole");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const validateRequest = require("../middlewares/validateRequest");
const checkTenantVerified = require("../middlewares/checkTenantVerified");
const pagination = require("../middlewares/pagination");
const uploadTaskFiles = require("../middlewares/fileUploads/taskManagementFileUploadMiddleware");
const {
  createValidateTask,
  updateValidateTask,
} = require("../validations/taskManagement.validator");
const taskController = require("../controllers/taskManagement.controller");
const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware to check authentication
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.taskManagement),
  checkTenantVerified,
);
// Routes
router.post(
  "/tenant",
  uploadTaskFiles, // Middleware to handle file uploads
  validateRequest(createValidateTask), // Middleware to validate task creation payload
  taskController.createTask,
);

router.get(
  "/tenant",
  pagination, // Middleware for pagination
  taskController.getAllTasks,
);

router.get("/:id/tenant", taskController.getTaskById);

router.put(
  "/:id/tenant",
  uploadTaskFiles, // Middleware to handle file uploads
  validateRequest(updateValidateTask), // Middleware to validate task update payload
  taskController.updateTask,
);

router.delete("/:id/tenant", taskController.deleteTask);

module.exports = router;
