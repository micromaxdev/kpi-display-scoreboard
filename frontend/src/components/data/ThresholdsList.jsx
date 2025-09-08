import { motion, AnimatePresence } from 'framer-motion';
import {
  ThresholdsContainer,
  ThresholdsHeader,
  ThresholdsGrid,
  DynamicThresholdTab,
  OrderNumber,
  DragHandle,
  ThresholdInfo,
  CollectionName,
  FieldName,
  RemoveButton,
  EmptyState
} from '../../styles/DisplaySelector.styled';

const ThresholdsList = ({
  displayName,
  thresholds,
  loading,
  error,
  reorderLoading,
  removingThreshold,
  draggedItem,
  dragOverIndex,
  onThresholdRemove,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  // Don't render if no display is selected
  if (!displayName) return null;

  // Show empty state if no thresholds and not loading
  if (thresholds.length === 0 && !loading && !error) {
    return (
      <EmptyState>
        No thresholds configured for this display
      </EmptyState>
    );
  }

  // Don't render anything if no thresholds
  if (thresholds.length === 0) return null;

  return (
    <ThresholdsContainer>
      <ThresholdsHeader>
        <h4>Configured Thresholds {reorderLoading && '(Saving order...)'}</h4>
        <span className="count">
          {thresholds.length} threshold{thresholds.length !== 1 ? 's' : ''}
          {thresholds.length > 1 && ' • Drag to reorder'}
        </span>
      </ThresholdsHeader>
      
      <ThresholdsGrid>
        <AnimatePresence mode="popLayout">
          {thresholds.map((threshold, index) => (
            <motion.div
              key={threshold._id || index}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1 // Stagger animation for multiple items
              }}
              layout
            >
              <DynamicThresholdTab 
                draggable={!reorderLoading}
                $isDragging={draggedItem === index}
                $dragOverIndex={dragOverIndex}
                $index={index}
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, index)}
                onDragEnd={onDragEnd}
              >
                <OrderNumber>{index + 1}</OrderNumber>
                <DragHandle title="Drag to reorder">⋮⋮</DragHandle>
                <ThresholdInfo>
                  <CollectionName>{threshold.collectionName}</CollectionName>
                  <FieldName>{threshold.field}</FieldName>
                </ThresholdInfo>
                <RemoveButton
                  onClick={() => onThresholdRemove(threshold._id)}
                  disabled={removingThreshold === threshold._id || reorderLoading}
                  title="Remove threshold"
                >
                  {removingThreshold === threshold._id ? '...' : '×'}
                </RemoveButton>
              </DynamicThresholdTab>
            </motion.div>
          ))}
        </AnimatePresence>
      </ThresholdsGrid>
    </ThresholdsContainer>
  );
};

export default ThresholdsList;
