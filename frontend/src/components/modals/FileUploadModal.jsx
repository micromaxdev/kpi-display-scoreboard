import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFileToCollection } from '../../services/apiService';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  FileDropZone,
  FileInput,
  FileInfo,
  UploadIcon,
  ErrorMessage,
  SuccessMessage,
  ModalActions,
  CancelBtn,
  UploadBtn,
  LoadingSpinner,
  ProgressBar,
  ProgressFill
} from '../../styles/FileUploadModal.styled';

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [collectionName, setCollectionName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setCollectionName('');
    setSelectedFile(null);
    setError('');
    setSuccess('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    // Reset states
    setIsUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(100); // Show as complete since we don't track progress

    try {
      // Upload file using API service
      const result = await uploadFileToCollection(collectionName, selectedFile);

      if (result.success) {
        setSuccess(result.message);
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }

        // Close modal after brief delay
        setTimeout(() => {
          handleClose();
        }, 300);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Upload Data File</ModalTitle>
              <CloseButton onClick={handleClose} disabled={isUploading}>
                ×
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label htmlFor="collectionName">Collection Name *</Label>
                <Input
                  id="collectionName"
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Enter collection name"
                  disabled={isUploading}
                />
              </FormGroup>

              <FormGroup>
                <Label>File Upload *</Label>
                <FileDropZone
                  $isDragOver={isDragOver}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <FileInput
                    id="fileInput"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                  />
                  
                  {selectedFile ? (
                    <FileInfo>
                      <UploadIcon>📄</UploadIcon>
                      <div>
                        <div>{selectedFile.name}</div>
                        <div>{formatFileSize(selectedFile.size)}</div>
                      </div>
                    </FileInfo>
                  ) : (
                    <FileInfo>
                      <UploadIcon>📤</UploadIcon>
                      <div>
                        <div>Drop your file here or click to browse</div>
                        <div>Supports CSV, Excel files (max 50MB)</div>
                      </div>
                    </FileInfo>
                  )}
                </FileDropZone>
              </FormGroup>

              {isUploading && (
                <FormGroup>
                  <Label>Upload Progress</Label>
                  <ProgressBar>
                    <ProgressFill style={{ width: `${uploadProgress}%` }} />
                  </ProgressBar>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    {uploadProgress}%
                  </div>
                </FormGroup>
              )}

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
            </ModalBody>

            <ModalActions>
              <CancelBtn onClick={handleClose} disabled={isUploading}>
                Cancel
              </CancelBtn>
              <UploadBtn onClick={handleUpload} disabled={isUploading || !selectedFile || !collectionName.trim()}>
                {isUploading ? (
                  <>
                    <LoadingSpinner />
                    Uploading...
                  </>
                ) : (
                  'Upload File'
                )}
              </UploadBtn>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default FileUploadModal;
