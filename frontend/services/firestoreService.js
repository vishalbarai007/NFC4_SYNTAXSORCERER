import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class FirestoreService {
  constructor() {
    this.collections = {
      users: 'users',
      files: 'files',
      userFiles: 'userFiles'
    };
  }

  // Create or update user document
  async createUserDocument(userData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, this.collections.users, userId);
      
      const defaultUserData = {
        uid: userId,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || null,
        photoURL: auth.currentUser.photoURL || null,
        emailVerified: auth.currentUser.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        fileCount: 0,
        storageUsed: 0, // in bytes
        ...userData
      };

      await setDoc(userRef, defaultUserData, { merge: true });

      return {
        success: true,
        data: defaultUserData,
        message: 'User document created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user document
  async getUserDocument(userId = null) {
    try {
      const targetUserId = userId || auth.currentUser?.uid;
      
      if (!targetUserId) {
        throw new Error('User ID is required');
      }

      const userRef = doc(db, this.collections.users, targetUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return {
          success: true,
          data: { id: userSnap.id, ...userSnap.data() }
        };
      } else {
        return {
          success: false,
          error: 'User document not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update user document
  async updateUserDocument(updateData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, this.collections.users, userId);
      
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, dataToUpdate);

      return {
        success: true,
        message: 'User document updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Save file metadata to Firestore
  async saveFileMetadata(fileData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      
      const fileMetadata = {
        ...fileData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        downloadCount: 0,
        tags: fileData.tags || [],
        description: fileData.description || ''
      };

      // Add to files collection
      const filesRef = collection(db, this.collections.files);
      const docRef = await addDoc(filesRef, fileMetadata);

      // Update user's file count and storage used
      await this.updateUserStats(fileData.size, 1);

      return {
        success: true,
        data: { id: docRef.id, ...fileMetadata },
        message: 'File metadata saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's files
  async getUserFiles(options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const {
        limitCount = 20,
        orderByField = 'createdAt',
        orderDirection = 'desc',
        fileType = null,
        lastDoc = null
      } = options;

      let q = query(
        collection(db, this.collections.files),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy(orderByField, orderDirection),
        limit(limitCount)
      );

      // Filter by file type if specified
      if (fileType) {
        q = query(q, where('type', '==', fileType));
      }

      // For pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const files = [];
      
      querySnapshot.forEach((doc) => {
        files.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: files,
        hasMore: files.length === limitCount,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get single file metadata
  async getFileMetadata(fileId) {
    try {
      const fileRef = doc(db, this.collections.files, fileId);
      const fileSnap = await getDoc(fileRef);

      if (fileSnap.exists()) {
        const fileData = { id: fileSnap.id, ...fileSnap.data() };
        
        // Check if user owns this file or has permission to view
        if (auth.currentUser && fileData.userId !== auth.currentUser.uid) {
          throw new Error('Permission denied');
        }

        return {
          success: true,
          data: fileData
        };
      } else {
        return {
          success: false,
          error: 'File not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update file metadata
  async updateFileMetadata(fileId, updateData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // First check if user owns the file
      const fileResult = await this.getFileMetadata(fileId);
      if (!fileResult.success) {
        return fileResult;
      }

      if (fileResult.data.userId !== auth.currentUser.uid) {
        return {
          success: false,
          error: 'Permission denied'
        };
      }

      const fileRef = doc(db, this.collections.files, fileId);
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(fileRef, dataToUpdate);

      return {
        success: true,
        message: 'File metadata updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file metadata (soft delete)
  async deleteFileMetadata(fileId) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // First check if user owns the file
      const fileResult = await this.getFileMetadata(fileId);
      if (!fileResult.success) {
        return fileResult;
      }

      if (fileResult.data.userId !== auth.currentUser.uid) {
        return {
          success: false,
          error: 'Permission denied'
        };
      }

      const fileRef = doc(db, this.collections.files, fileId);
      await updateDoc(fileRef, {
        isActive: false,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update user stats
      await this.updateUserStats(-fileResult.data.size, -1);

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

  // Update user statistics
  async updateUserStats(sizeChange, fileCountChange) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, this.collections.users, userId);
      
      await updateDoc(userRef, {
        storageUsed: increment(sizeChange),
        fileCount: increment(fileCountChange),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'User stats updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add tag to file
  async addTagToFile(fileId, tag) {
    try {
      const fileRef = doc(db, this.collections.files, fileId);
      await updateDoc(fileRef, {
        tags: arrayUnion(tag),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Tag added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Remove tag from file
  async removeTagFromFile(fileId, tag) {
    try {
      const fileRef = doc(db, this.collections.files, fileId);
      await updateDoc(fileRef, {
        tags: arrayRemove(tag),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Tag removed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Increment download count
  async incrementDownloadCount(fileId) {
    try {
      const fileRef = doc(db, this.collections.files, fileId);
      await updateDoc(fileRef, {
        downloadCount: increment(1),
        lastDownloadedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Download count updated'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search files by name or tags
  async searchFiles(searchTerm, options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const { limitCount = 20 } = options;

      // Search by file name (basic text search)
      let q = query(
        collection(db, this.collections.files),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const files = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fileName = data.fileName?.toLowerCase() || '';
        const tags = data.tags || [];
        const description = data.description?.toLowerCase() || '';
        
        // Simple text matching
        if (
          fileName.includes(searchTerm.toLowerCase()) ||
          tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          description.includes(searchTerm.toLowerCase())
        ) {
          files.push({ id: doc.id, ...data });
        }
      });

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

  // Real-time listener for user files
  subscribeToUserFiles(callback, options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userId = auth.currentUser.uid;
      const { limitCount = 20, orderByField = 'createdAt' } = options;

      const q = query(
        collection(db, this.collections.files),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy(orderByField, 'desc'),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const files = [];
          querySnapshot.forEach((doc) => {
            files.push({ id: doc.id, ...doc.data() });
          });
          callback({ success: true, data: files });
        },
        (error) => {
          callback({ success: false, error: error.message });
        }
      );

      return unsubscribe;
    } catch (error) {
      return null;
    }
  }
}

export default new FirestoreService();
