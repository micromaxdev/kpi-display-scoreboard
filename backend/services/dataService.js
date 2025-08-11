import mongoose from "mongoose";
import getDynamicModel from "../models/dynamicModel.js";
import { buildPaginationInfo } from "./queryService.js";
/**
 * Get paginated data from a specific collection
 * @param {string} collectionName - The name of the collection
 * @param {Object} filter - Filter object for querying specific data
 * @param {Object} sortOptions - Sort options object
 * @param {number} page - Page number (starting from 1)
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} Paginated data with metadata
 */
export const getPaginatedDataFromCollection = async (collectionName, filter = {}, sortOptions = {}, page = 1, limit = 50) => {
  try {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    const Model = getDynamicModel(collectionName);
    
    // Calculate skip value
    const skip = (page - 1) * limit;
    
    // Get the data with lean() for better performance
    const data = await Model.find(filter)
      .lean() // Returns plain JavaScript objects instead of Mongoose documents
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .exec();
    
    // Get total count for pagination
    const total = await Model.countDocuments(filter);
    
    // Build pagination info using queryService
    const pagination = buildPaginationInfo(page, limit, total);
    
    return {
      success: true,
      data,
      pagination,
      collection: collectionName
    };
  } catch (error) {
    throw new Error(`Error fetching paginated data from collection '${collectionName}': ${error.message}`);
  }
};

/** * Get all data from a specific collection without pagination
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Object>} All data from the collection
 */
export const getAllDataFromCollection = async (collectionName) => {
    try {
        if (!collectionName) {
            throw new Error('Collection name is required');
        }
        const Model = getDynamicModel(collectionName);
        // Exclude _id, createdAt, __v, updatedAt fields
        const data = await Model.find({}, { _id: 0, createdAt: 0, __v: 0, updatedAt: 0 }).lean().exec();
        if(!data || data.length === 0) {
            return {
                success: false,
                data: [],
                collection: collectionName,
                message: `Collection '${collectionName}' is empty/not exist`
            };
        }
        return {
            success: true,
            data,
            collection: collectionName
        };
    } catch (error) {
        throw new Error(`Error fetching all data from collection '${collectionName}': ${error.message}`);
    }
}


/**
 * Count documents in a collection with optional filter
 * @param {string} collectionName - The name of the collection
 * @param {Object} filter - Optional filter object
 * @returns {Promise<number>} Count of documents
 */
export const getCountFromCollection = async (collectionName, filter = {}) => {
  try {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    const Model = getDynamicModel(collectionName);
    const count = await Model.countDocuments(filter);
    
    return {
      success: true,
      count,
      collection: collectionName,
      filter
    };
  } catch (error) {
    throw new Error(`Error counting documents in collection '${collectionName}': ${error.message}`);
  }
};

/**
 * Get the field names (keys) of documents in a collection
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Array<string>>} Array of field names
 */
export const getCollectionFields = async (collectionName) => {
    try {
        if (!collectionName) {
            throw new Error('Collection name is required');
        }

        const Model = getDynamicModel(collectionName);

        // Get one document to infer fields
        const doc = await Model.findOne().lean().exec();
        if (!doc) {
            return [];
        }
        return {
            success: true,
            data: Object.keys(doc),
            collection: collectionName
        };
    } catch (error) {
        throw new Error(`Error getting fields from collection '${collectionName}': ${error.message}`);
    }
};

/** * Get a list of all collections in the database
 * @returns {Promise<Object>} Object containing collection names and total count
 */
export const getListOfCollections = async () => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        return {
            success: true,
            collectionsName: collectionNames,
            totalCollections: collectionNames.length
        };
    } catch (error) {
        throw new Error(`Error retrieving collections list: ${error.message}`);
    }
}