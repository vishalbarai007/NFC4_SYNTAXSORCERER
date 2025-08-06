import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const uploadFile = async (file, folder = 'general') => {
    if (!currentUser) {
      setError('User must be authenticated to upload files');
      return null;
    }

    if (!file) {
      setError('No file selected');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `${folder}/${currentUser.uid}`);
      
      // Add user context to the upload
      formData.append('context', `user_id=${currentUser.uid}|user_email=${currentUser.email}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Save file metadata to Firestore
      const fileData = {
        cloudinaryId: result.public_id,
        originalName: file.name,
        url: result.secure_url,
        size: result.bytes,
        format: result.format,
        uploadedAt: new Date(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        folder: folder,
        resourceType: result.resource_type,
      };

      const docRef = await addDoc(collection(db, 'user_files'), fileData);
      
      return {
        ...result,
        firestoreId: docRef.id,
        metadata: fileData
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
}
