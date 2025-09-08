import {
  Page,
  Content,
  FormSection,
  DataSection,
  CardForm,
  ConfigSection,
  Message,
  CloseBtn
} from '../../styles/ThresholdForm.styled';
import { useMemo, useState, useEffect } from 'react';
import { useThresholdFormWithData } from '../../hooks/useThresholdForm';
import { getDirectionSuggestion } from '../../utils/fieldUtils';
import { fetchCollectionFields } from '../../services/apiService';
import CollectionDataTable from '../data/CollectionDataTable';
import FileUploadModal from '../modals/FileUploadModal';
import ExcludedFieldsModal from '../modals/ExcludedFieldsModal';
import CollectionSelector from '../selectors/CollectionSelector';
import FieldSelector from '../selectors/FieldSelector';
import ThresholdConfig from '../config/ThresholdConfig';
import ThresholdInfoPanel from '../data/ThresholdInfoPanel';
import FormActions from './FormActions';

const ThresholdForm = () => {
  // Display state for passing to hook
  const [selectedDisplay, setSelectedDisplay] = useState('');
  const [displayThresholds, setDisplayThresholds] = useState([]);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);

  // Handle display change from DisplaySelector
  const handleDisplayChange = (e) => {
    const displayName = e.target ? e.target.value : e;
    setSelectedDisplay(displayName);
  };

  const {
    formData,
    message,
    loading,
    thresholdValidation,
    collections,
    fields,
    sampleData,
    sampleDataLoading,
    updateField,
    resetForm,
    clearMessage,
    handlePreview,
    handleSaveAndPreview,
    validation,
    refetchCollections,
    fetchAndPopulateThreshold,
    fetchExcludedFieldsForCurrentSelection,
    autoPopulating, // <-- new state from hook
    hasDirectionError
  } = useThresholdFormWithData(selectedDisplay); // Pass selectedDisplay to hook

  const {
    selectedCollection,
    selectedField,
    greenThreshold,
    amberThreshold,
    direction
  } = formData;

  // File upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Excluded fields modal state
  const [isExcludedFieldsModalOpen, setIsExcludedFieldsModalOpen] = useState(false);
  const [modalCollectionFields, setModalCollectionFields] = useState([]);
  const [currentExcludedFields, setCurrentExcludedFields] = useState([]);

  // Reset excluded fields when collection or field changes and fetch new ones
  useEffect(() => {
    const fetchExcludedFields = async () => {
      const excludedFields = await fetchExcludedFieldsForCurrentSelection(formData.selectedCollection, formData.selectedField);
      setCurrentExcludedFields(excludedFields);
    };

    fetchExcludedFields();
  }, [formData.selectedCollection, formData.selectedField, fetchExcludedFieldsForCurrentSelection]);

  // Get direction suggestion for the selected field
  const directionSuggestion = useMemo(() => {
    console.log('Calculating direction suggestion for field:', selectedField);
    const suggestion = getDirectionSuggestion(selectedField);
    console.log('Direction suggestion result:', suggestion);
    return suggestion;
  }, [selectedField]);
  
  // Handle applying the suggested direction
  const applySuggestedDirection = () => {
    if (directionSuggestion.suggestion) {
      updateField('direction', directionSuggestion.suggestion);
    }
  };

  // Handle successful file upload
  const handleUploadSuccess = (result) => {
    console.log('File uploaded successfully:', result);
    
    // Reset collection selection to trigger data refresh
    updateField('selectedCollection', '');
    updateField('selectedField', '');
    
    // Refresh collections list to show the newly uploaded collection
    refetchCollections();
  };

  // Handle opening excluded fields modal
  const handleOpenExcludedFieldsModal = async () => {
    console.log('🔧 Excluded Fields button clicked!');
    
    if (!formData.selectedCollection) {
      alert('Please select a collection first.');
      return;
    }

    if (!formData.selectedField) {
      alert('Please select a field first.');
      return;
    }

    try {
      // Get all fields for the selected collection
      console.log('Fetching fields for collection:', formData.selectedCollection);
      const fieldsResponse = await fetchCollectionFields(formData.selectedCollection);
      
      if (!fieldsResponse.success) {
        alert('Failed to fetch collection fields. Please try again.');
        return;
      }

      // Use the already fetched excluded fields from state
      console.log('Using excluded fields from state:', currentExcludedFields);

      // Set the modal data
      setModalCollectionFields(fieldsResponse.fields || []);
      setIsExcludedFieldsModalOpen(true);
      
      console.log('Modal opened with fields:', fieldsResponse.fields);
      console.log('Using excluded fields:', currentExcludedFields);
      
    } catch (error) {
      console.error('Error opening excluded fields modal:', error);
      alert('Error loading data. Please try again.');
    }
  };

  // Handle excluded fields changes from modal
  const handleExcludedFieldsChange = (excludedFields) => {
    console.log('Excluded fields updated in state:', excludedFields);
    setCurrentExcludedFields(excludedFields);
    console.log('Current excluded fields state after update:', excludedFields);
  };

  // Auto-populate thresholds and direction when both collection and field are chosen
  useEffect(() => {
    if (selectedCollection && selectedField) {
      fetchAndPopulateThreshold(selectedCollection, selectedField);
    }
  }, [selectedCollection, selectedField]);

  // Separate loading state for form submission
  const [submitting, setSubmitting] = useState(false);
  const safeValidation = validation || { isValid: true };

  // Wrap handlePreview and handleSaveAndPreview to set submitting state
  const handlePreviewWithLoading = async (e) => {
    console.log('Preview with excluded fields:', currentExcludedFields);
    setSubmitting(true);
    await handlePreview(e, currentExcludedFields);
    setSubmitting(false);
  };
  const handleSaveAndPreviewWithLoading = async (e) => {
    setSubmitting(true);
    await handleSaveAndPreview(currentExcludedFields);
    setSubmitting(false);
  };

  // Function to get threshold description based on direction
  const getThresholdDescription = () => {
    if (!greenThreshold || !amberThreshold) {
      return {
        green: "Green: Performance meets or exceeds target",
        amber: "Amber: Performance is approaching target", 
        red: "Red: Performance is below amber threshold"
      };
    }

    const green = parseFloat(greenThreshold);
    const amber = parseFloat(amberThreshold);

    if (direction === 'higher') {
      return {
        green: `Green: Values ≥ ${green} (meets or exceeds target)`,
        amber: `Amber: Values between ${amber} and ${green} (approaching target)`,
        red: `Red: Values < ${amber} (below target threshold)`
      };
    } else {
      return {
        green: `Green: Values ≤ ${green} (meets or exceeds target)`,
        amber: `Amber: Values between ${green} and ${amber} (approaching target)`,
        red: `Red: Values > ${amber} (above target threshold)`
      };
    }
  };

  const buttonsEnabled = !hasDirectionError && 
                         !submitting && 
                         formData.selectedCollection && 
                         formData.selectedField;

  return (
    <Page>
      {message.text && (
        <Message $type={message.type}>
          <span>{message.text}</span>
          <CloseBtn onClick={clearMessage}>&times;</CloseBtn>
        </Message>
      )}

      <Content>
        <FormSection>
          <CardForm onSubmit={handlePreviewWithLoading} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* Collection Selection - Full Width */}
            <CollectionSelector
              selectedCollection={selectedCollection}
              collections={collections}
              loading={loading}
              onCollectionChange={(value) => updateField('selectedCollection', value)}
              onUploadClick={() => setIsUploadModalOpen(true)}
              onExcludedFieldsClick={handleOpenExcludedFieldsModal}
              disabled={!buttonsEnabled}
            />

            {/* Field and Threshold Configuration */}
            <ConfigSection>
              <FieldSelector
                selectedCollection={selectedCollection}
                selectedField={selectedField}
                fields={fields}
                loading={loading}
                direction={direction}
                directionSuggestion={directionSuggestion}
                onFieldChange={(value) => updateField('selectedField', value)}
                onApplySuggestion={applySuggestedDirection}
              />

              <ThresholdConfig
                greenThreshold={greenThreshold}
                amberThreshold={amberThreshold}
                direction={direction}
                loading={loading}
                thresholdValidation={thresholdValidation}
                onGreenThresholdChange={(value) => updateField('greenThreshold', value)}
                onAmberThresholdChange={(value) => updateField('amberThreshold', value)}
                onDirectionChange={(value) => updateField('direction', value)}
              />
            </ConfigSection>

            <FormActions
              loading={submitting}
              isValid={buttonsEnabled}
              onPreview={handlePreviewWithLoading}
              onReset={resetForm}
              onSaveAndPreview={handleSaveAndPreviewWithLoading}
            />
          </CardForm>

          <ThresholdInfoPanel getThresholdDescription={getThresholdDescription} />
        </FormSection>

        <DataSection>
          {/* Collection Data Table */}
          <CollectionDataTable 
            collectionName={selectedCollection}
            sampleData={sampleData}
            loading={sampleDataLoading}
            measurableFields={fields}
          />
        </DataSection>
      </Content>

      {/* File Upload Modal */}
      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Excluded Fields Modal */}
      <ExcludedFieldsModal
        isOpen={isExcludedFieldsModalOpen}
        onClose={() => setIsExcludedFieldsModalOpen(false)}
        collectionFields={modalCollectionFields}
        isValid={buttonsEnabled}
        onExcludedFieldsChange={handleExcludedFieldsChange}
        initialExcludedFields={currentExcludedFields}
      />
    </Page>
  );
};

export default ThresholdForm;
