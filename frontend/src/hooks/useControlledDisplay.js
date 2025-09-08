import { useState, useCallback } from 'react';
import DisplayService from '../services/displayService';

/**
 * Custom hook for managing controlled display operations
 */
export const useControlledDisplay = () => {
  const [localDraggedItem, setLocalDraggedItem] = useState(null);
  const [localDragOverIndex, setLocalDragOverIndex] = useState(null);
  const [localReorderLoading, setLocalReorderLoading] = useState(false);

  // Handle display change in controlled mode
  const handleDisplayChangeControlled = async (
    displayName, 
    onDisplayChange, 
    onThresholdsUpdate, 
    onLoadingChange, 
    onErrorChange
  ) => {
    if (onDisplayChange) {
      onDisplayChange(displayName);
      
      // Fetch thresholds for controlled mode
      if (displayName && onThresholdsUpdate && onLoadingChange && onErrorChange) {
        await fetchThresholdsForDisplay(displayName, onThresholdsUpdate, onLoadingChange, onErrorChange);
      }
    }
  };

  // Fetch thresholds for a specific display
  const fetchThresholdsForDisplay = useCallback(async (displayName, onThresholdsUpdate, onLoadingChange, onErrorChange) => {
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
  }, []);

  // Handle threshold removal in controlled mode
  const handleThresholdRemoveControlled = async (
    selectedDisplay,
    thresholdId,
    displayThresholds,
    onThresholdsUpdate,
    onErrorChange
  ) => {
    try {
      const result = await DisplayService.removeThreshold(selectedDisplay, thresholdId);
      
      if (result.success) {
        const updatedThresholds = displayThresholds.filter(t => t._id !== thresholdId);
        onThresholdsUpdate(updatedThresholds);
        return { success: true };
      } else {
        const error = result.error || 'Failed to remove threshold';
        onErrorChange && onErrorChange(error);
        return { success: false, error };
      }
    } catch (err) {
      console.error('Error removing threshold:', err);
      const error = err.message || 'Failed to remove threshold';
      onErrorChange && onErrorChange(error);
      return { success: false, error };
    }
  };

  // Drag and drop handlers for controlled mode
  const handleDragStartControlled = (e, index) => {
    setLocalDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOverControlled = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setLocalDragOverIndex(index);
  };

  const handleDragLeaveControlled = () => {
    setLocalDragOverIndex(null);
  };

  const handleDropControlled = async (
    e, 
    dropIndex, 
    selectedDisplay,
    displayThresholds,
    onThresholdsUpdate,
    onErrorChange
  ) => {
    e.preventDefault();
    setLocalDragOverIndex(null);
    
    if (localDraggedItem === null || localDraggedItem === dropIndex) {
      setLocalDraggedItem(null);
      return;
    }

    // Create new ordered array
    const newThresholds = [...displayThresholds];
    const draggedThreshold = newThresholds[localDraggedItem];
    
    // Remove dragged item
    newThresholds.splice(localDraggedItem, 1);
    
    // Insert at new position
    newThresholds.splice(dropIndex, 0, draggedThreshold);
    
    // Update parent state immediately
    onThresholdsUpdate(newThresholds);
    
    // Save to backend
    if (selectedDisplay) {
      try {
        setLocalReorderLoading(true);
        const thresholdIds = newThresholds.map(t => t._id);
        const result = await DisplayService.reorderThresholds(selectedDisplay, thresholdIds);
        
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
  };

  const handleDragEndControlled = () => {
    setLocalDraggedItem(null);
    setLocalDragOverIndex(null);
  };

  return {
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
  };
};

export default useControlledDisplay;
