import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllThresholds, saveDisplayConfig } from '../../services/apiService';
import {
  ThresholdsContainer,
  ThresholdsHeader,

  EmptyState,
  ErrorMessage,
  LoadingSpinner
} from '../../styles/DisplaySelector.styled';
import {
  Button,
  ButtonGroup,
  Select,
  Label,
  buttonHoverVariants
} from '../../styles/ScreenConfig.styled';

const SavedThresholdsList = ({ selectedDisplay, onThresholdAssigned }) => {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThreshold, setSelectedThreshold] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(null);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAllThresholds();
      if (response.success) {
        setThresholds(response.thresholds);
      } else {
        setError(response.error || 'Failed to load thresholds');
      }
    } catch (err) {
      setError('Error loading thresholds: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatThresholdValue = (threshold) => {
    if (!threshold) return 'N/A';
    
    const { green, amber, direction } = threshold;
    
    if (direction === 'higher') {
      return `Green: ≥${green?.toLocaleString()}, Amber: ${amber?.toLocaleString()}`;
    } else {
      return `Green: ≤${green?.toLocaleString()}, Amber: ${amber?.toLocaleString()}`;
    }
  };

  const getDirectionIcon = (direction) => {
    return direction === 'higher' ? '⬆️' : '⬇️';
  };

  const handleThresholdSelect = (thresholdId) => {
    const threshold = thresholds.find(t => t._id === thresholdId);
    setSelectedThreshold(threshold);
    setAssignError(null);
    setAssignSuccess(null);
  };

  const handleAssignThreshold = async () => {
    if (!selectedDisplay) {
      setAssignError('Please select a playlist first');
      return;
    }

    if (!selectedThreshold) {
      setAssignError('Please select a threshold to assign');
      return;
    }

    setAssigning(true);
    setAssignError(null);
    setAssignSuccess(null);

    try {
      const response = await saveDisplayConfig({
        displayName: selectedDisplay,
        thresholdId: selectedThreshold._id,
        time: 30 // Default time
      });

      if (response.success) {
        setAssignSuccess(`✅ Threshold "${selectedThreshold.collectionName} - ${selectedThreshold.field}" successfully assigned to "${selectedDisplay}"`);
        setSelectedThreshold(null);
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAssignSuccess(null);
        }, 2000);
        if (onThresholdAssigned) {
          onThresholdAssigned();
        }
      } else {
        setAssignError(response.message || 'Failed to assign threshold');
      }
    } catch (err) {
      setAssignError('Error assigning threshold: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <ThresholdsContainer>
        <ThresholdsHeader>
          <h4>Assign Threshold to Playlist</h4>
          <LoadingSpinner />
        </ThresholdsHeader>
      </ThresholdsContainer>
    );
  }

  if (error) {
    return (
      <ThresholdsContainer>
        <ThresholdsHeader>
          <h4>Assign Threshold to Playlist</h4>
        </ThresholdsHeader>
        <ErrorMessage>
          <span>⚠️ {error}</span>
        </ErrorMessage>
      </ThresholdsContainer>
    );
  }

  return (
    <ThresholdsContainer>
      <ThresholdsHeader>
        <h4>Assign Threshold to Playlist</h4>
        <div className="count">
          {thresholds.length} threshold{thresholds.length !== 1 ? 's' : ''} available
        </div>
      </ThresholdsHeader>

      {thresholds.length === 0 ? (
        <EmptyState>
          <div className="icon">📊</div>
          <h3>No Saved Thresholds</h3>
          <p>Create your first threshold configuration to see it here.</p>
        </EmptyState>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          layout
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            overflow: 'hidden' // Prevents content jumping during transitions
          }}
        >
          {/* Dropdown Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Label>Select Threshold to Assign:</Label>
              <Select
                value={selectedThreshold?._id || ''}
                onChange={(e) => handleThresholdSelect(e.target.value)}
                key={selectedThreshold ? 'selected' : 'empty'} // Force re-render when threshold is cleared
              >
                <option value="" disabled>-- Choose a threshold --</option>
                {thresholds.map((threshold) => (
                  <option key={threshold._id} value={threshold._id}>
                    {threshold.collectionName} - {threshold.field} {getDirectionIcon(threshold.direction)}
                  </option>
                ))}
              </Select>
            </div>
            
            <ButtonGroup>
              <Button 
                as={motion.button}
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="primary" 
                onClick={handleAssignThreshold}
                disabled={!selectedDisplay || !selectedThreshold || assigning}
              >
                {assigning ? 'Assigning...' : 'Assign to Playlist'}
              </Button>
            </ButtonGroup>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence mode="wait">
            {assignSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '6px',
                  color: '#155724',
                  fontSize: '14px',
                  marginBottom: '1rem'
                }}
              >
                ✅ {assignSuccess}
              </motion.div>
            )}

            {assignError && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ErrorMessage>
                  <span>⚠️ {assignError}</span>
                </ErrorMessage>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Threshold Information */}
          <AnimatePresence mode="wait">
            {selectedThreshold && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth feel
                }}
                layout
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: '2px solid #4299e1',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginTop: '1rem',
                  boxShadow: '0 8px 25px rgba(66, 153, 225, 0.15)'
                }}
              >
              <h5 style={{ 
                margin: '0 0 1rem 0', 
                color: '#2d3748', 
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Selected Threshold Details
              </h5>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Collection:</strong>
                  <div style={{ color: '#2d3748', fontWeight: '500' }}>
                    {selectedThreshold.collectionName}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Field:</strong>
                  <div style={{ color: '#2d3748', fontWeight: '500' }}>
                    {selectedThreshold.field}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Direction:</strong>
                  <div style={{ color: '#2d3748', fontWeight: '500' }}>
                    {selectedThreshold.direction === 'higher' ? 'Higher is Better ↗️' : 'Lower is Better ↘️'}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Green Threshold:</strong>
                  <div style={{ color: '#28a745', fontWeight: '600' }}>
                    {selectedThreshold.direction === 'higher' ? '≥' : '≤'} {selectedThreshold.green?.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Amber Threshold:</strong>
                  <div style={{ color: '#ffc107', fontWeight: '600' }}>
                    {selectedThreshold.amber?.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.9rem' }}>Red Threshold:</strong>
                  <div style={{ color: '#dc3545', fontWeight: '600' }}>
                    {selectedThreshold.direction === 'higher' ? '<' : '>'} {selectedThreshold.amber?.toLocaleString()}
                  </div>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </ThresholdsContainer>
  );
};

export default SavedThresholdsList;
