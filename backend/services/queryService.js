const { normalizeDateFormat, isLikelyDate } = require('../utils/dateUtils.js');

/**
 * Builds a MongoDB query object from request filters
 * @param {Object} filters - The filters from request query parameters
 * @returns {Object} MongoDB query object
 */
function buildQuery(filters) {
  const query = {};
  
  Object.keys(filters).forEach(key => {
    let value = filters[key];
    if (value !== undefined && value !== '') {
      try {
        const parsed = JSON.parse(value);

        // e.g. dueDate={"gte":"06/08/25", "lte":"10/08/25"}
        if (typeof parsed === 'object' && parsed !== null) {
          Object.keys(parsed).forEach(op => {
            if (typeof parsed[op] === 'string' && isLikelyDate(parsed[op])) {
              parsed[op] = normalizeDateFormat(parsed[op]);
            }
          });
        }

        query[key] = parsed;
      } catch (e) {
        // Simple value like dueDate=06/08/25
        query[key] = isLikelyDate(value) ? normalizeDateFormat(value) : value;
      }
    }
  });

  return query;
}

/**
 * Builds sort options for MongoDB queries
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Object} MongoDB sort options
 */
function buildSortOptions(sortBy = '_id', sortOrder = 'desc') {
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  return sortOptions;
}

/**
 * Builds pagination info object
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of documents
 * @returns {Object} Pagination information
 */
function buildPaginationInfo(page, limit, total) {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalDocuments: total,
    limit: itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

/**
 * Extracts and validates query parameters from request
 * @param {Object} query - Request query object
 * @returns {Object} Extracted and validated parameters
 */
function extractQueryParams(query) {
  const { 
    page = 1, 
    limit = 50, 
    sortBy = '_id', 
    sortOrder = 'desc',
    ...filters
  } = query;

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    sortBy,
    sortOrder,
    filters
  };
}

module.exports = {
    buildQuery,
    buildSortOptions,
    buildPaginationInfo,
    extractQueryParams
};