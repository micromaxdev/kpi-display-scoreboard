import { useState } from 'react';

/**
 * Custom hook for managing confirmation modal state and actions
 */
export const useConfirmationModal = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const openConfirmation = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const confirmAction = async (actionCallback) => {
    if (!itemToDelete) return;

    try {
      await actionCallback(itemToDelete);
    } finally {
      closeConfirmation();
    }
  };

  return {
    showConfirmation,
    itemToDelete,
    openConfirmation,
    closeConfirmation,
    confirmAction
  };
};

export default useConfirmationModal;
