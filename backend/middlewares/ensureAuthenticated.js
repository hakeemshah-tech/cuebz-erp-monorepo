// const ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res
//     .status(401)
//     .json({ error: "Unauthorized: Please log in to access this resource." });
// };

// module.exports = ensureAuthenticated;
const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User.schema");

const ensureAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header." });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    // Fetch full user with tenant populated
    const user = await User.findById(decoded.userId).populate("tenant_id");

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    req.user = user; // Full user object with tenant_id populated
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = ensureAuthenticated;
