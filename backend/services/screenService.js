const Screen = require("../models/screenModel.js");

async function createScreen(screenData) {
    const screen = new Screen(screenData);
    await screen.save();
    return screen;
}

async function getAllScreens() {
    return await Screen.find();
}
async function getScreenByName(screenName) {

    return await Screen.findOne({ screenNameToLower: screenName.toLowerCase() }); 
}
async function getScreenById(id) {
    return await Screen.findById(id);
}

async function updateScreen(screenName, screenData) {
    return await Screen.findOneAndUpdate({ screenNameToLower: screenName.toLowerCase() }, screenData, { new: true });
}

async function deleteScreen(screenName) {
    return await Screen.findOneAndDelete({ screenNameToLower: screenName.toLowerCase() });
}

module.exports = {
    createScreen,
    getAllScreens,
    getScreenByName,
    getScreenById,
    updateScreen,
    deleteScreen
};