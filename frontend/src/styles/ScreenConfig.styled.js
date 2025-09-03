import styled from 'styled-components';
import { motion } from 'framer-motion';

// Reusing the main page wrapper from ThresholdForm
export const Page = styled.div`
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Header = styled(motion.div)`
  margin-bottom: 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  color: white;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const ActionsBar = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 250px;
  background: white;
  color: black;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #6c757d;
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

export const StatsText = styled.div`
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  &.secondary {
    background: #6c757d;
    color: white;
    &:hover {
      background: #545b62;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
    }
  }

  &.danger {
    background: #dc3545;
    color: white;
    &:hover {
      background: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
    }
  }

  &.success {
    background: #28a745;
    color: white;
    &:hover {
      background: #1e7e34;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const ScreenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ScreenCard = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ScreenName = styled.h3`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

export const ScreenDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const Status = styled.div`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;

  &.assigned {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  &.unassigned {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
`;

export const AssignmentSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: black;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:hover {
    border-color: #667eea;
  }
`;

export const UrlDisplay = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;
  min-height: 2.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
  
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

export const CopyButton = styled(motion.button)`
  padding: 0.4rem 0.8rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 70px;

  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  &.copied {
    background: #28a745;
    border-color: #28a745;
    color: white;
    transform: scale(1.05);
  }
`;

export const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

export const EmptyStateTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

export const EmptyStateMessage = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

// Modal styles (reusing from existing pattern)
export const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: white;
  color: black;
  font-family: 'Arial', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:hover {
    border-color: #667eea;
  }
`;

export const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  font-weight: 500;
`;

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95
  }
};
