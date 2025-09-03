import { useEffect, useState } from 'react';
import { fetchAllScreens, fetchAllDisplays, updateScreen } from '../../services/apiService';
import DeleteScreenModal from '../modals/DeleteScreenModal';
import CreateScreenModal from '../modals/CreateScreenModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Page,
  Container,
  Header,
  Title,
  Subtitle,
  ActionsBar,
  LeftSection,
  SearchInput,
  StatsText,
  ButtonGroup,
  Button,
  ScreenGrid,
  ScreenCard,
  ScreenName,
  ScreenDescription,
  Status,
  AssignmentSection,
  Label,
  Select,
  UrlDisplay,
  CopyButton,
  EmptyState,
  EmptyStateTitle,
  EmptyStateMessage,
  ErrorMessage,
  containerVariants,
  cardVariants,
  buttonHoverVariants
} from '../../styles/ScreenConfig.styled';

const ScreenConfigPage = () => {
  const [screens, setScreens] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [copiedUrls, setCopiedUrls] = useState({}); // Track copied state for each screen
  const [deletingScreens, setDeletingScreens] = useState(new Set()); // Track screens being deleted
  const [searchTerm, setSearchTerm] = useState(''); // New state for search functionality

  // Filter screens based on search term
  const filteredScreens = screens.filter(screen =>
    screen.screenName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy URL to clipboard function
  const handleCopyUrl = async (screenId, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => ({ ...prev, [screenId]: true }));
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedUrls(prev => ({ ...prev, [screenId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Load screens and displays on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [screensResponse, displaysResponse] = await Promise.all([
        fetchAllScreens(),
        fetchAllDisplays()
      ]);

      if (screensResponse.success) {
        setScreens(screensResponse.screens);
      } else {
        setError(`Failed to load screens: ${screensResponse.error}`);
      }

      if (displaysResponse.success) {
        setDisplays(displaysResponse.displays);
      } else {
        setError(prev => prev ? `${prev} | Failed to load displays: ${displaysResponse.error}` : `Failed to load displays: ${displaysResponse.error}`);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDisplay = async (screenName, displayName) => {
    try {
      const response = await updateScreen(screenName, { displayName });
      if (response.success) {
        // Update the local state
        setScreens(screens.map(screen => 
          screen.screenName === screenName 
            ? { ...screen, displayName } 
            : screen
        ));
      } else {
        setError(`Failed to assign display: ${response.error}`);
      }
    } catch (err) {
      setError('Failed to assign display: ' + err.message);
    }
  };

  // Handler for successful screen creation
  const handleCreateSuccess = (newScreenData) => {
    setScreens([...screens, newScreenData]);
    setShowCreateModal(false);
    setError(null);
  };

  // Handler for screen creation errors
  const handleCreateError = (errorMessage) => {
    setError(errorMessage);
  };

  // New functions for modal-based deletion
  const handleDeleteClick = (screen) => {
    setScreenToDelete(screen);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setScreenToDelete(null);
    // Refresh the whole page when modal closes
    window.location.reload();
  };

  const handleConfirmDelete = (screenName) => {
    // This function is only called when deletion is successful
    // Remove the screen from the list
    setScreens(prevScreens => prevScreens.filter(screen => screen.screenName !== screenName));
    setError(null);
    
    // Clear from deleting state
    setDeletingScreens(prev => {
      const newSet = new Set(prev);
      newSet.delete(screenName);
      return newSet;
    });
    
    // Modal closing is handled by the DeleteScreenModal component
  };

  const handleDeleteError = (errorMessage) => {
    // Handle deletion errors
    setError(errorMessage);
    
    // Clear from deleting state
    if (screenToDelete) {
      setDeletingScreens(prev => {
        const newSet = new Set(prev);
        newSet.delete(screenToDelete.screenName);
        return newSet;
      });
    }
    
    // Optionally reload data to ensure UI is in sync with backend
    // loadData(); // Uncomment if you want to refresh data on error
  };

  const handleDeleteStart = (screenName) => {
    // Add screen to deleting state
    setDeletingScreens(prev => new Set(prev).add(screenName));
  };

  if (loading) {
    return (
      <Page>
        <Container>
          <Header
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Title>Screen Configuration</Title>
            <Subtitle>Loading screens and displays...</Subtitle>
          </Header>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Header>
            <Title>Screen Configuration</Title>
            <Subtitle>Assign playlists/displays to physical screens</Subtitle>
          </Header>

          <AnimatePresence>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <ActionsBar>
            <LeftSection>
              <StatsText>
                <strong>{filteredScreens.length}</strong> of <strong>{screens.length}</strong> screens 
              </StatsText>
              <SearchInput
                type="text"
                placeholder="Search screens by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </LeftSection>
            <ButtonGroup>
              <Button 
                as={motion.button}
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="secondary" 
                onClick={loadData}
              >
                Refresh
              </Button>
              <Button 
                as={motion.button}
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="primary" 
                onClick={() => setShowCreateModal(true)}
              >
                Create New Screen
              </Button>
            </ButtonGroup>
          </ActionsBar>

          <motion.div>
            <ScreenGrid>
              <AnimatePresence>
                {filteredScreens.map((screen) => {
                  const isDeleting = deletingScreens.has(screen.screenName);
                  return (
                    <ScreenCard 
                      key={screen._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        opacity: isDeleting ? 0.5 : 1,
                        pointerEvents: isDeleting ? 'none' : 'auto'
                      }}
                    >
                      {isDeleting && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(220, 53, 69, 0.9)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)'
                          }}
                        >
                          Deleting...
                        </motion.div>
                      )}
                      
                      <ScreenName>{screen.screenName}</ScreenName>
                      <ScreenDescription>
                        {screen.description || 'No description provided'}
                      </ScreenDescription>
                      
                      <Status className={screen.displayName ? 'assigned' : 'unassigned'}>
                        {screen.displayName ? `Assigned: ${screen.displayName}` : 'Unassigned'}
                      </Status>

                      {/* Display Screen URL */}
                      {screen.screenUrl && (
                        <div>
                          <Label style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Screen URL:</Label>
                          <UrlDisplay>
                            <span>{screen.screenUrl}</span>
                            <CopyButton
                              as={motion.button}
                              variants={buttonHoverVariants}
                              whileHover="hover"
                              whileTap="tap"
                              className={copiedUrls[screen._id] ? 'copied' : ''}
                              onClick={() => handleCopyUrl(screen._id, screen.screenUrl)}
                            >
                              {copiedUrls[screen._id] ? 'Copied!' : 'Copy'}
                            </CopyButton>
                          </UrlDisplay>
                        </div>
                      )}

                      <AssignmentSection>
                        <Label>Assign Playlist/Display:</Label>
                        <Select
                          value={screen.displayName || ''}
                          onChange={(e) => handleAssignDisplay(screen.screenName, e.target.value)}
                        >
                          <option value="">-- Select Playlist --</option>
                          {displays.map((display) => (
                            <option key={display._id} value={display.displayName}>
                              {display.displayName} ({display.thresholdIds?.length || 0} thresholds)
                            </option>
                          ))}
                        </Select>

                        <ButtonGroup>
                          <Button 
                            as={motion.button}
                            variants={buttonHoverVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="danger" 
                            onClick={() => handleDeleteClick(screen)}
                          >
                            Delete Screen
                          </Button>
                          {screen.displayName && (
                            <Button 
                              as={motion.button}
                              variants={buttonHoverVariants}
                              whileHover="hover"
                              whileTap="tap"
                              className="secondary"
                              onClick={() => window.open(`shows/${screen.screenName}`, '_blank')}
                            >
                              View Display
                            </Button>
                          )}
                        </ButtonGroup>
                      </AssignmentSection>
                    </ScreenCard>
                  );
                })}
              </AnimatePresence>
            </ScreenGrid>
          </motion.div>

          <AnimatePresence>
            {screens.length === 0 && (
              <EmptyState
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <EmptyStateTitle>No screens configured</EmptyStateTitle>
                <EmptyStateMessage>Create your first screen to get started</EmptyStateMessage>
                <Button 
                  as={motion.button}
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="primary" 
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Screen
                </Button>
              </EmptyState>
            )}
            
            {screens.length > 0 && filteredScreens.length === 0 && searchTerm && (
              <EmptyState>
                <EmptyStateTitle>No screens found</EmptyStateTitle>
                <EmptyStateMessage>
                  No screens match your search for "{searchTerm}"
                </EmptyStateMessage>
                <Button 
                  as={motion.button}
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </EmptyState>
            )}
          </AnimatePresence>

          {/* Create Screen Modal */}
          <CreateScreenModal
            isOpen={showCreateModal}  
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
            onError={handleCreateError}
          />

          {/* Delete Screen Modal */}
          <DeleteScreenModal
            isOpen={showDeleteModal}
            screenName={screenToDelete?.screenName}
            screenDescription={screenToDelete?.description}
            onClose={handleCloseDeleteModal}
            onSuccess={handleConfirmDelete}
            onError={handleDeleteError}
            onDeleteStart={handleDeleteStart}
          />
        </motion.div>
      </Container>
    </Page>
  );
};

export default ScreenConfigPage;
