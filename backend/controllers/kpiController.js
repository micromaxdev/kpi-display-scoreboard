import { getTopNCategory, categorizeItems } from "../services/kpiService.js";
import { getAllDataFromCollection } from "../services/dataService.js";
import { validateInput, checkThresholds } from "../utils/kpiUtils.js";


export const analyzeKPIData = async (req, res) => {
    try {
        const {collectionName, field, greenThreshold, amberThreshold, direction} = req.body;
        
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
        //categorize items based on the field and thresholds
        const categorizedItems = categorizeItems(dataResult.data, field, thresholds, direction);
        //count items in each RAG category
        const countsByCategory = {
            green: categorizedItems.filter(item => item.ragCategory === 'green').length,
            amber: categorizedItems.filter(item => item.ragCategory === 'amber').length,
            red: categorizedItems.filter(item => item.ragCategory === 'red').length,
            total: categorizedItems.length
        }

        // Get top N items in each category
        const topN = 10;
        const topItems = getTopNCategory(categorizedItems, topN, direction, field);

        const response = {
            success: true,
            collection: collectionName,
            thresholds:{
                green: thresholds.green,
                amber: thresholds.amber,
                direction: direction
            },
            countsByCategory,
            topItems
        };
        return res.json(response);
    } catch (error) {
        console.error('Error validating input:', error);
        return res.status(400).json({ success: false, message: error.message });   
    }

}