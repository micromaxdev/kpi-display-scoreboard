import * as thresholdService from '../services/thresholdService.js';

// Get all threshold for a collection
export async function getThresholdsByCollection(req, res) {
    const { collectionName } = req.query;
    if (!collectionName) {
        return res.status(400).json({ success: false, message: 'collectionName is required' });
    }
    const thresholds = await thresholdService.getThresholdsByCollection(collectionName);
    res.json({ success: true, thresholds });
}

// Get a threshold for a collection with specific field
export async function getThreshold(req, res) {
    const { collectionName, field } = req.query;
    if (!collectionName || !field) {
        return res.status(400).json({ success: false, message: 'collectionName and field are required' });
    } 
    const threshold = await thresholdService.getThreshold(collectionName, field);
    if (!threshold) {
        return res.status(404).json({ success: false, message: 'Threshold not found' });
    }
    res.json({ success: true, threshold });
}


// Create or update a threshold
export async function setThreshold(req, res) {
    const { collectionName, field, green, amber, direction } = req.body;
    if (!collectionName || !field || green == null || amber == null || !direction) {
        console.error('Missing required fields for threshold:', { collectionName, field, green, amber, direction });
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const updated = await thresholdService.setThreshold({ collectionName, field, green, amber, direction });
    res.json({ success: true, threshold: updated });
}

export async function getThresholdById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID is required' });
    }
    const threshold = await thresholdService.getThresholdById(id);
    if (!threshold) {
        return res.status(404).json({ success: false, message: 'Threshold not found' });
    }
    res.json({ success: true, threshold });
}