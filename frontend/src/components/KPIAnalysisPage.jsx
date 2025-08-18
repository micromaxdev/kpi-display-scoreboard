import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import KPIAnalysisLayout from './KPIAnalysisLayout';
import styled from 'styled-components';

const ActionButtons = styled.div`
  margin-bottom: 1.5rem;
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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
