const checkTenantVerified = (req, res, next) => {
  try {
    const user = req.user; // Assuming `req.user` is populated via authentication middleware.

    // Check if the user is a tenant and is not verified
    if (user.role === "tenant-owner" && !user.isVerified) {
      return res.status(403).json({
        message:
          "Your account is not verified. Please verify your account to proceed.",
      });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error in checkTenantVerified middleware:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

module.exports = checkTenantVerified;
