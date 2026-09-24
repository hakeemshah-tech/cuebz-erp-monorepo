const pagination = (req, res, next) => {
  let { page, limit } = req.query; // Default values if not provided
  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = 20;
  }

  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};

module.exports = pagination;
