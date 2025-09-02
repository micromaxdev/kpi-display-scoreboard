import { motion, AnimatePresence } from 'framer-motion';
import {
  FieldSection,
  FormGroup,
  SelectedInfo,
  FieldHelp,
  DirectionSuggestion,
  SuggestionHeader,
  SuggestionIcon,
  SuggestionContent,
  SuggestionText,
  SuggestedDirection,
  ConfidenceBadge,
  SuggestionExplanation,
  ApplySuggestionButton
} from '../../styles/ThresholdForm.styled';
import { getPlaceholderText, formatFieldDisplayName } from '../../utils/formUtils';

const FieldSelector = ({
  selectedCollection,
  selectedField,
  fields,
  loading,
  direction,
  directionSuggestion,
  onFieldChange,
  onApplySuggestion
}) => {
  return (
    <FieldSection>
      <FormGroup>
        <label htmlFor="field">
          Field * <span className="field-info">(Only measurable fields shown)</span>
        </label>
        <select
          id="field"
          value={selectedField}
          onChange={(e) => {
            console.log('Selected field:', e.target.value);
            onFieldChange(e.target.value);
          }}
          disabled={!selectedCollection}
          required
        >
          <option value="">
            {getPlaceholderText({ selectedCollection, fields, loading }, 'field')}
          </option>
          {fields.map((field, index) => (
            <option key={`field-${index}`} value={field}>
              {formatFieldDisplayName(field)}
            </option>
          ))}
        </select>
        {selectedField && (
          <SelectedInfo>Selected: {formatFieldDisplayName(selectedField)}</SelectedInfo>
        )}
        {selectedCollection && fields.length === 0 && !loading && (
          <FieldHelp>
            <small>Only showing fields suitable for KPI measurement (amounts, dates, counts, etc.)</small>
          </FieldHelp>
        )}
        
        {/* Direction Suggestion with animation */}
        <AnimatePresence initial={false} mode="wait">
          {selectedField && directionSuggestion.suggestion && (
            <DirectionSuggestion
              as={motion.div}
              key={`${selectedField}-${directionSuggestion.suggestion}`}
              layout
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } }}
            >
              <SuggestionHeader as={motion.div} layout>
                <SuggestionIcon as={motion.span} initial={{ rotate: -8 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>💡</SuggestionIcon>
                <strong>Smart Suggestion:</strong>
              </SuggestionHeader>
              <SuggestionContent as={motion.div} layout>
                <SuggestionText as={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                  <SuggestedDirection $type={directionSuggestion.suggestion}>
                    {directionSuggestion.suggestion === 'higher' ? 'Higher is Better' : 'Lower is Better'}
                  </SuggestedDirection>
                  <ConfidenceBadge as={motion.span} $level={directionSuggestion.confidence} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 250, damping: 16 }}>
                    {directionSuggestion.confidence} confidence
                  </ConfidenceBadge>
                </SuggestionText>
                <SuggestionExplanation as={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  {directionSuggestion.explanation}
                </SuggestionExplanation>
                {direction !== directionSuggestion.suggestion && (
                  <ApplySuggestionButton
                    as={motion.button}
                    type="button"
                    onClick={onApplySuggestion}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Apply Suggestion
                  </ApplySuggestionButton>
                )}
              </SuggestionContent>
            </DirectionSuggestion>
          )}
        </AnimatePresence>
      </FormGroup>
    </FieldSection>
  );
};

export default FieldSelector;
