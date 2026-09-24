const parseJSONData = (data) => {
  return JSON.stringify(data, null, 2);
};

/**
 * Generate pagination metadata for API responses.
 * @param {Number} total - Total number of items in the database.
 * @param {Number} page - Current page number.
 * @param {Number} limit - Number of items per page.
 * @returns {Object} Pagination metadata.
 */
const generatePaginationMetadata = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

module.exports = {
  parseJSONData,
  generatePaginationMetadata,
};
