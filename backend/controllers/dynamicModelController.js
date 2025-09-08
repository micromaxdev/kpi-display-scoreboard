const { 
  buildQuery, 
  buildSortOptions, 
  extractQueryParams 
} = require('../services/queryService.js');
const {
  getPaginatedDataFromCollection,
  getCollectionFields,
  getListOfCollections
} = require('../services/dataService.js');


// Main function to retrieve collection data with pagination and indexing
const getPaginatedData = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { page, limit, sortBy, sortOrder, filters } = extractQueryParams(req.query);

    // Build query and sort options using service functions
    const query = buildQuery(filters);
    const sortOptions = buildSortOptions(sortBy, sortOrder);

    // Use the dataService to get paginated data
    const result = await getPaginatedDataFromCollection(
      collectionName,
      query,
      sortOptions,
      page,
      limit
    );

    // Transform the response to match the original format
    res.json({
      success: result.success,
      data: result.data,
      pagination: result.pagination,
      collectionName: result.collection
    });

  } catch (error) {
    console.error('Error retrieving collection data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving data',
      error: error.message 
    });
  }
};

// Function to get list of collections in the database
const getCollectionsList = async (req, res) => {
  try {
    const collections = await getListOfCollections();
    res.json({
      success: collections.success,
      collections: collections.collectionsName,
      totalCollections: collections.totalCollections
    });
  } catch (error) {
    console.error('Error retrieving collections list:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving collections list',
      error: error.message
    });
  }
};

// Function to get fields of a specific collection
const getFieldsOfCollection = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const result = await getCollectionFields(collectionName);

    if (!result || !result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No fields found for the specified collection',
        collectionName
      });
    }
    res.json({
      success: result.success,
      fields: result.data,
      collectionName: result.collection
    });

  } catch (error) {
    console.error('Error retrieving fields of collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving fields',
      error: error.message
    });
  }
}

module.exports = {
    getPaginatedData,
    getCollectionsList,
    getFieldsOfCollection
};