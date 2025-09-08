import React, { useState, useEffect } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FieldsSection,
  SectionTitle,
  InstructionText,
  FieldsList,
  FieldItem,
  FieldCheckbox,
  FieldName,
  ButtonGroup,
  CancelButton,
  SaveButton,
  ErrorMessage
} from '../../styles/ExcludedFieldsModal.styled';

const ExcludedFieldsModal = ({ 
  isOpen, 
  onClose, 
  collectionFields = [],
  onExcludedFieldsChange,
  initialExcludedFields = []
}) => {
  const [includedFields, setIncludedFields] = useState(new Set());
  const [originalIncludedFields, setOriginalIncludedFields] = useState(new Set());
  const [error, setError] = useState(null);

  // Initialize fields when modal opens or when initialExcludedFields changes
  useEffect(() => {
    if (isOpen && collectionFields.length > 0) {
      // Create a set of included fields (all fields except excluded ones)
      const includedSet = new Set();
      collectionFields.forEach(field => {
        if (!initialExcludedFields.includes(field)) {
          includedSet.add(field);
        }
      });
      
      setIncludedFields(includedSet);
      setOriginalIncludedFields(new Set(includedSet));
      console.log('Initialized with excluded fields:', initialExcludedFields);
      console.log('Included fields:', Array.from(includedSet));
    }
  }, [isOpen, collectionFields, initialExcludedFields]);

  const handleFieldToggle = (fieldName) => {
    setIncludedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName); // Remove from included (add to excluded)
      } else {
        newSet.add(fieldName); // Add to included (remove from excluded)
      }
      return newSet;
    });
    setError(null);
  };

  const handleApply = () => {
    // Calculate excluded fields (fields that are NOT included)
    const excludedFields = collectionFields.filter(field => !includedFields.has(field));
    
    console.log('Applying excluded fields:', excludedFields);
    console.log('Included fields:', Array.from(includedFields));
    
    // Notify parent component about the changes
    if (onExcludedFieldsChange) {
      onExcludedFieldsChange(excludedFields);
    }
    
    setOriginalIncludedFields(new Set(includedFields));
    onClose();
  };

  const handleCancel = () => {
    setIncludedFields(new Set(originalIncludedFields));
    setError(null);
    onClose();
  };

  const hasChanges = includedFields.size !== originalIncludedFields.size || 
    !Array.from(includedFields).every(field => originalIncludedFields.has(field));

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Manage Field Visibility</ModalTitle>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </ModalHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FieldsSection>
          <SectionTitle>
            Field Visibility ({collectionFields.length} total fields)
          </SectionTitle>
          <InstructionText>
            ✅ Checked = Field will be shown in analysis | ❌ Unchecked = Field will be excluded
          </InstructionText>
          
          {collectionFields.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No fields available for this collection
            </div>
          ) : (
            <FieldsList>
              {collectionFields.map(fieldName => (
                <FieldItem key={fieldName}>
                  <FieldCheckbox
                    type="checkbox"
                    id={`field-${fieldName}`}
                    checked={includedFields.has(fieldName)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleFieldToggle(fieldName);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FieldName onClick={() => handleFieldToggle(fieldName)}>
                    {fieldName}
                  </FieldName>
                </FieldItem>
              ))}
            </FieldsList>
          )}
        </FieldsSection>

        <ButtonGroup>
          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SaveButton 
            onClick={handleApply} 
            disabled={!hasChanges}
          >
            Apply Changes
          </SaveButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExcludedFieldsModal;
