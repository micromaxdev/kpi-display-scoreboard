import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import KPIAnalysisLayout from '../layout/KPIAnalysisLayout';
import { ActionButtons, BackButton, DownloadButton } from '../../styles/KpiLayout.styled';
import { downloadExcel } from '../../services/apiService';

const KPIPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get analysis data from navigation state
  const { analysisData, field, collectionName, greenThreshold, amberThreshold, direction } = location.state || {};
  
  const handleBackToForm = () => {
    navigate('/');z
  };

  const handleDownload = async () => {
    // Check each value individually
    if (!collectionName) {
      alert('Missing collectionName for download. Please go back to the form and try again.');
      return;
    }
    if (!field) {
      alert('Missing field for download. Please go back to the form and try again.');
      return;
    }
    if (greenThreshold === undefined || greenThreshold === null) {
      alert('Missing greenThreshold for download. Please go back to the form and try again.');
      return;
    }
    if (amberThreshold === undefined || amberThreshold === null) {
      alert('Missing amberThreshold for download. Please go back to the form and try again.');
      return;
    }
    if (!direction) {
      alert('Missing direction for download. Please go back to the form and try again.');
      return;
    }

    setIsDownloading(true);
    try {
      const result = await downloadExcel({
        collectionName,
        field,
        greenThreshold,
        amberThreshold,
        direction
      });

      if (result.success) {
        console.log('Download successful:', result.message);
      } else {
        alert(`Download failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the file.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Create action buttons for preview page
  const actionButtons = (
    <ActionButtons>
      <BackButton
        onClick={handleBackToForm}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        ← Back to Form
      </BackButton>
      
      <DownloadButton
        onClick={handleDownload}
        disabled={isDownloading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isDownloading ? 'Downloading...' : 'Download File'}
      </DownloadButton>
    </ActionButtons>
  );

  return (
    <KPIAnalysisLayout
      title="KPI Analysis Preview"
      subtitle={`Preview your analysis results | Collection: ${collectionName || 'N/A'} | Field: ${field || 'N/A'}`}
      analysisData={analysisData}
      field={field}
      collectionName={collectionName}
      actionButtons={actionButtons}
      emptyStateTitle="No Preview Data Available"
      emptyStateMessage="Please go back to the form and submit your threshold configuration."
    />
  );
};

export default KPIPreviewPage;
