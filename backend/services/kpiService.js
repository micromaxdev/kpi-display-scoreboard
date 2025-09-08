const { getDaysDifference} = require('../utils/dateUtils.js');
const { sortCategoryItems,checkThresholds,validateInput } = require('../utils/kpiUtils.js');
const { getAllDataFromCollection } = require("../services/dataService.js");
const { isDueOrInputDate, getDateRAGCategory, getAmountRAGCategory } = require('../utils/ragCategoryUtils.js');

function getComparisonValue(item, field){
    if (field.toLowerCase().includes('date')){
        return getDaysDifference(item[field]);
    }
    return item[field];
}

function getRAGCategory(value, thresholds, direction, field = '') {
    if (isDueOrInputDate(field)) {
        return getDateRAGCategory(value, thresholds, direction);
    } else {
        return getAmountRAGCategory(value, thresholds, direction);
    }
}

function categorizeItems(items, field, thresholds, direction) {
    return items.map(item => {
        const value = getComparisonValue(item, field);
        const category = getRAGCategory(value, thresholds, direction, field);
        return {
            ...item,
            ragCategory: category,
            comparisonValue: value
        };
    });
}

function getTopNCategory(items, n, direction, field = '') {
    const grouped = { red: [], amber: [], green: [] };
    items.forEach(item => {
        if (grouped[item.ragCategory]) {
            grouped[item.ragCategory].push(item);
        }
    });

    for (const cat in grouped) {
        grouped[cat] = sortCategoryItems(grouped[cat], cat, direction, field).slice(0, n);
    }

    return grouped;
}

//Validate input parameters and return categorized items workflow 
async function processData(collectionName, field, greenThreshold, amberThreshold, direction){
    // Validate required parameters
    const validated = await validateInput(field, greenThreshold, amberThreshold);
    if (!validated.success) {
        throw new Error(validated.message || 'Invalid input parameters');
    }

    // Check thresholds based on direction
    const checkThresholdsResult = await checkThresholds(greenThreshold, amberThreshold, direction);
    if (!checkThresholdsResult.success) {
        throw new Error(checkThresholdsResult.message || 'Threshold check failed');
    }

    // Fetch all data from the collection
    const dataResult = await getAllDataFromCollection(collectionName);
    if (!dataResult.success) {
        throw new Error(dataResult.message || 'Failed to fetch data');
    }

    const thresholds = {
        green: parseFloat(greenThreshold),
        amber: parseFloat(amberThreshold)
    };

    // Categorize items based on the field and thresholds
    const categorizedItems = categorizeItems(dataResult.data, field, thresholds, direction);

    return categorizedItems;
}

module.exports = {
    getComparisonValue,
    getRAGCategory,
    categorizeItems,
    getTopNCategory,
    processData
};