import { useState } from 'react';
import DisplayService from '../services/displayService';

/**
 * Custom hook for managing display selection and threshold operations
 */
export const useDisplaySelector = () => {
  // State management
  const [selectedDisplay, setSelectedDisplay] = useState('');
  const [displayThresholds, setDisplayThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [removingThreshold, setRemovingThreshold] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  /**
   * Fetch display thresholds
   */
  const fetchDisplayThresholds = async (displayName) => {
    if (!displayName) {
      setDisplayThresholds([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await DisplayService.fetchDisplayConfig(displayName);
      
      if (result.success) {
        setDisplayThresholds(result.thresholds);
      } else {
        setDisplayThresholds([]);
        setError(result.error || 'No thresholds found for this display');
      }
    } catch (err) {
      console.error('Error fetching display thresholds:', err);
      setError(err.message || 'Failed to fetch display thresholds');
      setDisplayThresholds([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle display selection change
   */
  const handleDisplayChange = (displayName) => {
    setSelectedDisplay(displayName);
    fetchDisplayThresholds(displayName);
  };

  /**
   * Reorder thresholds
   */
  const reorderThresholds = async (newOrderedThresholds) => {
    if (!selectedDisplay || newOrderedThresholds.length === 0) return;

    try {
      setReorderLoading(true);
      
      const thresholdIds = newOrderedThresholds.map(t => t._id);
      const result = await DisplayService.reorderThresholds(selectedDisplay, thresholdIds);
      
      if (result.success) {
        setDisplayThresholds(newOrderedThresholds);
        console.log('✅ Threshold order updated successfully');
      } else {
        setError(result.error || 'Failed to reorder thresholds');
      }
    } catch (err) {
      console.error('Error reordering thresholds:', err);
      setError(err.message || 'Failed to reorder thresholds');
    } finally {
      setReorderLoading(false);
    }
  };

  /**
   * Remove threshold
   */
  const removeThreshold = async (thresholdId) => {
    if (!selectedDisplay || !thresholdId) return;

    try {
      setRemovingThreshold(thresholdId);

      const result = await DisplayService.removeThreshold(selectedDisplay, thresholdId);
      
      if (result.success) {
        const updatedThresholds = displayThresholds.filter(t => t._id !== thresholdId);
        setDisplayThresholds(updatedThresholds);
      } else {
        setError(result.error || 'Failed to remove threshold');
      }
    } catch (err) {
      console.error('Error removing threshold:', err);
      setError(err.message || 'Failed to remove threshold');
    } finally {
      setRemovingThreshold(null);
    }
  };

  /**
   * Drag and drop handlers
   */
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    // Create new ordered array
    const newThresholds = [...displayThresholds];
    const draggedThreshold = newThresholds[draggedItem];
    
    // Remove dragged item
    newThresholds.splice(draggedItem, 1);
    
    // Insert at new position
    newThresholds.splice(dropIndex, 0, draggedThreshold);
    
    // Update UI immediately
    setDisplayThresholds(newThresholds);
    
    // Save to backend
    await reorderThresholds(newThresholds);
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    selectedDisplay,
    displayThresholds,
    loading,
    error,
    removingThreshold,
    reorderLoading,
    draggedItem,
    dragOverIndex,
    
    // Actions
    handleDisplayChange,
    removeThreshold,
    clearError,
    
    // Drag and drop
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    
    // Utils
    displayOptions: DisplayService.getDisplayOptions()
  };
};

export default useDisplaySelector;
