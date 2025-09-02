import * as screenService from '../services/screenService.js';

export const createScreen = async (req, res) => {
    try {
        const { screenName, description, screenUrl } = req.body;
        const screenNameToLower = screenName.toLowerCase();
        const screen = await screenService.createScreen({ screenName, description, screenUrl, screenNameToLower });
        res.status(201).json(screen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllScreens = async (req, res) => {
    try {
        const screens = await screenService.getAllScreens();
        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getScreenByName = async (req, res) => {
    try {
        const { screenName } = req.params;
        const screen = await screenService.getScreenByName(screenName);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        res.status(200).json(screen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateScreen = async (req, res) => {
    try {
        const { screenName } = req.params;
        const screenData = req.body;
        const updatedScreen = await screenService.updateScreen(screenName, screenData);
        if (!updatedScreen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        res.status(200).json(updatedScreen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteScreen = async (req, res) => {
    try {
        const { screenName } = req.params;
        const deletedScreen = await screenService.deleteScreen(screenName);
        if (!deletedScreen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
