import { useState, useCallback, useEffect, useRef } from 'react';
import { TranslationSession, Message, Language } from '../types';
import { api } from '../services/api';

interface UseTranslationSessionReturn {
  session: TranslationSession | null;
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (userName: string, language: Language) => Promise<void>;
  disconnect: () => void;
  sendMessage: (text: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useTranslationSession(sessionId?: string): UseTranslationSessionReturn {
  const [session, setSession] = useState<TranslationSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Connect to a session
  const connect = useCallback(async (userName: string, language: Language) => {
    setIsLoading(true);
    setError(null);

    try {
      // If sessionId provided, join existing session
      // Otherwise create new quick session
      const newSession: TranslationSession = sessionId
        ? await api.getSession(sessionId)
        : {
            id: `session_${Date.now()}`,
            participants: [{ name: userName, language, role: 'A' }],
            messages: [],
            createdAt: new Date().toISOString(),
            isActive: true,
          };

      setSession(newSession);
      setMessages(newSession.messages || []);
      setIsConnected(true);

      // Start polling for new messages
      startPolling(newSession.id, userName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Disconnect from session
  const disconnect = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsConnected(false);
    setSession(null);
    setMessages([]);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    if (!session || !isConnected) return;

    const userName = session.participants[0]?.name || 'Guest';
    const userLanguage = session.participants[0]?.language || 'en';

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      from: userName,
      originalText: text,
      translatedText: text, // Would be translated by backend
      fromLanguage: userLanguage,
      toLanguage: 'en', // Target language
      timestamp: new Date().toISOString(),
    };

    // Optimistically add message
    setMessages((prev) => [...prev, newMessage]);

    try {
      // Send to backend
      await api.sendMessage(session.id, {
        text,
        from: userName,
        language: userLanguage,
      });
    } catch (err) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [session, isConnected]);

  // Refresh messages
  const refreshMessages = useCallback(async () => {
    if (!session) return;

    try {
      const updatedMessages = await api.getMessages(
        session.id,
        session.participants[0]?.name || '',
        lastMessageIdRef.current || undefined
      );

      if (updatedMessages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = updatedMessages.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMessages];
        });
        lastMessageIdRef.current = updatedMessages[updatedMessages.length - 1].id;
      }
    } catch (err) {
      console.error('Failed to refresh messages:', err);
    }
  }, [session]);

  // Start polling for messages
  const startPolling = useCallback((sessionId: string, userName: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const newMessages = await api.getMessages(
          sessionId,
          userName,
          lastMessageIdRef.current || undefined
        );

        if (newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNew = newMessages.filter((m) => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
          lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Poll every 3 seconds
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    session,
    messages,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    sendMessage,
    refreshMessages,
  };
}

export default useTranslationSession;
