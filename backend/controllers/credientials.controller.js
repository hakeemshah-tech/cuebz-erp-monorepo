const Credential = require("../models/credientials.schema");
const User = require("../models/User.schema");
// const organizationSchema = require("../models/Organization.schema");
const AppError = require("../utils/appError");
// const otpService = require("../services/otpService"); // OTP Service
const { generatePaginationMetadata } = require("../utils/usefulFunctions");
const OrganizationSchema = require("../models/Organization.schema");

// **🔐 Generate OTP for Credential Access**
exports.generateCredentialsOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // **Expires in 15 minutes**

    user.credentials_otp = otp;
    user.expiry_credentials_otp = expiry;
    user.credentials_session_active_until = null; // Reset session
    await user.save();

    // Send OTP via Email
    // await otpService.sendOTP(user.email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

// **🔐 Verify OTP & Start 15-minute Secure Session**
exports.verifyCredentialsOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!otp) {
      return next(new AppError("OTP is required for verification.", 400));
    }

    if (!user || !user.credentials_otp || !user.expiry_credentials_otp) {
      return next(new AppError("OTP not found or expired.", 400));
    }

    if (user.expiry_credentials_otp < new Date()) {
      return next(
        new AppError("OTP has expired. Please request a new one.", 400),
      );
    }

    if (user.credentials_otp !== otp) {
      return next(new AppError("Invalid OTP.", 400));
    }

    // ✅ Set Secure Session (Expires in 15 minutes)
    user.credentials_otp = null;
    user.expiry_credentials_otp = null;
    user.credentials_session_active_until = new Date(
      Date.now() + 15 * 60 * 1000,
    );
    await user.save();

    res.status(200).json({ message: "OTP Verified. Secure session started." });
  } catch (error) {
    next(error);
  }
};

// ✅ Create or Update Credentials (Upsert)
exports.upsertCredential = async (req, res, next) => {
  try {
    const { platform, accounts } = req.body;

    if (!platform || !accounts || !Array.isArray(accounts)) {
      return next(new AppError("Platform and accounts are required.", 400));
    }

    // ✅ Ensure OTP-verified session (15 min check)
    const user = await User.findById(req.user._id);
    if (
      !user.credentials_session_active_until ||
      user.credentials_session_active_until < new Date()
    ) {
      return next(
        new AppError("Session expired. Please verify OTP again.", 400),
      );
    }

    // ✅ Check if organization belongs to the current user's tenant
    const organization = await OrganizationSchema.findOne({
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

    let credential = await Credential.findOne({
      tenant_id: req.user.tenant_id._id,
      organization_id: req.user.selectedOrganization,
      platform,
    });

    if (credential) {
      // ✅ Update existing credentials without encrypting again
      credential.accounts = accounts;
      credential = await credential.save();
    } else {
      // ✅ Create new credentials without encrypting again
      credential = await Credential.create({
        tenant_id: req.user.tenant_id._id,
        organization_id: req.user.selectedOrganization,
        platform,
        accounts,
      });
    }

    res.status(200).json({
      message: credential
        ? "Credential updated successfully."
        : "Credential created successfully.",
      data: credential,
    });
  } catch (error) {
    next(error);
  }
};

// // ✅ Create or Update Credentials (Upsert)
// exports.upsertCredential = async (req, res, next) => {
//   try {
//     const { platform, accounts } = req.body;

//     if (!platform || !accounts || !Array.isArray(accounts)) {
//       return next(new AppError("Platform and accounts are required.", 400));
//     }

//     // ✅ Ensure OTP-verified session (15 min check)
//     const user = await User.findById(req.user._id);
//     if (
//       !user.credentials_session_active_until ||
//       user.credentials_session_active_until < new Date()
//     ) {
//       return next(
//         new AppError("Session expired. Please verify OTP again.", 400),
//       );
//     }

//     // ✅ Check if organization belongs to the current user's tenant
//     const organization = await OrganizationSchema.findOne({
//       _id: req.user.selectedOrganization,
//       tenant_id: req.user.tenant_id._id,
//     });

//     if (!organization) {
//       return next(
//         new AppError(
//           "The specified organization does not belong to the current tenant.",
//           400,
//         ),
//       );
//     }

//     // ✅ Encrypt passwords before saving
//     const encryptedAccounts = accounts.map((account) => ({
//       ...account,
//       password: encrypt(account.password), // AES-256 encryption
//     }));

//     let credential = await Credential.findOne({
//       tenant_id: req.user.tenant_id._id,
//       organization_id: req.user.selectedOrganization,
//       platform,
//     });

//     if (credential) {
//       // ✅ Update existing credentials
//       credential.accounts = encryptedAccounts;
//       credential = await credential.save();
//     } else {
//       // ✅ Create new credentials
//       credential = await Credential.create({
//         tenant_id: req.user.tenant_id._id,
//         organization_id: req.user.selectedOrganization,
//         platform,
//         accounts: encryptedAccounts,
//       });
//     }

//     res.status(200).json({
//       message: credential
//         ? "Credential updated successfully."
//         : "Credential created successfully.",
//       data: credential,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// **🔐 Get Credentials (Validates 15-minute Secure Session)**
exports.getCredentials = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Ensure active session
    if (
      !user.credentials_session_active_until ||
      user.credentials_session_active_until < new Date()
    ) {
      return next(
        new AppError("Session expired. Please request a new OTP.", 403),
      );
    }

    const { search, platform } = req.query;
    const { page, limit, skip } = req.pagination;

    const filters = {
      tenant_id: req.user.tenant_id,
      organization_id: req.user.selectedOrganization,
    };

    if (search) {
      filters.$or = [{ platform: { $regex: search, $options: "i" } }];
    }

    if (platform) filters.platform = platform;

    const credentials = await Credential.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("organization_id", "name")
      .exec();

    const totalCount = await Credential.countDocuments(filters);

    // ✅ Decrypt passwords safely
    const decryptedData = credentials.map((credential) => {
      try {
        return {
          ...credential._doc,
          accounts: credential.getDecryptedAccounts(),
        };
      } catch (error) {
        console.error("Decryption failed for:", error);
        return {
          ...credential._doc,
          accounts: [],
        };
      }
    });

    res.status(200).json({
      message: "Credentials retrieved successfully.",
      data: decryptedData,
      pagination: generatePaginationMetadata(totalCount, page, limit),
    });
  } catch (error) {
    console.error("Error in getCredentials:", error.message);
    next(error);
  }
};

// **🔐 Check Session Status (Frontend Polling)**
exports.checkSessionStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (
      !user.credentials_session_active_until ||
      user.credentials_session_active_until < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Session expired. Request a new OTP." });
    }

    res.status(200).json({ message: "Session active." });
  } catch (error) {
    next(error);
  }
};

// **🔐 Delete Credential by Platform**
exports.deleteCredential = async (req, res, next) => {
  try {
    const { platform } = req.params;

    const deletedCredential = await Credential.findOneAndDelete({
      tenant_id: req.user.tenant_id,
      organization_id: req.user.selectedOrganization,
      platform,
    });

    if (!deletedCredential) {
      return res.status(404).json({ message: "Credential not found." });
    }

    res.status(200).json({
      message: "Credential deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
