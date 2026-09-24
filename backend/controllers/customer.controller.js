const Customer = require("../models/Customer.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const Lead = require("../models/Lead.schema");
const Quotation = require("../models/Quotation.schema");
const Visitor = require("../models/Visitor.schema");

// Create customer
exports.createCustomer = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate organization belongs to tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError("Organization does not belong to the tenant.", 400),
      );
    }

    const customerData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      createdBy: req.user._id,
    };

    const customer = await Customer.create(customerData);

    res.status(201).json({
      message: "Customer created successfully.",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate organization belongs to tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError("Organization does not belong to the tenant.", 400),
      );
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      body,
      { new: true },
    );

    if (!customer) {
      return next(new AppError("Customer not found.", 404));
    }

    res.status(200).json({
      message: "Customer updated successfully.",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Get all customers with filters
exports.getAllCustomers = async (req, res, next) => {
  try {
    const { search, customerType } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    if (search) {
      filters.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone_number: { $regex: search, $options: "i" } },
      ];
    }

    if (customerType) {
      filters.customer_type = customerType;
    }

    const customers = await Customer.find(filters)
      .populate("assigned_to", "full_name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCount = await Customer.countDocuments(filters);

    res.status(200).json({
      message: "Customers retrieved successfully.",
      data: customers,
      pagination: { page, limit, total: totalCount },
    });
  } catch (error) {
    next(error);
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    })
      .populate("assigned_to", "full_name")
      .populate("createdBy", "name");

    if (!customer) {
      return next(new AppError("Customer not found.", 404));
    }

    res.status(200).json({
      message: "Customer retrieved successfully.",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Delete customer
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findOneAndDelete({
      _id: customerId,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!customer) {
      return next(new AppError("Customer not found.", 404));
    }

    // 2. Nullify references in other collections
    if (customer) {
      await Promise.all([
        Lead.updateMany(
          { customer_reference: customerId },
          { $set: { customer_reference: null } },
        ),
        Quotation.updateMany(
          { customer_id: customerId },
          { $set: { customer_id: null } },
        ),
        Visitor.updateMany(
          { person_visiting: customerId },
          { $set: { person_visiting: null } },
        ),
      ]);
    }

    res.status(200).json({
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
