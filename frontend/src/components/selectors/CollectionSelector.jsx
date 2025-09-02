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
  onUploadClick
}) => {
  return (
    <CollectionSection>
      <FormGroup>
        <LabelRow>
          <label htmlFor="collection">Collection *</label>
          <UploadButton 
            type="button"
            onClick={onUploadClick}
            title="Upload new data file"
          >
            📤 Upload File
          </UploadButton>
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
