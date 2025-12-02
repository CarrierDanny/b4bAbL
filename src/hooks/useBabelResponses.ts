import { useState, useCallback } from 'react';
import { BabelResponse } from '../types';
import { api } from '../services/api';

interface UseBabelResponsesReturn {
  responses: BabelResponse[];
  isLoading: boolean;
  error: string | null;
  fetchResponses: () => Promise<void>;
  submitResponse: (response: Omit<BabelResponse, 'id'>) => Promise<void>;
}

export function useBabelResponses(): UseBabelResponsesReturn {
  const [responses, setResponses] = useState<BabelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing responses
  const fetchResponses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedResponses = await api.getBabelResponses(20);
      setResponses(fetchedResponses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch responses');
      // Use mock data if API fails
      setResponses([
        {
          id: '1',
          name: 'Maria',
          language: 'es',
          response: 'The Tower of Babel reminds me of how important it is to understand each other, even when we speak different languages.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Kenji',
          language: 'ja',
          response: 'In my culture, we have similar stories about the importance of humility and communication.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Ahmed',
          language: 'ar',
          response: 'Babel teaches us that diversity of language is both a challenge and a gift.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit a new response
  const submitResponse = useCallback(async (response: Omit<BabelResponse, 'id'>) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.submitBabelResponse(response);

      // Add to local state
      const newResponse: BabelResponse = {
        ...response,
        id: `local_${Date.now()}`,
      };
      setResponses((prev) => [newResponse, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
      // Still add locally even if API fails
      const newResponse: BabelResponse = {
        ...response,
        id: `local_${Date.now()}`,
      };
      setResponses((prev) => [newResponse, ...prev]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    responses,
    isLoading,
    error,
    fetchResponses,
    submitResponse,
  };
}

export default useBabelResponses;
