import Threshold from '../models/thresholdModel.js';

export async function getThresholdsByCollection(collectionName) {
    return Threshold.find({ collectionName }, '-_id -__v');
}

export async function getThreshold(collectionName, field) {
    return Threshold.findOne({ collectionName, field }, '-_id -__v');
}

export async function setThreshold({ collectionName, field, green, amber, direction }) {
    return Threshold.findOneAndUpdate(
        { collectionName, field },
        { green, amber, direction },
        { upsert: true, new: true }
    );
}