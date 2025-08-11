import { getDaysDifference } from '../utils/dateUtils.js';
import { sortCategoryItems } from '../utils/kpiUtils.js';

export function getComparisonValue(item, field){
    if (field.toLowerCase().includes('date')){
        return getDaysDifference(item[field]);
    }
    return item[field];
}

export function getRAGCategory(value, thresholds, direction, field = '') {
    const {green, amber} = thresholds;
    const isDueOrInputDate = field.toLowerCase().includes('due') ||
                             field.toLowerCase().includes('input') ||
                             field.toLowerCase().includes('created')||
                             field.toLowerCase().includes('date');

    if(direction === 'lower'){
        if (isDueOrInputDate) {
            // For "lower" direction: Recent = Good, Old = Bad
            if (value >= 0) return 'green'; // Future dates = good
            else {
                const days = Math.abs(value);
                if (days <= green) return 'green';    // Recently past = good
                else if (days <= amber) return 'amber'; // Moderately past = warning
                else return 'red';                     // Far past = bad
            }
        } else {
            // Amount logic (lower values better)
            if (value <= green) return 'green';
            else if (value <= amber) return 'amber';
            else return 'red';
        }
    } else {
        if (isDueOrInputDate) {
            // For "higher" direction: Old = Good, Recent = Bad
            if (value >= 0) {
                // Future dates - shouldn't happen for creation dates, but treat as new
                return 'red';
            } else {
                const days = Math.abs(value); // Convert to positive days ago
                if (days >= green) return 'green';      // Very old = good (≥365 days)
                else if (days >= amber) return 'amber'; // Moderately old = warning (180-364 days)
                else return 'red';                      // Recent = bad (<180 days)
            }
        } else {
            // Amount logic (higher values better)
            if (value >= green) return 'green';
            else if (value >= amber) return 'amber';
            else return 'red';
        }
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
