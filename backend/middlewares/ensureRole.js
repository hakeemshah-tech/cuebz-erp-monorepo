const ensureRole = (requiredRoles, moduleAccess = null) => {
  return (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //   return res
    //     .status(403)
    //     .json({ error: "Access denied: User not authenticated." });
    // }

    const userRole = req.user.role;
    const accessibleModules = req.user.accessible_modules;

    // By pass superadmin
    if (userRole === "super-admin") {
      return next();
    }

    // Check if the user's role is included in the required roles
    if (requiredRoles.includes(userRole)) {
      // Additional check for tenant_user
      if (userRole === "tenant-user" && moduleAccess) {
        if (!accessibleModules || !accessibleModules.includes(moduleAccess)) {
          return res.status(403).json({
            error: `Access denied: Insufficient permissions for the module ${moduleAccess}.`,
          });
        }
      }
      return next(); // User has sufficient permissions
    }

    res.status(403).json({ error: "Access denied: Insufficient permissions." });
  };
};

module.exports = ensureRole;
