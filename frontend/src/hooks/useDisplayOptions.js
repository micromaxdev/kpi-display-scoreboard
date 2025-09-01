import { useState, useEffect } from 'react';
import DisplayService from '../services/displayService';

/**
 * Custom hook for managing display options
 */
export const useDisplayOptions = () => {
  const [displayOptions, setDisplayOptions] = useState([]);
  const [displayOptionsLoading, setDisplayOptionsLoading] = useState(false);

  // Fetch display options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setDisplayOptionsLoading(true);
      try {
        const options = await DisplayService.getDisplayOptions();
        setDisplayOptions(options);
      } catch (error) {
        console.error('Error fetching display options:', error);
        setDisplayOptions([]);
      } finally {
        setDisplayOptionsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const getFilteredOptions = () => {
    return displayOptions.filter(option => option && typeof option.displayName === 'string');
  };

  const formatDisplayName = (displayName) => {
    return displayName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return {
    displayOptions,
    displayOptionsLoading,
    getFilteredOptions,
    formatDisplayName
  };
};

export default useDisplayOptions;
