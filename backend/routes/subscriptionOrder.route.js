const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  downloadInvoice,
} = require("../controllers/subscriptionOrder.controller");
const ensureRole = require("../middlewares/ensureRole");
const validateRequest = require("../middlewares/validateRequest");
const {
  validateCreateOrder,
  validateUpdateOrderStatus,
} = require("../validations/subscriptionOrder.validator");
const pagination = require("../middlewares/pagination");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

router.use("/admin", ensureAuthenticated, ensureRole(["super-admin"])); // Apply role-based restriction

// Admin Routes
router.get("/admin", pagination, getAllOrders);
router.get("/:id/admin", getOrderById);
router.post("/admin", validateRequest(validateCreateOrder), createOrder);
router.put(
  "/:id/status/admin",
  validateRequest(validateUpdateOrderStatus),
  updateOrderStatus,
);
router.get("/:id/invoice/admin", downloadInvoice);

router.delete("/:id/admin", deleteOrder);

module.exports = router;
