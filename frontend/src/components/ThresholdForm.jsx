import {
  Page,
  Header as PageHeader,
  Content,
  FormSection,
  DataSection,
  CardForm,
  CollectionSection,
  ConfigSection,
  FieldSection,
  ThresholdSection,
  DirectionSuggestion,
  SuggestionHeader,
  SuggestionIcon,
  SuggestionContent,
  SuggestionText,
  SuggestedDirection,
  ConfidenceBadge,
  SuggestionExplanation,
  ApplySuggestionButton,
  ThresholdError,
  ErrorIcon,
  Actions,
  FormGroup,
  SelectedInfo,
  FieldHelp,
  Message,
  CloseBtn,
  ThresholdInfo,
  InfoGrid,
  InfoItem,
  ColorIndicator,
  SubmitBtn,
  ResetBtn,
  LabelRow,
  InfoHelp,
  InfoIcon,
  Tooltip,
  UploadButton,
  CollectionActions,
} from '../styles/ThresholdForm.styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useThresholdFormWithData } from '../hooks/useThresholdForm';
import { getPlaceholderText, formatFieldDisplayName } from '../utils/formUtils';
import { getDirectionSuggestion } from '../utils/fieldUtils';
import CollectionDataTable from './CollectionDataTable';
import FileUploadModal from './FileUploadModal';

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

  // Tooltip visibility state
  const [showGreenTip, setShowGreenTip] = useState(false);
  const [showAmberTip, setShowAmberTip] = useState(false);
  const [showDirectionTip, setShowDirectionTip] = useState(false);
  
  // File upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
        <p>Configure green and amber thresholds for your KPI metrics</p>
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
            <CollectionSection>
              <FormGroup>
                <LabelRow>
                  <label htmlFor="collection">Collection *</label>
                  <UploadButton 
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    title="Upload new data file"
                  >
                    📤 Upload File
                  </UploadButton>
                </LabelRow>
                <select
                  id="collection"
                  value={selectedCollection}
                  onChange={(e) => {
                    console.log('Selected collection:', e.target.value);
                    updateField('selectedCollection', e.target.value);
                  }}
                  disabled={false}
                  required
                >
                  <option value="">{getPlaceholderText({ loading }, 'collection')}</option>
                  {collections.map((collection, index) => (
                    <option key={`collection-${index}`} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
                {selectedCollection && (
                  <SelectedInfo>Selected: {selectedCollection}</SelectedInfo>
                )}
              </FormGroup>
            </CollectionSection>

            {/* Field and Threshold Configuration */}
            <ConfigSection>
              <FieldSection>
                <FormGroup>
                  <label htmlFor="field">Field * <span className="field-info">(Only measurable fields shown)</span></label>
                  <select
                    id="field"
                    value={selectedField}
                    onChange={(e) => {
                      console.log('Selected field:', e.target.value);
                      updateField('selectedField', e.target.value);
                    }}
                    disabled={!selectedCollection}
                    required
                  >
                    <option value="">
                      {getPlaceholderText({ selectedCollection, fields, loading }, 'field')}
                    </option>
                    {fields.map((field, index) => (
                      <option key={`field-${index}`} value={field}>
                        {formatFieldDisplayName(field)}
                      </option>
                    ))}
                  </select>
                  {selectedField && (
                    <SelectedInfo>Selected: {formatFieldDisplayName(selectedField)}</SelectedInfo>
                  )}
                  {selectedCollection && fields.length === 0 && !loading && (
                    <FieldHelp>
                      <small>Only showing fields suitable for KPI measurement (amounts, dates, counts, etc.)</small>
                    </FieldHelp>
                  )}
                  
                  {/* Direction Suggestion with animation */}
                  <AnimatePresence initial={false} mode="wait">
                    {selectedField && directionSuggestion.suggestion && (
                      <DirectionSuggestion
                        as={motion.div}
                        key={`${selectedField}-${directionSuggestion.suggestion}`}
                        layout
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                        exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } }}
                      >
                        <SuggestionHeader as={motion.div} layout>
                          <SuggestionIcon as={motion.span} initial={{ rotate: -8 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>💡</SuggestionIcon>
                          <strong>Smart Suggestion:</strong>
                        </SuggestionHeader>
                        <SuggestionContent as={motion.div} layout>
                          <SuggestionText as={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                            <SuggestedDirection $type={directionSuggestion.suggestion}>
                              {directionSuggestion.suggestion === 'higher' ? 'Higher is Better' : 'Lower is Better'}
                            </SuggestedDirection>
                            <ConfidenceBadge as={motion.span} $level={directionSuggestion.confidence} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 250, damping: 16 }}>
                              {directionSuggestion.confidence} confidence
                            </ConfidenceBadge>
                          </SuggestionText>
                          <SuggestionExplanation as={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            {directionSuggestion.explanation}
                          </SuggestionExplanation>
                          {direction !== directionSuggestion.suggestion && (
                            <ApplySuggestionButton
                              as={motion.button}
                              type="button"
                              onClick={applySuggestedDirection}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              Apply Suggestion
                            </ApplySuggestionButton>
                          )}
                        </SuggestionContent>
                      </DirectionSuggestion>
                    )}
                  </AnimatePresence>
                </FormGroup>
              </FieldSection>

              <ThresholdSection>
                <FormGroup>
                  <label htmlFor="greenThreshold">
                    <LabelRow>
                      <span>Green Threshold *</span>
                      <InfoHelp
                        as={motion.div}
                        onHoverStart={() => setShowGreenTip(true)}
                        onHoverEnd={() => setShowGreenTip(false)}
                        onFocus={() => setShowGreenTip(true)}
                        onBlur={() => setShowGreenTip(false)}
                      >
                        <InfoIcon type="button" aria-label="Green threshold help">i</InfoIcon>
                        <AnimatePresence>
                          {showGreenTip && (
                            <Tooltip
                              as={motion.div}
                              key="tt-green"
                              initial={{ opacity: 0, y: 6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                              exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                            >
                              <strong>Green threshold</strong> is the target value for strong performance. Values meeting or exceeding this are considered green.
                            </Tooltip>
                          )}
                        </AnimatePresence>
                      </InfoHelp>
                    </LabelRow>
                  </label>
                  <input
                    type="number"
                    id="greenThreshold"
                    value={greenThreshold}
                    onChange={(e) => updateField('greenThreshold', e.target.value)}
                    placeholder="Enter green threshold value"
                    step="0.01"
                    disabled={loading}
                    required
                    className={!thresholdValidation.isValid ? 'error' : ''}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="amberThreshold">
                    <LabelRow>
                      <span>Amber Threshold *</span>
                      <InfoHelp
                        as={motion.div}
                        onHoverStart={() => setShowAmberTip(true)}
                        onHoverEnd={() => setShowAmberTip(false)}
                        onFocus={() => setShowAmberTip(true)}
                        onBlur={() => setShowAmberTip(false)}
                      >
                        <InfoIcon type="button" aria-label="Amber threshold help">i</InfoIcon>
                        <AnimatePresence>
                          {showAmberTip && (
                            <Tooltip
                              as={motion.div}
                              key="tt-amber"
                              initial={{ opacity: 0, y: 6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                              exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                            >
                              <strong>Amber threshold</strong> is a warning level indicating performance is approaching the target but not yet green.
                            </Tooltip>
                          )}
                        </AnimatePresence>
                      </InfoHelp>
                    </LabelRow>
                  </label>
                  <input
                    type="number"
                    id="amberThreshold"
                    value={amberThreshold}
                    onChange={(e) => updateField('amberThreshold', e.target.value)}
                    placeholder="Enter amber threshold value"
                    step="0.01"
                    disabled={loading}
                    required
                    className={!thresholdValidation.isValid ? 'error' : ''}
                  />
                  {!thresholdValidation.isValid && (
                    <ThresholdError>
                      <ErrorIcon>⚠️</ErrorIcon>
                      {thresholdValidation.message}
                    </ThresholdError>
                  )}
                </FormGroup>

                <FormGroup>
                  <label htmlFor="direction">
                    <LabelRow>
                      <span>Direction *</span>
                      <InfoHelp
                        as={motion.div}
                        onHoverStart={() => setShowDirectionTip(true)}
                        onHoverEnd={() => setShowDirectionTip(false)}
                        onFocus={() => setShowDirectionTip(true)}
                        onBlur={() => setShowDirectionTip(false)}
                      >
                        <InfoIcon type="button" aria-label="Direction help">i</InfoIcon>
                        <AnimatePresence>
                          {showDirectionTip && (
                            <Tooltip
                              as={motion.div}
                              key="tt-direction"
                              initial={{ opacity: 0, y: 6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                              exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                            >
                              Choose whether <strong>higher</strong> values or <strong>lower</strong> values indicate better performance for this KPI.
                            </Tooltip>
                          )}
                        </AnimatePresence>
                      </InfoHelp>
                    </LabelRow>
                  </label>
                  <select
                    id="direction"
                    value={direction}
                    onChange={(e) => updateField('direction', e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="higher">Higher is Better</option>
                    <option value="lower">Lower is Better</option>
                  </select>
                </FormGroup>
              </ThresholdSection>
            </ConfigSection>

            <Actions>
              <SubmitBtn type="submit" disabled={loading || !validation.isValid}>
                {loading ? 'Processing...' : 'Preview KPI Data'}
              </SubmitBtn>
              <ResetBtn type="button" onClick={resetForm} disabled={loading}>
                Reset
              </ResetBtn>
              <SubmitBtn type="button" onClick={handleSaveAndPreview} disabled={loading || !validation.isValid}>
                {loading ? 'Saving...' : 'Save & Preview'}
              </SubmitBtn>
            </Actions>
          </CardForm>

          <ThresholdInfo>
            <h3>Threshold Information</h3>
            <InfoGrid>
              <InfoItem>
                <ColorIndicator $color="green" />
                <span>{getThresholdDescription().green}</span>
              </InfoItem>
              <InfoItem>
                <ColorIndicator $color="amber" />
                <span>{getThresholdDescription().amber}</span>
              </InfoItem>
              <InfoItem>
                <ColorIndicator $color="red" />
                <span>{getThresholdDescription().red}</span>
              </InfoItem>
            </InfoGrid>
          </ThresholdInfo>
        </FormSection>

        <DataSection>
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
