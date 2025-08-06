// utils/authHelpers.js
import { auth } from '../config/firebase';

export const authHelpers = {
  // Check if user email is verified
  isEmailVerified: () => {
    return auth.currentUser?.emailVerified || false;
  },

  // Get user display name
  getUserDisplayName: () => {
    return auth.currentUser?.displayName || auth.currentUser?.email || 'User';
  },

  // Get user photo URL
  getUserPhotoURL: () => {
    return auth.currentUser?.photoURL || null;
  },

  // Get user metadata
  getUserMetadata: () => {
    if (!auth.currentUser) return null;
    
    return {
      creationTime: auth.currentUser.metadata.creationTime,
      lastSignInTime: auth.currentUser.metadata.lastSignInTime
    };
  },

  // Format user data for frontend
  formatUserData: (user) => {
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      providerData: user.providerData
    };
  },

  // Check authentication status
  checkAuthStatus: () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(!!user);
      });
    });
  }
};
