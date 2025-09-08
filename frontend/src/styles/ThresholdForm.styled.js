import styled from 'styled-components';
import { motion } from 'framer-motion';

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

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
  margin-top: 1rem;
  min-height: calc(100vh - 120px);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    height: calc(100vh - 100px);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    height: calc(100vh - 80px);
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const DataSection = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: calc(700px + 120px + 1rem);
`;

export const CardForm = styled(motion.form)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  overflow: visible;

  @media (max-width: 1200px) {
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  overflow-y: visible;
`;

export const CollectionSection = styled.div`
  width: 100%;
`;

export const ConfigSection = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FieldSection = styled.div`
  width: 100%;
`;

export const ThresholdSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DirectionSuggestion = styled.div`
  margin-top: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
`;

export const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #495057 !important;
`;

export const SuggestionIcon = styled.span`
  font-size: 1.1rem;
`;

export const SuggestionContent = styled.div`
  color: #495057 !important;
`;

export const SuggestionText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const SuggestedDirection = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  background: ${(p) => (p.$type === 'higher' ? '#d4edda' : '#fff3cd')};
  color: ${(p) => (p.$type === 'higher' ? '#155724' : '#856404')} !important;
  border: 1px solid ${(p) => (p.$type === 'higher' ? '#c3e6cb' : '#ffeaa7')};
`;

export const ConfidenceBadge = styled.span`
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background: ${(p) => (p.$level === 'high' ? '#d4edda' : p.$level === 'medium' ? '#fff3cd' : '#f8d7da')};
  color: ${(p) => (p.$level === 'high' ? '#155724' : p.$level === 'medium' ? '#856404' : '#721c24')} !important;
`;

export const SuggestionExplanation = styled.p`
  margin: 0.5rem 0;
  color: #6c757d !important;
  font-style: italic;
`;

export const ApplySuggestionButton = styled.button`
  padding: 0.375rem 0.75rem;
  background: #007bff;
  color: white !important;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

export const ThresholdError = styled.div`
  margin-top: 0.125rem;
  padding: 0.05rem 0.25rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 21px;
  color: #721c24 !important;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.15rem;
`;

export const ErrorIcon = styled.span`
  font-size: 0.7rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    color: #333 !important;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input,
  select {
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    color: #333 !important;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  input:disabled,
  select:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }

  select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    appearance: none;
    cursor: pointer;
  }
`;

export const SelectedInfo = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1565c0 !important;
  font-weight: 500;
`;

export const FieldHelp = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #856404 !important;

  small {
    display: block;
    line-height: 1.4;
    color: #856404 !important;
  }
`;

export const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  background: ${(p) => (p.$type === 'success' ? '#d4edda' : '#f8d7da')};
  color: ${(p) => (p.$type === 'success' ? '#155724' : '#721c24')};
  border: 1px solid ${(p) => (p.$type === 'success' ? '#c3e6cb' : '#f5c6cb')};
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0;
  margin-left: 1rem;

  &:hover {
    opacity: 1;
  }
`;

export const ThresholdInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  min-height: 120px;

  h3 {
    color: #333 !important;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #333 !important;
`;

export const ColorIndicator = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$color === 'green' ? '#28a745' : p.$color === 'amber' ? '#ffc107' : '#dc3545')};
`;

export const SubmitBtn = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ResetBtn = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e1e5e9;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #dee2e6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Inline info tooltip for form labels
export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const InfoHelp = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Keep keyboard accessibility: reveal on focus without motion */
  &:focus-within > div {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

export const InfoIcon = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #667eea;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  cursor: help;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: #5567d6;
  }

  &:focus {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: 360px; /* landscape rectangle */
  max-width: 80vw; /* keep responsive on small screens */
  background: #fff;
  color: #333;
  border: 1px solid #e1e5e9;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: normal;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 10px;
    width: 12px;
    height: 12px;
    background: #fff;
    border-left: 1px solid #e1e5e9;
    border-top: 1px solid #e1e5e9;
    transform: rotate(45deg);
  }

  strong { color: #111; }
`;

export const UploadButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.675rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CollectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;