import { useEffect, useState } from 'react';
import { fetchAllScreens, fetchAllDisplays, updateScreen, createScreen, deleteScreen } from '../services/apiService';
import DeleteScreenModal from './modals/DeleteScreenModal';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  padding-bottom: 4rem; /* Extra padding at bottom for better scrolling */
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px); /* Account for navigation height */
  background: #f8f9fa;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &.primary {
    background: #007bff;
    color: white;
    &:hover {
      background: #0056b3;
    }
  }

  &.secondary {
    background: #6c757d;
    color: white;
    &:hover {
      background: #545b62;
    }
  }

  &.danger {
    background: #dc3545;
    color: white;
    &:hover {
      background: #c82333;
    }
  }

  &.success {
    background: #28a745;
    color: white;
    &:hover {
      background: #1e7e34;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ScreenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ScreenCard = styled.div`
  position: relative;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ScreenName = styled.h3`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const ScreenDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const AssignmentSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const UrlDisplay = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-height: 2.5rem;
  
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

const CopyButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 60px;

  &:hover {
    background: #007bff;
    color: white;
  }

  &.copied {
    background: #28a745;
    border-color: #28a745;
    color: white;
  }
`;

const Status = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;

  &.assigned {
    background: #d4edda;
    color: #155724;
  }

  &.unassigned {
    background: #f8d7da;
    color: #721c24;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

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
  const [newScreen, setNewScreen] = useState({
    screenName: '',
    description: '',
    screenUrl: ''
  });

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

  const handleCreateScreen = async () => {
    if (!newScreen.screenName.trim()) {
      setError('Screen name is required');
      return;
    }

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
        setScreens([...screens, response.screen]);
        setNewScreen({ screenName: '', description: '', screenUrl: '' });
        setShowCreateModal(false);
        setError(null);
      } else {
        setError(`Failed to create screen: ${response.error}`);
      }
    } catch (err) {
      setError('Failed to create screen: ' + err.message);
    }
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
      <Container>
        <Header>
          <Title>Screen Configuration</Title>
          <Subtitle>Loading screens and displays...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Screen Configuration</Title>
        <Subtitle>Assign playlists/displays to physical screens</Subtitle>
      </Header>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <ActionsBar>
        <div>
          <strong>{screens.length}</strong> screens configured
        </div>
        <ButtonGroup>
          <Button className="secondary" onClick={loadData}>
            Refresh
          </Button>
          <Button className="primary" onClick={() => setShowCreateModal(true)}>
            Create New Screen
          </Button>
        </ButtonGroup>
      </ActionsBar>

      <ScreenGrid>
        {screens.map((screen) => {
          const isDeleting = deletingScreens.has(screen.screenName);
          return (
            <ScreenCard key={screen._id} style={{ 
              opacity: isDeleting ? 0.5 : 1,
              pointerEvents: isDeleting ? 'none' : 'auto',
              transition: 'opacity 0.3s ease'
            }}>
              {isDeleting && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(220, 53, 69, 0.9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  Deleting...
                </div>
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
                <option value="">-- Select Display --</option>
                {displays.map((display) => (
                  <option key={display._id} value={display.displayName}>
                    {display.displayName} ({display.thresholdIds?.length || 0} thresholds)
                  </option>
                ))}
              </Select>

              <ButtonGroup>
                <Button 
                  className="danger" 
                  onClick={() => handleDeleteClick(screen)}
                >
                  Delete Screen
                </Button>
                {screen.displayName && (
                  <Button 
                    className="secondary"
                    onClick={() => window.open(`/${screen.screenName}`, '_blank')}
                  >
                    View Display
                  </Button>
                )}
              </ButtonGroup>
            </AssignmentSection>
          </ScreenCard>
          );
        })}
      </ScreenGrid>

      {screens.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#666'
        }}>
          <h3>No screens configured</h3>
          <p>Create your first screen to get started</p>
          <Button className="primary" onClick={() => setShowCreateModal(true)}>
            Create Screen
          </Button>
        </div>
      )}

      {/* Create Screen Modal */}
      {showCreateModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}>
          <ModalContent>
            <ModalTitle>Create New Screen</ModalTitle>
            
            <Label>Screen Name (required):</Label>
            <Input
              type="text"
              placeholder="e.g., Lobby, Conference Room A"
              value={newScreen.screenName}
              onChange={(e) => setNewScreen({...newScreen, screenName: e.target.value})}
            />

            {/* URL Preview */}
            {newScreen.screenName.trim() && (
              <div>
                <Label>Generated URL Preview:</Label>
                <UrlDisplay>
                  <span>
                    {window.location.origin}/{newScreen.screenName.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>Auto-generated</span>
                </UrlDisplay>
              </div>
            )}

            <Label>Description:</Label>
            <Input
              type="text"
              placeholder="Brief description of the screen location"
              value={newScreen.description}
              onChange={(e) => setNewScreen({...newScreen, description: e.target.value})}
            />

            <ButtonGroup>
              <Button className="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="success" onClick={handleCreateScreen}>
                Create Screen
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

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
    </Container>
  );
};

export default ScreenConfigPage;
