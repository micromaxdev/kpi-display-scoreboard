import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import DisplaySelector from '../selectors/DisplaySelector';
import SavedThresholdsList from '../data/SavedThresholdsList';
import {
  Page,
  Container,
  Header,
  Title,
  Subtitle,
  ActionsBar,
  buttonHoverVariants,
  containerVariants
} from '../../styles/ScreenConfig.styled';

const PlaylistConfigPage = () => {
  const [selectedDisplay, setSelectedDisplay] = useState('');
  const [displayThresholds, setDisplayThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasContent, setHasContent] = useState(false);

  const handleDisplayChange = (displayName) => {
    setSelectedDisplay(displayName);
  };

  const handleThresholdAssigned = () => {
    // Trigger a refresh of the display thresholds without page refresh
    if (selectedDisplay) {
      // Increment refresh trigger to force re-fetch
      setRefreshTrigger(prev => prev + 1);
    }
  };
  return (
    <Page>
      <Container>
        <Header
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Title>Playlist Configuration</Title>
          <Subtitle>Select a playlist and manage its reports</Subtitle>
        </Header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <DisplaySelector 
            selectedDisplay={selectedDisplay}
            displayThresholds={displayThresholds}
            loading={loading}
            error={error}
            onDisplayChange={handleDisplayChange}
            onThresholdsUpdate={setDisplayThresholds}
            onLoadingChange={setLoading}
            onErrorChange={setError}
            refreshTrigger={refreshTrigger}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ActionsBar 
            as={motion.div} 
            variants={buttonHoverVariants}
            initial={{ 
              minHeight: '120px',
              scale: 1
            }}
            animate={{ 
              minHeight: selectedDisplay ? 'auto' : '120px',
              scale: 1,
              height: 'auto'
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94] // Smooth cubic-bezier easing
            }}
            layout
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <SavedThresholdsList 
                selectedDisplay={selectedDisplay}
                onThresholdAssigned={handleThresholdAssigned}
              />
            </div>
          </ActionsBar>
        </motion.div>


      </Container>
    </Page>
  );
};

export default PlaylistConfigPage;

