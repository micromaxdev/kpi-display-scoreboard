const thresholdService = require('../services/thresholdService.js');

// Get all threshold for a collection
async function getThresholdsByCollection(req, res) {
    const { collectionName } = req.query;
    if (!collectionName) {
        return res.status(400).json({ success: false, message: 'collectionName is required' });
    }
    const thresholds = await thresholdService.getThresholdsByCollection(collectionName);
    res.json({ success: true, thresholds });
}
async function getAllThresholds(req, res) {
    const thresholds = await thresholdService.getAllThresholds();
    res.json({ success: true, thresholds });
}

// Get a threshold for a collection with specific field
async function getThreshold(req, res) {
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
async function setThreshold(req, res) {
    const { collectionName, field, green, amber, direction, excludedFields } = req.body;
    if (!collectionName || !field || green == null || amber == null || !direction) {
        console.error('Missing required fields for threshold:', { collectionName, field, green, amber, direction });
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const updated = await thresholdService.setThreshold({ collectionName, field, green, amber, direction, excludedFields });
    res.json({ success: true, threshold: updated });
}

async function getThresholdById(req, res) {
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

// Get threshold excluded fields
async function getThresholdExcludedFields(req, res) {
    try {
        const {collectionName, field} = req.query;

        if (!collectionName || !field) {
            return res.status(400).json({
                success: false,
                message: 'Collection name and field are required'
            });
        }

        const result = await thresholdService.getThresholdExcludedFields(collectionName, field);

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                message: result.message
            });
        }
        res.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('Error fetching threshold excluded fields:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching excluded fields',
            error: error.message
        });
    }
}



module.exports = {
    getThresholdsByCollection,
    getAllThresholds,
    getThreshold,
    setThreshold,
    getThresholdById,
    getThresholdExcludedFields
};