import { useState } from 'react';
import {
  ConfirmationModal,
  ConfirmationDialog,
  ConfirmationHeader,
  ConfirmationBody,
  ConfirmationActions,
  CancelButton,
  DeleteButton
} from '../../styles/DisplaySelector.styled';
import { deleteDisplay } from '../../services/apiService';

const DeleteDisplayModal = ({ 
  isOpen, 
  displayName, 
  onClose, 
  onSuccess,
  formatDisplayName 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!displayName) return;

    setIsDeleting(true);

    try {
      const result = await deleteDisplay(displayName);
      
      if (result.success) {
        handleClose();
        onSuccess?.(displayName);
      } else {
        console.error('Failed to delete display:', result.message);
        // You might want to show an error toast here
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting display:', error);
      handleClose();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !displayName) return null;

  return (
    <ConfirmationModal>
      <ConfirmationDialog>
        <ConfirmationHeader>
          <h3>Delete Display/Playlist</h3>
        </ConfirmationHeader>
        
        <ConfirmationBody>
          <p>
            Are you sure you want to delete the display "
            {formatDisplayName ? formatDisplayName(displayName) : displayName}"?
          </p>
          <p><strong>This action cannot be undone.</strong></p>
          <p>All configured settings for this playlist will be permanently removed.</p>
        </ConfirmationBody>
        
        <ConfirmationActions>
          <CancelButton onClick={handleClose} disabled={isDeleting}>
            Cancel
          </CancelButton>
          <DeleteButton 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Display'}
          </DeleteButton>
        </ConfirmationActions>
      </ConfirmationDialog>
    </ConfirmationModal>
  );
};

export default DeleteDisplayModal;
