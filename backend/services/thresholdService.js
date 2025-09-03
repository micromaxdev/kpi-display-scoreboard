import Threshold from '../models/thresholdModel.js';
import { getCollectionFields as getDataCollectionFields } from '../services/dataService.js';

export async function getThresholdsByCollection(collectionName) {
    return Threshold.find({ collectionName }, '-__v');
}

export async function getThreshold(collectionName, field) {
    return Threshold.findOne({ collectionName, field }, '-__v');
}

export async function getThresholdById(id) {
    return Threshold.findById(id, '-__v');
}

export async function setThreshold({ collectionName, field, green, amber, direction }) {
    return Threshold.findOneAndUpdate(
        { collectionName, field },
        { green, amber, direction },
        { upsert: true, new: true }
    );
}

// Update excluded fields for a threshold
export async function updateThresholdExcludedFields(thresholdId, excludedFields) {
    try {
        if (!thresholdId) {
            return {
                success: false,
                status: 400,
                message: 'Threshold ID is required'
            };
        }

        // Only update existing thresholds - no upsert
        const threshold = await Threshold.findByIdAndUpdate(
            thresholdId,
            { 
                $set: { 
                    excludedFields: excludedFields || []
                }
            },
            { 
                new: true,     // Return the updated document
                runValidators: true  // Run schema validation
            }
        );

        if (!threshold) {
            return {
                success: false,
                status: 404,
                message: 'Threshold not found. Please create the threshold first.'
            };
        }

        return {
            success: true,
            data: {
                thresholdId: threshold._id,
                excludedFields: threshold.excludedFields || []
            }
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: `Error updating excluded fields: ${error.message}`
        };
    }
}

// Get excluded fields for a threshold
export async function getThresholdExcludedFields(thresholdId) {
    try {
        if (!thresholdId) {
            return {
                success: false,
                status: 400,
                message: 'Threshold ID is required'
            };
        }

        const threshold = await Threshold.findById(thresholdId)
            .select('excludedFields')
            .lean();

        if (!threshold) {
            return {
                success: false,
                status: 404,
                message: 'Threshold not found'
            };
        }

        return {
            success: true,
            data: {
                excludedFields: threshold.excludedFields || []
            }
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: `Error fetching excluded fields: ${error.message}`
        };
    }
}
