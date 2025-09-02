import {
  ConfirmationModal,
  ConfirmationDialog,
  ConfirmationHeader,
  ConfirmationBody,
  ConfirmationActions,
  CancelButton,
  DeleteButton
} from '../../styles/DisplaySelector.styled';

const DeleteThresholdModal = ({ 
  isOpen, 
  threshold, 
  displayName,
  onClose, 
  onConfirm,
  isDeleting = false
}) => {
  const handleConfirm = () => {
    onConfirm?.(threshold);
  };

  if (!isOpen || !threshold) return null;

  return (
    <ConfirmationModal>
      <ConfirmationDialog>
        <ConfirmationHeader>
          <h3>Delete Threshold</h3>
        </ConfirmationHeader>
        
        <ConfirmationBody>
          <p>Are you sure you want to delete this threshold? This action cannot be undone.</p>
          
          <div className="threshold-info">
            <div className="collection">{threshold?.collectionName}</div>
            <div className="field">{threshold?.field}</div>
          </div>
          
          <p>This will remove the threshold from the "{displayName}" display configuration.</p>
        </ConfirmationBody>
        
        <ConfirmationActions>
          <CancelButton onClick={onClose} disabled={isDeleting}>
            Cancel
          </CancelButton>
          <DeleteButton 
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Threshold'}
          </DeleteButton>
        </ConfirmationActions>
      </ConfirmationDialog>
    </ConfirmationModal>
  );
};

export default DeleteThresholdModal;
