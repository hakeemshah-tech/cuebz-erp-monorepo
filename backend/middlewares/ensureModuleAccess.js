const ensureModuleAccess = (...requiredModules) => {
  return (req, res, next) => {
    const userModules = req.user.accessible_modules || [];

    if (requiredModules.every((module) => userModules.includes(module))) {
      return next();
    }
    res
      .status(403)
      .json({ error: "Access denied: Insufficient module permissions." });
  };
};

module.exports = ensureModuleAccess;
