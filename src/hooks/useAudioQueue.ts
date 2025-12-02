import { useState, useCallback, useEffect, useRef } from 'react';
import { AudioQueueItem } from '../types';
import { api } from '../services/api';

interface UseAudioQueueReturn {
  queue: AudioQueueItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsPlayed: (id: number) => void;
}

export function useAudioQueue(
  sessionId: string,
  userName: string,
  pollInterval: number = 5000
): UseAudioQueueReturn {
  const [queue, setQueue] = useState<AudioQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastIdRef = useRef<number>(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch audio queue
  const fetchQueue = useCallback(async () => {
    if (!sessionId || !userName) return;

    try {
      const response = await api.getAudioQueue(sessionId, userName, lastIdRef.current);

      if (response.queue && response.queue.length > 0) {
        setQueue((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = response.queue.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        lastIdRef.current = response.lastId;
      }
    } catch (err) {
      console.error('Failed to fetch audio queue:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audio');
    }
  }, [sessionId, userName]);

  // Initial fetch and polling
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await fetchQueue();
    setIsLoading(false);
  }, [fetchQueue]);

  // Mark item as played
  const markAsPlayed = useCallback((id: number) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, played: true } : item
      )
    );
  }, []);

  // Start polling
  useEffect(() => {
    if (!sessionId || !userName) return;

    // Initial fetch
    refresh();

    // Set up polling
    pollingRef.current = setInterval(fetchQueue, pollInterval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [sessionId, userName, pollInterval, fetchQueue, refresh]);

  return {
    queue,
    isLoading,
    error,
    refresh,
    markAsPlayed,
  };
}

export default useAudioQueue;
