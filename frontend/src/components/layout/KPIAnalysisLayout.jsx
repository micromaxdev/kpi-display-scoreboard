import { motion } from 'framer-motion';
import {
  PreviewPage as AnalysisPageContainer,
  Container,
  Card,
  DataSection,
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  EmptyState
} from '../../styles/KpiLayout.styled';

const KPIAnalysisLayout = ({ 
  title, 
  subtitle, 
  analysisData, 
  field, 
  collectionName, 
  actionButtons,
  emptyStateTitle = "No Analysis Data Available",
  emptyStateMessage = "Please configure your threshold and display settings."
}) => {
  if (!analysisData) {
    return (
      <AnalysisPageContainer>
        <Container>
          {actionButtons}
          <Card>
            <EmptyState>
              <div className="icon">📊</div>
              <h3>{emptyStateTitle}</h3>
              <p>{emptyStateMessage}</p>
            </EmptyState>
          </Card>
        </Container>
      </AnalysisPageContainer>
    );
  }

  const { collection, thresholds, countsByCategory, topItems } = analysisData;

  const categories = ['red', 'amber', 'green'];
  const categoryLabels = {
    red: 'Critical Issues',
    amber: 'Needs Attention', 
    green: 'Good Performance'
  };

  // Function to get dynamic category descriptions based on thresholds
  const getCategoryDescription = (category) => {
    const { thresholds } = analysisData;
    
    // Check if thresholds exist and have the required properties
    if (!thresholds || !thresholds.direction || thresholds.green === undefined || thresholds.amber === undefined) {
      // Fallback descriptions when thresholds are not available
      const fallbackDescriptions = {
        red: 'Records that require immediate attention and action. These are the most critical items that need to be addressed as soon as possible.',
        amber: 'Records that need monitoring and may require attention soon. These items should be reviewed and addressed before they become critical.',
        green: 'Records that are performing well and meeting expectations. These items are in good standing and require no immediate action.'
      };
      return fallbackDescriptions[category];
    }
    
    const direction = thresholds.direction;
    const greenThreshold = thresholds.green;
    const amberThreshold = thresholds.amber;
    
    if (direction === 'higher') {
      switch (category) {
      case 'red':
        return (
        <>
          Records with values &lt; <strong>{amberThreshold?.toLocaleString() || amberThreshold}</strong>. These require immediate attention.
        </>
        );
      case 'amber':
        return (
        <>
          Records with values between <strong>{amberThreshold?.toLocaleString() || amberThreshold}</strong> and <strong>{greenThreshold?.toLocaleString() || greenThreshold}</strong>. These need monitoring.
        </>
        );
      case 'green':
        return (
        <>
          Records with values &ge; <strong>{greenThreshold?.toLocaleString() || greenThreshold}</strong>. These are performing well.
        </>
        );
      default:
        return 'No description available.';
      }
    } else if (direction === 'lower') {
      switch (category) {
      case 'red':
        return (
        <>
          Records with values &gt; <strong>{amberThreshold?.toLocaleString() || amberThreshold}</strong>. These require immediate attention.
        </>
        );
      case 'amber':
        return (
        <>
          Records with values between <strong>{greenThreshold?.toLocaleString() || greenThreshold}</strong> and <strong>{amberThreshold?.toLocaleString() || amberThreshold}</strong>. These need monitoring.
        </>
        );
      case 'green':
        return (
        <>
          Records with values &le; <strong>{greenThreshold?.toLocaleString() || greenThreshold}</strong>. These are performing well.
        </>
        );
      default:
        return 'No description available.';
      }
    }
    
    return 'No description available.';
  };

  // Generate dynamic descriptions for each category
  const categoryDescriptions = {
    red: getCategoryDescription("red"),
    amber: getCategoryDescription("amber"),
    green: getCategoryDescription("green")
  };

  

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Function to get all unique fields from data, excluding system fields
  const getDynamicFields = (data) => {
    // Ensure data is an array and has elements
    if (!Array.isArray(data) || data.length === 0) {
      return ['ragCategory']; // Return at least the RAG field
    }
    
    const excludedFields = [
      '_id', 
      '__v', 
      'password', 
      'createdAt', 
      'updatedAt', 
      'id',
      'created_at',
      'updated_at',
      // Exclude score/comparison fields from display
      'comparisonValue',
      'score'
    ];

    const shouldExcludeField = (fieldName) => {
      if (excludedFields.includes(fieldName)) return true;
      
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
        data
          .flatMap(Object.keys)
          .filter((field) => !shouldExcludeField(field))
      ),
    ];

    // Always put RAG first, then other fields
    const ragField = 'ragCategory';
    const otherFields = allFields.filter(field => field !== ragField);
    
    // Ensure we always have at least the RAG field
    const result = [ragField, ...otherFields];
    return result.length > 0 ? result : ['ragCategory'];
  };

  // Function to get grid template columns based on field count - using smaller columns
  const getGridTemplateColumns = (fieldCount) => {
    // Validate fieldCount and ensure it's a positive number
    const validFieldCount = typeof fieldCount === 'number' && fieldCount > 0 ? fieldCount : 1;
    
    // If only 1 field (just RAG), return single column
    if (validFieldCount <= 1) {
      return '40px';
    }
    
    // Responsive column sizing: fixed RAG column + flexible data columns
    const ragColumn = '40px';
    const otherColumnsCount = validFieldCount - 1;
    const standardColumns = Array(otherColumnsCount).fill('minmax(130px, 1fr)').join(' ');
    return `${ragColumn} ${standardColumns}`;
  };

  // Function to format cell value
  const formatCellValue = (value, fieldName) => {
    if (value === null || value === undefined) return '-';
    
    // Special handling for RAG field
    if (fieldName === 'ragCategory') {
      return (
        <div className={`rag-dot ${value}`} style={{ width: '10px', height: '10px' }}></div>
      );
    }
    
    // Handle different data types
    if (typeof value === 'object') {
      if (value instanceof Date) return value.toLocaleDateString();
      return JSON.stringify(value);
    }
    
    if (typeof value === 'number') {
      // Check if it looks like currency/amount - exclude comparisonValue
      if ((fieldName.toLowerCase().includes('amount') || 
           fieldName.toLowerCase().includes('price') ||
           fieldName.toLowerCase().includes('cost')) &&
          !fieldName.toLowerCase().includes('comparison')) {
        return formatCurrency(value);
      }
      return value.toLocaleString();
    }
    
    if (typeof value === 'string') {
      if (value.length > 30) {
        return value.substring(0, 30) + '...';
      }
      return value;
    }
    
    return String(value);
  };

  // Function to get field display name
  const getFieldDisplayName = (fieldName) => {
    const displayNames = {
      'ragCategory': 'RAG',
      'customerName': 'Customer Name',
      'custCode': 'Customer Code',
      'customerCode': 'Customer Code',
      'docNo': 'Document No',
      'callId': 'Call ID',
      'docDate': 'Document Date',
      'inputDate': 'Input Date',
      'dueDate': 'Due Date',
      'quotedAmount': 'Quoted Amount',
      'amount': 'Amount',
      'salesEmployee': 'Sales Employee',
      'subject': 'Subject',
      'jobType': 'Job Type',
      'comparisonValue': 'Score'
    };
    
    return displayNames[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const isMeasurementField = (fieldName) => {
    if (!fieldName || !field) return false;
    return String(fieldName).toLowerCase() === String(field).toLowerCase();
  };

  return (
    <AnalysisPageContainer>
      <Container style={{ maxWidth: '100%', padding: '0' }}>

        {/* Full-width Data Table Section */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ padding: '1.5rem', margin: '0' }}
        >

          <DataSection>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginBottom: '0.5rem'
            }}>
              <h3 style={{ 
                fontSize: 'clamp(1.1rem, 1.2vw + 0.6rem, 2rem)',
                fontWeight: '600',
                color: '#2c3e50',
                margin: 0
              }}>
                 {title} for "{collectionName?.toUpperCase()}" with measurement: "{field?.toUpperCase()}"
              </h3>
              <div>
                {actionButtons}
              </div>
            </div>
            
            {/* Display all categories */}
            {categories.map((category, categoryIndex) => {
              const categoryData = topItems[category] || [];
              const fields = getDynamicFields(categoryData);
              const gridTemplateColumns = getGridTemplateColumns(fields.length);
              
              return (
                <div key={category} style={{ marginBottom: '2rem' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '250px 1fr',
                      gap: '1.5rem',
                      alignItems: 'start'
                    }}
                  >
                    {/* RAG Explanation Card */}
                    <Card style={{ 
                      padding: '1rem', 
                      margin: '0',
                      background: category === 'red' ? 'linear-gradient(135deg, #fff5f5, #fed7d7)' :
                                 category === 'amber' ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' :
                                 'linear-gradient(135deg, #f0fff4, #c6f6d5)',
                      border: `3px solid ${
                        category === 'red' ? '#dc3545' :
                        category === 'amber' ? '#ffc107' :
                        '#28a745'
                      }`
                    }}>
                      <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                        <div className={`rag-dot ${category}`} style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          margin: '0 auto 0.5rem',
                          background: category === 'red' ? 'linear-gradient(135deg, #dc3545, #c82333)' :
                                     category === 'amber' ? 'linear-gradient(135deg, #ffc107, #e0a800)' :
                                     'linear-gradient(135deg, #28a745, #1e7e34)',
                          border: `3px solid ${
                            category === 'red' ? '#dc3545' :
                            category === 'amber' ? '#ffc107' :
                            '#28a745'
                          }`,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}></div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: category === 'red' ? '#dc3545' :
                                 category === 'amber' ? '#d97706' :
                                 '#059669',
                          marginBottom: '0.25rem'
                        }}>
                          {categoryLabels[category]}
                        </h4>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '0.75rem'
                        }}>
                          {countsByCategory[category].toLocaleString()} Records
                        </div>
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        color: '#6b7280',
                        lineHeight: '1.4',
                        textAlign: 'center'
                      }}>
                        {categoryDescriptions[category]}
                      </p>
                    </Card>

                    {/* Scrollable Data Table */}
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                      <DataTable style={{ 
                        width: '100%',
                        maxHeight: '250px',
                        fontSize: '0.75rem',
                        overflowX: 'auto',
                        overflowY: 'auto'
                      }}>
                        {categoryData.length > 0 ? (
                          <div style={{ 
                            minWidth: `${fields.length * 130}px`, // Ensure minimum width for all columns
                            width: '100%'
                          }}>
                            <TableHeader style={{ 
                              padding: '0.5rem',
                              fontSize: '0.7rem',
                              gridTemplateColumns: gridTemplateColumns,
                              position: 'sticky',
                              top: 0,
                              zIndex: 10
                            }}>
                              {fields.map((fieldName, index) => (
                                <div key={index} className={isMeasurementField(fieldName) ? 'measurable' : ''} style={{ 
                                  padding: '0.25rem',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {getFieldDisplayName(fieldName)}
                                </div>
                              ))}
                            </TableHeader>
                            {categoryData.map((item, index) => (
                              <TableRow
                                key={`${item.callId || item.docNo || item._id || index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                style={{ 
                                  padding: '0.5rem',
                                  gridTemplateColumns: gridTemplateColumns
                                }}
                              >
                                {fields.map((fieldName, fieldIndex) => (
                                  <TableCell 
                                    key={fieldIndex} 
                                    style={{ 
                                      fontSize: '0.7rem',
                                      padding: '0.25rem',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                    className={`${fieldName === 'ragCategory' ? 'rag-indicator' : ''} ${isMeasurementField(fieldName) ? 'measurable' : ''}`}
                                    title={item[fieldName] ? String(item[fieldName]) : '-'}
                                  >
                                    {formatCellValue(item[fieldName], fieldName)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </div>
                        ) : (
                          <EmptyState style={{ padding: '2rem' }}>
                            <div className="icon" style={{ fontSize: '2rem' }}>📄</div>
                            <h3 style={{ fontSize: '1rem' }}>No {categoryLabels[category]} Records</h3>
                            <p style={{ fontSize: '0.8rem' }}>{categoryDescriptions[category]}</p>
                          </EmptyState>
                        )}
                      </DataTable>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </DataSection>
        </Card>
      </Container>
    </AnalysisPageContainer>
  );
};

export default KPIAnalysisLayout;
