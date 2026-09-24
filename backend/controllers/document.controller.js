const Document = require("../models/document.schema");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const AppError = require("../utils/appError");

/**
 * Upload a single file to Cloudinary
 * @param {Object} file - File to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - Returns uploaded file URL
 */

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

// exports.upsertDocument = async (req, res, next) => {
//   try {
//     const { comments } = req.body;
//     let expiry_dates = {};

//     try {
//       expiry_dates = req.body.expiry_dates
//         ? JSON.parse(req.body.expiry_dates)
//         : {};
//     } catch (e) {
//       return next(new AppError("Invalid expiry_dates format", 400));
//     }

//     const { tenant_id, selectedOrganization } = req.user;

//     if (!tenant_id || !selectedOrganization) {
//       return next(
//         new AppError("Tenant ID and Organization ID are required.", 400),
//       );
//     }

//     let document = await Document.findOne({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });

//     const uploadResults = {};

//     const singleFields = [
//       "trade_license",
//       "moa",
//       "aoa",
//       "emigration_card",
//       "certificate_of_incorporation",
//       "shareholder_agreement",
//       "tenancy_contract_or_ejari",
//       "vat_registration_certificate",
//       "corporate_tax_certificate",
//       "business_plan_document",
//       "power_of_attorney",
//       "insurance_policies",
//       "employee_handbook_or_hr_policies",
//       "intellectual_property_registrations",
//       "trade_mark_certificate",
//       "iso_certification",
//       "bank_statement",
//     ];

//     for (const field of singleFields) {
//       const existingData =
//         document?.section_1?.[field] || document?.section_2?.[field] || {};

//       if (req.files[field]) {
//         const fileUpload = await uploadToCloudinary(
//           req.files[field][0],
//           `documents/${field}`,
//         );
//         uploadResults[field] = {
//           file: fileUpload,
//           expiry_date: expiry_dates[field]
//             ? new Date(expiry_dates[field])
//             : null,
//         };
//       } else if (req.body[field] === "null") {
//         // 👇 Handle deletion
//         uploadResults[field] = {
//           file: null,
//           expiry_date: null,
//         };
//       } else if (expiry_dates[field] !== undefined) {
//         uploadResults[field] = {
//           ...existingData,
//           expiry_date: expiry_dates[field]
//             ? new Date(expiry_dates[field])
//             : null,
//         };
//       }
//     }

//     const multipleFields = [
//       "passport_copies",
//       "visa_residence_permits",
//       "company_policies",
//       "contract_templates",
//     ];

//     for (const field of multipleFields) {
//       const existingDocs =
//         document?.section_1?.[field] || document?.section_2?.[field] || [];

//       if (req.files[field]) {
//         const uploads = await Promise.all(
//           req.files[field].map((file, index) =>
//             uploadToCloudinary(file, `documents/${field}`).then((result) => ({
//               file: result,
//               expiry_date: expiry_dates[field]?.[index]
//                 ? new Date(expiry_dates[field][index])
//                 : null,
//             })),
//           ),
//         );
//         uploadResults[field] = uploads;
//       } else if (expiry_dates[field]) {
//         uploadResults[field] = existingDocs.map((doc, index) => ({
//           ...doc,
//           expiry_date: expiry_dates[field][index]
//             ? new Date(expiry_dates[field][index])
//             : null,
//         }));
//       }
//     }

//     const documentData = {
//       tenant_id,
//       organization_id: selectedOrganization,
//       comments,
//       section_1: {
//         ...document?.section_1,
//         ...pick(uploadResults, [...singleFields, ...multipleFields]),
//       },
//       section_2: {
//         ...document?.section_2,
//         ...pick(uploadResults, [...singleFields, ...multipleFields]),
//       },
//     };

//     if (document) {
//       document = await Document.findByIdAndUpdate(document._id, documentData, {
//         new: true,
//       });
//     } else {
//       document = await Document.create(documentData);
//     }

//     res.status(200).json({
//       message: document
//         ? "Document updated successfully."
//         : "Document created successfully.",
//       data: document,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.upsertDocument = async (req, res, next) => {
  try {
    const { comments } = req.body;

    // ---- helpers ----
    const parseMaybeJSON = (val, fallback) => {
      if (val == null) return fallback;
      if (typeof val !== "string") return val;
      try {
        return JSON.parse(val);
      } catch {
        return val; // it was just a string (like a URL)
      }
    };

    const toDateOrNull = (v) => (v ? new Date(v) : null);
    const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";

    // expiry_dates may come as JSON string from FormData
    let expiry_dates = {};
    try {
      expiry_dates = parseMaybeJSON(req.body.expiry_dates, {}) || {};
    } catch {
      return next(new AppError("Invalid expiry_dates format", 400));
    }

    const { tenant_id, selectedOrganization } = req.user;
    if (!tenant_id || !selectedOrganization) {
      return next(
        new AppError("Tenant ID and Organization ID are required.", 400),
      );
    }

    let document = await Document.findOne({
      tenant_id,
      organization_id: selectedOrganization,
    });

    const uploadResults = {};

    const singleFields = [
      "trade_license",
      "moa",
      "aoa",
      "emigration_card",
      "certificate_of_incorporation",
      "shareholder_agreement",
      "tenancy_contract_or_ejari",
      "vat_registration_certificate",
      "corporate_tax_certificate",
      "business_plan_document",
      "power_of_attorney",
      "insurance_policies",
      "employee_handbook_or_hr_policies",
      "intellectual_property_registrations",
      "trade_mark_certificate",
      "iso_certification",
      "bank_statement",
    ];

    // Handle single URL fields
    for (const field of singleFields) {
      const existingData =
        document?.section_1?.[field] || document?.section_2?.[field] || {};

      const bodyVal = req.body[field];

      if (bodyVal === "null") {
        // delete
        uploadResults[field] = { file: null, expiry_date: null };
        continue;
      }

      if (isNonEmptyString(bodyVal)) {
        // new/updated URL provided by frontend (from /upload)
        uploadResults[field] = {
          file: bodyVal, // ✅ plain string
          expiry_date: toDateOrNull(expiry_dates[field]),
        };
        continue;
      }

      // no URL change, but expiry date may be updated
      if (expiry_dates[field] !== undefined) {
        uploadResults[field] = {
          ...existingData,
          expiry_date: toDateOrNull(expiry_dates[field]),
        };
      }
    }

    const multipleFields = [
      "passport_copies",
      "visa_residence_permits",
      "company_policies",
      "contract_templates",
    ];

    // Handle arrays of URLs
    for (const field of multipleFields) {
      const existingDocs =
        document?.section_1?.[field] || document?.section_2?.[field] || [];

      // Could be JSON string (e.g., '["https://...","https://..."]') or an array already
      const urls = parseMaybeJSON(req.body[field], undefined);

      // Delete all if explicitly "null"
      if (req.body[field] === "null") {
        uploadResults[field] = [];
        continue;
      }

      if (Array.isArray(urls) && urls.length) {
        // build new list from URLs + expiry_dates[field][i]
        const expArr = parseMaybeJSON(expiry_dates[field], []);
        uploadResults[field] = urls.map((u, i) => ({
          file: isNonEmptyString(u) ? u : null, // ✅ plain string
          expiry_date: toDateOrNull(expArr?.[i]),
        }));
        continue;
      }

      // No new URLs provided, but may update expiry dates by index
      if (expiry_dates[field]) {
        const expArr = parseMaybeJSON(expiry_dates[field], []);
        uploadResults[field] = existingDocs.map((doc, i) => ({
          ...doc,
          expiry_date: toDateOrNull(expArr?.[i]),
        }));
      }
    }

    // Merge into section_1 / section_2 like your original
    const documentData = {
      tenant_id,
      organization_id: selectedOrganization,
      comments,
      section_1: {
        ...document?.section_1,
        ...pick(uploadResults, [...singleFields, ...multipleFields]),
      },
      section_2: {
        ...document?.section_2,
        ...pick(uploadResults, [...singleFields, ...multipleFields]),
      },
    };

    if (document) {
      document = await Document.findByIdAndUpdate(document._id, documentData, {
        new: true,
      });
    } else {
      document = await Document.create(documentData);
    }

    res.status(200).json({
      message: document
        ? "Document updated successfully."
        : "Document created successfully.",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// Optional: helper if not using lodash
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});
}

/**
 * Get document details by Tenant and Organization ID
 */
exports.getDocument = async (req, res, next) => {
  try {
    const { tenant_id, selectedOrganization } = req.user;

    if (!tenant_id || !selectedOrganization) {
      return next(
        new AppError("Tenant ID and Organization ID are required.", 400),
      );
    }

    const document = await Document.findOne({
      tenant_id,
      organization_id: selectedOrganization,
    });

    // if (!document) {
    //   return next(new AppError("Document not found.", 404));
    // }

    res.status(200).json({
      message: "Document retrieved successfully.",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles both creating and updating a document (Upsert)
 */
// exports.upsertDocument = async (req, res, next) => {

//   try {
//     const { comments } = req.body;

//     const { tenant_id, selectedOrganization } = req.user;

//     if (!tenant_id || !selectedOrganization) {
//       return next(
//         new AppError("Tenant ID and Organization ID are required.", 400),
//       );
//     }

//     // Check if a document already exists
//     let document = await Document.findOne({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });

//     // Object to store file upload results
//     const uploadResults = {};

//     // Upload single files
//     const singleFields = [
//       "trade_license",
//       "moa",
//       "aoa",
//       "emigration_card",
//       "certificate_of_incorporation",
//       "shareholder_agreement",
//       "tenancy_contract_or_ejari",
//       "vat_registration_certificate",
//       "corporate_tax_certificate",
//       "business_plan_document",
//       "power_of_attorney",
//       "insurance_policies",
//       "employee_handbook_or_hr_policies",
//       "intellectual_property_registrations",
//       "trade_mark_certificate",
//       "iso_certification",
//       "bank_statement",
//     ];

//     for (const field of singleFields) {
//       if (req.files[field]) {
//         uploadResults[field] = await uploadToCloudinary(
//           req.files[field][0],
//           `documents/${field}`,
//         );
//       }
//     }

//     // Upload multiple files
//     const multipleFields = [
//       "passport_copies",
//       "visa_residence_permits",
//       "company_policies",
//       "contract_templates",
//     ];

//     for (const field of multipleFields) {
//       if (req.files[field]) {
//         uploadResults[field] = await Promise.all(
//           req.files[field].map((file) =>
//             uploadToCloudinary(file, `documents/${field}`),
//           ),
//         );
//       }
//     }

//     // Prepare document data
//     const documentData = {
//       tenant_id,
//       organization_id: selectedOrganization,
//       comments,
//       section_1: {
//         ...document?.section_1,
//         ...uploadResults,
//       },
//       section_2: {
//         ...document?.section_2,
//         ...uploadResults,
//       },
//     };

//     // Update or create the document
//     if (document) {
//       document = await Document.findByIdAndUpdate(document._id, documentData, {
//         new: true,
//       });
//     } else {
//       document = await Document.create(documentData);
//     }

//     res.status(200).json({
//       message: document
//         ? "Document updated successfully."
//         : "Document created successfully.",
//       data: document,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
