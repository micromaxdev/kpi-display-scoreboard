import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const DataTableContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const Header = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid #e1e5e9;
  padding-bottom: 1rem;
  flex-shrink: 0;

  h3 {
    color: #333 !important;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    color: #666 !important;
    margin: 0;
    font-size: 0.9rem;
  }
`;

export const FieldLegend = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #333 !important;
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333 !important;
`;

export const LegendDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => (p.$type === 'measurable' ? '#667eea' : '#e1e5e9')};
`;

export const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const Th = styled.th`
  background: ${(p) => (p.$measurable ? '#e3f2fd' : '#f8f9fa')};
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: ${(p) => (p.$measurable ? '#1565c0' : '#333')} !important;
  border-bottom: 2px solid ${(p) => (p.$measurable ? '#667eea' : '#e1e5e9')};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
  max-width: 200px;
  word-wrap: break-word;
  color: #333 !important;
  background: ${(p) => (p.$measurable ? 'rgba(102, 126, 234, 0.05)' : 'white')};
  font-weight: ${(p) => (p.$measurable ? 500 : 400)};

  tr:hover & {
    background: ${(p) => (p.$measurable ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)')};
  }
`;

export const TableFooter = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e1e5e9;
  color: #666;
  text-align: center;
`;

export const CenteredContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #333 !important;
  padding: 2rem;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  p {
    font-size: 1rem !important;
    line-height: 1.5;
    max-width: 300px;
    color: #555 !important;
    font-weight: 500;
    margin: 0;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loading = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  p {
    margin-top: 1rem;
    color: #667eea !important;
    font-weight: 500;
  }
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const MeasurableIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.8rem;
`;

export const ErrorText = styled.p`
  color: #dc3545 !important;
`;
