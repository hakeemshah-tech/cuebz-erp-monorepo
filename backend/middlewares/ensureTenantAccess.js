const ensureTenantAccess = (req, res, next) => {
  const tenantId = req.params.tenant_id || req.body.tenant_id;

  if (
    req.isAuthenticated() &&
    req.user.tenant_id._id?.toString() === tenantId
  ) {
    return next();
  }
  res.status(403).json({ error: "Access denied: Tenant mismatch." });
};

module.exports = ensureTenantAccess;
