const authorizeTenant = (model, tenantField = "tenant_id") => {
  return async (req, res, next) => {
    try {
      const { id } = req.params; // The ID of the resource being accessed
      const tenantId = req.user.tenant_id._id; // The tenant ID of the authenticated user

      // Check if the requested resource belongs to the tenant
      const resource = await model.findOne({
        _id: id,
        [tenantField]: tenantId,
      });

      if (!resource) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
        });
      }

      next(); // Proceed if authorized
    } catch (error) {
      console.error("Authorization error:", error);
      next(error);
    }
  };
};

module.exports = authorizeTenant;
