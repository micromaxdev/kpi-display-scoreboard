const displayService = require("../services/displayService.js");

async function setDisplay(req, res) {
    try {
        const { displayName, time, thresholdIds } = req.body;
        const display = await displayService.setDisplay(displayName, { time, thresholdIds });
        res.status(201).json({ success: true, display });
    } catch (error) {
        console.error('Error creating display:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getAllDisplays(req, res) {
    try {
        const displays = await displayService.getAllDisplays();
        res.json({ success: true, displays });
    } catch (error) {
        console.error('Error fetching displays:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getDisplayByName(req, res) {
    const { displayName } = req.params;
    try {
        const display = await displayService.getDisplayByName(displayName);
        if (!display) {
            return res.status(404).json({ success: false, message: 'Display not found' });
        }
        res.json({ success: true, display });
    } catch (error) {
        console.error('Error fetching display:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}   

async function deleteDisplay(req, res) {
    const { displayName } = req.params;
    try {
        const deletedDisplay = await displayService.deleteDisplay(displayName);
        if (!deletedDisplay) {
            return res.status(404).json({ success: false, message: 'Display not found' });
        }
        res.json({ success: true, display: deletedDisplay });
    } catch (error) {
        console.error('Error deleting display:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function saveOrUpdateDisplay(req, res){
    try {
        const {displayName, time, thresholdId} = req.body;

        if(!displayName) {
            return res.status(400).json({ success: false, message: 'Display name, time, and threshold ID are required' });
        }

        let existingDisplay = await displayService.getDisplayByName(displayName);
        if (existingDisplay) {
            // Update existing display
            existingDisplay.time = time;
            //push thresholdId
            if(thresholdId!=null && thresholdId!=undefined && thresholdId!='') {
                existingDisplay = await displayService.addThresholdId(displayName, thresholdId);
            }
            await displayService.setDisplay(displayName, existingDisplay);
            return res.json({ success: true, display: existingDisplay, message: 'Display updated successfully' });
        } else {
            // Create new display
            const newDisplay = await displayService.setDisplay(displayName, { time, thresholdIds: [thresholdId] });
            return res.status(201).json({ success: true, display: newDisplay, message: 'Display created successfully' });
        }
    } catch (error) {
        console.error('Error saving or updating display:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function addThresholdId(req, res) {
    const { displayName, thresholdId } = req.body;
    try {
        const updatedDisplay = await displayService.addThresholdId(displayName, thresholdId);
        if (!updatedDisplay) {
            return res.status(404).json({ success: false, message: 'Display not found' });
        }
        res.json({ success: true, display: updatedDisplay });
    } catch (error) {
        console.error('Error assigning threshold ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteThresholdId(req, res) {
    const { displayName, thresholdId } = req.body;
    try {
        const updatedDisplay = await displayService.deleteThresholdId(displayName, thresholdId);
        if (!updatedDisplay) {
            return res.status(404).json({ success: false, message: 'Display not found' });
        }
        res.json({ success: true, display: updatedDisplay });
    } catch (error) {
        console.error('Error removing threshold ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function reorderThresholds(req, res) {
    const { displayName } = req.params;
    const { thresholdIds } = req.body;
    try {
        const updatedDisplay = await displayService.reorderThresholds(displayName, thresholdIds);
        if (!updatedDisplay) {
            return res.status(404).json({ success: false, message: 'Display not found' });
        }
        res.json({ success: true, display: updatedDisplay });
    } catch (error) {
        console.error('Error reordering thresholds:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    setDisplay,
    getAllDisplays,
    getDisplayByName,
    deleteDisplay,
    saveOrUpdateDisplay,
    addThresholdId,
    deleteThresholdId,
    reorderThresholds
};
