import { useState } from 'react';
import {
  ConfirmationModal,
  ConfirmationDialog,
  ConfirmationHeader,
  ConfirmationBody,
  ConfirmationActions,
  CancelButton,
  DeleteButton,
  TimeLabel,
  CycleTimeInput
} from '../../styles/DisplaySelector.styled';
import { createDisplay } from '../../services/apiService';

const CreateDisplayModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  existingDisplays = [] 
}) => {
  const [displayName, setDisplayName] = useState('');
  const [displayTime, setDisplayTime] = useState(30);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setDisplayName('');
    setDisplayTime(30);
    setError('');
    setIsCreating(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    // Check if display name already exists
    if (existingDisplays.some(d => d.displayName.toLowerCase() === displayName.trim().toLowerCase())) {
      setError('A display with this name already exists');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const result = await createDisplay(displayName.trim(), displayTime);
      
      if (result.success) {
        handleClose();
        onSuccess?.(result.data);
      } else {
        setError(result.message || 'Failed to create display');
      }
    } catch (error) {
      setError('Error creating display');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isCreating) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <ConfirmationModal>
      <ConfirmationDialog>
        <ConfirmationHeader>
          <h3>Create New Playlist</h3>
        </ConfirmationHeader>
        
        <ConfirmationBody>
          <div style={{ marginBottom: '16px' }}>
            <TimeLabel style={{ display: 'block', marginBottom: '6px' }}>
              Display Name
            </TimeLabel>
            <CycleTimeInput
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter display name"
              style={{ 
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                borderColor: error ? '#f56565' : '#e2e8f0'
              }}
              autoFocus
            />
            {error && (
              <div style={{ 
                color: '#f56565', 
                fontSize: '13px', 
                marginTop: '4px' 
              }}>
                {error}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <TimeLabel style={{ display: 'block', marginBottom: '6px' }}>
              Cycle Time (seconds)
            </TimeLabel>
            <CycleTimeInput
              type="number"
              min="5"
              max="3600"
              value={displayTime}
              onChange={(e) => setDisplayTime(parseInt(e.target.value) || 30)}
              onKeyPress={handleKeyPress}
              placeholder="30"
              style={{ width: '100%' }}
            />
          </div>
        </ConfirmationBody>
        
        <ConfirmationActions>
          <CancelButton onClick={handleClose} disabled={isCreating}>
            Cancel
          </CancelButton>
          <DeleteButton 
            onClick={handleSubmit}
            disabled={isCreating}
            style={{ 
              backgroundColor: '#4299e1',
              '&:hover': { backgroundColor: '#3182ce' }
            }}
          >
            {isCreating ? 'Creating...' : 'Create Display'}
          </DeleteButton>
        </ConfirmationActions>
      </ConfirmationDialog>
    </ConfirmationModal>
  );
};

export default CreateDisplayModal;
