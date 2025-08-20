import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PreviewPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: clamp(0.5rem, 1.5vw, 2rem);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
`;

export const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;

  h1 {
    font-size: 2.8rem;
    margin-bottom: 0.75rem;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
`;

export const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const BackButton = styled(motion.button)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

export const DownloadButton = styled(motion.button)`
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #218838, #1ea085);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

export const SummaryCard = styled(motion.div)`
  background: ${props => {
    switch(props.$category) {
      case 'green': return 'linear-gradient(135deg, #4CAF50, #45a049)';
      case 'amber': return 'linear-gradient(135deg, #FF9800, #f57c00)';
      case 'red': return 'linear-gradient(135deg, #f44336, #d32f2f)';
      case 'total': return 'linear-gradient(135deg, #2196F3, #1976d2)';
      default: return 'linear-gradient(135deg, #9E9E9E, #757575)';
    }
  }};
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateX(0);
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .count {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .percentage {
    font-size: 1rem;
    opacity: 0.9;
    font-weight: 500;
  }
`;

export const ThresholdInfo = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  h3 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
  }

  .threshold-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .threshold-item {
    background: white;
    padding: 1.25rem;
    border-radius: 12px;
    border-left: 4px solid #667eea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .label {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2c3e50;
    }
  }
`;

export const DataSection = styled.div`
  h3 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const CategoryTab = styled.button`
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? '#667eea' : '#e9ecef'};
  color: ${props => props.$active ? 'white' : '#6c757d'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.$active ? '#5a6fd8' : '#dee2e6'};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const DataTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: clamp(100px, 18vh, 180px);
  max-height: clamp(160px, 28vh, 420px);
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  width: 100%;
  font-size: clamp(0.85rem, 0.55vw + 0.5rem, 1rem);
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar { height: 8px; width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
`;

export const TableHeader = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: clamp(0.45rem, 0.4vw + 0.3rem, 0.7rem);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
  font-size: clamp(0.9rem, 0.6vw + 0.55rem, 1.05rem);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: fit-content;

  .measurable {
    background: rgba(102, 126, 234, 0.12);
    border-radius: 8px;
    color: #2c3e50;
  }
`;

export const TableRow = styled(motion.div)`
  display: grid;
  gap: 0.5rem;
  padding: clamp(0.45rem, 0.4vw + 0.3rem, 0.7rem);
  border-bottom: 1px solid #f8f9fa;
  transition: all 0.2s ease;
  position: relative;
  min-width: fit-content;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.div`
  font-size: clamp(0.85rem, 0.55vw + 0.5rem, 1rem);
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding: clamp(0.25rem, 0.3vw + 0.15rem, 0.45rem);
  min-width: 0;

  &.measurable {
    background: rgba(102, 126, 234, 0.08);
    border-left: 3px solid #667eea;
  }

  &.rag-indicator {
    justify-content: center;
    
    .rag-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      position: relative;
      flex-shrink: 0;
      
      &.red { background: linear-gradient(135deg, #dc3545, #c82333); border-color: #dc3545; }
      &.amber { background: linear-gradient(135deg, #ffc107, #e0a800); border-color: #ffc107; }
      &.green { background: linear-gradient(135deg, #28a745, #1e7e34); border-color: #28a745; }
      
      &::after {
        content: '';
        position: absolute;
        top: 1px; left: 1px; right: 1px; bottom: 1px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &.customer-name { font-weight: 500; }

  &.amount {
    font-weight: 600;
    color: ${props => props.$negative ? '#dc3545' : '#28a745'};
    font-family: 'Monaco', 'Menlo', monospace;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6c757d;

  .icon {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  h3 {
    margin-bottom: 0.75rem;
    color: #495057;
    font-size: 1.3rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;
// Styled component for last updated timestamp
export const LastUpdatedTimestamp = styled.div`
  position: fixed;
  top: clamp(40px, 2vh, 40px);
  right: clamp(20px, 3vw, 70px);
  color: black;
  font-size: clamp(0.75rem, 0.5vw + 0.4rem, 0.85rem);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 1000;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  min-width: clamp(120px, 15vw, 180px);
  max-width: clamp(180px, 20vw, 250px);
  
  @media (max-width: 768px) {
    top: clamp(15px, 2vh, 25px);
    right: clamp(10px, 2vw, 20px);
    font-size: clamp(0.7rem, 1.2vw, 0.8rem);
    min-width: clamp(100px, 20vw, 150px);
  }
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    font-size: clamp(0.65rem, 1.5vw, 0.75rem);
    min-width: clamp(90px, 25vw, 130px);
  }
  
  .label {
    opacity: 0.8;
    margin-right: clamp(4px, 0.3vw, 6px);
  }
  
  .time {
    font-weight: 500;
  }
  
  .date {
    font-size: clamp(0.65rem, 0.4vw + 0.35rem, 0.75rem);
    opacity: 0.9;
    margin-top: clamp(1px, 0.1vw, 2px);
  }
`;