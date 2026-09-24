const PettyCash = require("../models/PettyCash.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// const uploadToCloudinary = require("../utils/uploadToCloudinary");

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Create petty cash entry
exports.createPettyCash = async (req, res, next) => {
  try {
    const { body, files } = req;

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

    // Handle attachment upload
    let attachment = null;
    if (files?.attachment) {
      attachment = await uploadToCloudinary(
        files.attachment[0],
        "petty-cash/attachments",
      );
    }

    const pettyCashData = {
      ...body,
      amount: parseFloat(body.amount),
      attachment,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      createdBy: req.user._id,
    };

    const pettyCashEntry = await PettyCash.create(pettyCashData);

    res.status(201).json({
      message: "Petty cash entry created successfully.",
      data: pettyCashEntry,
    });
  } catch (error) {
    next(error);
  }
};

// Update petty cash entry
exports.updatePettyCash = async (req, res, next) => {
  try {
    const { body, files } = req;

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

    // Upload new attachment if provided
    let newAttachment = null;
    if (files?.attachment) {
      newAttachment = await uploadToCloudinary(
        files.attachment[0],
        "petty-cash/attachments",
      );
    }

    const updatedData = {
      ...body,
      amount: parseFloat(body.amount),
      ...(newAttachment ? { attachment: newAttachment } : {}),
    };

    const pettyCashEntry = await PettyCash.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatedData,
      { new: true },
    );

    if (!pettyCashEntry) {
      return next(new AppError("Petty cash entry not found.", 404));
    }

    res.status(200).json({
      message: "Petty cash entry updated successfully.",
      data: pettyCashEntry,
    });
  } catch (error) {
    next(error);
  }
};

// Get all petty cash entries with filters
exports.getAllPettyCashEntries = async (req, res, next) => {
  try {
    const { search, transaction_type, transaction_date } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Apply search filter
    if (search) {
      filters.$or = [
        { purpose: { $regex: search, $options: "i" } },
        { remarks: { $regex: search, $options: "i" } },
      ];
    }

    // Apply transaction type filter
    if (transaction_type) {
      filters.transaction_type = transaction_type;
    }

    // Apply date filter if provided
    if (transaction_date) {
      const parsedDate = new Date(transaction_date);
      if (!isNaN(parsedDate.getTime())) {
        filters.transaction_date = {
          $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
          $lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
        };
      }
    }

    // Fetch filtered entries with pagination
    const entries = await PettyCash.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ transaction_date: -1 });

    const totalCount = await PettyCash.countDocuments(filters);

    // Aggregation for total calculations
    const totals = await PettyCash.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalReceived: {
            $sum: {
              $cond: [{ $eq: ["$transaction_type", "Add"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$transaction_type", "Expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const totalReceived = totals.length > 0 ? totals[0].totalReceived : 0;
    const totalExpense = totals.length > 0 ? totals[0].totalExpense : 0;
    const balanceAmount = totalReceived - totalExpense;

    res.status(200).json({
      message: "Petty cash entries retrieved successfully.",
      data: entries,
      pagination: { page, limit, total: totalCount },
      totals: {
        totalReceived,
        totalExpense,
        balanceAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get petty cash entry by ID
exports.getPettyCashById = async (req, res, next) => {
  try {
    const entry = await PettyCash.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id createdBy");

    if (!entry) {
      return next(new AppError("Petty cash entry not found.", 404));
    }

    res.status(200).json({
      message: "Petty cash entry retrieved successfully.",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

// Delete petty cash entry
exports.deletePettyCash = async (req, res, next) => {
  try {
    const entry = await PettyCash.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!entry) {
      return next(new AppError("Petty cash entry not found.", 404));
    }

    res.status(200).json({
      message: "Petty cash entry deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
