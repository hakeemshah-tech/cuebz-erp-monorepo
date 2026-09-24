const ChequeTracking = require("../models/Checktracker.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

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

exports.createChequeTracking = async (req, res, next) => {
  try {
    const { body, files } = req;

    // Debug: Log incoming request data
    console.log("Request Body:", body);
    console.log("Files:", files);

    // Validate organization belongs to the tenant
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

    // Construct cheque tracking data
    const chequeData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      createdBy: req.user._id,
    };

    // Handle attachments upload
    if (
      files &&
      files["attachments[]"] &&
      Array.isArray(files["attachments[]"])
    ) {
      console.log("Uploading attachments...");
      chequeData.attachments = await Promise.all(
        files["attachments[]"].map((file) =>
          uploadToCloudinary(file, "cheque-tracker/attachments"),
        ),
      );
    }

    // Create cheque tracking entry in the database
    const cheque = await ChequeTracking.create(chequeData);
    console.log("Cheque tracking entry created:", cheque);

    res.status(201).json({
      message: "Cheque tracking entry created successfully.",
      data: cheque,
    });
  } catch (error) {
    console.error("Error creating cheque tracking entry:", error);
    next(error);
  }
};

// Get all cheque tracking entries with filters
exports.getAllCheques = async (req, res, next) => {
  try {
    const { search, cheque_status, reminder_date, cheque_date } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    if (search) {
      filters.$or = [
        { cheque_number: { $regex: search, $options: "i" } },
        { bank_name: { $regex: search, $options: "i" } },
        { payeer_name: { $regex: search, $options: "i" } },
        { payee_name: { $regex: search, $options: "i" } },
        { purpose: { $regex: search, $options: "i" } },
      ];
    }

    if (cheque_status) {
      filters.cheque_status = cheque_status;
    }

    if (reminder_date) {
      const parsedReminderDate = new Date(reminder_date);
      if (!isNaN(parsedReminderDate.getTime())) {
        filters.reminder_date = {
          $gte: new Date(parsedReminderDate.setHours(0, 0, 0, 0)),
          $lte: new Date(parsedReminderDate.setHours(23, 59, 59, 999)),
        };
      }
    }

    // Filter by cheque_date
    if (cheque_date) {
      const parsedChequeDate = new Date(cheque_date);
      if (!isNaN(parsedChequeDate.getTime())) {
        filters.cheque_date = {
          $gte: new Date(parsedChequeDate.setHours(0, 0, 0, 0)),
          $lte: new Date(parsedChequeDate.setHours(23, 59, 59, 999)),
        };
      }
    }

    const cheques = await ChequeTracking.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ cheque_date: -1 });

    const totalCount = await ChequeTracking.countDocuments(filters);

    res.status(200).json({
      message: "Cheques retrieved successfully.",
      data: cheques,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get cheque tracking entry by ID
exports.getChequeById = async (req, res, next) => {
  try {
    const cheque = await ChequeTracking.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id createdBy");

    if (!cheque) {
      return next(new AppError("Cheque tracking entry not found.", 404));
    }

    res.status(200).json({
      message: "Cheque tracking entry retrieved successfully.",
      data: cheque,
    });
  } catch (error) {
    next(error);
  }
};

// Update cheque tracking entry
exports.updateChequeTracking = async (req, res, next) => {
  try {
    const { body, files } = req;

    // Validate organization belongs to the tenant
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

    // const updatedData = {
    //   ...body,
    // };

    // // Handle new attachments
    // const newAttachments =
    //   files && files["attachments[]"]
    //     ? await Promise.all(
    //         files["attachments[]"].map((file) =>
    //           uploadToCloudinary(file, "cheque-tracker/attachments"),
    //         ),
    //       )
    //     : [];

    // Combine existing and new attachments
    // updatedData.attachments = [
    //   ...(body["attachments"] || []),
    //   ...newAttachments,
    // ];

    // Handle new attachments
    const newAttachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map((file) =>
              uploadToCloudinary(file, "cheque-tracker/attachments"),
            ),
          )
        : [];

    // Merge attachments
    const mergedAttachments = [
      ...(body["attachments"] || []),
      ...newAttachments,
    ];

    // Build update pipeline (atomic conditional reminder logic)
    // const updatePipeline = [
    //   {
    //     $set: {
    //       ...body,
    //       attachments: mergedAttachments,
    //       reminder_status: {
    //         $cond: [
    //           { $ne: ["$reminder_date", new Date(body.reminder_date)] },
    //           "pending",
    //           "$reminder_status",
    //         ],
    //       },
    //     },
    //   },
    // ];
    const { reminder_date, ...rest } = body; // Destructure to exclude reminder_date

    const updatePipeline = [
      {
        $set: {
          ...rest, // everything except reminder_date
          attachments: mergedAttachments,
        },
      },
      {
        $set: {
          reminder_date: new Date(body.reminder_date),
          reminder_status: {
            $cond: [
              { $ne: ["$reminder_date", new Date(reminder_date)] },
              "pending",
              "$reminder_status",
            ],
          },
        },
      },
    ];

    // Run atomic update
    const cheque = await ChequeTracking.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatePipeline,
      { new: true },
    );

    if (!cheque) {
      return next(
        new AppError(
          "Cheque tracking entry not found or does not belong to the current tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Cheque tracking entry updated successfully.",
      data: cheque,
    });
  } catch (error) {
    console.error("Error updating cheque tracking entry:", error);
    next(error);
  }
};

// Delete cheque tracking entry
exports.deleteChequeTracking = async (req, res, next) => {
  try {
    const cheque = await ChequeTracking.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!cheque) {
      return next(new AppError("Cheque tracking entry not found.", 404));
    }

    res.status(200).json({
      message: "Cheque tracking entry deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
