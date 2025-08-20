import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch display configuration
        const displayRes = await fetchDisplayConfig(displayName);
        
        if (displayRes.success && displayRes.display) {
          const display = displayRes.display;

          if (display.thresholdIds && display.thresholdIds.length > 0) {
            const firstThreshold = display.thresholdIds[0];
            
            // Analyze data using the first threshold
            const analysisRes = await analyzeKPIData({
              collectionName: firstThreshold.collectionName,
              field: firstThreshold.field,
              greenThreshold: firstThreshold.green,
              amberThreshold: firstThreshold.amber,
              direction: firstThreshold.direction
            });
            
            if (analysisRes.success) {
              const contentData = {
                display: display,
                analysisData: analysisRes.data,
                currentThreshold: firstThreshold,
                lastUpdated: new Date().toISOString()
              };
              
              setContent(contentData);
              localStorage.setItem(`displayContent_${displayName}`, JSON.stringify(contentData));
            }
          }
        }
      } catch (err) {
        console.error('Fetch exception (keeping last known data displayed):', err);
      }
    };

    fetchContent();
    let interval;
    if (content?.display?.time) {
      interval = setInterval(fetchContent, content.display.time * 1000);
    } else {
      // Default polling every 30 seconds if no time specified
      interval = setInterval(fetchContent, 30000);
    }

    return () => clearInterval(interval);
  }, [displayName, content?.display?.time]);

  if (!content) {
    return (
      <KPIAnalysisLayout
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
        title={`KPI Dashboard: ${displayName}`}
        subtitle={`Collection: ${currentThreshold?.collectionName || 'N/A'} | Field: ${currentThreshold?.field || 'N/A'} | Polling: ${display?.time || 30}s`}
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
