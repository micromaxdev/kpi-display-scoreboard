import './CollectionDataTable.css';

const CollectionDataTable = ({ 
  collectionName, 
  sampleData, 
  loading, 
  error,
  measurableFields = []
}) => {
  if (!collectionName) {
    return (
      <div className="data-table-container static">
        <div className="data-table-header">
          <h3>Collection Data Preview</h3>
          <p>Select a collection to see sample data</p>
        </div>
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <p>Choose a collection from the dropdown to preview its data structure and fields.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="data-table-container static">
        <div className="data-table-header">
          <h3>Collection Data Preview</h3>
          <p>Loading sample data for {collectionName}...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-table-container static">
        <div className="data-table-header">
          <h3>Collection Data Preview</h3>
          <p className="error-text">Error loading data: {error}</p>
        </div>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <p>Unable to load data for this collection.</p>
        </div>
      </div>
    );
  }

  if (!sampleData || sampleData.length === 0) {
    return (
      <div className="data-table-container static">
        <div className="data-table-header">
          <h3>Collection Data Preview</h3>
          <p>No data found for {collectionName}</p>
        </div>
        <div className="empty-content">
          <div className="empty-icon">📭</div>
          <p>This collection appears to be empty.</p>
        </div>
      </div>
    );
  }

// Get all unique fields from the sample data, excluding common system fields
const excludedFields = [
  '_id', 
  '__v', 
  'password', 
  'createdAt', 
  'updatedAt', 
  'id',
  'created_at',
  'updated_at'
];

// Helper function to check if a field should be excluded
const shouldExcludeField = (fieldName) => {
  // Direct match with excluded fields
  if (excludedFields.includes(fieldName)) return true;
  
  // Pattern-based exclusion for variations
  const lowercaseField = fieldName.toLowerCase();
  if (lowercaseField.includes('password') || 
      lowercaseField.includes('token') ||
      lowercaseField.includes('secret') ||
      lowercaseField.endsWith('_id') ||
      lowercaseField.startsWith('_')) return true;
      
  return false;
};

const allFields = [
    ...new Set(
        sampleData
            .flatMap(Object.keys)
            .filter((field) => !shouldExcludeField(field))
    ),
];

// Show all fields (no filtering, just limit to reasonable number for display)
const displayFields = allFields.slice(0, 12); // Show up to 12 columns for better readability

const formatCellValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
        if (value instanceof Date) return value.toLocaleDateString();
        return JSON.stringify(value);
    }
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string' && value.length > 50) {
        return value.substring(0, 50) + '...';
    }
    return String(value);
};

  const isFieldMeasurable = (fieldName) => {
    return measurableFields.includes(fieldName);
  };

  return (
    <div className="data-table-container static">
      <div className="data-table-header">
        <h3>Collection Data Preview</h3>
        <p>
          Showing {sampleData.length} sample records with all fields from <strong>{collectionName}</strong>
        </p>
        <div className="field-legend">
          <span className="legend-item">
            <span className="legend-dot measurable"></span>
            Measurable fields (for KPI)
          </span>
          <span className="legend-item">
            <span className="legend-dot regular"></span>
            Other fields
          </span>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {displayFields.map((field, index) => (
                <th 
                  key={index} 
                  className={isFieldMeasurable(field) ? 'measurable-header' : 'regular-header'}
                  title={isFieldMeasurable(field) ? 'This field can be used for KPI measurement' : 'Regular field'}
                >
                  {field}
                  {isFieldMeasurable(field) && <span className="measurable-icon">📊</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {displayFields.map((field, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className={isFieldMeasurable(field) ? 'measurable-cell' : 'regular-cell'}
                  >
                    {formatCellValue(row[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {allFields.length > displayFields.length && (
        <div className="table-footer">
          <small>
            Showing {displayFields.length} of {allFields.length} fields. 
            Measurable fields are highlighted for KPI calculations.
          </small>
        </div>
      )}
    </div>
  );
};

export default CollectionDataTable;
