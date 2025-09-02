import { motion } from 'framer-motion';
import {
  ThresholdInfo,
  InfoGrid,
  InfoItem,
  ColorIndicator
} from '../../styles/ThresholdForm.styled';

const ThresholdInfoPanel = ({ getThresholdDescription }) => {
  // Animation variants for the container only
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <ThresholdInfo
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3>Threshold Information</h3>
      <InfoGrid>
        <InfoItem>
          <ColorIndicator $color="green" />
          <span>{getThresholdDescription().green}</span>
        </InfoItem>
        <InfoItem>
          <ColorIndicator $color="amber" />
          <span>{getThresholdDescription().amber}</span>
        </InfoItem>
        <InfoItem>
          <ColorIndicator $color="red" />
          <span>{getThresholdDescription().red}</span>
        </InfoItem>
      </InfoGrid>
    </ThresholdInfo>
  );
};

export default ThresholdInfoPanel;
