import {
  DataTableContainer,
  Header,
  FieldLegend,
  LegendItem,
  LegendDot,
  TableWrapper,
  Table,
  Th,
  Td,
  TableFooter,
  CenteredContent,
  Loading,
  Spinner,
  MeasurableIcon,
  ErrorText,
} from '../../styles/CollectionDataTable.styled';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionDataTable = ({ 
  collectionName, 
  sampleData, 
  loading, 
  error,
  measurableFields = []
}) => {
  if (!collectionName) {
    return (
      <DataTableContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
        <Header>
          <h3>Collection Data Preview</h3>
          <p>Select a collection to see sample data</p>
        </Header>
        <CenteredContent initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
          <div className="icon">📊</div>
          <p>Choose a collection from the dropdown to preview its data structure and fields.</p>
        </CenteredContent>
      </DataTableContainer>
    );
  }

  if (loading) {
    return (
      <DataTableContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
        <Header>
          <h3>Collection Data Preview</h3>
          <p>Loading sample data for {collectionName}...</p>
        </Header>
        <Loading>
          <Spinner />
          <p>Fetching data...</p>
        </Loading>
      </DataTableContainer>
    );
  }

  if (error) {
    return (
      <DataTableContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
        <Header>
          <h3>Collection Data Preview</h3>
          <ErrorText>Error loading data: {error}</ErrorText>
        </Header>
        <CenteredContent initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
          <div className="icon">⚠️</div>
          <p>Unable to load data for this collection.</p>
        </CenteredContent>
      </DataTableContainer>
    );
  }

  if (!sampleData || sampleData.length === 0) {
    return (
      <DataTableContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
        <Header>
          <h3>Collection Data Preview</h3>
          <p>No data found for {collectionName}</p>
        </Header>
        <CenteredContent initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
          <div className="icon">📭</div>
          <p>This collection appears to be empty.</p>
        </CenteredContent>
      </DataTableContainer>
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
    <DataTableContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
      <Header>
        <h3>Collection Data Preview</h3>
        <p>
          Showing {sampleData.length} sample records with all fields from <strong>{collectionName}</strong>
        </p>
        <FieldLegend>
          <LegendItem>
            <LegendDot $type="measurable" />
            Measurable fields (for KPI)
          </LegendItem>
          <LegendItem>
            <LegendDot $type="regular" />
            Other fields
          </LegendItem>
        </FieldLegend>
      </Header>

      <TableWrapper as={motion.div} layout>
        <Table as={motion.table} layout>
          <thead>
            <motion.tr initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {displayFields.map((field, index) => (
                <Th
                  as={motion.th}
                  key={index}
                  $measurable={isFieldMeasurable(field)}
                  title={isFieldMeasurable(field) ? 'This field can be used for KPI measurement' : 'Regular field'}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.2 }}
                >
                  {field}
                  {isFieldMeasurable(field) && <MeasurableIcon>📊</MeasurableIcon>}
                </Th>
              ))}
            </motion.tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sampleData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
               >
                  {displayFields.map((field, cellIndex) => (
                    <Td as={motion.td} key={cellIndex} $measurable={isFieldMeasurable(field)} layout>
                      {formatCellValue(row[field])}
                    </Td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </TableWrapper>

      {allFields.length > displayFields.length && (
        <TableFooter>
          <small>
            Showing {displayFields.length} of {allFields.length} fields. Measurable fields are highlighted for KPI calculations.
          </small>
        </TableFooter>
      )}
    </DataTableContainer>
  );
};

export default CollectionDataTable;
