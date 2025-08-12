import './ThresholdForm.css';
import { useThresholdFormWithData } from '../hooks/useThresholdForm';
import { getPlaceholderText, formatFieldDisplayName } from '../utils/formUtils';
import CollectionDataTable from './CollectionDataTable';

const ThresholdForm = () => {
  const {
    formData,
    message,
    loading,
    collections,
    fields,
    sampleData,
    sampleDataLoading,
    updateField,
    resetForm,
    clearMessage,
    handleSubmit,
    validation
  } = useThresholdFormWithData();

  const {
    selectedCollection,
    selectedField,
    greenThreshold,
    amberThreshold,
    direction
  } = formData;

  return (
    <div className="threshold-form-container">
      <div className="form-header">
        <h2>Set KPI Thresholds</h2>
        <p>Configure green and amber thresholds for your KPI metrics</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={clearMessage} className="close-btn">&times;</button>
        </div>
      )}

      <div className="form-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="threshold-form">
            {/* Collection Selection - Full Width */}
            <div className="collection-section">
              <div className="form-group">
                <label htmlFor="collection">Collection *</label>
                <select
                  id="collection"
                  value={selectedCollection}
                  onChange={(e) => {
                    console.log('Selected collection:', e.target.value);
                    updateField('selectedCollection', e.target.value);
                  }}
                  disabled={loading}
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
                  <div className="selected-info">Selected: {selectedCollection}</div>
                )}
              </div>
            </div>

            {/* Field and Threshold Configuration */}
            <div className="config-section">
              <div className="field-section">
                <div className="form-group">
                  <label htmlFor="field">Field * <span className="field-info">(Only measurable fields shown)</span></label>
                  <select
                    id="field"
                    value={selectedField}
                    onChange={(e) => {
                      console.log('Selected field:', e.target.value);
                      updateField('selectedField', e.target.value);
                    }}
                    disabled={loading || !selectedCollection}
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
                    <div className="selected-info">Selected: {formatFieldDisplayName(selectedField)}</div>
                  )}
                  {selectedCollection && fields.length === 0 && !loading && (
                    <div className="field-help">
                      <small>Only showing fields suitable for KPI measurement (amounts, dates, counts, etc.)</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="threshold-section">
                <div className="form-group">
                  <label htmlFor="greenThreshold">Green Threshold *</label>
                  <input
                    type="number"
                    id="greenThreshold"
                    value={greenThreshold}
                    onChange={(e) => updateField('greenThreshold', e.target.value)}
                    placeholder="Enter green threshold value"
                    step="0.01"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amberThreshold">Amber Threshold *</label>
                  <input
                    type="number"
                    id="amberThreshold"
                    value={amberThreshold}
                    onChange={(e) => updateField('amberThreshold', e.target.value)}
                    placeholder="Enter amber threshold value"
                    step="0.01"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="direction">Direction *</label>
                  <select
                    id="direction"
                    value={direction}
                    onChange={(e) => updateField('direction', e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="higher">Higher is Better</option>
                    <option value="lower">Lower is Better</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !validation.isValid}
              >
                {loading ? 'Loading...' : 'Preview'}
              </button>
              
              <button 
                type="button" 
                className="reset-btn"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="threshold-info">
            <h3>Threshold Information</h3>
            <div className="info-grid">
              <div className="info-item green">
                <div className="color-indicator"></div>
                <span>Green: Performance meets or exceeds target</span>
              </div>
              <div className="info-item amber">
                <div className="color-indicator"></div>
                <span>Amber: Performance is approaching target</span>
              </div>
              <div className="info-item red">
                <div className="color-indicator"></div>
                <span>Red: Performance is below amber threshold</span>
              </div>
            </div>
          </div>
        </div>

        <div className="data-section">
          <CollectionDataTable 
            collectionName={selectedCollection}
            sampleData={sampleData}
            loading={sampleDataLoading}
            measurableFields={fields}
          />
        </div>
      </div>
    </div>
  );
};

export default ThresholdForm;
