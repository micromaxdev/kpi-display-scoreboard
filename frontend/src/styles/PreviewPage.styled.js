import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PreviewPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

export const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;

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
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .count {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .percentage {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

export const ThresholdInfo = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;

  h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.5rem;
  }

  .threshold-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .threshold-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;

    .label {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
    }
  }
`;

export const DataSection = styled.div`
  h3 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? '#667eea' : '#e9ecef'};
  color: ${props => props.$active ? 'white' : '#6c757d'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#5a6fd8' : '#dee2e6'};
    transform: translateY(-2px);
  }
`;

export const DataTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.div`
  font-size: 0.9rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.customer-name {
    font-weight: 500;
  }

  &.amount {
    font-weight: 600;
    color: ${props => props.$negative ? '#dc3545' : '#28a745'};
    font-family: 'Monaco', 'Menlo', monospace;
  }

  &.category {
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      text-align: center;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      background: ${props => {
        switch(props.$category) {
          case 'green': return '#28a745';
          case 'amber': return '#ffc107';
          case 'red': return '#dc3545';
          default: return '#6c757d';
        }
      }};
    }
  }

  &.comparison {
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 500;
    color: ${props => props.$negative ? '#dc3545' : '#28a745'};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #495057;
  }
`;
