import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DisplaySection = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #2d3748;
    font-size: 18px;
    font-weight: 600;
  }
  
  .description {
    color: #718096;
    font-size: 14px;
    margin-top: 4px;
  }
`;

export const DisplayDropdown = styled.select`
  width: 300px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: white;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TimeSettingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const TimeLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  white-space: nowrap;
`;

export const TimeUnit = styled.span`
  font-size: 13px;
  color: #718096;
  font-weight: 500;
`;

export const TimeButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #4a5568;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
  
  &:active {
    background: #edf2f7;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ThresholdsContainer = styled.div`
  margin-top: 20px;
`;

export const ThresholdsGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  margin-top: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
`;

export const ThresholdTab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  transform: ${props => props.$isDragging ? 'rotate(2deg)' : 'none'};
  box-shadow: ${props => props.$isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  opacity: ${props => props.$isDragging ? 0.8 : 1};
  flex-shrink: 0;
  min-width: 200px;
  white-space: nowrap;
  
  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  color: #a0aec0;
  font-size: 14px;
  cursor: grab;
  padding: 2px;
  
  &:hover {
    color: #718096;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

export const OrderNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #4299e1;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const ThresholdInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CollectionName = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
`;

export const FieldName = styled.span`
  color: #718096;
  font-size: 12px;
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: #fed7d7;
  color: #c53030;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  
  &:hover {
    background: #feb2b2;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ThresholdsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  
  h4 {
    margin: 0;
    color: #2d3748;
    font-size: 16px;
    font-weight: 600;
  }
  
  .count {
    color: #718096;
    font-size: 14px;
  }
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #718096;
  font-style: italic;
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #4299e1;
  animation: spin 1s ease-in-out infinite;
  margin-left: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ConfirmationDialog = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

export const ConfirmationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .icon {
    font-size: 24px;
    color: #e53e3e;
  }
  
  h3 {
    margin: 0;
    color: #2d3748;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const ConfirmationBody = styled.div`
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 24px;
  
  .threshold-info {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin: 12px 0;
    
    .collection {
      font-weight: 600;
      color: #2d3748;
    }
    
    .field {
      color: #718096;
      font-size: 14px;
    }
  }
`;

export const ConfirmationActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

export const DeleteButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #e53e3e;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c53030;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const HeaderActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CycleTimeInput = styled.input`
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  background: white;
  color: black;
  font-weight: bold;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormattedTimeDisplay = styled.div`
  font-size: 11px;
  color: #718096;
  margin-left: 8px;
  white-space: nowrap;
`;

export const ErrorCloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: 8px;
  font-size: 16px;
  
  &:hover {
    opacity: 0.8;
  }
`;

export const DynamicThresholdTab = styled(ThresholdTab)`
  opacity: ${props => props.$dragOverIndex === props.$index ? 0.5 : 1};
  transform: ${props => props.$dragOverIndex === props.$index ? 'scale(1.05)' : 'none'};
`;
