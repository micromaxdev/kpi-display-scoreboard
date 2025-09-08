import Threshold from '../models/thresholdModel.js';

export async function getThresholdsByCollection(collectionName) {
    return Threshold.find({ collectionName }, '-__v');
}
export async function getAllThresholds() {
    return Threshold.find({}, '-__v');
}
export async function getThreshold(collectionName, field) {
    return Threshold.findOne({ collectionName, field }, '-__v');
}

export async function getThresholdById(id) {
    return Threshold.findById(id, '-__v');
}

export async function setThreshold({ collectionName, field, green, amber, direction, excludedFields }) {
    // If excludedFields is explicitly provided (even as undefined), it will overwrite the field.
    // If excludedFields is not provided, it will remain unchanged.
    const update = { green, amber, direction };
    if (excludedFields !== undefined) {
        update.excludedFields = excludedFields || [];
    }
    return Threshold.findOneAndUpdate(
        { collectionName, field },
        update,
        { upsert: true, new: true }
    );
}

// Get excluded fields for a threshold
export async function getThresholdExcludedFields(collectionName, field) {
    try {
        if (!collectionName || !field) {
            return {
                success: false,
                status: 400,
                message: 'Collection name and field are required'
            };
        }

        const threshold = await Threshold.findOne({ collectionName, field })
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
