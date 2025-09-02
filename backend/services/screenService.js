import Screen from "../models/screenModel.js";

export async function createScreen(screenData) {
    const screen = new Screen(screenData);
    await screen.save();
    return screen;
}

export async function getAllScreens() {
    return await Screen.find();
}
export async function getScreenByName(screenName) {

    return await Screen.findOne({ screenNameToLower: screenName.toLowerCase() }); 
}
export async function getScreenById(id) {
    return await Screen.findById(id);
}

export async function updateScreen(screenName, screenData) {
    return await Screen.findOneAndUpdate({ screenNameToLower: screenName.toLowerCase() }, screenData, { new: true });
}

export async function deleteScreen(screenName) {
    return await Screen.findOneAndDelete({ screenNameToLower: screenName.toLowerCase() });
}
