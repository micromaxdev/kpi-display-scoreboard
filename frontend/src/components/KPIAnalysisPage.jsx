import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import KPIAnalysisLayout from './KPIAnalysisLayout';
import styled from 'styled-components';

const KPIAnalysisPage = () => {
  const location = useLocation();
  
  // Get analysis data from navigation state
  const { analysisData, field, collectionName } = location.state || {};
  

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
