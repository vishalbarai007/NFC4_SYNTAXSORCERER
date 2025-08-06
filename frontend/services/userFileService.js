import fileUploadService from './fileUploadService';
import firestoreService from './firestoreService';
import { auth } from '../config/firebase';

class UserFileService {
  constructor() {
    this.supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  }

  // Upload file and save metadata to Firestore
  async uploadAndSaveFile(file, options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const {
        folder = 'user-uploads',
        description = '',
        tags = [],
        isPublic = false,
        customFileName = null
      } = options;

      // Upload file to Storage
      const uploadResult = await fileUploadService.uploadFile(file, folder, customFileName);
      
      if (!uploadResult.success) {
        return uploadResult;
      }

      // Prepare file metadata for Firestore
      const fileMetadata = {
        ...uploadResult.data,
        description,
        tags,
        isPublic,
        category: this.categorizeFile(file.type),
        originalName: file.name
      };

      // Save metadata to Firestore
      const firestoreResult = await firestoreService.saveFileMetadata(fileMetadata);
      
      if (!firestoreResult.success) {
        // If Firestore save fails, clean up the uploaded file
        await fileUploadService.deleteFile(uploadResult.data.filePath);
        return firestoreResult;
      }

      return {
        success: true,
        data: {
          ...firestoreResult.data,
        },
        message: 'File uploaded and saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload file with progress tracking and save metadata
  async uploadAndSaveFileWithProgress(file, options = {}, onProgress = null) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const {
        folder = 'user-uploads',
        description = '',
        tags = [],
        isPublic = false,
        customFileName = null
      } = options;

      // Upload file to Storage with progress
      const uploadResult = await fileUploadService.uploadFileWithProgress(
        file, 
        folder, 
        onProgress,
        customFileName
      );
      
      if (!uploadResult.success) {
        return uploadResult;
      }

      // Prepare file metadata for Firestore
      const fileMetadata = {
        ...uploadResult.data,
        description,
        tags,
        isPublic,
        category: this.categorizeFile(file.type),
        originalName: file.name
      };

      // Save metadata to Firestore
      const firestoreResult = await firestoreService.saveFileMetadata(fileMetadata);
      
      if (!firestoreResult.success) {
        // If Firestore save fails, clean up the uploaded file
        await fileUploadService.deleteFile(uploadResult.data.filePath);
        return firestoreResult;
      }

      return {
        success: true,
        data: firestoreResult.data,
        message: 'File uploaded and saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple files and save metadata
  async uploadAndSaveMultipleFiles(files, options = {}, onProgress = null) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const results = [];
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        const result = await this.uploadAndSaveFileWithProgress(
          file,
          options,
          (progress) => {
            if (onProgress) {
              onProgress({
                currentFile: completedFiles + 1,
                totalFiles,
                currentFileProgress: progress.progress,
                overallProgress: Math.round(((completedFiles + (progress.progress / 100)) / totalFiles) * 100),
                fileName: file.name
              });
            }
          }
        );
        
        results.push({
          fileName: file.name,
          ...result
        });
        completedFiles++;
      }

      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      return {
        success: failedUploads.length === 0,
        data: {
          successful: successfulUploads,
          failed: failedUploads,
          totalFiles,
          successCount: successfulUploads.length,
          failureCount: failedUploads.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file from both Storage and Firestore
  async deleteFile(fileId) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // Get file metadata first
      const fileResult = await firestoreService.getFileMetadata(fileId);
      if (!fileResult.success) {
        return fileResult;
      }

      const fileData = fileResult.data;

      // Delete from Storage
      const storageResult = await fileUploadService.deleteFile(fileData.filePath);
      if (!storageResult.success) {
        return storageResult;
      }

      // Delete metadata from Firestore (soft delete)
      const firestoreResult = await firestoreService.deleteFileMetadata(fileId);
      
      return {
        success: true,
        message: 'File deleted successfully from both storage and database'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's files with pagination
  async getUserFiles(options = {}) {
    return await firestoreService.getUserFiles(options);
  }

  // Update file information
  async updateFileInfo(fileId, updateData) {
    return await firestoreService.updateFileMetadata(fileId, updateData);
  }

  // Search user's files
  async searchFiles(searchTerm, options = {}) {
    return await firestoreService.searchFiles(searchTerm, options);
  }

  // Add tag to file
  async addTagToFile(fileId, tag) {
    return await firestoreService.addTagToFile(fileId, tag);
  }

  // Remove tag from file
  async removeTagFromFile(fileId, tag) {
    return await firestoreService.removeTagFromFile(fileId, tag);
  }

  // Download file (increment counter and return URL)
  async downloadFile(fileId) {
    try {
      // Increment download count
      await firestoreService.incrementDownloadCount(fileId);
      
      // Get file metadata
      const fileResult = await firestoreService.getFileMetadata(fileId);
      if (!fileResult.success) {
        return fileResult;
      }

      return {
        success: true,
        data: {
          downloadURL: fileResult.data.downloadURL,
          fileName: fileResult.data.originalName || fileResult.data.fileName,
          fileType: fileResult.data.type
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file statistics for user
  async getUserFileStats() {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userResult = await firestoreService.getUserDocument();
      if (!userResult.success) {
        return userResult;
      }

      const userData = userResult.data;
      const files = await this.getUserFiles({ limitCount: 1000 }); // Get all files for stats

      if (!files.success) {
        return files;
      }

      const filesByCategory = files.data.reduce((acc, file) => {
        const category = file.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const filesByType = files.data.reduce((acc, file) => {
        const type = file.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const totalDownloads = files.data.reduce((sum, file) => sum + (file.downloadCount || 0), 0);

      return {
        success: true,
        data: {
          totalFiles: userData.fileCount || 0,
          totalStorageUsed: userData.storageUsed || 0,
          totalDownloads,
          filesByCategory,
          filesByType,
          storageUsedFormatted: this.formatFileSize(userData.storageUsed || 0),
          lastUpdated: userData.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const result = await fileUploadService.uploadProfilePicture(file);
      
      if (result.success) {
        // Also save to Firestore as a file record
        const fileMetadata = {
          ...result.data,
          description: 'Profile Picture',
          tags: ['profile'],
          isPublic: false,
          category: 'image',
          originalName: file.name
        };

        await firestoreService.saveFileMetadata(fileMetadata);
        
        // Update user document with new photo URL
        await firestoreService.updateUserDocument({
          photoURL: result.data.downloadURL
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get files by category
  async getFilesByCategory(category, options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const files = await this.getUserFiles(options);
      if (!files.success) {
        return files;
      }

      const filteredFiles = files.data.filter(file => file.category === category);

      return {
        success: true,
        data: filteredFiles,
        hasMore: files.hasMore,
        lastDoc: files.lastDoc
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get recent files
  async getRecentFiles(limitCount = 10) {
    return await this.getUserFiles({
      limitCount,
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });
  }

  // Get popular files (most downloaded)
  async getPopularFiles(limitCount = 10) {
    return await this.getUserFiles({
      limitCount,
      orderByField: 'downloadCount',
      orderDirection: 'desc'
    });
  }

  // Subscribe to real-time file updates
  subscribeToFiles(callback, options = {}) {
    return firestoreService.subscribeToUserFiles(callback, options);
  }

  // Categorize file based on MIME type
  categorizeFile(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('text/')) return 'text';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'archive';
    return 'other';
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file is image
  isImageFile(mimeType) {
    return this.supportedImageTypes.includes(mimeType);
  }

  // Generate thumbnail URL for images (if using Firebase Extensions or custom solution)
  generateThumbnailURL(downloadURL, size = '200x200') {
    // This would work if you have Firebase Extensions for image resizing
    // Or implement your own thumbnail generation logic
    if (downloadURL.includes('firebase')) {
      return `${downloadURL}_${size}`;
    }
    return downloadURL;
  }

  // Bulk operations
  async bulkDeleteFiles(fileIds) {
    try {
      const results = [];
      
      for (const fileId of fileIds) {
        const result = await this.deleteFile(fileId);
        results.push({
          fileId,
          ...result
        });
      }

      const successfulDeletes = results.filter(r => r.success);
      const failedDeletes = results.filter(r => !r.success);

      return {
        success: failedDeletes.length === 0,
        data: {
          successful: successfulDeletes,
          failed: failedDeletes,
          totalFiles: fileIds.length,
          successCount: successfulDeletes.length,
          failureCount: failedDeletes.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Bulk update tags
  async bulkUpdateTags(fileIds, tagsToAdd = [], tagsToRemove = []) {
    try {
      const results = [];
      
      for (const fileId of fileIds) {
        const updatePromises = [];
        
        // Add tags
        for (const tag of tagsToAdd) {
          updatePromises.push(this.addTagToFile(fileId, tag));
        }
        
        // Remove tags
        for (const tag of tagsToRemove) {
          updatePromises.push(this.removeTagFromFile(fileId, tag));
        }
        
        const updateResults = await Promise.all(updatePromises);
        const success = updateResults.every(r => r.success);
        
        results.push({
          fileId,
          success,
          error: success ? null : 'Some tag operations failed'
        });
      }

      const successfulUpdates = results.filter(r => r.success);
      const failedUpdates = results.filter(r => !r.success);

      return {
        success: failedUpdates.length === 0,
        data: {
          successful: successfulUpdates,
          failed: failedUpdates,
          totalFiles: fileIds.length,
          successCount: successfulUpdates.length,
          failureCount: failedUpdates.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new UserFileService();
