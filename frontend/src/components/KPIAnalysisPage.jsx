import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {LastUpdatedTimestamp} from '../styles/KpiLayout.styled.js';
import KPIAnalysisLayout from './KPIAnalysisLayout';
import { fetchDisplayConfig, analyzeKPIData } from '../services/apiService';


const KPIAnalysisPage = () => {
  const { displayName } = useParams();
  
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(`displayContent_${displayName}`);
    return saved ? JSON.parse(saved) : null;
  });

  // THRESHOLD CYCLING STATE
  const [currentThresholdIndex, setCurrentThresholdIndex] = useState(0);
  const [cycleInterval, setCycleInterval] = useState(null);
  
  // Ref to store current threshold IDs for stable access in intervals
  const thresholdIdsRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log(`Fetching content for displayName: ${displayName}, currentThresholdIndex: ${currentThresholdIndex}`);
        
        // Fetch display configuration
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
            const analysisRes = await analyzeKPIData({
              collectionName: currentThreshold.collectionName,
              field: currentThreshold.field,
              greenThreshold: currentThreshold.green,
              amberThreshold: currentThreshold.amber,
              direction: currentThreshold.direction
            });
            
            if (analysisRes.success) {
              const contentData = {
                display: display,
                analysisData: analysisRes.data,
                currentThreshold: currentThreshold,
                currentThresholdIndex: currentThresholdIndex,
                lastUpdated: new Date().toISOString()
              };
              
              setContent(contentData);
              // Update ref for stable access in intervals
              thresholdIdsRef.current = display?.thresholdIds;
              localStorage.setItem(`displayContent_${displayName}`, JSON.stringify(contentData));
            } else {
              console.warn('Analysis failed for threshold:', currentThreshold, 'Error:', analysisRes.error);
            }
          }
        }
      } catch (err) {
        console.error('Fetch exception (keeping last known data displayed):', err);
      }
    };

    // Initial fetch
    fetchContent();
    
  }, [displayName, currentThresholdIndex]);

  // CONSOLIDATED POLLING - Re-fetch data every X seconds using the CURRENT threshold
  useEffect(() => {
    if (!content?.display?.time) {
      return; // Wait until we have display config
    }

    const pollingTime = content.display.time; // Use configured time
    console.log(`Setting up polling every ${pollingTime}s (will use current threshold index: ${currentThresholdIndex})`);

    // Use the same fetchContent function but call it on interval
    const refreshData = async () => {
      try {
        // Get fresh current values instead of closure variables
        const currentContent = JSON.parse(localStorage.getItem(`displayContent_${displayName}`) || 'null');
        const currentIndex = currentContent?.currentThresholdIndex || 0;
        const currentThresholdCount = currentContent?.display?.thresholdIds?.length || 0;
        
        console.log(`POLLING: Refreshing data and config for threshold ${currentIndex + 1}/${currentThresholdCount}`);
        
        const displayRes = await fetchDisplayConfig(displayName);
        if (displayRes.success && displayRes.display) {
          const display = displayRes.display;
          
          // CHECK FOR CONFIGURATION CHANGES
          const oldThresholdCount = currentThresholdCount;
          const newThresholdCount = display.thresholdIds.length;
          
          if (oldThresholdCount !== newThresholdCount) {
            console.log(`THRESHOLD COUNT CHANGED: ${oldThresholdCount} → ${newThresholdCount}. Refreshing full configuration.`);
            
            // Reset threshold index if it's out of bounds
            if (currentIndex >= newThresholdCount) {
              console.log(`Resetting threshold index from ${currentIndex} to 0`);
              setCurrentThresholdIndex(0);
              return; // Exit and let the main useEffect handle the reset
            }
          }
          
          if (display.thresholdIds && display.thresholdIds.length > 0 && currentIndex < display.thresholdIds.length) {
            const currentThreshold = display.thresholdIds[currentIndex];
            
            if (currentThreshold?.collectionName && currentThreshold?.field) {
              const analysisRes = await analyzeKPIData({
                collectionName: currentThreshold.collectionName,
                field: currentThreshold.field,
                greenThreshold: currentThreshold.green,
                amberThreshold: currentThreshold.amber,
                direction: currentThreshold.direction
              });
              
              if (analysisRes.success) {
                // UPDATE BOTH DISPLAY CONFIG AND ANALYSIS DATA
                const updatedContent = {
                  display: display, // Update display config with latest thresholds
                  analysisData: analysisRes.data,
                  currentThreshold: currentThreshold,
                  currentThresholdIndex: currentIndex, // Use fresh current index
                  lastUpdated: new Date().toISOString()
                };
                
                setContent(updatedContent);
                // Update ref immediately when content changes
                thresholdIdsRef.current = display?.thresholdIds;
                localStorage.setItem(`displayContent_${displayName}`, JSON.stringify(updatedContent));
                console.log(`POLLING: Updated config & data for ${currentThreshold.collectionName}.${currentThreshold.field}`);
              }
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };    const pollingInterval = setInterval(refreshData, pollingTime * 1000);
    
    return () => {
      console.log('🧹 Cleaning up polling interval');
      clearInterval(pollingInterval);
    };
  }, [content?.display?.time, displayName]); // Removed currentThresholdIndex dependency

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
        key={`loading-${displayName}`}
        title="Loading..."
        subtitle={`Loading display: ${displayName || 'N/A'}`}
        analysisData={null}
        field=""
        collectionName=""
        actionButtons={null}
        emptyStateTitle="Loading Display"
        emptyStateMessage="Please wait while we fetch your display configuration..."
      />
    );
  }

  const { display, analysisData, currentThreshold } = content;

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
        key={`${displayName}-${currentThresholdIndex}-${currentThreshold?._id}`}
        title={`KPI Dashboard: ${displayName}`}
        subtitle={`Collection: ${currentThreshold?.collectionName || 'N/A'} | Field: ${currentThreshold?.field || 'N/A'} | Polling: ${display?.time || 30}s | Threshold: ${(currentThresholdIndex || 0) + 1}/${display?.thresholdIds?.length || 1}`}
        analysisData={analysisData}
        field={currentThreshold?.field}
        collectionName={currentThreshold?.collectionName}
        actionButtons={null}
        emptyStateTitle="No Analysis Data Available"
        emptyStateMessage="No data could be analyzed for this display configuration."
      />
      
    </>
  );
};

export default KPIAnalysisPage;
