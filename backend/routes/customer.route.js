const express = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");
const validateRequest = require("../middlewares/validateRequest");
const pagination = require("../middlewares/pagination");
const customerController = require("../controllers/customer.controller");
const {
  createCustomerValidation,
  updateCustomerValidation,
} = require("../validations/customer.validator");

const MODULES = require("../constants/module");
const validateSubscription = require("../middlewares/validateSubscription");

const router = express.Router();

// Middleware for authentication and role-based access
router.use(ensureAuthenticated, validateSubscription);
router.use(
  "/tenant",
  ensureRole(["tenant-owner", "tenant-user"], MODULES.customer),
);

// Routes
router.post(
  "/tenant",
  validateRequest(createCustomerValidation),
  customerController.createCustomer,
);

router.get("/tenant", pagination, customerController.getAllCustomers);

router.get("/:id/tenant", customerController.getCustomerById);

router.put(
  "/:id/tenant",
  validateRequest(updateCustomerValidation),
  customerController.updateCustomer,
);

router.delete("/:id/tenant", customerController.deleteCustomer);

module.exports = router;
