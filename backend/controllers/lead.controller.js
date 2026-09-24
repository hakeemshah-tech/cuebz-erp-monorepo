const Lead = require("../models/Lead.schema");
const AppError = require("../utils/appError");
const Organization = require("../models/Organization.schema");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");

// Create Lead
exports.createLead = async (req, res, next) => {
  try {
    // Check if the organization belongs to the current user's tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError(
          "The specified organization does not belong to the current tenant.",
          400,
        ),
      );
    }

    // Create lead record
    const lead = await Lead.create({
      ...req.body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    res.status(201).json({
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Leads with Filtering
exports.getAllLeads = async (req, res, next) => {
  try {
    const {
      search,
      lead_status,
      lead_source,
      assigned_to,
      start_date,
      end_date,
    } = req.query;

    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { contact_person: { $regex: search, $options: "i" } },
        { lead_identifier_name: { $regex: search, $options: "i" } },
        { company_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Add lead status filter
    if (lead_status) {
      filters.lead_status = lead_status;
    }

    // Add lead source filter
    if (lead_source) {
      filters.lead_source = lead_source;
    }

    // Add assigned_to filter
    if (assigned_to) {
      filters.assigned_to = assigned_to;
    }

    // Add date range filter
    if (start_date && end_date) {
      filters.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    }

    const leads = await Lead.find(filters)
      .populate("assigned_to", "full_name email")
      .populate("customer_reference", "customer_name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCount = await Lead.countDocuments(filters);

    res.status(200).json({
      message: "Leads retrieved successfully.",
      data: leads,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Lead by ID
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    })
      .populate("assigned_to", "full_name email")
      .populate("customer_reference", "customer_name email");

    if (!lead) {
      return next(new AppError("Lead not found.", 404));
    }

    res.status(200).json({
      message: "Lead retrieved successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Update Lead
exports.updateLead = async (req, res, next) => {
  try {
    // Check if the organization belongs to the current user's tenant
    const organization = await Organization.findOne({
      _id: req.user.selectedOrganization,
      tenant_id: req.user.tenant_id._id,
    });

    if (!organization) {
      return next(
        new AppError(
          "The specified organization does not belong to the current tenant.",
          400,
        ),
      );
    }

    // Update lead record
    const lead = await Lead.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      req.body,
      { new: true },
    );

    if (!lead) {
      return next(
        new AppError(
          "Lead not found or does not belong to the current tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!lead) {
      return next(new AppError("Lead not found.", 404));
    }

    res.status(200).json({
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
