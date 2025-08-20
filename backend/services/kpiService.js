import { getDaysDifference} from '../utils/dateUtils.js';
import { sortCategoryItems,checkThresholds,validateInput } from '../utils/kpiUtils.js';
import { getAllDataFromCollection } from "../services/dataService.js";
import { isDueOrInputDate, getDateRAGCategory, getAmountRAGCategory } from '../utils/ragCategoryUtils.js';

export function getComparisonValue(item, field){
    if (field.toLowerCase().includes('date')){
        return getDaysDifference(item[field]);
    }
    return item[field];
}

export function getRAGCategory(value, thresholds, direction, field = '') {
    if (isDueOrInputDate(field)) {
        return getDateRAGCategory(value, thresholds, direction);
    } else {
        return getAmountRAGCategory(value, thresholds, direction);
    }
}

export function categorizeItems(items, field, thresholds, direction) {
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

export function getTopNCategory(items, n, direction, field = '') {
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
export async function processData(collectionName, field, greenThreshold, amberThreshold, direction){
    // Validate required parameters
    const validated = await validateInput(field, greenThreshold, amberThreshold);
    if (!validated.success) {
        return res.status(400).json(validated);
    }

    // Check thresholds based on direction
    const checkThresholdsResult = await checkThresholds(greenThreshold, amberThreshold, direction);
    if (!checkThresholdsResult.success) {
        return res.status(400).json(checkThresholdsResult);
    }

    // Fetch all data from the collection
    const dataResult = await getAllDataFromCollection(collectionName);
    if (!dataResult.success) {
        return res.status(500).json({ success: false, message: dataResult.message });
    }

    const thresholds = {
        green: parseFloat(greenThreshold),
        amber: parseFloat(amberThreshold)
    };

    // Categorize items based on the field and thresholds
    const categorizedItems = categorizeItems(dataResult.data, field, thresholds, direction);

    return categorizedItems
}

