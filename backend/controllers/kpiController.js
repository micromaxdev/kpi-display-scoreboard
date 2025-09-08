const { getTopNCategory, processData } = require("../services/kpiService.js");
const { createColorCodedExcel, filterExcludedFields } = require("../utils/kpiUtils.js");

const analyzeKPIData = async (req, res) => {
    try {
        const {collectionName, field, greenThreshold, amberThreshold, direction, excludedFields = []} = req.body;
        
        //categorize items based on the field and thresholds
        const categorizedItems = await processData(collectionName, field, greenThreshold, amberThreshold, direction);
        
        // Filter out excluded fields from the response data
        const filteredItems = filterExcludedFields(categorizedItems, excludedFields);
        
        //count items in each RAG category
        const countsByCategory = {
            green: filteredItems.filter(item => item.ragCategory === 'green').length,
            amber: filteredItems.filter(item => item.ragCategory === 'amber').length,
            red: filteredItems.filter(item => item.ragCategory === 'red').length,
            total: filteredItems.length
        }

        // Get top N items in each category
        const topN = 10;
        const topItems = getTopNCategory(filteredItems, topN, direction, field);

        const response = {
            success: true,
            collection: collectionName,
            thresholds:{
                green: parseFloat(greenThreshold),
                amber: parseFloat(amberThreshold),
                direction: direction
            },
            countsByCategory,
            topItems,
            excludedFields: excludedFields
        };
        return res.json(response);
    } catch (error) {
        console.error('Error validating input:', error);
        return res.status(400).json({ success: false, message: error.message });   
    }

}

const downloadExcel = async (req, res) => {
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

module.exports = {
    analyzeKPIData,
    downloadExcel
};