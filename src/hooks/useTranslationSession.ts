import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, Language } from '../types';
import { api } from '../services/api';

interface SessionConfig {
  userA: string;
  userB: string;
  langA: string;
  langB: string;
  langCodeA?: string;
  langCodeB?: string;
}

interface UseTranslationSessionReturn {
  sessionCode: string | null;
  config: SessionConfig | null;
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  myRole: 'A' | 'B' | null;
  connect: (sessionCode: string, userName: string, language: Language, isCreator: boolean) => Promise<void>;
  disconnect: () => void;
  sendMessage: (text: string) => Promise<void>;
}

export function useTranslationSession(): UseTranslationSessionReturn {
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<'A' | 'B' | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastRowRef = useRef<number>(1);
  const userNameRef = useRef<string>('');
  const userLanguageRef = useRef<Language>('en');

  // Connect to a session
  const connect = useCallback(async (
    code: string,
    userName: string,
    language: Language,
    isCreator: boolean
  ) => {
    setIsLoading(true);
    setError(null);
    userNameRef.current = userName;
    userLanguageRef.current = language;

    try {
      if (isCreator) {
        // Create new session
        const result = await api.createSession(userName, language, code);
        if (result.error) {
          throw new Error(result.error);
        }
        setSessionCode(result.sessionCode);
        setMyRole('A');
        setConfig({
          userA: userName,
          userB: 'Waiting...',
          langA: language,
          langB: 'es',
        });
      } else {
        // Join existing session
        const result = await api.joinSession(code, userName, language);
        if (result.error) {
          throw new Error(result.error);
        }
        setSessionCode(code);
        setMyRole('B');
        if (result.config) {
          setConfig({
            userA: result.config.userA,
            userB: userName,
            langA: result.config.langA,
            langB: result.config.langB,
          });
        }
      }

      setIsConnected(true);
      lastRowRef.current = 1;

      // Start polling for messages
      startPolling(code);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start polling for messages
  const startPolling = useCallback((code: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Initial fetch
    fetchMessages(code);

    // Poll every 2 seconds
    pollingRef.current = setInterval(() => {
      fetchMessages(code);
    }, 2000);
  }, []);

  // Fetch messages from the server
  const fetchMessages = useCallback(async (code: string) => {
    try {
      const response = await api.getMessagesWithMeta(
        code,
        userNameRef.current,
        1 // Always get all messages to ensure we have the full conversation
      );

      if (response.messages && response.messages.length > 0) {
        setMessages(response.messages);
        lastRowRef.current = response.lastRow;
      }

      // Update config if provided
      if (response.config) {
        setConfig(prev => ({
          ...prev,
          ...response.config,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, []);

  // Disconnect from session
  const disconnect = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsConnected(false);
    setSessionCode(null);
    setConfig(null);
    setMessages([]);
    setMyRole(null);
    lastRowRef.current = 1;
  }, []);

  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    if (!sessionCode || !isConnected || !myRole) return;

    try {
      const result = await api.sendMessage(sessionCode, {
        text,
        from: userNameRef.current,
        language: userLanguageRef.current,
        role: myRole,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Immediately fetch messages to show the sent message
      await fetchMessages(sessionCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [sessionCode, isConnected, myRole, fetchMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    sessionCode,
    config,
    messages,
    isConnected,
    isLoading,
    error,
    myRole,
    connect,
    disconnect,
    sendMessage,
  };
}

export default useTranslationSession;
