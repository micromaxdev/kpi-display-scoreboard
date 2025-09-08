import {
  DisplayDropdown,
  TimeButton
} from '../../styles/DisplaySelector.styled';

const DisplayActions = ({
  selectedDisplay,
  displayOptions,
  loading,
  onDisplayChange,
  onCreateDisplay,
  onDeleteDisplay,
  formatDisplayName,
  isDeleting = false
}) => {
  return (
    <>
      <DisplayDropdown
        value={selectedDisplay}
        onChange={onDisplayChange}
        disabled={loading}
        style={{ marginRight: '12px' }}
      >
        <option value="" disabled>Select a playlist...</option>
        {displayOptions.map(option => (
          <option key={option.displayName} value={option.displayName}>
            {formatDisplayName(option.displayName)}
          </option>
        ))}
      </DisplayDropdown>
      
      <TimeButton 
        onClick={onCreateDisplay}
        style={{ 
          backgroundColor: '#4299e1', 
          color: 'white',
          borderColor: '#4299e1',
          marginRight: '8px'
        }}
        title="Create new display/playlist"
      >
        + New
      </TimeButton>
      
      {selectedDisplay && (
        <TimeButton 
          onClick={onDeleteDisplay}
          style={{ 
            backgroundColor: '#f56565', 
            color: 'white',
            borderColor: '#f56565'
          }}
          title="Delete current display/playlist"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : '× Delete'}
        </TimeButton>
      )}
    </>
  );
};

export default DisplayActions;
