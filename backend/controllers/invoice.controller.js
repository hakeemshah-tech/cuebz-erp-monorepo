const Invoice = require("../models/invoice.schema");
const Quotation = require("../models/Quotation.schema");
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

// 📌 **Create Invoice**
exports.createInvoice = async (req, res, next) => {
  try {
    const { body, files } = req;

    // ✅ Validate Organization Ownership
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

    // ✅ Validate Quotation Reference
    const quotation = await Quotation.findOne({
      _id: body.quotation_id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!quotation) {
      return next(new AppError("The specified quotation does not exist.", 400));
    }

    // ✅ Handle Attachments Upload
    const attachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(file, "invoices/attachments"),
            })),
          )
        : [];

    // ✅ Prepare Invoice Data
    const invoiceData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      attachments,
    };

    // ✅ Create Invoice Record
    const invoice = await Invoice.create(invoiceData);

    res.status(201).json({
      message: "Invoice created successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// 📌 **Get All Invoices with Filters**
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { search, status, date_from, date_to } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // ✅ Add Search Filter
    if (search) {
      filters.$or = [{ invoice_number: { $regex: search, $options: "i" } }];
    }

    // ✅ Add Status Filter
    if (status) {
      filters.status = status;
    }

    // ✅ Add Date Range Filter
    if (date_from || date_to) {
      filters.invoice_date = {};
      if (date_from) filters.invoice_date.$gte = new Date(date_from);
      if (date_to) filters.invoice_date.$lte = new Date(date_to);
    }

    const invoices = await Invoice.find(filters)
      .populate("quotation_id")
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ invoice_date: -1 });

    const totalCount = await Invoice.countDocuments(filters);

    res.status(200).json({
      message: "Invoices retrieved successfully.",
      data: invoices,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// 📌 **Get Invoice by ID**
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("quotation_id tenant_id organization_id");

    if (!invoice) {
      return next(new AppError("Invoice not found.", 404));
    }

    res.status(200).json({
      message: "Invoice retrieved successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// 📌 **Update Invoice**
exports.updateInvoice = async (req, res, next) => {
  try {
    const { body, files } = req;

    // ✅ Validate Organization Ownership
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

    // ✅ Validate Quotation Reference (if updated)
    if (body.quotation_id) {
      const quotation = await Quotation.findOne({
        _id: body.quotation_id,
        tenant_id: req.user.tenant_id._id,
      });

      if (!quotation) {
        return next(
          new AppError("The specified quotation does not exist.", 400),
        );
      }
    }

    // ✅ Upload New Attachments
    const newAttachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(file, "invoices/attachments"),
            })),
          )
        : [];

    // ✅ Combine Existing and New Attachments
    const updatedData = {
      ...body,
      attachments: [...(body.attachments || []), ...newAttachments],
    };

    // ✅ Update Invoice Record
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatedData,
      { new: true },
    );

    if (!invoice) {
      return next(
        new AppError(
          "Invoice not found or does not belong to the tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Invoice updated successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// 📌 **Delete Invoice**
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!invoice) {
      return next(new AppError("Invoice not found.", 404));
    }

    res.status(200).json({
      message: "Invoice deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
