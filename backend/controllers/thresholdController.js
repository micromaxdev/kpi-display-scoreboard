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

// Update threshold excluded fields
export async function updateThresholdExcludedFields(req, res) {
    try {
        const { thresholdId } = req.params;
        const { excludedFields } = req.body;

        if (!thresholdId) {
            return res.status(400).json({
                success: false,
                message: 'Threshold ID is required'
            });
        }

        const result = await thresholdService.updateThresholdExcludedFields(
            thresholdId, 
            excludedFields
        );

        if (!result.success) {
            return res.status(result.status || 500).json({
                success: false,
                message: result.message
            });
        }

        res.json({
            success: true,
            message: 'Excluded fields updated successfully',
            data: result.data
        });

    } catch (error) {
        console.error('Error updating threshold excluded fields:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating excluded fields',
            error: error.message
        });
    }
}

// Get threshold excluded fields
export async function getThresholdExcludedFields(req, res) {
    try {
        const { thresholdId } = req.params;

        if (!thresholdId) {
            return res.status(400).json({
                success: false,
                message: 'Threshold ID is required'
            });
        }

        const result = await thresholdService.getThresholdExcludedFields(thresholdId);

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

// Get available fields for a collection (helper endpoint)
export async function getCollectionFields(req, res) {
    try {
        const { collectionName } = req.query;
        
        if (!collectionName) {
            return res.status(400).json({
                success: false,
                message: 'Collection name is required'
            });
        }

        const result = await thresholdService.getCollectionFields(collectionName);

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
        console.error('Error fetching collection fields:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching collection fields',
            error: error.message
        });
    }
}