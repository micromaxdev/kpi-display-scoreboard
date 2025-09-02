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
import { deleteScreen } from '../../services/apiService';

const DeleteScreenModal = ({ 
  isOpen, 
  screenName, 
  screenDescription,
  onClose, 
  onSuccess,
  onError, // Add error callback
  onDeleteStart // Add delete start callback
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!screenName) return;

    setIsDeleting(true);
    onDeleteStart?.(screenName); // Notify parent that deletion started

    try {
      const result = await deleteScreen(screenName);
      
      if (result.success) {
        handleClose();
        onSuccess?.(screenName);
      } else {
        console.error('Failed to delete screen:', result.error);
        onError?.(`Failed to delete screen: ${result.error}`);
        handleClose();
      }
    } catch (error) {
      console.error('Error deleting screen:', error);
      onError?.(`Error deleting screen: ${error.message}`);
      handleClose();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !screenName) return null;

  return (
    <ConfirmationModal>
      <ConfirmationDialog>
        <ConfirmationHeader>
          <h3>Delete Screen</h3>
        </ConfirmationHeader>
        
        <ConfirmationBody>
          <p>
            Are you sure you want to delete the screen "<strong>{screenName}</strong>"?
          </p>
          {screenDescription && (
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {screenDescription}
            </p>
          )}
          <p><strong>This action cannot be undone.</strong></p>
          <p>All configured settings for this screen will be permanently removed.</p>
        </ConfirmationBody>
        
        <ConfirmationActions>
          <CancelButton onClick={handleClose} disabled={isDeleting}>
            Cancel
          </CancelButton>
          <DeleteButton 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Screen'}
          </DeleteButton>
        </ConfirmationActions>
      </ConfirmationDialog>
    </ConfirmationModal>
  );
};

export default DeleteScreenModal;
