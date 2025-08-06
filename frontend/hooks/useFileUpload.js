import { useState, useCallback } from 'react';
import userFileService from '../services/userFileService';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const uploadFile = useCallback(async (file, options = {}) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await userFileService.uploadAndSaveFileWithProgress(
        file,
        options,
        (progress) => {
          setUploadProgress(progress.progress);
        }
      );

      if (result.success) {
        setUploadedFiles(prev => [...prev, result.data]);
      } else {
        setError(result.error);
      }

      setUploading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files, options = {}) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await userFileService.uploadAndSaveMultipleFiles(
        files,
        options,
        (progress) => {
          setUploadProgress(progress.overallProgress);
        }
      );

      if (result.success) {
        setUploadedFiles(prev => [...prev, ...result.data.successful.map(r => r.data)]);
      } else {
        setError('Some files failed to upload');
      }

      setUploading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setError(null);
    setUploadedFiles([]);
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    uploadedFiles,
    uploadFile,
    uploadMultipleFiles,
    clearError,
    clearUploadedFiles,
    resetUpload
  };
};
