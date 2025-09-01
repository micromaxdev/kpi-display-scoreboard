import { useState, useEffect } from 'react';
import DisplayService from '../services/displayService';

/**
 * Custom hook for managing display time settings
 */
export const useDisplayTime = (selectedDisplay) => {
  const [displayTime, setDisplayTime] = useState(30);
  const [isTimeUpdating, setIsTimeUpdating] = useState(false);

  // Fetch display config to get current time when display changes
  useEffect(() => {
    const fetchDisplayTime = async () => {
      if (selectedDisplay) {
        try {
          const result = await DisplayService.fetchDisplayConfig(selectedDisplay);
          if (result.success && result.display?.time) {
            setDisplayTime(result.display.time);
          }
        } catch (err) {
          console.error('Error fetching display time:', err);
        }
      }
    };

    fetchDisplayTime();
  }, [selectedDisplay]);

  // Handle time setting update
  const handleTimeUpdate = async (displayThresholds) => {
    if (!selectedDisplay || !displayThresholds) return;
    
    // Ensure we have a valid number
    const timeValue = parseInt(displayTime);
    if (isNaN(timeValue) || timeValue < 5 || timeValue > 3600) {
      alert('Time must be between 5 and 3600 seconds');
      return;
    }
    
    try {
      setIsTimeUpdating(true);
      const thresholdIds = displayThresholds.map(t => t._id);
      
      console.log('Updating display config:', {
        displayName: selectedDisplay,
        time: timeValue,
        thresholdIds
      });
      
      const result = await DisplayService.updateDisplayConfig(selectedDisplay, timeValue, thresholdIds);
      
      if (result.success) {
        console.log(`Time updated successfully to ${timeValue}s`);
        return { success: true };
      } else {
        console.error('Update failed:', result.error);
        const errorMessage = `Failed to update time: ${result.error || 'Unknown error'}`;
        alert(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error updating time settings:', error);
      const errorMessage = `Failed to update time settings: ${error.message}`;
      alert(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsTimeUpdating(false);
    }
  };

  const handleTimeChange = (value) => {
    console.log('Input onChange triggered:', value);
    setDisplayTime(value);
  };

  const handleTimeBlur = (value) => {
    console.log('Input onBlur triggered:', value);
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 5) {
      setDisplayTime(5);
    } else if (numValue > 3600) {
      setDisplayTime(3600);
    } else {
      setDisplayTime(numValue);
    }
  };

  const getFormattedTime = () => {
    return displayTime >= 60 
      ? `(${Math.floor(displayTime / 60)}m ${displayTime % 60}s)`
      : `(${displayTime} seconds)`;
  };

  return {
    displayTime,
    isTimeUpdating,
    handleTimeUpdate,
    handleTimeChange,
    handleTimeBlur,
    getFormattedTime
  };
};

export default useDisplayTime;
