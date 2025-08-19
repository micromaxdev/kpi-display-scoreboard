import * as displayService from "../services/displayService.js";

export async function setDisplay(req, res) {
    try {
        const { displayName, time, thresholdIds } = req.body;
        const display = await displayService.setDisplay(displayName, { time, thresholdIds });
        res.status(201).json({ success: true, display });
    } catch (error) {
        console.error('Error creating display:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function getDisplayByName(req, res) {
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

export async function addThresholdId(req, res) {
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


export async function deleteThresholdId(req, res) {
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

export async function deleteDisplay(req, res) {
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