import getDynamicModel from '../models/dynamicModel.js';
import mongoose from 'mongoose';
import { 
  buildQuery, 
  buildSortOptions, 
  buildPaginationInfo, 
  extractQueryParams 
} from '../services/queryService.js';

// Main function to retrieve collection data with pagination and indexing
export const getCollectionData = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { page, limit, sortBy, sortOrder, filters } = extractQueryParams(req.query);

    const Model = getDynamicModel(collectionName);
    
    // Build query and sort options using service functions
    const query = buildQuery(filters);
    const sortOptions = buildSortOptions(sortBy, sortOrder);

    // Use lean() for better performance with large datasets
    const data = await Model.find(query)
      .lean() // Returns plain JavaScript objects instead of Mongoose documents
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Model.countDocuments(query);

    // Build pagination info
    const pagination = buildPaginationInfo(page, limit, total);

    res.json({
      success: true,
      data,
      pagination,
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
// Function to get list of collections in the database
export const getCollectionsList = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    res.json({
      success: true,
      collections: collectionNames
    });
  } catch (error) {
    console.error('Error retrieving collections list:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving collections list',
      error: error.message
    });
  }
};
