import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {LastUpdatedTimestamp} from '../../styles/KpiLayout.styled.js';
import KPIAnalysisLayout from '../layout/KPIAnalysisLayout';
import { fetchDisplayConfig, analyzeKPIData, fetchScreenConfig } from '../../services/apiService';


const KPIAnalysisPage = () => {
  const { displayName: screenName } = useParams(); // URL param is actually screenName
  
  const [screenConfig, setScreenConfig] = useState(null);
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(`screenContent_${screenName}`);
    return saved ? JSON.parse(saved) : null;
  });
  // Helper function to analyze KPI data with excluded fields
    const analyzeKPIDataWithExcludedFields = async (threshold) => {
      if (!threshold?.collectionName || !threshold?.field) {
        return { success: false, error: 'Invalid threshold data' };
      }

      // Get excluded fields from threshold (or default to empty array)
      const excludedFields = threshold.excludedFields || [];
      
      console.log(`Analyzing KPI data with excluded fields:`, excludedFields);
      
      return await analyzeKPIData({
        collectionName: threshold.collectionName,
        field: threshold.field,
        greenThreshold: threshold.green,
        amberThreshold: threshold.amber,
        direction: threshold.direction,
        excludedFields: excludedFields
      });
    };
  // THRESHOLD CYCLING STATE
  const [currentThresholdIndex, setCurrentThresholdIndex] = useState(0);
  const [cycleInterval, setCycleInterval] = useState(null);
  
  // Ref to store current threshold IDs for stable access in intervals
  const thresholdIdsRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log(`Fetching content for screenName: ${screenName}, currentThresholdIndex: ${currentThresholdIndex}`);
        
        // First, fetch screen configuration
        const screenRes = await fetchScreenConfig(screenName);
        
        if (screenRes.success && screenRes.screen) {
          const screen = screenRes.screen;
          setScreenConfig(screen);
          
          // Check if screen has displayName configured
          if (!screen.displayName) {
            console.warn('Screen does not have a displayName configured:', screen);
            setContent({
              screen: screen,
              display: null,
              analysisData: null,
              currentThreshold: null,
              currentThresholdIndex: 0,
              lastUpdated: new Date().toISOString(),
              error: 'Screen does not have a playlist/display configured'
            });
            return;
          }
          
          // Fetch display configuration using displayName from screen
          const displayName = screen.displayName.toLowerCase();
          const displayRes = await fetchDisplayConfig(displayName);

          if (displayRes.success && displayRes.display) {
            const display = displayRes.display;

            // CYCLING: Use the current threshold index for analysis
            if (display.thresholdIds && display.thresholdIds.length > 0) {
              // VALIDATION: Ensure currentThresholdIndex is within bounds
              if (currentThresholdIndex >= display.thresholdIds.length) {
                console.warn(`currentThresholdIndex (${currentThresholdIndex}) out of bounds, resetting to 0`);
                setCurrentThresholdIndex(0);
                return;
              }

              // Use currentThresholdIndex for cycling through thresholds
              const currentThreshold = display.thresholdIds[currentThresholdIndex];
              
              // VALIDATION: Check if threshold has required fields
              if (!currentThreshold?.collectionName || !currentThreshold?.field) {
                console.error(' Invalid threshold data:', currentThreshold);
                return;
              }

              console.log(`ANALYZING THRESHOLD ${currentThresholdIndex + 1}/${display.thresholdIds.length}:`, {
                index: currentThresholdIndex,
                thresholdId: currentThreshold._id,
                collection: currentThreshold.collectionName,
                field: currentThreshold.field,
                thresholds: { green: currentThreshold.green, amber: currentThreshold.amber },
                direction: currentThreshold.direction
              });
              
              // Analyze data using the current threshold
              const analysisRes = await analyzeKPIDataWithExcludedFields(currentThreshold);

              if (analysisRes.success) {
                const contentData = {
                  screen: screen,
                  display: display,
                  analysisData: analysisRes.data,
                  currentThreshold: currentThreshold,
                  currentThresholdIndex: currentThresholdIndex,
                  lastUpdated: new Date().toISOString()
                };
                
                setContent(contentData);
                // Update ref for stable access in intervals
                thresholdIdsRef.current = display?.thresholdIds;
                localStorage.setItem(`screenContent_${screenName}`, JSON.stringify(contentData));
              } else {
                console.warn('Analysis failed for threshold:', currentThreshold, 'Error:', analysisRes.error);
              }
            } else {
              // No thresholds configured for this display
              const contentData = {
                screen: screen,
                display: display,
                analysisData: null,
                currentThreshold: null,
                currentThresholdIndex: 0,
                lastUpdated: new Date().toISOString(),
                error: 'No thresholds configured for this display'
              };
              setContent(contentData);
              localStorage.setItem(`screenContent_${screenName}`, JSON.stringify(contentData));
            }
          } else {
            console.warn('Display fetch failed for displayName:', screen.displayName, 'Error:', displayRes.error);
            setContent({
              screen: screen,
              display: null,
              analysisData: null,
              currentThreshold: null,
              currentThresholdIndex: 0,
              lastUpdated: new Date().toISOString(),
              error: `Failed to fetch display configuration: ${displayRes.error}`
            });
          }
        } else {
          console.warn('Screen fetch failed for screenName:', screenName, 'Error:', screenRes.error);
          setContent({
            screen: null,
            display: null,
            analysisData: null,
            currentThreshold: null,
            currentThresholdIndex: 0,
            lastUpdated: new Date().toISOString(),
            error: `Screen not found: ${screenName}`
          });
        }
      } catch (err) {
        console.error('Fetch exception (keeping last known data displayed):', err);
      }
    };

    // Initial fetch
    fetchContent();
    
  }, [screenName, currentThresholdIndex]);

  // CONSOLIDATED POLLING - Re-fetch data every X seconds using the CURRENT threshold
  useEffect(() => {
    if (!content?.display?.time || !content?.screen?.displayName) {
      return; // Wait until we have both screen and display config
    }

    const pollingTime = content.display.time; // Use configured time
    console.log(`Setting up polling every ${pollingTime}s (will use current threshold index: ${currentThresholdIndex})`);

    // Polling function uses currentThresholdIndex from React state
    const refreshData = async () => {
      try {
        // First fetch screen to get current displayName
        const screenRes = await fetchScreenConfig(screenName);
        if (screenRes.success && screenRes.screen && screenRes.screen.displayName) {
          // Then fetch display config using displayName from screen
          const displayRes = await fetchDisplayConfig(screenRes.screen.displayName);
          if (displayRes.success && displayRes.display) {
            const display = displayRes.display;
            const thresholdCount = display.thresholdIds?.length || 0;

            // Reset threshold index if out of bounds
            if (currentThresholdIndex >= thresholdCount) {
              console.log(`Polling: threshold index ${currentThresholdIndex} out of bounds, resetting to 0`);
              setCurrentThresholdIndex(0);
              return;
            }

            if (display.thresholdIds && thresholdCount > 0 && currentThresholdIndex < thresholdCount) {
              const currentThreshold = display.thresholdIds[currentThresholdIndex];

              if (currentThreshold?.collectionName && currentThreshold?.field) {
                const analysisRes = await analyzeKPIDataWithExcludedFields(currentThreshold);

                if (analysisRes.success) {
                  // UPDATE BOTH SCREEN, DISPLAY CONFIG AND ANALYSIS DATA
                  const updatedContent = {
                    screen: screenRes.screen, // Update screen config
                    display: display, // Update display config with latest thresholds
                    analysisData: analysisRes.data,
                    currentThreshold: currentThreshold,
                    currentThresholdIndex: currentThresholdIndex, // Use React state
                    lastUpdated: new Date().toISOString()
                  };

                  setContent(updatedContent);
                  thresholdIdsRef.current = display?.thresholdIds;
                  localStorage.setItem(`screenContent_${screenName}`, JSON.stringify(updatedContent));
                  console.log(`POLLING: Updated config & data for ${currentThreshold.collectionName}.${currentThreshold.field}`);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };
    const pollingInterval = setInterval(refreshData, pollingTime * 1000);

    return () => {
      console.log('🧹 Cleaning up polling interval');
      clearInterval(pollingInterval);
    };
  }, [content?.display?.time, screenName, currentThresholdIndex]); // Update dependencies

    // THRESHOLD INDEX BOUNDS CHECK USEEFFECT
  useEffect(() => {
    if (content?.display?.thresholdIds && currentThresholdIndex >= content.display.thresholdIds.length) {
      console.log(`RESETTING threshold index from ${currentThresholdIndex} to 0 (threshold count: ${content.display.thresholdIds.length})`);
      setCurrentThresholdIndex(0);
    }
  }, [content?.display?.thresholdIds?.length, currentThresholdIndex]);

  // THRESHOLD CYCLING USEEFFECT
  useEffect(() => {
    if (!content?.display?.thresholdIds || content.display.thresholdIds.length <= 1) {
      console.log('Skipping threshold cycling - only one or no thresholds');
      return; // No cycling needed for single threshold
    }

    const thresholdCount = content.display.thresholdIds.length;
    const cycleTime = content.display.time || 30;
    
    console.log(`Setting up threshold cycling for ${thresholdCount} thresholds, interval: ${cycleTime}s`);
    console.log('Current threshold list:', content.display.thresholdIds.map((t, i) => `${i + 1}. ${t.collectionName}.${t.field}`));

    const cycleThresholds = () => {
      setCurrentThresholdIndex(prevIndex => {
        const currentThresholds = thresholdIdsRef.current;
        if (!currentThresholds || currentThresholds.length <= 1) {
          return prevIndex; // Don't cycle if no thresholds
        }
        
        const nextIndex = (prevIndex + 1) % currentThresholds.length;
        console.log(`CYCLING TO THRESHOLD ${nextIndex + 1}/${currentThresholds.length} (from ${prevIndex + 1})`);
        return nextIndex;
      });
    };

    // Set up threshold cycling interval based on display.time
    const cycleIntervalId = setInterval(cycleThresholds, cycleTime * 1000);
    setCycleInterval(cycleIntervalId);

    return () => {
      console.log(`🧹 Cleaning up threshold cycling interval (was ${thresholdCount} thresholds)`);
      if (cycleIntervalId) {
        clearInterval(cycleIntervalId);
      }
    };
  }, [content?.display?.thresholdIds?.length, content?.display?.time]);

  if (!content) {
    return (
      <KPIAnalysisLayout
        key={`loading-${screenName}`}
        title="Loading..."
        subtitle={`Loading screen: ${screenName || 'N/A'}`}
        analysisData={null}
        field=""
        collectionName=""
        actionButtons={null}
        emptyStateTitle="Loading Screen"
        emptyStateMessage="Please wait while we fetch your screen configuration..."
      />
    );
  }

  // Handle error states
  if (content.error) {
    return (
      <KPIAnalysisLayout
        key={`error-${screenName}`}
        title={`Screen: ${screenName}`}
        subtitle={content.screen ? `Display: ${content.screen.displayName || 'Not configured'}` : 'Screen not found'}
        analysisData={null}
        field=""
        collectionName=""
        actionButtons={null}
        emptyStateTitle="Configuration Error"
        emptyStateMessage={content.error}
      />
    );
  }

  const { screen, display, analysisData, currentThreshold } = content;

  // Format the last updated time for display
  const formatLastUpdated = () => {
    if (!content?.lastUpdated) return { time: 'Never', date: '' };
    
    const lastUpdate = new Date(content.lastUpdated);
    const now = new Date();
    
    // Format time as HH:MM:SS
    const timeStr = lastUpdate.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Format date - show date if not today
    const isToday = lastUpdate.toDateString() === now.toDateString();
    const dateStr = isToday ? 'Today' : lastUpdate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return { time: timeStr, date: dateStr };
  };

  const { time: lastUpdatedTime, date: lastUpdatedDate } = formatLastUpdated();

  return (
    <>
      {/* Last Updated Timestamp in bottom-right corner */}
      <LastUpdatedTimestamp>
        <span className="label">Last Updated:</span>
        <div className="time">{lastUpdatedTime}</div>
        <div className="date">{lastUpdatedDate}</div>
      </LastUpdatedTimestamp>
      <KPIAnalysisLayout
        key={`${screenName}-${currentThresholdIndex}-${currentThreshold?._id}`}
        title={`Screen: ${screen?.screenName || screenName}`}
        subtitle={`Display: ${screen?.displayName || 'N/A'} | ${screen?.description || ''} | Collection: ${currentThreshold?.collectionName || 'N/A'} | Field: ${currentThreshold?.field || 'N/A'} | Polling: ${display?.time || 30}s | Threshold: ${(currentThresholdIndex || 0) + 1}/${display?.thresholdIds?.length || 1}`}
        analysisData={analysisData}
        field={currentThreshold?.field}
        collectionName={currentThreshold?.collectionName}
        actionButtons={null}
        emptyStateTitle="No Analysis Data Available"
        emptyStateMessage={analysisData ? "No data could be analyzed for this display configuration." : "Display configuration is loading or not available."}
      />
      
    </>
  );
};

export default KPIAnalysisPage;
