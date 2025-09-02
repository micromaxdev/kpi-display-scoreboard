import {
  Actions,
  SubmitBtn,
  ResetBtn
} from '../../styles/ThresholdForm.styled';

const FormActions = ({
  loading,
  isValid,
  onPreview,
  onReset,
  onSaveAndPreview
}) => {
  return (
    <Actions>
      <SubmitBtn type="submit" disabled={loading || !isValid}>
        {loading ? 'Processing...' : 'Preview KPI Data'}
      </SubmitBtn>
      <ResetBtn type="button" onClick={onReset} disabled={loading}>
        Reset
      </ResetBtn>
      <SubmitBtn type="button" onClick={onSaveAndPreview} disabled={loading || !isValid}>
        {loading ? 'Saving...' : 'Save & Preview'}
      </SubmitBtn>
    </Actions>
  );
};

export default FormActions;
