import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { auth, storage } from '@/config/firebase';

class FileUploadService {
  constructor() {
    this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.allowedDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  // Validate file before upload
  validateFile(file, fileType = 'image') {
    const allowedTypes = fileType === 'image' ? this.allowedImageTypes : this.allowedDocumentTypes;
    
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.size > this.maxFileSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true, error: null };
  }

  // Generate unique file name
  generateFileName(originalName, userId) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${userId}_${timestamp}_${randomString}.${extension}`;
  }

  // Simple file upload
  async uploadFile(file, folder = 'uploads', customFileName = null) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to upload files');
      }

      const userId = auth.currentUser.uid;
      const validation = this.validateFile(file);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const fileName = customFileName || this.generateFileName(file.name, userId);
      const filePath = `${folder}/${userId}/${fileName}`;
      const storageRef = ref(storage, filePath);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        data: {
          fileName,
          filePath,
          downloadURL,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          userId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload with progress tracking
  async uploadFileWithProgress(file, folder = 'uploads', onProgress = null, customFileName = null) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to upload files');
      }

      const userId = auth.currentUser.uid;
      const validation = this.validateFile(file);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const fileName = customFileName || this.generateFileName(file.name, userId);
      const filePath = `${folder}/${userId}/${fileName}`;
      const storageRef = ref(storage, filePath);

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress({
                progress: Math.round(progress),
                bytesTransferred: snapshot.bytesTransferred,
                totalBytes: snapshot.totalBytes,
                state: snapshot.state
              });
            }
          },
          (error) => {
            reject({
              success: false,
              error: error.message
            });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                data: {
                  fileName,
                  filePath,
                  downloadURL,
                  size: file.size,
                  type: file.type,
                  uploadedAt: new Date().toISOString(),
                  userId
                }
              });
            } catch (error) {
              reject({
                success: false,
                error: error.message
              });
            }
          }
        );
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'uploads', onProgress = null) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to upload files');
      }

      const results = [];
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        const result = await this.uploadFileWithProgress(
          file, 
          folder, 
          (progress) => {
            if (onProgress) {
              onProgress({
                currentFile: completedFiles + 1,
                totalFiles,
                currentFileProgress: progress.progress,
                overallProgress: Math.round(((completedFiles + (progress.progress / 100)) / totalFiles) * 100)
              });
            }
          }
        );
        
        results.push(result);
        completedFiles++;
      }

      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      return {
        success: failedUploads.length === 0,
        data: {
          successful: successfulUploads.map(r => r.data),
          failed: failedUploads.map(r => r.error),
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

  // Delete file
  async deleteFile(filePath) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to delete files');
      }

      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file metadata
  async getFileMetadata(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      const metadata = await getMetadata(fileRef);
      
      return {
        success: true,
        data: metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List user files
  async getUserFiles(folder = 'uploads') {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to list files');
      }

      const userId = auth.currentUser.uid;
      const folderRef = ref(storage, `${folder}/${userId}`);
      const result = await listAll(folderRef);

      const files = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          
          return {
            name: item.name,
            fullPath: item.fullPath,
            downloadURL: url,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated
          };
        })
      );

      return {
        success: true,
        data: files
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
      const result = await this.uploadFile(file, 'profile-pictures', 'profile-picture');
      
      if (result.success) {
        // Update user profile with new photo URL
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(auth.currentUser, {
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
}

export default new FileUploadService();
