import {
  CollectionSection,
  FormGroup,
  LabelRow,
  UploadButton,
  SelectedInfo
} from '../../styles/ThresholdForm.styled';
import { getPlaceholderText } from '../../utils/formUtils';

const CollectionSelector = ({
  selectedCollection,
  collections,
  loading,
  onCollectionChange,
  onUploadClick,
  onExcludedFieldsClick,
  disabled = false
}) => {
  return (
    <CollectionSection>
      <FormGroup>
        <LabelRow>
          <label htmlFor="collection">Collection *</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <UploadButton 
              type="button"
              onClick={onUploadClick}
              title="Upload new data file"
            >
              📤 Upload File
            </UploadButton>
            <UploadButton 
              type="button"
              onClick={() => {
                console.log('🔧 Excluded Fields button clicked in CollectionSelector!');
                onExcludedFieldsClick();
              }}
              disabled={disabled}
              title="Manage excluded fields for thresholds"
            >
              🔧 Excluded Fields
            </UploadButton>
          </div>
        </LabelRow>
        <select
          id="collection"
          value={selectedCollection}
          onChange={(e) => {
            console.log('Selected collection:', e.target.value);
            onCollectionChange(e.target.value);
          }}
          disabled={false}
          required
        >
          <option value="">{getPlaceholderText({ loading }, 'collection')}</option>
          {collections.map((collection, index) => (
            <option key={`collection-${index}`} value={collection}>
              {collection}
            </option>
          ))}
        </select>
        {selectedCollection && (
          <SelectedInfo>Selected: {selectedCollection}</SelectedInfo>
        )}
      </FormGroup>
    </CollectionSection>
  );
};

export default CollectionSelector;
