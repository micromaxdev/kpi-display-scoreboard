import { useState } from 'react';

/**
 * Custom hook for managing display-related modal states and actions
 */
const useDisplayManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [displayToDelete, setDisplayToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const openDeleteConfirmation = (displayName) => {
    setDisplayToDelete(displayName);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setDisplayToDelete(null);
    setIsDeleting(false);
  };

  const setDeletingState = (state) => {
    setIsDeleting(state);
  };

  return {
    // Create modal state
    showCreateModal,
    openCreateModal,
    closeCreateModal,

    // Delete modal state
    showDeleteConfirmation,
    displayToDelete,
    openDeleteConfirmation,
    closeDeleteConfirmation,

    // Delete state
    isDeleting,
    setDeletingState
  };
};

export default useDisplayManagement;
