const User = require("../models/User.schema");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

const checkCredentialSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // ✅ If session is still active, proceed to the next middleware/controller
    if (
      user.credentials_session_active_until &&
      user.credentials_session_active_until > new Date()
    ) {
      return next();
    }

    // ✅ If session expired, generate new OTP and reset session
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.credentials_otp = otp;
    user.expiry_credentials_otp = expiry;
    user.credentials_session_active_until = null; // Reset active session
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

    return res.status(400).json({
      message: "Session expired. A new OTP has been sent to your email.",
      otp_required: true, // This tells the frontend to show OTP input again
    });
  } catch (error) {
    next(error);
  }
};

module.exports = checkCredentialSession;
