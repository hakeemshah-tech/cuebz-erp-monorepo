// const User = require("../models/User.schema");
// const Organization = require("../models/organization.schema");
// const AppError = require("../utils/appError");
// const sendEmail = require("../utils/sendEmail"); // Assuming you have an email utility function
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");

// // Assign Role and Modules
// exports.assignRole = async (req, res, next) => {
//   try {
//     const { email, name, accessible_modules } = req.body;
//     let role = "tenant-user";

//     // Check if the organization belongs to the current user's tenant
//     const organization = await Organization.findOne({
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

//     // Generate an OTP and expiration for user verification
//     const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
//     const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

//     // Check if the user already exists
//     let user = await User.findOne({ email });

//     if (user) {
//       // If user exists, update their role and modules
//       user.role = role;
//       user.name = name;
//       user.accessible_modules = accessible_modules;
//       user.tenant_id = req.user.tenant_id._id;
//       user.organization_id = req.user.selectedOrganization;
//       user.otp = otp;
//       user.otpExpiresAt = otpExpiresAt;
//       await user.save();
//     } else {
//       // If user does not exist, create a new user record
//       user = await User.create({
//         email,
//         role,
//         accessible_modules,
//         tenant_id: req.user.tenant_id._id,
//         organization_id: req.user.selectedOrganization,
//         otp,
//         name,
//         otpExpiresAt,
//         isVerified: false,
//       });
//     }

//     // Send email with the OTP link to the user
//     const verifyUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&otp=${otp}`;
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Invitation to Access Application",
//       html: `
//         <p>Hi,</p>
//         <p>You have been invited to access the application. Please click the link below to set your password:</p>
//         <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
//         <p>This link will expire in 15 minutes.</p>
//       `,
//     };

//     await sendEmail(mailOptions);

//     res.status(200).json({
//       message: "Role assigned successfully. Invitation email sent.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Verify OTP and Set Password
// exports.verifyOtpAndSetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return next(new AppError("Invalid email or OTP.", 400));
//     }

//     // Check if OTP is valid
//     if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
//       return next(new AppError("Invalid or expired OTP.", 400));
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Update the user's password and mark them as verified
//     user.password = hashedPassword;
//     user.isVerified = true;
//     user.otp = undefined; // Clear the OTP
//     user.otpExpiresAt = undefined; // Clear the expiration time
//     await user.save();

//     res.status(200).json({
//       message: "Password set successfully. You can now log in.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get All Users with Filtering
// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const { search, role, status } = req.query;

//     const filters = {};

//     // Add filters
//     if (search) {
//       filters.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (role) {
//       filters.role = role;
//     }

//     if (status) {
//       filters.status = status;
//     }

//     // Fetch users
//     const users = await User.find(filters).sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Users retrieved successfully.",
//       data: users,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update Role and Modules for Existing Users
// exports.updateUserRoleAndModules = async (req, res, next) => {
//   try {
//     const { userId, accessible_modules } = req.body;

//     let role = "tenant-user";

//     // Update the user
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { role, accessible_modules },
//       { new: true },
//     );

//     if (!user) {
//       return next(new AppError("User not found.", 404));
//     }

//     res.status(200).json({
//       message: "User role and modules updated successfully.",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const User = require("../models/User.schema");
const Organization = require("../models/Organization.schema");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Assign Role and Modules
exports.assignRole = async (req, res, next) => {
  try {
    const { email, name, accessible_modules, employee_id } = req.body;
    console.log(employee_id, "heyy");
    let role = "tenant-user";

    // Check if the organization belongs to the current user's tenant
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

    const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // OTP valid for 1 day

    let user = await User.findOne({ email });

    if (user) {
      user.role = role;
      user.employee_id = employee_id;
      user.name = name;
      user.accessible_modules = accessible_modules;
      user.tenant_id = req.user.tenant_id._id;
      user.selectedOrganization = req.user.selectedOrganization;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      user = await User.create({
        email,
        role,
        employee_id,
        accessible_modules,
        tenant_id: req.user.tenant_id._id,
        selectedOrganization: req.user.selectedOrganization,
        otp,
        name,
        otpExpiresAt,
        isVerified: false,
      });
    }

    const verifyUrl = `${process.env.NODE_ENV === "development" ? process.env.FRONTEND_WEB_URL : process.env.FRONTEND_WEB_URL_LIVE}/set-password?email=${email}&otp=${otp}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Invitation to Access Application",
      html: `
        <p>Hi,</p>
        <p>You have been invited to access the application. Please click the link below to set your password:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
        <p>This link will expire in 24 hours</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message: "Role assigned successfully. Invitation email sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP and Set Password
exports.verifyOtpAndSetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Invalid email or OTP.", 400));
    }

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return next(
        new AppError("Verification Link is Expired! Please Resent Again!", 400),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      message: "Password set successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// Resend OTP Verification Link
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User with this email does not exist.", 404));
    }

    // Generate a new OTP and expiration time
    const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // OTP valid for 1 day

    // Update user with the new OTP and expiration time
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send email with the OTP link
    const verifyUrl = `${process.env.NODE_ENV === "development" ? process.env.FRONTEND_WEB_URL : process.env.FRONTEND_WEB_URL_LIVE}/set-password?email=${email}&otp=${otp}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Resend: Set Your Password",
      html: `
        <p>Hi,</p>
        <p>You requested to set your password. Please use the link below to set it:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message: "OTP has been resent successfully. Please check your email.",
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users with Filtering
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;

    const filters = { tenant_id: req.user.tenant_id, role: "tenant-user" };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filters.role = role;
    }

    if (status) {
      filters.status = status;
    }

    const users = await User.find(filters)
      .populate("tenant_id", "company_name")
      .populate("organization_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get User by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      tenant_id: req.user.tenant_id._id,
    }).populate("tenant_id organization_id");

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Role and Modules for Existing Users
exports.updateUserRoleAndModules = async (req, res, next) => {
  try {
    const { userId, name, accessible_modules } = req.body;

    let role = "tenant-user";

    const user = await User.findOneAndUpdate(
      { _id: userId, tenant_id: req.user.tenant_id },
      { role, accessible_modules, name },
      { new: true },
    );

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      message: "User role and modules updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({
      _id: id,
      tenant_id: req.user.tenant_id,
    });

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
