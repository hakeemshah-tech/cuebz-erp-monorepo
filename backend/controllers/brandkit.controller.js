const BrandKit = require("../models/brandkit.schema");
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

/**
 * Create or Update Brand Kit (Upsert)
 */
// exports.upsertBrandKit = async (req, res, next) => {
//   try {
//     const {
//       name,
//       color_palette,
//       typography,
//       brand_voice_and_tone,
//       brand_story,
//       brand_mission,
//       brand_vision,
//       brand_values,
//     } = req.body;
//     const { tenant_id, selectedOrganization } = req.user;

//     if (!tenant_id || !selectedOrganization) {
//       return next(
//         new AppError("Tenant ID and Organization ID are required.", 400),
//       );
//     }

//     // Check if a brand kit already exists
//     let brandKit = await BrandKit.findOne({
//       tenant_id,
//       organization_id: selectedOrganization,
//     });

//     // Object to store file upload results
//     const uploadResults = {};

//     // Upload single files
//     const singleFields = [
//       "logo",
//       "brand_guidelines",
//       "business_card_files",
//       "letterhead_file",
//       "company_profile",
//       "video_guidelines",
//     ];

//     for (const field of singleFields) {
//       if (req.files[field]) {
//         uploadResults[field] = await uploadToCloudinary(
//           req.files[field][0],
//           `brandkit/${field}`,
//         );
//       }
//     }

//     // Upload multiple imagery files
//     if (req.files.imagery) {
//       uploadResults.imagery = await Promise.all(
//         req.files.imagery.map((file) =>
//           uploadToCloudinary(file, "brandkit/imagery"),
//         ),
//       );
//     }

//     // Upload multiple presentation templates
//     if (req.files.presentation_templates) {
//       uploadResults.presentation_templates = await Promise.all(
//         req.files.presentation_templates.map((file) =>
//           uploadToCloudinary(file, "brandkit/presentation_templates"),
//         ),
//       );
//     }

//     // Prepare brand kit data
//     const brandKitData = {
//       name,
//       tenant_id,
//       organization_id: selectedOrganization,
//       color_palette: JSON.parse(color_palette || "[]"),
//       typography: JSON.parse(typography || "[]"),
//       brand_voice_and_tone,
//       brand_story,
//       brand_mission,
//       brand_vision,
//       brand_values,
//       ...uploadResults,
//     };

//     // Update or create the brand kit
//     if (brandKit) {
//       brandKit = await BrandKit.findByIdAndUpdate(brandKit._id, brandKitData, {
//         new: true,
//       });
//     } else {
//       brandKit = await BrandKit.create(brandKitData);
//     }

//     res.status(200).json({
//       message: brandKit
//         ? "Brand Kit updated successfully."
//         : "Brand Kit created successfully.",
//       data: brandKit,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.upsertBrandKit = async (req, res, next) => {
  try {
    const {
      name,
      color_palette,
      typography,
      brand_voice_and_tone,
      brand_story,
      brand_mission,
      brand_vision,
      brand_values,
    } = req.body;

    const { tenant_id, selectedOrganization } = req.user;
    if (!tenant_id || !selectedOrganization) {
      return next(
        new AppError("Tenant ID and Organization ID are required.", 400),
      );
    }

    // --- helpers ---
    const parseMaybeJSON = (val, fallback) => {
      if (val == null) return fallback;
      if (typeof val !== "string") return val;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    };
    const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";

    // Load existing brand kit (so we can keep values when not provided)
    let brandKit = await BrandKit.findOne({
      tenant_id,
      organization_id: selectedOrganization,
    });

    // Build updates only for fields explicitly provided
    const updates = {};

    // Simple scalar fields
    if (typeof name !== "undefined") updates.name = name;
    if (typeof brand_voice_and_tone !== "undefined")
      updates.brand_voice_and_tone = brand_voice_and_tone;
    if (typeof brand_story !== "undefined") updates.brand_story = brand_story;
    if (typeof brand_mission !== "undefined")
      updates.brand_mission = brand_mission;
    if (typeof brand_vision !== "undefined")
      updates.brand_vision = brand_vision;
    if (typeof brand_values !== "undefined")
      updates.brand_values = brand_values;

    // Arrays (can arrive as JSON string)
    const palette = parseMaybeJSON(color_palette, undefined);
    if (typeof palette !== "undefined")
      updates.color_palette = Array.isArray(palette) ? palette : [];

    const typo = parseMaybeJSON(typography, undefined);
    if (typeof typo !== "undefined")
      updates.typography = Array.isArray(typo) ? typo : [];

    // SINGLE file URL fields (strings)
    const singleFields = [
      "logo",
      "brand_guidelines",
      "business_card_files",
      "letterhead_file",
      "company_profile",
      "video_guidelines",
    ];

    for (const field of singleFields) {
      if (field in req.body) {
        const v = req.body[field];
        if (v === "null") {
          updates[field] = null; // delete
        } else if (isNonEmptyString(v)) {
          updates[field] = v; // new URL string
        } // else ignore to keep existing
      }
    }

    // MULTI file URL fields (arrays of strings)
    const multiFields = ["imagery", "presentation_templates"];

    for (const field of multiFields) {
      if (field in req.body) {
        if (req.body[field] === "null") {
          updates[field] = []; // delete all
        } else {
          const urls = parseMaybeJSON(req.body[field], undefined);
          if (Array.isArray(urls)) {
            updates[field] = urls.filter(isNonEmptyString); // keep only non-empty strings
          }
        }
      }
    }

    const brandKitData = {
      tenant_id,
      organization_id: selectedOrganization,
      ...(brandKit ? {} : { createdAt: new Date() }), // optional
      ...updates,
    };

    if (brandKit) {
      brandKit = await BrandKit.findByIdAndUpdate(brandKit._id, brandKitData, {
        new: true,
      });
    } else {
      brandKit = await BrandKit.create(brandKitData);
    }

    res.status(200).json({
      message: brandKit
        ? "Brand Kit updated successfully."
        : "Brand Kit created successfully.",
      data: brandKit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Brand Kit by Tenant and Organization ID
 */
exports.getBrandKit = async (req, res, next) => {
  try {
    const { tenant_id, selectedOrganization } = req.user;

    if (!tenant_id || !selectedOrganization) {
      return next(
        new AppError("Tenant ID and Organization ID are required.", 400),
      );
    }

    const brandKit = await BrandKit.findOne({
      tenant_id,
      organization_id: selectedOrganization,
    });

    res.status(200).json({
      message: "Brand Kit retrieved successfully.",
      data: brandKit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Brand Kit
 */
exports.deleteBrandKit = async (req, res, next) => {
  try {
    const { tenant_id, selectedOrganization } = req.user;

    if (!tenant_id || !selectedOrganization) {
      return next(
        new AppError("Tenant ID and Organization ID are required.", 400),
      );
    }

    const deletedBrandKit = await BrandKit.findOneAndDelete({
      tenant_id,
      organization_id: selectedOrganization,
    });

    if (!deletedBrandKit) {
      return next(new AppError("Brand Kit not found.", 404));
    }

    res.status(200).json({
      message: "Brand Kit deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
