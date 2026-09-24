const Asset = require("../models/asset.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");

// ✅ Create Asset
exports.createAsset = async (req, res, next) => {
  try {
    // Validate if the organization belongs to the current user's tenant
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

    const newAsset = await Asset.create({
      ...req.body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    res.status(201).json({
      message: "Asset added successfully.",
      data: newAsset,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Asset
exports.updateAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedAsset = await Asset.findOneAndUpdate(
      {
        _id: id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      req.body,
      { new: true },
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    res.status(200).json({
      message: "Asset updated successfully.",
      data: updatedAsset,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Assets with Filters & Pagination
exports.getAssets = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Search filter
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { serial_number: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) filters.category = category;

    // Status filter
    if (status) filters.status = status;

    const assets = await Asset.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("assigned_to", "full_name") // Populating assigned employee details
      .exec();

    const totalCount = await Asset.countDocuments(filters);

    res.status(200).json({
      message: "Assets retrieved successfully.",
      data: assets,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Asset by ID
exports.getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("assigned_to organization_id");

    if (!asset) {
      return next(new AppError("Asset not found.", 404));
    }

    res.status(200).json({
      message: "Asset retrieved successfully.",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Asset
exports.deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedAsset = await Asset.findOneAndDelete({
      _id: id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    res.status(200).json({
      message: "Asset deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
