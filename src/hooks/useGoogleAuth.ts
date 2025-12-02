import { useState, useCallback, useEffect } from 'react';
import { User, Language } from '../types';
import { storage } from '../services/storage';

interface GoogleAuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UseGoogleAuthReturn extends GoogleAuthState {
  signIn: () => Promise<void>;
  signOut: () => void;
  setGuestUser: (name: string, language: Language) => void;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [state, setState] = useState<GoogleAuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Check for existing user on mount
  useEffect(() => {
    const storedName = storage.getUserName();
    const storedLanguage = storage.getUserLanguage();

    if (storedName) {
      setState({
        user: {
          name: storedName,
          language: storedLanguage || 'en',
          isGuest: true,
        },
        isLoading: false,
        error: null,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Google OAuth implementation would go here
      // For now, we'll simulate a basic flow
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // This is a placeholder for actual Google OAuth
      // In production, you would use the Google Identity Services library
      console.log('Google Sign-In would be initiated here');

      // Simulating a successful sign-in for now
      // Replace with actual Google OAuth flow
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Google Sign-In not yet implemented. Please continue as guest.',
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign-in failed',
      }));
    }
  }, []);

  const signOut = useCallback(() => {
    storage.clearAll();
    setState({
      user: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const setGuestUser = useCallback((name: string, language: Language) => {
    storage.setUserName(name);
    storage.setUserLanguage(language);

    setState({
      user: {
        name,
        language,
        isGuest: true,
      },
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    signIn,
    signOut,
    setGuestUser,
  };
}

export default useGoogleAuth;
