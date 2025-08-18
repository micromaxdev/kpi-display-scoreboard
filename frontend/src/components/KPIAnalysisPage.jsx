import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import KPIAnalysisLayout from './KPIAnalysisLayout';
import styled from 'styled-components';

const ActionButtons = styled.div`
  margin-bottom: 1.5rem;
`;

const BackButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const KPIAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get analysis data from navigation state
  const { analysisData, field, collectionName } = location.state || {};
  
  const handleBackToForm = () => {
    navigate('/');
  };

  // Create action buttons for analysis page
  const actionButtons = (
    <ActionButtons>
      <BackButton
        onClick={handleBackToForm}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
      title="KPI Analysis Results"
      subtitle={`Detailed analysis of your thresholds | Collection: ${collectionName || 'N/A'} | Field: ${field || 'N/A'}`}
      analysisData={analysisData}
      field={field}
      collectionName={collectionName}
      actionButtons={actionButtons}
      emptyStateTitle="No Analysis Data Available"
      emptyStateMessage="Please go back to the form and submit your threshold configuration."
    />
  );
};

export default KPIAnalysisPage;
