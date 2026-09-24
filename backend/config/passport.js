// config/passport.js
const path = require('path');
const env = process.env.NODE_ENV || "development";
const { config } = require("dotenv");
config({ path: path.resolve(process.cwd(), `./env/.env.${env}`) });

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User.schema");
const TenantSchema = require("../models/Tenant.schema");
const sendEmail = require("../utils/sendEmail");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

// Define Passport LocalStrategy
passport.use(
  "email-password",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        if (user.status !== "Active") {
          return done(null, false, { message: "User account is not active." });
        }

        if (user.tenant_id) {
          const tenant = await TenantSchema.findById(user.tenant_id);
          if (tenant) {
            if (tenant.subscription_status === "PendingApproval") {
              return done(null, false, {
                message:
                  "Your account is pending approval. Please wait for activation.",
              });
            }
            if (tenant.subscription_status === "Expired") {
              return done(null, false, {
                message:
                  "Your subscription has expired. Please contact support to renew.",
              });
            }
            if (tenant.subscription_status === "Payment Failed") {
              return done(null, false, {
                message:
                  "Subscription payment failed. Please update payment information.",
              });
            }
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Role-based login handler
const loginWithRole = (requiredRole) => {
  return (req, res, next) => {
    passport.authenticate("email-password", async (err, user, info) => {
      if (err) return res.status(500).json({ error: "Internal server error." });
      if (!user)
        return res
      .status(400)
      .json({ error: info?.message || "Invalid credentials." });
      
      if (!user.isVerified) {
        try {
          const otp = crypto.randomInt(100000, 999999).toString();
          const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
          
          user.otp = otp;
          user.otpExpiresAt = otpExpiresAt;
          await user.save();
          console.log("otp : ", otp);
          
          await sendEmail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Verify Your Email with OTP",
            html: `
            <p>Hi ${user.name},</p>
            <p>Please verify your email using the OTP below:</p>
            <h3>${otp}</h3>
              <p>This OTP will expire in 15 minutes.</p>
            `,
          });
          return res.status(200).json({
            message: "OTP sent to your email for verification.",
            verificationRequired: true,
          });
        } catch (error) {
          console.log("error : ", error);
          return res
            .status(500)
            .json({ error: "Failed to send verification email." });
        }
      }

      try {
        const accessToken = signAccessToken(user);
        const refreshToken = await signRefreshToken(user);

        return res.status(200).json({
          message: `${requiredRole.replace("-", " ")} login successful.`,
          accessToken,
          refreshToken,
          user,
        });
      } catch (tokenErr) {
        return res.status(500).json({ error: "Failed to generate tokens." });
      }
    })(req, res, next);
  };
};

module.exports = {
  passport,
  superAdminLogin: loginWithRole("super-admin"),
  tenantOwnerLogin: loginWithRole("tenant-owner"),
};

// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcrypt");
// const User = require("../models/User.schema");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
// const TenantSchema = require("../models/Tenant.schema");
// const { signAccessToken, signRefreshToken } = require("../utils/jwt");

// passport.use(
//   "email-password",
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email, password, done) => {
//       try {
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//           return done(null, false, { message: "Invalid email or password." });
//         }

//         // Compare hashed passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return done(null, false, { message: "Invalid email or password." });
//         }

//         // Check user status (e.g., active/inactive)
//         if (user.status !== "Active") {
//           return done(null, false, { message: "User account is not active." });
//         }

//         // If user is a tenant-owner or tenant user, check tenant subscription status
//         if (user.tenant_id) {
//           const tenant = await TenantSchema.findById(user.tenant_id);
//           if (tenant) {
//             if (tenant.subscription_status === "PendingApproval") {
//               return done(null, false, {
//                 message:
//                   "Your account is pending approval. Please wait for activation.",
//               });
//             }
//             if (tenant.subscription_status === "Expired") {
//               return done(null, false, {
//                 message:
//                   "Your subscription has expired. Please contact support to renew.",
//               });
//             }
//             if (tenant.subscription_status === "Payment Failed") {
//               return done(null, false, {
//                 message:
//                   "Subscription payment failed. Please update payment information.",
//               });
//             }
//           }
//         }

//         // Success
//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     },
//   ),
// );

// // Serialize user for session storage
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id).populate("tenant_id");
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// const loginWithRole = (requiredRole) => {
//   return (req, res, next) => {
//     passport.authenticate("email-password", async (err, user, info) => {
//       if (err) return res.status(500).json({ error: "Internal server error." });

//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: info?.message || "Invalid credentials." });
//       }

//       // Check if the user is verified
//       if (!user.isVerified) {
//         try {
//           const otp = crypto.randomInt(100000, 999999).toString();
//           const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

//           user.otp = otp;
//           user.otpExpiresAt = otpExpiresAt;
//           await user.save();

//           const mailOptions = {
//             from: process.env.EMAIL,
//             to: user.email,
//             subject: "Verify Your Email with OTP",
//             html: `
//               <p>Hi ${user.name},</p>
//               <p>Thank you for registering. Please verify your email using the OTP below:</p>
//               <h3>${otp}</h3>
//               <p>This OTP will expire in 15 minutes.</p>
//             `,
//           };
//           await sendEmail(mailOptions);

//           return res.status(200).json({
//             message: "OTP sent to your email for verification.",
//             verificationRequired: true,
//           });
//         } catch (error) {
//           return res
//             .status(500)
//             .json({ error: "Failed to send verification email." });
//         }
//       }

//       // JWT-based login
//       try {
//         const accessToken = signAccessToken(user);
//         const refreshToken = await signRefreshToken(user); // handles Redis whitelisting

//         return res.status(200).json({
//           message: `${requiredRole.replace("-", " ")} login successful.`,
//           accessToken,
//           refreshToken,
//           user,
//         });
//       } catch (tokenErr) {
//         console.error("Token generation error:", tokenErr);
//         return res.status(500).json({ error: "Failed to generate tokens." });
//       }
//     })(req, res, next);
//   };
// };

// // Export Passport and Role-Based Login Functions
// module.exports = {
//   passport, // Export Passport for use in middleware
//   superAdminLogin: loginWithRole("super-admin"),
//   tenantOwnerLogin: loginWithRole("tenant-owner"),
// };

// Local strategy for email-password login
// passport.use(
//   "email-password",
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email, password, done) => {
//       try {
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//           return done(null, false, { message: "Invalid email or password." });
//         }

//         // Compare hashed passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return done(null, false, { message: "Invalid email or password." });
//         }

//         // Check user status (e.g., active/inactive)
//         if (user.status !== "Active") {
//           return done(null, false, { message: "User account is not active." });
//         }

//         return done(null, user); // Success
//       } catch (error) {
//         return done(error); // Internal error
//       }
//     },
//   ),
// );

// const loginWithRole = (requiredRole) => {
//   return (req, res, next) => {
//     passport.authenticate("email-password", async (err, user, info) => {
//       if (err) {
//         return res.status(500).json({ error: "Internal server error." });
//       }
//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: info?.message || "Invalid credentials." });
//       }

//       // Check if the user is verified
//       if (!user.isVerified) {
//         try {
//           // Generate OTP
//           const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
//           const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

//           // Save OTP and expiry to user in the database
//           user.otp = otp;
//           user.otpExpiresAt = otpExpiresAt;
//           await user.save(); // Ensure the fields are persisted

//           // Send OTP email
//           const mailOptions = {
//             from: process.env.EMAIL,
//             to: user.email,
//             subject: "Verify Your Email with OTP",
//             html: `
//               <p>Hi ${user.name},</p>
//               <p>Thank you for registering. Please verify your email by using the OTP below:</p>
//               <h3>${otp}</h3>
//               <p>This OTP will expire in 15 minutes.</p>
//             `,
//           };

//           await sendEmail(mailOptions);

//           return res.status(200).json({
//             message:
//               "Your account is not verified. We have sent an OTP to your email for verification.",
//             verificationRequired: true,
//           });
//         } catch (error) {
//           console.error("Error sending verification email:", error);
//           return res.status(500).json({
//             error: "Failed to send verification email. Please try again.",
//           });
//         }
//       }

//       // Log the user in if verified
//       req.logIn(user, (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Failed to log in user." });
//         }

//         // Debug session content
//         console.log("Session after login:", req.session);
//         res.status(200).json({
//           message: `${requiredRole.replace("-", " ")} login successful.`,
//           user,
//           hello: req.session,
//         });
//       });
//     })(req, res, next);
//   };
// };
// Generic Login Logic
// const loginWithRole = (requiredRole) => {
//   return (req, res, next) => {
//     passport.authenticate("email-password", (err, user, info) => {
//       if (err) {
//         return res.status(500).json({ error: "Internal server error." });
//       }
//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: info.message || "Invalid credentials." });
//       }

//       // Log the user in
//       req.logIn(user, (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Failed to log in user." });
//         }
//         res.status(200).json({
//           message: `${requiredRole.replace("-", " ")} login successful.`,
//           user,
//         });
//       });
//     })(req, res, next);
//   };
// };

// Check if the user role matches the required role
// if (user.role !== requiredRole) {
//   return res.status(403).json({ error: "Unauthorized role access." });
// }

// const loginWithRole = (requiredRole) => {
//   return (req, res, next) => {
//     passport.authenticate("email-password", async (err, user, info) => {
//       if (err) {
//         return res.status(500).json({ error: "Internal server error." });
//       }
//       if (!user) {
//         return res
//           .status(400)
//           .json({ error: info?.message || "Invalid credentials." });
//       }

//       // Check if the user is verified
//       if (!user.isVerified) {
//         try {
//           // Re-fetch the user from the database to ensure it's a Mongoose document
//           const dbUser = await User.findById(user._id);
//           if (!dbUser) {
//             return res.status(404).json({ error: "User not found." });
//           }

//           // Generate OTP
//           const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
//           const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

//           // Update fields and save
//           dbUser.otp = otp;
//           dbUser.otpExpiry = otpExpiresAt;
//           await dbUser.save(); // Save updated user

//           // Send OTP email
//           const mailOptions = {
//             from: process.env.EMAIL,
//             to: dbUser.email,
//             subject: "Verify Your Email with OTP",
//             html: `
//               <p>Hi ${dbUser.name},</p>
//               <p>Thank you for registering. Please verify your email by using the OTP below:</p>
//               <h3>${otp}</h3>
//               <p>This OTP will expire in 15 minutes.</p>
//             `,
//           };

//           await sendEmail(mailOptions);

//           return res.status(200).json({
//             message:
//               "Your account is not verified. We have sent an OTP to your email for verification.",
//             verificationRequired: true,
//           });
//         } catch (error) {
//           console.error("Error sending verification email:", error);
//           return res.status(500).json({
//             error: "Failed to send verification email. Please try again.",
//           });
//         }
//       }

//       // Log the user in if verified
//       req.logIn(user, (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Failed to log in user." });
//         }
//         res.status(200).json({
//           message: `${requiredRole.replace("-", " ")} login successful.`,
//           user,
//         });
//       });
//     })(req, res, next);
//   };
// };
