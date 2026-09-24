const Vendor = require("../models/Vendor.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const { encrypt, decrypt } = require("../utils/encryption");
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

// Create Vendor
exports.createVendor = async (req, res, next) => {
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

    // Encrypt bank details if provided
    if (body.bank_details) {
      body.bank_details = {
        bank_name: body.bank_details.bank_name,
        account_number: body.bank_details.account_number
          ? encrypt(body.bank_details.account_number)
          : undefined,
        iban_number: body.bank_details.iban_number
          ? encrypt(body.bank_details.iban_number)
          : undefined,
        branch: body.bank_details.branch,
      };
    }

    // Handle attachments upload
    const attachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(file, "vendors/attachments"),
            })),
          )
        : [];

    // Prepare vendor data
    const vendorData = {
      ...body,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      created_by: req.user._id,
      attachments,
    };

    // Create vendor record
    const vendor = await Vendor.create(vendorData);

    res.status(201).json({
      message: "Vendor created successfully.",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Vendors with Filters
// exports.getAllVendors = async (req, res, next) => {
//   try {
//     const { search, vendor_type, services_offered, assigned_to } = req.query;
//     const { page, limit, skip } = req.pagination;

//     const filters = {
//       tenant_id: req.user.tenant_id._id,
//       organization_id: req.user.selectedOrganization,
//     };

//     // Add search filter
//     if (search) {
//       filters.$or = [
//         { vendor_name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { phone_number: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Add additional filters
//     if (vendor_type) filters.vendor_type = vendor_type;
//     if (services_offered)
//       filters.services_offered = { $in: services_offered.split(",") };
//     if (assigned_to) filters.assigned_to = assigned_to;

//     const vendors = await Vendor.find(filters)
//       .populate("tenant_id", "company_name")
//       .populate("organization_id", "name")
//       .populate("assigned_to", "full_name")
//       .skip(skip)
//       .limit(Number(limit))
//       .sort({ createdAt: -1 });

//     const totalCount = await Vendor.countDocuments(filters);

//     res.status(200).json({
//       message: "Vendors retrieved successfully.",
//       data: vendors,
//       pagination: generatePaginationMetadata(totalCount, page, limit),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getAllVendors = async (req, res, next) => {
  try {
    const { search, vendor_type, services_offered, assigned_to } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    };

    // Add search filter
    if (search) {
      filters.$or = [
        { vendor_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone_number: { $regex: search, $options: "i" } },
      ];
    }

    // Add additional filters
    if (vendor_type) filters.vendor_type = vendor_type;
    if (services_offered)
      filters.services_offered = { $in: services_offered.split(",") };
    if (assigned_to) filters.assigned_to = assigned_to;

    const vendors = await Vendor.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .populate("assigned_to", "full_name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // 🔐 Decrypt bank details for each vendor
    vendors.forEach((vendor) => {
      if (vendor.bank_details) {
        try {
          vendor.bank_details.account_number = decrypt(
            vendor.bank_details.account_number,
          );
          vendor.bank_details.iban_number = decrypt(
            vendor.bank_details.iban_number,
          );
        } catch (err) {
          console.warn(`Decryption failed for vendor ${vendor._id}:`, err);
        }
      }
    });

    const totalCount = await Vendor.countDocuments(filters);

    res.status(200).json({
      message: "Vendors retrieved successfully.",
      data: vendors,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    }).populate("tenant_id organization_id assigned_to");

    if (!vendor) {
      return next(new AppError("Vendor not found.", 404));
    }

    // Decrypt bank details
    if (vendor.bank_details) {
      vendor.bank_details.account_number = decrypt(
        vendor.bank_details.account_number,
      );
      vendor.bank_details.iban_number = decrypt(
        vendor.bank_details.iban_number,
      );
    }

    res.status(200).json({
      message: "Vendor retrieved successfully.",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Update Vendor
exports.updateVendor = async (req, res, next) => {
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

    // Encrypt bank details if updated
    if (body.bank_details) {
      body.bank_details = {
        bank_name: body.bank_details.bank_name,
        account_number: body.bank_details.account_number
          ? encrypt(body.bank_details.account_number)
          : undefined,
        iban_number: body.bank_details.iban_number
          ? encrypt(body.bank_details.iban_number)
          : undefined,
        branch: body.bank_details.branch,
      };
    }

    // Upload new attachments
    const newAttachments =
      files && files["attachments[]"]
        ? await Promise.all(
            files["attachments[]"].map(async (file) => ({
              file_name: file.originalname,
              file_url: await uploadToCloudinary(file, "vendors/attachments"),
            })),
          )
        : [];

    // Combine existing and new attachments
    const updatedData = {
      ...body,
      attachments: [...(body.attachments || []), ...newAttachments],
    };

    // Update vendor record
    const vendor = await Vendor.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
      },
      updatedData,
      { new: true },
    );

    if (!vendor) {
      return next(
        new AppError(
          "Vendor not found or does not belong to the current tenant.",
          404,
        ),
      );
    }

    res.status(200).json({
      message: "Vendor updated successfully.",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOneAndDelete({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
    });

    if (!vendor) {
      return next(new AppError("Vendor not found.", 404));
    }

    res.status(200).json({
      message: "Vendor deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
