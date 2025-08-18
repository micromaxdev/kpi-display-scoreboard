import { useLocation, useNavigate } from 'react-router-dom';
import KPIAnalysisLayout from './KPIAnalysisLayout';
import { ActionButtons, BackButton } from '../styles/KpiLayout.styled';

const KPIPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get analysis data from navigation state
  const { analysisData, field, collectionName } = location.state || {};
  
  const handleBackToForm = () => {
    navigate('/');
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
