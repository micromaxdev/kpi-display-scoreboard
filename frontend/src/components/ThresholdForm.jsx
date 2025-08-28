import {
  Page,
  Header as PageHeader,
  Content,
  FormSection,
  DataSection,
  CardForm,
  ConfigSection,
  Message,
  CloseBtn
} from '../styles/ThresholdForm.styled';
import { useMemo, useState } from 'react';
import { useThresholdFormWithData } from '../hooks/useThresholdForm';
import { getDirectionSuggestion } from '../utils/fieldUtils';
import CollectionDataTable from './CollectionDataTable';
import FileUploadModal from './FileUploadModal';
import CollectionSelector from './CollectionSelector';
import FieldSelector from './FieldSelector';
import ThresholdConfig from './ThresholdConfig';
import ThresholdInfoPanel from './ThresholdInfoPanel';
import FormActions from './FormActions';
import DisplaySelector from './DisplaySelector';

const ThresholdForm = () => {
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
    refetchCollections
  } = useThresholdFormWithData();

  const {
    selectedCollection,
    selectedField,
    greenThreshold,
    amberThreshold,
    direction
  } = formData;

  // File upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Display selection state
  const [selectedDisplay, setSelectedDisplay] = useState('');
  const [displayThresholds, setDisplayThresholds] = useState([]);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);

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

  return (
    <Page>
      <PageHeader>
        <h2>Set KPI Thresholds</h2>
        {/* <p>Configure green and amber thresholds for your KPI metrics</p> */}
      </PageHeader>

      {message.text && (
        <Message $type={message.type}>
          <span>{message.text}</span>
          <CloseBtn onClick={clearMessage}>&times;</CloseBtn>
        </Message>
      )}

      <Content>
        <FormSection>
          <CardForm onSubmit={handlePreview} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* Collection Selection - Full Width */}
            <CollectionSelector
              selectedCollection={selectedCollection}
              collections={collections}
              loading={loading}
              onCollectionChange={(value) => updateField('selectedCollection', value)}
              onUploadClick={() => setIsUploadModalOpen(true)}
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
              loading={loading}
              isValid={validation.isValid}
              onPreview={handlePreview}
              onReset={resetForm}
              onSaveAndPreview={handleSaveAndPreview}
            />
          </CardForm>

          <ThresholdInfoPanel getThresholdDescription={getThresholdDescription} />
        </FormSection>

        <DataSection>
          {/* Display Selection Section */}
          <DisplaySelector
            selectedDisplay={selectedDisplay}
            displayThresholds={displayThresholds}
            loading={displayLoading}
            error={displayError}
            onDisplayChange={setSelectedDisplay}
            onThresholdsUpdate={setDisplayThresholds}
            onLoadingChange={setDisplayLoading}
            onErrorChange={setDisplayError}
          />
          
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
    </Page>
  );
};

export default ThresholdForm;
