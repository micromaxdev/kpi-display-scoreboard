import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createScreen } from '../../services/apiService';
import {
  Modal,
  ModalContent,
  ModalTitle,
  Label,
  Input,
  UrlDisplay,
  ButtonGroup,
  Button,
  ErrorMessage,
  modalVariants,
  buttonHoverVariants
} from '../../styles/ScreenConfig.styled';

const CreateScreenModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onError
}) => {
  const [newScreen, setNewScreen] = useState({
    screenName: '',
    description: '',
    screenUrl: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleClose = () => {
    setNewScreen({ screenName: '', description: '', screenUrl: '' });
    setLocalError(null);
    setIsCreating(false);
    onClose();
  };

  const handleCreateScreen = async () => {
    if (!newScreen.screenName.trim()) {
      setLocalError('Screen name is required');
      return;
    }

    setIsCreating(true);
    setLocalError(null);

    try {
      // Generate URL based on screen name
      const baseUrl = window.location.origin;
      const screenPath = newScreen.screenName.toLowerCase().replace(/\s+/g, '-');
      const generatedUrl = `${baseUrl}/${screenPath}`;
      
      // Create screen data with generated URL
      const screenDataWithUrl = {
        ...newScreen,
        screenUrl: generatedUrl
      };

      const response = await createScreen(screenDataWithUrl);
      
      if (response.success) {
        handleClose();
        onSuccess?.(response.screen);
      } else {
        setLocalError(`Failed to create screen: ${response.error}`);
        onError?.(`Failed to create screen: ${response.error}`);
      }
    } catch (err) {
      const errorMessage = `Failed to create screen: ${err.message}`;
      setLocalError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isCreating) {
      handleCreateScreen();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Modal
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <ModalContent
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <ModalTitle>Create New Screen</ModalTitle>
          
          <AnimatePresence>
            {localError && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {localError}
              </ErrorMessage>
            )}
          </AnimatePresence>
          
          <Label>Screen Name (required):</Label>
          <Input
            type="text"
            placeholder="e.g., Lobby, Conference Room A"
            value={newScreen.screenName}
            onChange={(e) => setNewScreen({...newScreen, screenName: e.target.value})}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
          />

          {/* URL Preview */}
          {newScreen.screenName.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label>Generated URL Preview:</Label>
              <UrlDisplay>
                <span>
                  {window.location.origin}/{newScreen.screenName.toLowerCase().replace(/\s+/g, '-')}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6c757d', flexShrink: 0 }}>Auto-generated</span>
              </UrlDisplay>
            </motion.div>
          )}

          <Label>Description:</Label>
          <Input
            type="text"
            placeholder="Brief description of the screen location"
            value={newScreen.description}
            onChange={(e) => setNewScreen({...newScreen, description: e.target.value})}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
          />

          <ButtonGroup>
            <Button 
              as={motion.button}
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="secondary" 
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              as={motion.button}
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="success" 
              onClick={handleCreateScreen}
              disabled={isCreating || !newScreen.screenName.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Screen'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
};

export default CreateScreenModal;
