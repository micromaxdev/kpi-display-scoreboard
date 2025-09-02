import {
  TimeSettingContainer,
  TimeLabel,
  CycleTimeInput,
  TimeUnit,
  TimeButton,
  FormattedTimeDisplay
} from '../../styles/DisplaySelector.styled';

const TimeSettings = ({
  displayName,
  displayTime,
  isTimeUpdating,
  onTimeChange,
  onTimeBlur,
  onTimeUpdate,
  getFormattedTime
}) => {
  // Don't render if no display is selected
  if (!displayName) return null;

  return (
    <TimeSettingContainer>
      <TimeLabel>Cycle Time:</TimeLabel>
      <CycleTimeInput
        type="number"
        min="5"
        max="3600"
        value={displayTime}
        onChange={(e) => onTimeChange(e.target.value)}
        onBlur={(e) => onTimeBlur(e.target.value)}
        disabled={isTimeUpdating}
        placeholder="seconds"
      />
      <TimeUnit>sec</TimeUnit>
      <TimeButton
        onClick={onTimeUpdate}
        disabled={isTimeUpdating || !displayName}
      >
        {isTimeUpdating ? 'Saving...' : 'Save'}
      </TimeButton>
      <FormattedTimeDisplay>
        {getFormattedTime()}
      </FormattedTimeDisplay>
    </TimeSettingContainer>
  );
};

export default TimeSettings;
