import { getTopNCategory, processData } from "../services/kpiService.js";
import { createColorCodedExcel } from "../utils/kpiUtils.js";

export const analyzeKPIData = async (req, res) => {
    try {
        const {collectionName, field, greenThreshold, amberThreshold, direction} = req.body;
        
        //categorize items based on the field and thresholds
        const categorizedItems = await processData(collectionName, field, greenThreshold, amberThreshold, direction);
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
                green: parseFloat(greenThreshold),
                amber: parseFloat(amberThreshold),
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

export const downloadExcel = async (req, res) => {
    try {
        const { collectionName, field, greenThreshold, amberThreshold, direction } = req.body;

        // Categorize items based on the field and thresholds
        const categorizedItems = await processData(collectionName, field, greenThreshold, amberThreshold, direction);
        const thresholds = {
            green: parseFloat(greenThreshold),
            amber: parseFloat(amberThreshold)
        };
        // Create Excel workbook with color coding
        const workbook = await createColorCodedExcel(categorizedItems, field, collectionName, thresholds, direction);

        // Set headers for Excel download
        const filename = `${collectionName}_${field}_categorized_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error downloading Excel:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


