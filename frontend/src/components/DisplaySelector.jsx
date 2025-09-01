import {
  DisplaySection,
  SectionHeader,
  DisplayDropdown,
  TimeSettingContainer,
  TimeLabel,
  TimeUnit,
  TimeButton,
  ThresholdsContainer,
  ThresholdsGrid,
  DragHandle,
  OrderNumber,
  ThresholdInfo,
  CollectionName,
  FieldName,
  RemoveButton,
  ThresholdsHeader,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  ConfirmationModal,
  ConfirmationDialog,
  ConfirmationHeader,
  ConfirmationBody,
  ConfirmationActions,
  CancelButton,
  DeleteButton,
  HeaderActionsContainer,
  CycleTimeInput,
  FormattedTimeDisplay,
  ErrorCloseButton,
  DynamicThresholdTab
} from '../styles/DisplaySelector.styled';
import useDisplaySelector from '../hooks/useDisplaySelector';
import useDisplayTime from '../hooks/useDisplayTime';
import useDisplayOptions from '../hooks/useDisplayOptions';
import useConfirmationModal from '../hooks/useConfirmationModal';
import useControlledDisplay from '../hooks/useControlledDisplay';


const DisplaySelector = ({ 
  selectedDisplay: propSelectedDisplay, 
  displayThresholds: propDisplayThresholds, 
  loading: propLoading, 
  error: propError,
  onDisplayChange,
  onThresholdsUpdate,
  onLoadingChange,
  onErrorChange
}) => {
  // Original hook for uncontrolled mode
  const {
    selectedDisplay,
    displayThresholds,
    loading,
    error,
    removingThreshold,
    reorderLoading: hookReorderLoading,
    draggedItem: hookDraggedItem,
    dragOverIndex: hookDragOverIndex,
    handleDisplayChange: hookHandleDisplayChange,
    removeThreshold,
    clearError,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDisplaySelector();

  // Use props if provided (controlled mode) or hook state (uncontrolled mode)
  const currentSelectedDisplay = propSelectedDisplay !== undefined ? propSelectedDisplay : selectedDisplay;
  const currentDisplayThresholds = propDisplayThresholds !== undefined ? propDisplayThresholds : displayThresholds;
  const currentLoading = propLoading !== undefined ? propLoading : loading;
  const currentError = propError !== undefined ? propError : error;

  // Custom hooks for specific functionality
  const { getFilteredOptions, formatDisplayName } = useDisplayOptions();
  
  const { 
    displayTime, 
    isTimeUpdating, 
    handleTimeUpdate: updateDisplayTime, 
    handleTimeChange, 
    handleTimeBlur, 
    getFormattedTime 
  } = useDisplayTime(currentSelectedDisplay);
  
  const { 
    showConfirmation, 
    itemToDelete: thresholdToDelete, 
    openConfirmation, 
    closeConfirmation, 
    confirmAction 
  } = useConfirmationModal();
  
  const {
    localDraggedItem,
    localDragOverIndex,
    localReorderLoading,
    handleDisplayChangeControlled,
    handleThresholdRemoveControlled,
    handleDragStartControlled,
    handleDragOverControlled,
    handleDragLeaveControlled,
    handleDropControlled,
    handleDragEndControlled
  } = useControlledDisplay();

  // Debug: Add console.log to see state changes
  console.log('DisplayTime state:', displayTime, 'Type:', typeof displayTime);

  const handleDisplayChangeWrapper = async (e) => {
    const displayName = e.target.value;
    
    // If controlled mode, call controlled handler
    if (onDisplayChange) {
      await handleDisplayChangeControlled(
        displayName, 
        onDisplayChange, 
        onThresholdsUpdate, 
        onLoadingChange, 
        onErrorChange
      );
    } else {
      // If uncontrolled mode, use hook handler
      hookHandleDisplayChange(displayName);
    }
  };

  const handleThresholdRemove = (thresholdId) => {
    // Find the threshold to delete for confirmation display
    const threshold = currentDisplayThresholds.find(t => t._id === thresholdId);
    openConfirmation(threshold);
  };

  const confirmDeleteThreshold = async () => {
    await confirmAction(async (threshold) => {
      const thresholdId = threshold._id;

      if (onThresholdsUpdate) {
        // Controlled mode - use controlled handler
        await handleThresholdRemoveControlled(
          currentSelectedDisplay,
          thresholdId,
          currentDisplayThresholds,
          onThresholdsUpdate,
          onErrorChange
        );
      } else {
        // Uncontrolled mode - use hook
        await removeThreshold(thresholdId);
      }
    });
  };

  // Handle time setting update
  const handleTimeUpdateWrapper = async () => {
    await updateDisplayTime(currentDisplayThresholds);
  };

  const handleErrorClear = () => {
    if (onErrorChange) {
      onErrorChange(null);
    } else {
      clearError();
    }
  };

  // Drag and drop handlers for controlled mode
  const handleDragStartWrapper = (e, index) => {
    if (onThresholdsUpdate) {
      // Controlled mode - use controlled handler
      handleDragStartControlled(e, index);
    } else {
      // Uncontrolled mode - use hook
      handleDragStart(e, index);
    }
  };

  const handleDragOverWrapper = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (onThresholdsUpdate) {
      // Controlled mode
      handleDragOverControlled(e, index);
    } else {
      // Uncontrolled mode
      handleDragOver(e, index);
    }
  };

  const handleDragLeaveWrapper = () => {
    if (onThresholdsUpdate) {
      // Controlled mode
      handleDragLeaveControlled();
    } else {
      // Uncontrolled mode
      handleDragLeave();
    }
  };

  const handleDropWrapper = async (e, dropIndex) => {
    e.preventDefault();
    
    if (onThresholdsUpdate) {
      // Controlled mode
      await handleDropControlled(
        e, 
        dropIndex, 
        currentSelectedDisplay,
        currentDisplayThresholds,
        onThresholdsUpdate,
        onErrorChange
      );
    } else {
      // Uncontrolled mode
      handleDrop(e, dropIndex);
    }
  };

  const handleDragEndWrapper = () => {
    if (onThresholdsUpdate) {
      // Controlled mode
      handleDragEndControlled();
    } else {
      // Uncontrolled mode
      handleDragEnd();
    }
  };

  // Use controlled or uncontrolled drag state
  const currentDraggedItem = onThresholdsUpdate ? localDraggedItem : hookDraggedItem;
  const currentDragOverIndex = onThresholdsUpdate ? localDragOverIndex : hookDragOverIndex;
  const currentReorderLoading = onThresholdsUpdate ? localReorderLoading : hookReorderLoading;

  return (
    <DisplaySection
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <div>
          <h3>Playlist Configuration</h3>
          <div className="description">
            Select a playlist to view its configured reports
          </div>
        </div>
        <HeaderActionsContainer>
          <DisplayDropdown
            value={currentSelectedDisplay}
            onChange={handleDisplayChangeWrapper}
            disabled={currentLoading}
          >
            <option value="">Select a playlist...</option>
            {getFilteredOptions().map(option => (
              <option key={option.displayName} value={option.displayName}>
                {formatDisplayName(option.displayName)}
              </option>
            ))}
          </DisplayDropdown>
          
          {currentSelectedDisplay && (
            <TimeSettingContainer>
              <TimeLabel>Cycle Time:</TimeLabel>
              <CycleTimeInput
                type="number"
                min="5"
                max="3600"
                value={displayTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                onBlur={(e) => handleTimeBlur(e.target.value)}
                disabled={isTimeUpdating}
                placeholder="seconds"
              />
              <TimeUnit>sec</TimeUnit>
              <TimeButton
                onClick={handleTimeUpdateWrapper}
                disabled={isTimeUpdating || !currentSelectedDisplay}
              >
                {isTimeUpdating ? 'Saving...' : 'Save'}
              </TimeButton>
              <FormattedTimeDisplay>
                {getFormattedTime()}
              </FormattedTimeDisplay>
            </TimeSettingContainer>
          )}
          
          {currentLoading && <LoadingSpinner />}
        </HeaderActionsContainer>
      </SectionHeader>

      {currentError && (
        <ErrorMessage>
          <span>⚠️ {currentError}</span>
          <ErrorCloseButton onClick={handleErrorClear}>
            ×
          </ErrorCloseButton>
        </ErrorMessage>
      )}

      {currentSelectedDisplay && currentDisplayThresholds.length > 0 && (
        <ThresholdsContainer>
          <ThresholdsHeader>
            <h4>Configured Thresholds {currentReorderLoading && '(Saving order...)'}</h4>
            <span className="count">
              {currentDisplayThresholds.length} threshold{currentDisplayThresholds.length !== 1 ? 's' : ''}
              {currentDisplayThresholds.length > 1 && ' • Drag to reorder'}
            </span>
          </ThresholdsHeader>
          
          <ThresholdsGrid>
            {currentDisplayThresholds.map((threshold, index) => (
              <DynamicThresholdTab 
                key={threshold._id || index}
                draggable={!currentReorderLoading}
                $isDragging={currentDraggedItem === index}
                $dragOverIndex={currentDragOverIndex}
                $index={index}
                onDragStart={(e) => handleDragStartWrapper(e, index)}
                onDragOver={(e) => handleDragOverWrapper(e, index)}
                onDragLeave={handleDragLeaveWrapper}
                onDrop={(e) => handleDropWrapper(e, index)}
                onDragEnd={handleDragEndWrapper}
              >
                <OrderNumber>{index + 1}</OrderNumber>
                <DragHandle title="Drag to reorder">⋮⋮</DragHandle>
                <ThresholdInfo>
                  <CollectionName>{threshold.collectionName}</CollectionName>
                  <FieldName>{threshold.field}</FieldName>
                </ThresholdInfo>
                <RemoveButton
                  onClick={() => handleThresholdRemove(threshold._id)}
                  disabled={removingThreshold === threshold._id || currentReorderLoading}
                  title="Remove threshold"
                >
                  {removingThreshold === threshold._id ? '...' : '×'}
                </RemoveButton>
              </DynamicThresholdTab>
            ))}
          </ThresholdsGrid>
        </ThresholdsContainer>
      )}

      {currentSelectedDisplay && currentDisplayThresholds.length === 0 && !currentLoading && !currentError && (
        <EmptyState>
          No thresholds configured for this display
        </EmptyState>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && thresholdToDelete && (
        <ConfirmationModal>
          <ConfirmationDialog>
            <ConfirmationHeader>
              <h3>Delete Threshold</h3>
            </ConfirmationHeader>
            
            <ConfirmationBody>
              <p>Are you sure you want to delete this threshold? This action cannot be undone.</p>
              
              <div className="threshold-info">
                <div className="collection">{thresholdToDelete?.collectionName}</div>
                <div className="field">{thresholdToDelete?.field}</div>
              </div>
              
              <p>This will remove the threshold from the "{currentSelectedDisplay}" display configuration.</p>
            </ConfirmationBody>
            
            <ConfirmationActions>
              <CancelButton onClick={closeConfirmation}>
                Cancel
              </CancelButton>
              <DeleteButton 
                onClick={confirmDeleteThreshold}
                disabled={removingThreshold === thresholdToDelete?._id}
              >
                {removingThreshold === thresholdToDelete?._id ? 'Deleting...' : 'Delete Threshold'}
              </DeleteButton>
            </ConfirmationActions>
          </ConfirmationDialog>
        </ConfirmationModal>
      )}
    </DisplaySection>
  );
};

export default DisplaySelector;
