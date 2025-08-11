import { getDaysDifference } from '../utils/dateUtils.js';
import { sortCategoryItems } from '../utils/kpiUtils.js';
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
