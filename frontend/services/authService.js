import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  // Email/Password Authentication
  async signUpWithEmail(email, password, displayName = null) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Send email verification
      await this.sendEmailVerification();
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully. Please verify your email.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Google Authentication
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      return {
        success: true,
        user: result.user,
        credential: credential
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Email Verification
  async sendEmailVerification() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return {
          success: true,
          message: 'Verification email sent'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Update Profile
  async updateUserProfile(updates) {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, updates);
        return {
          success: true,
          message: 'Profile updated successfully'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Update Password
  async updateUserPassword(newPassword) {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        return {
          success: true,
          message: 'Password updated successfully'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Reauthenticate User
  async reauthenticateUser(password) {
    try {
      if (auth.currentUser && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        return {
          success: true,
          message: 'Reauthentication successful'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Delete User Account
  async deleteUserAccount() {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        return {
          success: true,
          message: 'Account deleted successfully'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Get Current User
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Get user token
  async getUserToken(forceRefresh = false) {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(forceRefresh);
        return {
          success: true,
          token
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Error handler
  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/requires-recent-login': 'This operation requires recent authentication.',
      'auth/popup-closed-by-user': 'Authentication popup was closed.',
      'auth/cancelled-popup-request': 'Authentication request was cancelled.',
      'auth/popup-blocked': 'Authentication popup was blocked by the browser.'
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  }
}

export default new AuthService();
