const { passport } = require("passport");
const User = require("../models/User.schema");
const bcrypt = require("bcrypt");
const TenantSchema = require("../models/Tenant.schema");
const stripe = require("../config/stripe");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const organizationSchema = require("../models/Organization.schema");
const {
  verifyRefreshToken,
  signAccessToken,
  revokeRefreshToken,
} = require("../utils/jwt");

const {
  OTP_TTL_MINUTES,
  RESET_TOKEN_TTL_MINUTES,
  MAX_OTP_ATTEMPTS,
  generateOtp,
  generateOpaqueToken,
  addMinutes,
  hashValue,
  compareHash,
} = require("../utils/passwordReset");

// Login logic
const login = (req, res, next) => {
  passport.authenticate("email-password", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentials." });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log in user." });
      }
      res.status(200).json({ message: "Login successful.", user });
    });
  })(req, res, next);
};

// Approve tenant side => superadmin
const approveTenant = async (req, res, next) => {
  const { tenantId } = req.params;

  try {
    const tenant =
      await TenantSchema.findById(tenantId).populate("tenant_owner");

    if (!tenant) {
      return next(new AppError("Tenant not found.", 404));
    }

    if (tenant.subscription_status !== "PendingApproval") {
      return next(new AppError("Tenant is not pending approval.", 400));
    }

    const subscription_start_date = new Date();
    const subscription_end_date = new Date(subscription_start_date);
    subscription_end_date.setDate(subscription_start_date.getDate() + 20);

    tenant.subscription_status = "Trialing";
    tenant.subscription_start_date = subscription_start_date;
    tenant.subscription_end_date = subscription_end_date;

    await tenant.save();

    // Send "approval" email
    const mailOptions = {
      from: process.env.EMAIL,
      to: tenant.tenant_owner.email,
      subject: "Your Account Has Been Approved",
      html: `
        <p>Hi ${tenant.tenant_owner.name},</p>
        <p>Your account has been approved and activated. You can now log in using your credentials.</p>
        <p>Enjoy your 20-day trial period!</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message: "Tenant approved and activated successfully.",
      tenant,
    });
  } catch (error) {
    next(error);
  }
};

const registerTenant = async (req, res, next) => {
  const {
    name,
    email,
    password,
    company_name,
    employees_count,
    business_category,
  } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email is already registered.", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    // Create the tenant-owner account
    const tenantOwner = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "tenant-owner",
      tenant_id: null,
      isVerified: false,
      otp,
      otpExpiresAt,
    });

    // Create Stripe Customer for the tenant-owner
    const stripeCustomer = await stripe.customers.create({
      email: tenantOwner.email,
      name: tenantOwner.name,
      metadata: {
        tenant_owner_id: tenantOwner._id.toString(),
        company_name,
      },
    });

    // Create the tenant without trial dates
    const tenant = await TenantSchema.create({
      company_name,
      tenant_owner: tenantOwner._id,
      subscription_status: "PendingApproval",
      stripeCustomerId: stripeCustomer.id,
    });

    // Update tenant_id in tenantOwner
    tenantOwner.tenant_id = tenant._id;
    await tenantOwner.save();

    // Create the organization
    const organization = await organizationSchema.create({
      name: company_name,
      employees_count,
      business_category,
      tenant_id: tenant._id,
    });

    tenantOwner.selectedOrganization = organization._id;
    await tenantOwner.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL,
      to: tenantOwner.email,
      subject: "Verify Your Email with OTP",
      html: `
        <p>Hi ${tenantOwner.name},</p>
        <p>Thank you for registering. Please verify your email by using the OTP below:</p>
        <h3>${otp}</h3>
        <p>This OTP will expire in 15 minutes.</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(201).json({
      message:
        "Tenant-owner and organization registered successfully. Please verify your email using the OTP sent.",
      tenant,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

const verifyTenantOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    if (user.isVerified) {
      return next(new AppError("Email is already verified.", 400));
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return next(new AppError("Invalid or expired OTP.", 400));
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Send "pending approval" email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Account Pending Approval",
      html: `
        <p>Hi ${user.name},</p>
        <p>Your email has been verified successfully.</p>
        <p><strong>Your account is now pending approval by our team.</strong></p>
        <p>You will receive another email once your account has been approved and activated.</p>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message:
        "Email verified successfully. Your account is now pending approval. You will receive an email when your account has been activated.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current user's details
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // Ensure the request has an authenticated user
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    // Fetch the user by their ID
    const user = await User.findById(req.user._id)
      .populate("tenant_id")
      .populate("selectedOrganization")
      .select("-password"); // Exclude the password field

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email, role: "tenant-owner" });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP

    // Save the OTP and its expiration in the database
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify Your Email with OTP",
      html: `
            <p>Hi ${user.name},</p>
            <p>Thank you for registering. Please verify your email by using the OTP below:</p>
            <h3>${otp}</h3>
            <p>This OTP will expire in 15 minutes.</p>
          `,
    };

    await sendEmail(mailOptions);

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = await verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ _id: decoded.userId });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await revokeRefreshToken(userId);
    res.json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ error: "Logout failed" });
  }
};

// Step 1: Request reset → send OTP (email not disclosed if exists or not)
const forgotPasswordRequest = async (req, res, next) => {
  const { email } = req.body;

  // Always respond 200 to prevent user enumeration
  try {
    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetFlowId",
    );
    if (!user) {
      // still send 200
      return res.status(200).json({
        message: "If this email exists, we've sent an OTP with instructions.",
      });
    }

    // Throttle attempts a bit (optional: track per hour/day)
    if (
      user.resetOtpAttempts >= MAX_OTP_ATTEMPTS &&
      user.resetOtpExpiresAt &&
      user.resetOtpExpiresAt > new Date()
    ) {
      return res.status(429).json({
        message: "Too many attempts. Please try again later.",
      });
    }

    const otp = generateOtp();
    const otpHash = await hashValue(otp);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiresAt = addMinutes(new Date(), OTP_TTL_MINUTES);
    user.resetOtpAttempts = 0; // reset attempts on new issue
    user.resetFlowId = generateOpaqueToken(16); // correlate OTP flow
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save();

    // Send email with OTP (do NOT include user existence hints)
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <p>Hi ${user.name || ""},</p>
        <p>Use this OTP to reset your password:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in ${OTP_TTL_MINUTES} minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    };
    await sendEmail(mailOptions);

    return res.status(200).json({
      message: "If this email exists, we've sent an OTP with instructions.",
      // Return a flow identifier the client must include (doesn't reveal existence)
      flowId: user.resetFlowId,
    });
  } catch (err) {
    next(err);
  }
};

// Step 2: Verify OTP → issue single-use reset token
const verifyPasswordResetOtp = async (req, res, next) => {
  const { email, otp, flowId } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetFlowId +resetTokenHash +resetTokenExpiresAt",
    );
    // Generic response to avoid enumeration
    if (!user || !user.resetFlowId || user.resetFlowId !== flowId) {
      return res.status(400).json({ error: "Invalid OTP or expired." });
    }

    // Expired?
    if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid OTP or expired." });
    }

    // Attempts limit
    if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
      return res
        .status(429)
        .json({ error: "Too many attempts. Try again later." });
    }

    const ok = await compareHash(otp, user.resetOtpHash);
    user.resetOtpAttempts += 1;

    if (!ok) {
      await user.save();
      return res.status(400).json({ error: "Invalid OTP or expired." });
    }

    // Success: mint one-time reset token
    const resetTokenPlain = generateOpaqueToken(32);
    const resetTokenHash = await hashValue(resetTokenPlain);

    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpiresAt = addMinutes(new Date(), RESET_TOKEN_TTL_MINUTES);

    // Invalidate the OTP immediately (single use)
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;

    await user.save();

    return res.status(200).json({
      message: "OTP verified. Use the reset token to set a new password.",
      resetToken: resetTokenPlain, // return token via HTTPS only
      // alternatively, you could send a clickable link by email instead of returning token in API
    });
  } catch (err) {
    next(err);
  }
};

// Optional: resend OTP (respects rate limit)
const resendPasswordResetOtp = async (req, res, next) => {
  const { email, flowId } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetFlowId",
    );
    if (!user || !user.resetFlowId || user.resetFlowId !== flowId) {
      // generic response
      return res
        .status(200)
        .json({ message: "If this email exists, an OTP has been re-sent." });
    }

    const otp = generateOtp();
    user.resetOtpHash = await hashValue(otp);
    user.resetOtpExpiresAt = addMinutes(new Date(), OTP_TTL_MINUTES);
    user.resetOtpAttempts = 0;

    await user.save();

    await sendEmail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your Password Reset OTP",
      html: `
        <p>Hi ${user.name || ""},</p>
        <p>Here is your new OTP:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in ${OTP_TTL_MINUTES} minutes.</p>
      `,
    });

    return res
      .status(200)
      .json({ message: "If this email exists, an OTP has been re-sent." });
  } catch (err) {
    next(err);
  }
};

// Step 3: Reset password using the one-time reset token
const resetPasswordWithToken = async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+resetTokenHash +resetTokenExpiresAt",
    );
    if (!user || !user.resetTokenHash || !user.resetTokenExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    if (user.resetTokenExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const ok = await compareHash(resetToken, user.resetTokenHash);
    if (!ok) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    // All good → set new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Invalidate token & flow
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;
    user.resetFlowId = undefined;

    await user.save();

    // Revoke active refresh tokens / sessions
    await revokeRefreshToken(user._id);

    // (Optional) email notification
    // try {
    //   await sendEmail({
    //     from: process.env.EMAIL,
    //     to: user.email,
    //     subject: "Your password was changed",
    //     html: `<p>Hi ${user.name || ""},</p><p>Your password was just changed. If this wasn't you, contact support immediately.</p>`,
    //   });
    // } catch (_) {}

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
  registerTenant,
  verifyTenantOtp,
  getCurrentUser,
  approveTenant,
  refreshToken,
  forgotPasswordRequest,
  verifyPasswordResetOtp,
  resendPasswordResetOtp,
  resetPasswordWithToken,
};

// const register = async (req, res, next) => {
//   const { name, email, password, company_name } = req.body;

//   try {
//     // Check if a tenant-owner already exists
//     const existingTenantOwner = await User.findOne({ role: "tenant-owner" });
//     if (existingTenantOwner) {
//       return res
//         .status(403)
//         .json({ error: "A tenant-owner account already exists." });
//     }

//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email is already registered." });
//     }

//     // Check if the company name is unique
//     const existingTenant = await TenantSchema.findOne({ company_name });
//     if (existingTenant) {
//       return res.status(400).json({ error: "Company name already exists." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the tenant-owner account
//     const tenantOwner = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "tenant-owner", // Hardcoded as tenant-owner
//       tenant_id: null, // Will be updated after tenant creation
//     });

//     // Calculate trial start and end dates
//     const subscription_start_date = new Date();
//     const subscription_end_date = new Date(subscription_start_date);
//     subscription_end_date.setDate(subscription_start_date.getDate() + 20); // Add 20 days for free trial

//     // Create a Stripe Customer for the tenant-owner
//     const stripeCustomer = await stripe.customers.create({
//       email: tenantOwner.email,
//       name: tenantOwner.name,
//       metadata: {
//         tenant_owner_id: tenantOwner._id, // Metadata to easily associate with tenant owner
//         company_name,
//       },
//     });

//     // Create the tenant
//     const tenant = await TenantSchema.create({
//       company_name,
//       tenant_owner: tenantOwner._id,
//       subscription_start_date,
//       subscription_end_date,
//       subscription_status: "Trialing", // Default to Trialing
//       stripeCustomerId: stripeCustomer.id, // Save Stripe customer ID
//     });

//     // Update the tenant-owner with the tenant ID
//     tenantOwner.tenant_id = tenant._id;
//     await tenantOwner.save();

//     // Log the user in and set the session cookie
//     req.logIn(tenantOwner, (err) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ error: "Failed to log in tenant-owner." });
//       }

//       res.status(201).json({
//         message:
//           "Tenant-owner and tenant registered successfully with a 20-day free trial.",
//         user: tenantOwner,
//         tenant,
//       });
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to register tenant-owner and tenant." });
//   }
// };

// // Register Tenant in Tenant Collection
// const registerTenant = async (req, res) => {
//   const { tenantOwnerId, company_name } = req.body;

//   try {
//     // Check if the tenant-owner exists
//     const tenantOwner = await UserSchema.findById(tenantOwnerId);
//     if (!tenantOwner || tenantOwner.role !== "tenant-owner") {
//       return res.status(404).json({ error: "Invalid tenant-owner." });
//     }

//     // Ensure the company name is unique
//     const existingTenant = await TenantSchema.findOne({ company_name });
//     if (existingTenant) {
//       return res.status(400).json({ error: "Company name already exists." });
//     }

//     // Calculate trial start and end dates
//     const subscription_start_date = new Date();
//     const subscription_end_date = new Date(subscription_start_date);
//     subscription_end_date.setDate(subscription_start_date.getDate() + 20); // Add 20 days for free trial

//     // Create a Stripe Customer for the tenant-owner
//     const stripeCustomer = await stripe.customers.create({
//       email: tenantOwner.email,
//       name: tenantOwner.name,
//       metadata: {
//         tenant_owner_id: tenantOwnerId, // Metadata to easily associate with tenant owner
//         company_name,
//       },
//     });

//     // Create the tenant
//     const tenant = await TenantSchema.create({
//       company_name,
//       tenant_owner: tenantOwnerId,
//       subscription_start_date,
//       subscription_end_date,
//       subscription_status: "Trialing", // Default to Trialing
//       stripeCustomerId: stripeCustomer.id, // Save Stripe customer ID
//     });

//     // Update the tenant-owner with the tenant ID
//     tenantOwner.tenant_id = tenant._id;
//     await tenantOwner.save();

//     res.status(201).json({
//       message: "Tenant registered successfully with a 20-day free trial.",
//       tenant,
//     });
//   } catch (error) {
//     console.error("Error registering tenant:", error);
//     res.status(500).json({ error: "Failed to register tenant." });
//   }
// };

// const verifyTenantEmail = async (req, res, next) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return next(new AppError("Invalid or expired token.", 400));
//     }

//     if (user.isVerified) {
//       return next(new AppError("Email is already verified.", 400));
//     }

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully." });
//   } catch (error) {
//     next(error);
//     // res.status(400).json({ error: "Invalid or expired token." });
//   }
// };

// Logout logic
// const logout = (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to log out user." });
//     }
//     res.status(200).json({ message: "Logout successful." });
//   });
// };

// Register Tenant User in User Collection
// const registerTenant = async (req, res, next) => {
//   const {
//     name,
//     email,
//     password,
//     company_name,
//     employees_count,
//     business_category,
//   } = req.body;

//   try {
//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return next(new AppError("Email is already registered.", 400));
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
//     const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

//     // Create the tenant-owner account
//     const tenantOwner = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "tenant-owner",
//       tenant_id: null,
//       isVerified: false,
//       otp,
//       otpExpiresAt,
//     });

//     // Create Stripe Customer for the tenant-owner
//     const stripeCustomer = await stripe.customers.create({
//       email: tenantOwner.email,
//       name: tenantOwner.name,
//       metadata: {
//         tenant_owner_id: tenantOwner._id.toString(),
//         company_name,
//       },
//     });

//     // Create the tenant
//     const subscription_start_date = new Date();
//     const subscription_end_date = new Date(subscription_start_date);
//     subscription_end_date.setDate(subscription_start_date.getDate() + 20);

//     const tenant = await TenantSchema.create({
//       company_name,
//       tenant_owner: tenantOwner._id,
//       subscription_start_date,
//       subscription_end_date,
//       subscription_status: "Trialing",
//       stripeCustomerId: stripeCustomer.id,
//     });

//     // Update the tenant-owner with the tenant ID
//     tenantOwner.tenant_id = tenant._id;
//     await tenantOwner.save();

//     // Create the organization
//     const organization = await organizationSchema.create({
//       name: company_name,
//       employees_count,
//       business_category,
//       tenant_id: tenant._id,
//     });

//     tenantOwner.selectedOrganization = organization._id;

//     await tenantOwner.save();

//     // Send OTP email
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: tenantOwner.email,
//       subject: "Verify Your Email with OTP",
//       html: `
//             <p>Hi ${tenantOwner.name},</p>
//             <p>Thank you for registering. Please verify your email by using the OTP below:</p>
//             <h3>${otp}</h3>
//             <p>This OTP will expire in 15 minutes.</p>
//           `,
//     };

//     await sendEmail(mailOptions);

//     res.status(201).json({
//       message:
//         "Tenant-owner and organization registered successfully. Please verify your email using the OTP sent.",
//       tenant,
//       organization,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const registerTenant = async (req, res, next) => {
//   const {
//     name,
//     email,
//     password,
//     company_name,
//     employees_count,
//     business_category,
//   } = req.body;

//   try {
//     // Check if email exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return next(new AppError("Email is already registered.", 400));
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create tenant-owner user
//     const tenantOwner = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "tenant-owner",
//       tenant_id: null,
//       isVerified: false,
//     });

//     // Create Stripe Customer
//     const stripeCustomer = await stripe.customers.create({
//       email: tenantOwner.email,
//       name: tenantOwner.name,
//       metadata: {
//         tenant_owner_id: tenantOwner._id.toString(),
//         company_name,
//       },
//     });

//     // Create tenant
//     const tenant = await TenantSchema.create({
//       company_name,
//       tenant_owner: tenantOwner._id,
//       subscription_status: "PendingApproval",
//       stripeCustomerId: stripeCustomer.id,
//     });

//     // Update tenant_owner
//     tenantOwner.tenant_id = tenant._id;
//     await tenantOwner.save();

//     // Create organization
//     const organization = await organizationSchema.create({
//       name: company_name,
//       employees_count,
//       business_category,
//       tenant_id: tenant._id,
//     });

//     tenantOwner.selectedOrganization = organization._id;
//     await tenantOwner.save();

//     // Send "awaiting approval" email
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: tenantOwner.email,
//       subject: "Thank you for registering",
//       html: `
//         <p>Hi ${tenantOwner.name},</p>
//         <p>Thank you for registering your company: <strong>${company_name}</strong>.</p>
//         <p>Your account is pending approval. You will receive another email when your account has been approved and activated.</p>
//       `,
//     };

//     await sendEmail(mailOptions);

//     res.status(201).json({
//       message:
//         "Tenant-owner and organization registered successfully. Awaiting approval.",
//       tenant,
//       organization,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const verifyTenantOtp = async (req, res, next) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return next(new AppError("User not found.", 404));
//     }

//     // if (user.isVerified) {
//     //   return next(new AppError("Email is already verified.", 400));
//     // }

//     if (user.otp !== otp || user.otpExpiresAt < new Date()) {
//       return next(new AppError("Invalid or expired OTP.", 400));
//     }

//     // Mark user as verified
//     user.isVerified = true;
//     user.otp = undefined; // Clear OTP
//     user.otpExpiresAt = undefined;
//     await user.save();

//     // Log the user into the session
//     req.logIn(user, (err) => {
//       if (err) {
//         return next(new AppError("Failed to log in user.", 500));
//       }

//       res.status(200).json({
//         message: "Email verified successfully. You are now logged in.",
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };
