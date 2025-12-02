import {
  TranslationSession,
  Message,
  BabelResponse,
  AudioQueueResponse,
  Language,
} from '../types';

const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

interface SendMessagePayload {
  text: string;
  from: string;
  language: Language;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get audio queue
  async getAudioQueue(
    sessionId: string,
    userName: string,
    lastId: number = 0
  ): Promise<AudioQueueResponse> {
    const params = new URLSearchParams({
      mode: 'queue',
      session: sessionId,
      to: userName,
      lastId: lastId.toString(),
    });

    return this.request<AudioQueueResponse>(`?${params}`);
  }

  // Get translation session
  async getSession(sessionId: string): Promise<TranslationSession> {
    const params = new URLSearchParams({
      mode: 'session',
      session: sessionId,
    });

    return this.request<TranslationSession>(`?${params}`);
  }

  // Get messages for a session
  async getMessages(
    sessionId: string,
    userName: string,
    lastMessageId?: string
  ): Promise<Message[]> {
    const params = new URLSearchParams({
      mode: 'messages',
      session: sessionId,
      user: userName,
    });

    if (lastMessageId) {
      params.set('lastId', lastMessageId);
    }

    const response = await this.request<{ messages: Message[] }>(`?${params}`);
    return response.messages || [];
  }

  // Send a message
  async sendMessage(sessionId: string, payload: SendMessagePayload): Promise<void> {
    const params = new URLSearchParams({
      mode: 'message',
      session: sessionId,
    });

    await this.request(`?${params}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Submit Babel response
  async submitBabelResponse(response: Omit<BabelResponse, 'id'>): Promise<void> {
    const params = new URLSearchParams({
      mode: 'babelResponse',
    });

    await this.request(`?${params}`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  // Get Babel responses
  async getBabelResponses(limit: number = 20): Promise<BabelResponse[]> {
    const params = new URLSearchParams({
      mode: 'babelResponses',
      limit: limit.toString(),
    });

    const response = await this.request<{ responses: BabelResponse[] }>(`?${params}`);
    return response.responses || [];
  }

  // Create a new session
  async createSession(
    creatorName: string,
    creatorLanguage: Language
  ): Promise<TranslationSession> {
    const params = new URLSearchParams({
      mode: 'createSession',
    });

    return this.request<TranslationSession>(`?${params}`, {
      method: 'POST',
      body: JSON.stringify({
        name: creatorName,
        language: creatorLanguage,
      }),
    });
  }

  // Join an existing session
  async joinSession(
    sessionId: string,
    userName: string,
    userLanguage: Language
  ): Promise<TranslationSession> {
    const params = new URLSearchParams({
      mode: 'joinSession',
      session: sessionId,
    });

    return this.request<TranslationSession>(`?${params}`, {
      method: 'POST',
      body: JSON.stringify({
        name: userName,
        language: userLanguage,
      }),
    });
  }
}

// Export singleton instance
export const api = new ApiService(BASE_URL);

export default api;
