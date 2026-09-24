const SubscriptionOrder = require("../models/SubscriptionOrder.schema");
const Tenant = require("../models/Tenant.schema");
const SubscriptionPlan = require("../models/SubscriptionPlan.schema");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const AppError = require("../utils/appError");
const PDFDocument = require("pdfkit");

// Fetch all subscription orders with filters and pagination
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, tenantId, subscriptionPlanId } = req.query;

    const { page, limit, skip } = req.pagination;

    const filters = {};

    if (status) filters.status = status;
    if (tenantId) filters.tenant_id = tenantId;
    if (subscriptionPlanId) filters.subscription_plan = subscriptionPlanId;

    const orders = await SubscriptionOrder.find(filters)
      .populate("tenant_id", "company_name tenant_owner")
      .populate("subscription_plan", "name price interval")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await SubscriptionOrder.countDocuments(filters);

    res.status(200).json({
      message: "Subscription Orders retrieved successfully.",
      data: orders,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single subscription order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await SubscriptionOrder.findById(req.params.id)
      .populate("tenant_id", "company_name tenant_owner")
      .populate("subscription_plan", "name price interval");

    if (!order) {
      return next(new AppError("Subscription order not found", 400));
    }

    res.status(200).json({
      message: "Subscription Order Fetched success",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching subscription order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new subscription order
exports.createOrder = async (req, res, next) => {
  try {
    const {
      tenant_id,
      subscription_plan,
      stripeInvoiceId,
      stripeSubscriptionId,
      amount,
      currency,
      status,
      start_date,
      end_date,
    } = req.body;

    const tenantExists = await Tenant.findById(tenant_id);
    if (!tenantExists) {
      return next(new AppError("Tenant not found", 404));
    }

    const planExists = await SubscriptionPlan.findById(subscription_plan);
    if (!planExists) {
      return next(new AppError("Subscription plan not found", 404));
    }

    const newOrder = new SubscriptionOrder({
      tenant_id,
      subscription_plan,
      stripeInvoiceId,
      stripeSubscriptionId,
      amount,
      currency,
      status,
      start_date,
      end_date,
    });

    await newOrder.save();
    res.status(200).json({
      message: "Subscription Order Created",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Update subscription order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await SubscriptionOrder.findById(req.params.id);

    if (!order) {
      return next(new AppError("Subscription order not found", 404));
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Delete subscription order
exports.deleteOrder = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const order = await SubscriptionOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return next(new AppError("Subscription order not found", 404));
    }

    res
      .status(200)
      .json({ message: "Subscription order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Downloading Invoice for the Subscription Order
exports.downloadInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the order from the database
    const order = await SubscriptionOrder.findById(id)
      .populate("tenant_id", "company_name")
      .populate("subscription_plan", "name price interval");

    if (!order) {
      return res.status(404).json({ message: "Subscription order not found" });
    }

    // Generate the invoice
    const pdfDoc = new PDFDocument({ margin: 50 });

    // File name for download
    const fileName = `Invoice-${order._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    pdfDoc.pipe(res);

    // Add the content
    pdfDoc.fontSize(20).text("Invoice", { align: "center" });
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text(`Invoice ID: ${order._id}`);
    pdfDoc.text(`Date: ${new Date(order.created_at).toDateString()}`);
    pdfDoc.text(`Company Name: ${order.tenant_id.company_name}`);
    pdfDoc.text(`Plan: ${order.subscription_plan.name}`);
    pdfDoc.text(`Amount: ${order.amount} ${order.currency.toUpperCase()}`);
    pdfDoc.text(`Start Date: ${new Date(order.start_date).toDateString()}`);
    pdfDoc.text(`End Date: ${new Date(order.end_date).toDateString()}`);
    pdfDoc.text(`Status: ${order.status}`);

    pdfDoc.end();
  } catch (error) {
    next(error);
  }
};
