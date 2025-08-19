import displayModel from "../models/displayModel.js";
import { getThresholdById } from "./thresholdService.js";


export async function setDisplay(displayName, displayData) {
    return displayModel.findOneAndUpdate(
        { displayName },
        displayData,
        { upsert: true, new: true }
    );
}

export async function getDisplayByName(displayName) {
    return displayModel.findOne({ displayName }, '-_id -__v -createdAt').populate('thresholdIds', '-__v -createdAt');
}

export async function deleteThresholdId(displayName, thresholdId) {
    return displayModel.findOneAndUpdate(
        { displayName },
        { $pull: { thresholdIds: thresholdId } },
        { new: true }
    );
}
export async function addThresholdId(displayName, thresholdId) {
    const exists = await getThresholdById(thresholdId);
    if (!exists) {
        throw new Error('Threshold not found');
    }
    return displayModel.findOneAndUpdate(
        { displayName },
        { $addToSet: { thresholdIds: thresholdId } },
        { new: true }
    );
}
export async function deleteDisplay(displayName) {
    return displayModel.findOneAndDelete({ displayName });
}
