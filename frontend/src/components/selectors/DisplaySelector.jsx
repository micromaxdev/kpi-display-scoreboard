import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DisplaySection,
  SectionHeader,
  ErrorMessage,
  LoadingSpinner,
  HeaderActionsContainer,
  ErrorCloseButton
} from '../../styles/DisplaySelector.styled';
import useDisplaySelector from '../../hooks/useDisplaySelector';
import useDisplayTime from '../../hooks/useDisplayTime';
import useDisplayOptions from '../../hooks/useDisplayOptions';
import useConfirmationModal from '../../hooks/useConfirmationModal';
import useControlledDisplay from '../../hooks/useControlledDisplay';
import useDisplayManagement from '../../hooks/useDisplayManagement';
import DisplayService from '../../services/displayService';

// Import modular components
import DisplayActions from '../forms/DisplayActions';
import TimeSettings from '../config/TimeSettings';
import ThresholdsList from '../data/ThresholdsList';
import CreateDisplayModal from '../modals/CreateDisplayModal';
import DeleteDisplayModal from '../modals/DeleteDisplayModal';
import DeleteThresholdModal from '../modals/DeleteThresholdModal';


const DisplaySelector = ({ 
  selectedDisplay: propSelectedDisplay, 
  displayThresholds: propDisplayThresholds, 
  loading: propLoading, 
  error: propError,
  onDisplayChange,
  onThresholdsUpdate,
  onLoadingChange,
  onErrorChange,
  refreshTrigger
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
  // Display management hook
  const {
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    showDeleteConfirmation,
    displayToDelete,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    isDeleting,
    setDeletingState
  } = useDisplayManagement();
  
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
    handleDragEndControlled,
    fetchThresholdsForDisplay
  } = useControlledDisplay();

  // Store callback functions in refs to avoid infinite loops
  const callbacksRef = useRef({ onThresholdsUpdate, onLoadingChange, onErrorChange });
  callbacksRef.current = { onThresholdsUpdate, onLoadingChange, onErrorChange };

  // Handle refresh trigger for controlled mode
  useEffect(() => {
    if (refreshTrigger > 0 && currentSelectedDisplay) {
      // Refresh the thresholds for the current display
      const refreshThresholds = async () => {
        const { onThresholdsUpdate, onLoadingChange, onErrorChange } = callbacksRef.current;
        
        try {
          onLoadingChange(true);
          onErrorChange(null);
          
          const result = await DisplayService.fetchDisplayConfig(currentSelectedDisplay);
          
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
      };
      
      refreshThresholds();
    }
  }, [refreshTrigger, currentSelectedDisplay]); // Only depend on refreshTrigger and currentSelectedDisplay

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

  // Display management handlers
  const handleCreateDisplay = () => {
    openCreateModal();
  };

  const handleCreateSuccess = () => {
    // Refresh display options by triggering a re-fetch
    window.location.reload(); // Simple refresh for now
  };

  const handleDeleteDisplay = () => {
    if (!currentSelectedDisplay) return;
    openDeleteConfirmation(currentSelectedDisplay);
  };

  const handleDeleteSuccess = (deletedDisplayName) => {
    // Clear current selection if it was the deleted display
    if (currentSelectedDisplay === deletedDisplayName) {
      if (onDisplayChange) {
        onDisplayChange({ target: { value: '' } });
      } else {
        hookHandleDisplayChange('');
      }
    }
    // Refresh display options
    window.location.reload(); // Simple refresh for now
  };

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
          <DisplayActions
            selectedDisplay={currentSelectedDisplay}
            displayOptions={getFilteredOptions()}
            loading={currentLoading}
            onDisplayChange={handleDisplayChangeWrapper}
            onCreateDisplay={handleCreateDisplay}
            onDeleteDisplay={handleDeleteDisplay}
            formatDisplayName={formatDisplayName}
            isDeleting={isDeleting}
          />
          
          <TimeSettings
            displayName={currentSelectedDisplay}
            displayTime={displayTime}
            isTimeUpdating={isTimeUpdating}
            onTimeChange={handleTimeChange}
            onTimeBlur={handleTimeBlur}
            onTimeUpdate={handleTimeUpdateWrapper}
            getFormattedTime={getFormattedTime}
          />
          
          <AnimatePresence mode="wait">
            {currentLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>
        </HeaderActionsContainer>
      </SectionHeader>

      <AnimatePresence mode="wait">
        {!currentSelectedDisplay && (
          <motion.div
            key="no-selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '12px 16px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              color: '#856404',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          >
            ⚠️ No playlist selected. Please select a playlist to view its configured reports.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentError && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage>
              <span>⚠️ {currentError}</span>
              <ErrorCloseButton onClick={handleErrorClear}>
                ×
              </ErrorCloseButton>
            </ErrorMessage>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSelectedDisplay || 'empty'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <ThresholdsList
            displayName={currentSelectedDisplay}
            thresholds={currentDisplayThresholds}
            loading={currentLoading}
            error={currentError}
            reorderLoading={currentReorderLoading}
            removingThreshold={removingThreshold}
            draggedItem={currentDraggedItem}
            dragOverIndex={currentDragOverIndex}
            onThresholdRemove={handleThresholdRemove}
            onDragStart={handleDragStartWrapper}
            onDragOver={handleDragOverWrapper}
            onDragLeave={handleDragLeaveWrapper}
            onDrop={handleDropWrapper}
            onDragEnd={handleDragEndWrapper}
          />
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <DeleteThresholdModal
        isOpen={showConfirmation}
        threshold={thresholdToDelete}
        displayName={currentSelectedDisplay}
        onClose={closeConfirmation}
        onConfirm={confirmDeleteThreshold}
        isDeleting={removingThreshold === thresholdToDelete?._id}
      />

      <CreateDisplayModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSuccess={handleCreateSuccess}
        existingDisplays={getFilteredOptions()}
      />

      <DeleteDisplayModal
        isOpen={showDeleteConfirmation}
        displayName={displayToDelete}
        onClose={closeDeleteConfirmation}
        onSuccess={handleDeleteSuccess}
        formatDisplayName={formatDisplayName}
      />
    </DisplaySection>
  );
};

export default DisplaySelector;
