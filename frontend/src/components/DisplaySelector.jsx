import React from 'react';
import {
  DisplaySection,
  SectionHeader,
  DisplayDropdown,
  TimeSettingContainer,
  TimeLabel,
  TimeInput,
  TimeUnit,
  TimeButton,
  ThresholdsContainer,
  ThresholdsGrid,
  ThresholdTab,
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
  DeleteButton
} from '../styles/DisplaySelector.styled';
import useDisplaySelector from '../hooks/useDisplaySelector';
import DisplayService from '../services/displayService';


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
    handleDragEnd,
    displayOptions
  } = useDisplaySelector();

  // Local state for controlled mode drag and drop
  const [localDraggedItem, setLocalDraggedItem] = React.useState(null);
  const [localDragOverIndex, setLocalDragOverIndex] = React.useState(null);
  const [localReorderLoading, setLocalReorderLoading] = React.useState(false);

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [thresholdToDelete, setThresholdToDelete] = React.useState(null);

  // Time setting state
  const [displayTime, setDisplayTime] = React.useState(30);
  const [isTimeUpdating, setIsTimeUpdating] = React.useState(false);

  // Debug: Add console.log to see state changes
  console.log('DisplayTime state:', displayTime, 'Type:', typeof displayTime);

  // Use props if provided (controlled mode) or hook state (uncontrolled mode)
  const currentSelectedDisplay = propSelectedDisplay !== undefined ? propSelectedDisplay : selectedDisplay;
  const currentDisplayThresholds = propDisplayThresholds !== undefined ? propDisplayThresholds : displayThresholds;
  const currentLoading = propLoading !== undefined ? propLoading : loading;
  const currentError = propError !== undefined ? propError : error;

  const handleDisplayChangeWrapper = async (e) => {
    const displayName = e.target.value;
    
    // If controlled mode, call prop handler AND fetch thresholds
    if (onDisplayChange) {
      onDisplayChange(displayName);
      
      // Fetch thresholds for controlled mode
      if (displayName && onThresholdsUpdate && onLoadingChange && onErrorChange) {
        try {
          onLoadingChange(true);
          onErrorChange(null);
          
          const result = await DisplayService.fetchDisplayConfig(displayName);
          
          if (result.success) {
            onThresholdsUpdate(result.thresholds);
          } else {
            onThresholdsUpdate([]);
            onErrorChange(result.error || 'No thresholds found for this display');
          }
        } catch (err) {
          console.error('Error fetching display thresholds:', err);
          onErrorChange(err.message || 'Failed to fetch display thresholds');
          onThresholdsUpdate([]);
        } finally {
          onLoadingChange(false);
        }
      }
    } else {
      // If uncontrolled mode, use hook handler
      hookHandleDisplayChange(displayName);
    }
  };

  const handleThresholdRemove = (thresholdId) => {
    // Find the threshold to delete for confirmation display
    const threshold = currentDisplayThresholds.find(t => t._id === thresholdId);
    setThresholdToDelete(threshold);
    setShowConfirmation(true);
  };

  const confirmDeleteThreshold = async () => {
    if (!thresholdToDelete) return;

    const thresholdId = thresholdToDelete._id;

    if (onThresholdsUpdate) {
      // Controlled mode - call parent remove logic or DisplayService
      try {
        const result = await DisplayService.removeThreshold(currentSelectedDisplay, thresholdId);
        
        if (result.success) {
          const updatedThresholds = currentDisplayThresholds.filter(t => t._id !== thresholdId);
          onThresholdsUpdate(updatedThresholds);
        } else {
          onErrorChange && onErrorChange(result.error || 'Failed to remove threshold');
        }
      } catch (err) {
        console.error('Error removing threshold:', err);
        onErrorChange && onErrorChange(err.message || 'Failed to remove threshold');
      }
    } else {
      // Uncontrolled mode - use hook
      await removeThreshold(thresholdId);
    }

    // Close confirmation modal
    setShowConfirmation(false);
    setThresholdToDelete(null);
  };

  const cancelDeleteThreshold = () => {
    setShowConfirmation(false);
    setThresholdToDelete(null);
  };

  // Fetch display config to get current time when display changes
  React.useEffect(() => {
    const fetchDisplayTime = async () => {
      if (currentSelectedDisplay) {
        try {
          const result = await DisplayService.fetchDisplayConfig(currentSelectedDisplay);
          if (result.success && result.display?.time) {
            setDisplayTime(result.display.time);
          }
        } catch (err) {
          console.error('Error fetching display time:', err);
        }
      }
    };

    fetchDisplayTime();
  }, [currentSelectedDisplay]);

  // Handle time setting update
  const handleTimeUpdate = async () => {
    if (!currentSelectedDisplay || !currentDisplayThresholds) return;
    
    // Ensure we have a valid number
    const timeValue = parseInt(displayTime);
    if (isNaN(timeValue) || timeValue < 5 || timeValue > 3600) {
      alert('Time must be between 5 and 3600 seconds');
      return;
    }
    
    try {
      setIsTimeUpdating(true);
      const thresholdIds = currentDisplayThresholds.map(t => t._id);
      
      console.log('Updating display config:', {
        displayName: currentSelectedDisplay,
        time: timeValue,
        thresholdIds
      });
      
      const result = await DisplayService.updateDisplayConfig(currentSelectedDisplay, timeValue, thresholdIds);
      
      if (result.success) {
        console.log(`Time updated successfully to ${timeValue}s`);
      } else {
        console.error('Update failed:', result.error);
        alert(`Failed to update time: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating time settings:', error);
      alert(`Failed to update time settings: ${error.message}`);
    } finally {
      setIsTimeUpdating(false);
    }
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
      // Controlled mode - handle locally
      setLocalDraggedItem(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.outerHTML);
      e.dataTransfer.setDragImage(e.target, 0, 0);
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
      setLocalDragOverIndex(index);
    } else {
      // Uncontrolled mode
      handleDragOver(e, index);
    }
  };

  const handleDragLeaveWrapper = () => {
    if (onThresholdsUpdate) {
      // Controlled mode
      setLocalDragOverIndex(null);
    } else {
      // Uncontrolled mode
      handleDragLeave();
    }
  };

  const handleDropWrapper = async (e, dropIndex) => {
    e.preventDefault();
    
    if (onThresholdsUpdate) {
      // Controlled mode
      setLocalDragOverIndex(null);
      
      if (localDraggedItem === null || localDraggedItem === dropIndex) {
        setLocalDraggedItem(null);
        return;
      }

      // Create new ordered array
      const newThresholds = [...currentDisplayThresholds];
      const draggedThreshold = newThresholds[localDraggedItem];
      
      // Remove dragged item
      newThresholds.splice(localDraggedItem, 1);
      
      // Insert at new position
      newThresholds.splice(dropIndex, 0, draggedThreshold);
      
      // Update parent state immediately
      onThresholdsUpdate(newThresholds);
      
      // Save to backend
      if (currentSelectedDisplay) {
        try {
          setLocalReorderLoading(true);
          const thresholdIds = newThresholds.map(t => t._id);
          const result = await DisplayService.reorderThresholds(currentSelectedDisplay, thresholdIds);
          
          if (!result.success) {
            onErrorChange && onErrorChange(result.error || 'Failed to reorder thresholds');
          }
        } catch (err) {
          console.error('Error reordering thresholds:', err);
          onErrorChange && onErrorChange(err.message || 'Failed to reorder thresholds');
        } finally {
          setLocalReorderLoading(false);
        }
      }
      
      setLocalDraggedItem(null);
    } else {
      // Uncontrolled mode
      handleDrop(e, dropIndex);
    }
  };

  const handleDragEndWrapper = () => {
    if (onThresholdsUpdate) {
      // Controlled mode
      setLocalDraggedItem(null);
      setLocalDragOverIndex(null);
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DisplayDropdown
            value={currentSelectedDisplay}
            onChange={handleDisplayChangeWrapper}
            disabled={currentLoading}
          >
            <option value="">Select a playlist...</option>
            {displayOptions.map(option => (
              <option key={option} value={option}>
                {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </DisplayDropdown>
          
          {currentSelectedDisplay && (
            <TimeSettingContainer>
              <TimeLabel>Cycle Time:</TimeLabel>
              <input
                type="number"
                min="5"
                max="3600"
                value={displayTime}
                onChange={(e) => {
                  console.log('Input onChange triggered:', e.target.value);
                  setDisplayTime(e.target.value);
                }}
                onBlur={(e) => {
                  console.log('Input onBlur triggered:', e.target.value);
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 5) {
                    setDisplayTime(5);
                  } else if (value > 3600) {
                    setDisplayTime(3600);
                  } else {
                    setDisplayTime(value);
                  }
                }}
                disabled={isTimeUpdating}
                placeholder="seconds"
                style={{
                  width: '70px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  textAlign: 'center',
                  background: 'white',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              />
              <TimeUnit>sec</TimeUnit>
              <TimeButton
                onClick={handleTimeUpdate}
                disabled={isTimeUpdating || !currentSelectedDisplay}
              >
                {isTimeUpdating ? 'Saving...' : 'Save'}
              </TimeButton>
              <div style={{ 
                fontSize: '11px', 
                color: '#718096',
                marginLeft: '8px',
                whiteSpace: 'nowrap'
              }}>
                {displayTime >= 60 
                  ? `(${Math.floor(displayTime / 60)}m ${displayTime % 60}s)`
                  : `(${displayTime} seconds)`
                }
              </div>
            </TimeSettingContainer>
          )}
          
          {currentLoading && <LoadingSpinner />}
        </div>
      </SectionHeader>

      {currentError && (
        <ErrorMessage>
          <span>⚠️ {currentError}</span>
          <button 
            onClick={handleErrorClear}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '16px'
            }}
          >
            ×
          </button>
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
              <ThresholdTab 
                key={threshold._id || index}
                draggable={!currentReorderLoading}
                $isDragging={currentDraggedItem === index}
                onDragStart={(e) => handleDragStartWrapper(e, index)}
                onDragOver={(e) => handleDragOverWrapper(e, index)}
                onDragLeave={handleDragLeaveWrapper}
                onDrop={(e) => handleDropWrapper(e, index)}
                onDragEnd={handleDragEndWrapper}
                style={{
                  opacity: currentDragOverIndex === index ? 0.5 : 1,
                  transform: currentDragOverIndex === index ? 'scale(1.05)' : 'none'
                }}
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
              </ThresholdTab>
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
                <div className="collection">{thresholdToDelete.collectionName}</div>
                <div className="field">{thresholdToDelete.field}</div>
              </div>
              
              <p>This will remove the threshold from the "{currentSelectedDisplay}" display configuration.</p>
            </ConfirmationBody>
            
            <ConfirmationActions>
              <CancelButton onClick={cancelDeleteThreshold}>
                Cancel
              </CancelButton>
              <DeleteButton 
                onClick={confirmDeleteThreshold}
                disabled={removingThreshold === thresholdToDelete._id}
              >
                {removingThreshold === thresholdToDelete._id ? 'Deleting...' : 'Delete Threshold'}
              </DeleteButton>
            </ConfirmationActions>
          </ConfirmationDialog>
        </ConfirmationModal>
      )}
    </DisplaySection>
  );
};

export default DisplaySelector;
