import getDynamicModel from '../models/dynamicModel.js';

// Main function to retrieve collection data with pagination and indexing
const getCollectionData = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { 
      page = 1, 
      limit = 50, // Default to 50 for better performance with large datasets Limit = 0 means no limit a.k.a all data
      sortBy = '_id', // Default sort by _id for consistent ordering
      sortOrder = 'desc',
      ...filters
    } = req.query;

    const Model = getDynamicModel(collectionName);
    
    // Build query from filters with support for JSON-style MongoDB operators
    const query = {};
    Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== undefined && value !== '') {
        try {
        // Try parsing as JSON (for complex filters like $gt, $in, etc.)
        query[key] = JSON.parse(value);
        } catch (e) {
        // Fallback to string match
        query[key] = value;
        }
    }
    });

    // Optimize sort options for performance
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Use lean() for better performance with large datasets
    const data = await Model.find(query)
      .lean() // Returns plain JavaScript objects instead of Mongoose documents
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    // Get total count for pagination
    const total = await Model.countDocuments(query);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDocuments: total,
        limit: parseInt(limit),
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      },
      collectionName
    });

  } catch (error) {
    console.error('Error retrieving collection data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving data',
      error: error.message 
    });
  }
};

export {
  getCollectionData
};
