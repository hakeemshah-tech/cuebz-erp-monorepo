const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");

// Create Organization
exports.createOrganization = async (req, res, next) => {
  try {
    const { name, employees_count, business_category } = req.body;
    const tenantId = req.user.tenant_id._id;

    if (!tenantId) {
      return next(
        new AppError(
          "You must be associated with a tenant to create an organization.",
          403,
        ),
      );
    }

    // Check if the tenant has reached the max organization limit
    const organizationCount = await Organization.countDocuments({
      tenant_id: tenantId,
    });
    if (organizationCount >= 5) {
      return next(
        new AppError(
          "You have reached the maximum limit of 5 organizations.",
          400,
        ),
      );
    }

    // Create the organization
    const organization = await Organization.create({
      name,
      employees_count,
      business_category,
      tenant_id: tenantId,
    });

    res.status(201).json({
      message: "Organization created successfully.",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Get Organizations for a Tenant
exports.getOrganizations = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant_id._id;

    if (!tenantId) {
      return next(
        new AppError(
          "You must be associated with a tenant to view organizations.",
          403,
        ),
      );
    }

    const organizations = await Organization.find({ tenant_id: tenantId });

    res.status(200).json({
      message: "Organizations retrieved successfully.",
      data: organizations,
    });
  } catch (error) {
    next(error);
  }
};
