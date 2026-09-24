const Quotation = require("../models/Quotation.schema");
const Invoice = require("../models/invoice.schema");
const Customer = require("../models/Customer.schema"); // Replacing Lead with Customer
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Function to upload files to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// **Create Quotation**
exports.createQuotation = async (req, res, next) => {
  try {
    const { body, files } = req;

    // Validate organization ownership
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

    // Validate Customer ID if provided
    if (body.customer_id) {
      const customerExists = await Customer.findOne({
        _id: body.customer_id,
        tenant_id: req.user.tenant_id._id,
      });

      if (!customerExists) {
        return next(
          new AppError("The specified customer does not exist.", 400),
        );
      }
    } else {
      return next(new AppError("Customer ID is required.", 400));
    }

    // Handle attachments upload
    const attachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(
                file,
                "quotations/attachments",
              ),
            })),
          )
        : [];

    // Prepare quotation data
    const quotationData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      attachments,
    };

    // Create quotation record
    const quotation = await Quotation.create(quotationData);

    res.status(201).json({
      message: "Quotation created successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// **Get All Quotations with Filters**
exports.getAllQuotations = async (req, res, next) => {
  try {
    const { search, status, customer_id, date_from, date_to } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { proposal_title: { $regex: search, $options: "i" } },
        { proposal_number: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status) {
      filters.status = status;
    }

    // Add customer filter
    if (customer_id) {
      filters.customer_id = customer_id;
    }

    // Add date range filter
    if (date_from || date_to) {
      filters.proposal_date = {};
      if (date_from) filters.proposal_date.$gte = new Date(date_from);
      if (date_to) filters.proposal_date.$lte = new Date(date_to);
    }

    const quotations = await Quotation.find(filters)
      .populate("customer_id") // Populating Customer Data
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ proposal_date: -1 });

    const totalCount = await Quotation.countDocuments(filters);

    res.status(200).json({
      message: "Quotations retrieved successfully.",
      data: quotations,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// **Get Quotation by ID**
exports.getQuotationById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("customer_id tenant_id organization_id");

    if (!quotation) {
      return next(new AppError("Quotation not found.", 404));
    }

    res.status(200).json({
      message: "Quotation retrieved successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// **Update Quotation**
exports.updateQuotation = async (req, res, next) => {
  try {
    const { body, files } = req;

    // Validate organization ownership
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

    // Validate Customer ID if provided
    if (body.customer_id) {
      const customerExists = await Customer.findOne({
        _id: body.customer_id,
        tenant_id: req.user.tenant_id._id,
      });

      if (!customerExists) {
        return next(
          new AppError("The specified customer does not exist.", 400),
        );
      }
    } else {
      return next(new AppError("Customer ID is required.", 400));
    }

    // Handle new attachments upload
    const newAttachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(
                file,
                "quotations/attachments",
              ),
            })),
          )
        : [];

    // Combine existing and new attachments
    const updatedData = {
      ...body,
      attachments: [...(body.attachments || []), ...newAttachments],
    };

    // Update quotation record
    const quotation = await Quotation.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatedData,
      { new: true },
    );

    if (!quotation) {
      return next(
        new AppError(
          "Quotation not found or does not belong to the tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Quotation updated successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// **Delete Quotation**
exports.deleteQuotation = async (req, res, next) => {
  try {
    const quotationId = req.params.id;

    const quotation = await Quotation.findOneAndDelete({
      _id: quotationId,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!quotation) {
      return next(new AppError("Quotation not found.", 404));
    }

    //Nullify the references in other collections
    if (quotation) {
      await Invoice.updateMany(
        { quotation_id: quotationId },
        { $set: { quotation_id: null } },
      );
    }

    res.status(200).json({
      message: "Quotation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
