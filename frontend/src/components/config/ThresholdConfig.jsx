import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThresholdSection,
  FormGroup,
  LabelRow,
  InfoHelp,
  InfoIcon,
  Tooltip,
  ThresholdError,
  ErrorIcon
} from '../../styles/ThresholdForm.styled';

const ThresholdConfig = ({
  greenThreshold,
  amberThreshold,
  direction,
  loading,
  thresholdValidation,
  onGreenThresholdChange,
  onAmberThresholdChange,
  onDirectionChange
}) => {
  // Tooltip visibility state
  const [showGreenTip, setShowGreenTip] = useState(false);
  const [showAmberTip, setShowAmberTip] = useState(false);
  const [showDirectionTip, setShowDirectionTip] = useState(false);

  return (
    <ThresholdSection>
      <FormGroup>
        <label htmlFor="greenThreshold">
          <LabelRow>
            <span>Green Threshold *</span>
            <InfoHelp
              as={motion.div}
              onHoverStart={() => setShowGreenTip(true)}
              onHoverEnd={() => setShowGreenTip(false)}
              onFocus={() => setShowGreenTip(true)}
              onBlur={() => setShowGreenTip(false)}
            >
              <InfoIcon type="button" aria-label="Green threshold help">i</InfoIcon>
              <AnimatePresence>
                {showGreenTip && (
                  <Tooltip
                    as={motion.div}
                    key="tt-green"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                    exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                  >
                    <strong>Green threshold</strong> is the target value for strong performance. Values meeting or exceeding this are considered green.
                  </Tooltip>
                )}
              </AnimatePresence>
            </InfoHelp>
          </LabelRow>
        </label>
        <input
          type="number"
          id="greenThreshold"
          value={greenThreshold}
          onChange={(e) => onGreenThresholdChange(e.target.value)}
          placeholder="Enter green threshold value"
          step="0.01"
          disabled={loading}
          required
          className={!thresholdValidation.isValid ? 'error' : ''}
        />
      </FormGroup>

      <FormGroup>
        <label htmlFor="amberThreshold">
          <LabelRow>
            <span>Amber Threshold *</span>
            <InfoHelp
              as={motion.div}
              onHoverStart={() => setShowAmberTip(true)}
              onHoverEnd={() => setShowAmberTip(false)}
              onFocus={() => setShowAmberTip(true)}
              onBlur={() => setShowAmberTip(false)}
            >
              <InfoIcon type="button" aria-label="Amber threshold help">i</InfoIcon>
              <AnimatePresence>
                {showAmberTip && (
                  <Tooltip
                    as={motion.div}
                    key="tt-amber"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                    exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                  >
                    <strong>Amber threshold</strong> is a warning level indicating performance is approaching the target but not yet green.
                  </Tooltip>
                )}
              </AnimatePresence>
            </InfoHelp>
          </LabelRow>
        </label>
        <input
          type="number"
          id="amberThreshold"
          value={amberThreshold}
          onChange={(e) => onAmberThresholdChange(e.target.value)}
          placeholder="Enter amber threshold value"
          step="0.01"
          disabled={loading}
          required
          className={!thresholdValidation.isValid ? 'error' : ''}
        />
        {!thresholdValidation.isValid && (
          <ThresholdError>
            <ErrorIcon>⚠️</ErrorIcon>
            {thresholdValidation.message}
          </ThresholdError>
        )}
      </FormGroup>

      <FormGroup>
        <label htmlFor="direction">
          <LabelRow>
            <span>Direction *</span>
            <InfoHelp
              as={motion.div}
              onHoverStart={() => setShowDirectionTip(true)}
              onHoverEnd={() => setShowDirectionTip(false)}
              onFocus={() => setShowDirectionTip(true)}
              onBlur={() => setShowDirectionTip(false)}
            >
              <InfoIcon type="button" aria-label="Direction help">i</InfoIcon>
              <AnimatePresence>
                {showDirectionTip && (
                  <Tooltip
                    as={motion.div}
                    key="tt-direction"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
                    exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }}
                  >
                    Choose whether <strong>higher</strong> values or <strong>lower</strong> values indicate better performance for this KPI.
                  </Tooltip>
                )}
              </AnimatePresence>
            </InfoHelp>
          </LabelRow>
        </label>
        <select
          id="direction"
          value={direction}
          onChange={(e) => onDirectionChange(e.target.value)}
          disabled={loading}
          required
        >
          <option value="higher">Higher is Better</option>
          <option value="lower">Lower is Better</option>
        </select>
      </FormGroup>
    </ThresholdSection>
  );
};

export default ThresholdConfig;
