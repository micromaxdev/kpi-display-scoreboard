const displayModel = require("../models/displayModel.js");
const { getThresholdById } = require("./thresholdService.js");


async function setDisplay(displayName, displayData) {
    // Use case-insensitive upsert to prevent duplicates with different cases
    return displayModel.findOneAndUpdate(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } },
        { ...displayData, displayName }, // Keep original case for display
        { upsert: true, new: true }
    );
}
async function getAllDisplays() {
    return displayModel.find({}, '-_id -__v -createdAt').populate('thresholdIds', '-__v -createdAt');
}
async function getDisplayByName(displayName) {
    // Use case-insensitive lookup
    return displayModel.findOne(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } }, 
        '-_id -__v -createdAt'
    ).populate('thresholdIds', '-__v -createdAt');
}

async function deleteThresholdId(displayName, thresholdId) {
    // Use case-insensitive lookup
    return displayModel.findOneAndUpdate(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } },
        { $pull: { thresholdIds: thresholdId } },
        { new: true }
    );
}
async function addThresholdId(displayName, thresholdId) {
    const exists = await getThresholdById(thresholdId);
    if (!exists) {
        throw new Error('Threshold not found');
    }
    // Use case-insensitive lookup
    return displayModel.findOneAndUpdate(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } },
        { $addToSet: { thresholdIds: thresholdId } },
        { new: true }
    );
}
async function deleteDisplay(displayName) {
    // Use case-insensitive lookup
    return displayModel.findOneAndDelete(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } }
    );
}

async function reorderThresholds(displayName, newOrder) {
    // Use case-insensitive lookup
    return displayModel.findOneAndUpdate(
        { displayName: { $regex: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\\]/g, '\\$&')}$`, 'i') } },
        { thresholdIds: newOrder },
        { new: true }
    );
}

module.exports = {
    setDisplay,
    getAllDisplays,
    getDisplayByName,
    deleteThresholdId,
    addThresholdId,
    deleteDisplay,
    reorderThresholds
};
