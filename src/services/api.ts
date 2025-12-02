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
  role?: 'A' | 'B';
}

interface SessionConfig {
  userA: string;
  userB: string;
  langA: string;
  langB: string;
  langCodeA: string;
  langCodeB: string;
  audiate?: boolean;
  voiceA?: string;
  voiceB?: string;
}

interface MessagesResponse {
  messages: Message[];
  lastRow: number;
  config: SessionConfig;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async get<T>(params: Record<string, string>): Promise<T> {
    const searchParams = new URLSearchParams(params);
    const url = `${this.baseUrl}?${searchParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  }

  private async post<T>(params: Record<string, string>, body: Record<string, unknown>): Promise<T> {
    const searchParams = new URLSearchParams(params);
    const url = `${this.baseUrl}?${searchParams}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  }

  // ===== SESSION MANAGEMENT =====

  /**
   * Create a new translation session
   */
  async createSession(
    userName: string,
    userLanguage: Language,
    sessionCode?: string
  ): Promise<{ success: boolean; sessionCode: string; error?: string }> {
    return this.post(
      { mode: 'createSession' },
      {
        name: userName,
        language: this.getLanguageName(userLanguage),
        sessionCode: sessionCode,
        userA: userName,
        langA: this.getLanguageName(userLanguage),
      }
    );
  }

  /**
   * Join an existing session
   */
  async joinSession(
    sessionCode: string,
    userName: string,
    userLanguage: Language
  ): Promise<{ success: boolean; config?: SessionConfig; error?: string }> {
    return this.post(
      { mode: 'joinSession', session: sessionCode },
      {
        name: userName,
        language: this.getLanguageName(userLanguage),
      }
    );
  }

  /**
   * Get session info
   */
  async getSessionInfo(sessionCode: string): Promise<{
    sessionCode: string;
    config: SessionConfig;
    exists: boolean;
    error?: string;
  }> {
    return this.get({ mode: 'sessionInfo', session: sessionCode });
  }

  // ===== MESSAGES =====

  /**
   * Get messages from a session
   */
  async getMessages(
    sessionCode: string,
    userName: string,
    lastRow: number = 1
  ): Promise<Message[]> {
    const response = await this.get<MessagesResponse>({
      mode: 'messages',
      session: sessionCode,
      user: userName,
      lastRow: lastRow.toString(),
    });

    return response.messages || [];
  }

  /**
   * Get messages with full response (including lastRow for polling)
   */
  async getMessagesWithMeta(
    sessionCode: string,
    userName: string,
    lastRow: number = 1
  ): Promise<MessagesResponse> {
    return this.get<MessagesResponse>({
      mode: 'messages',
      session: sessionCode,
      user: userName,
      lastRow: lastRow.toString(),
    });
  }

  /**
   * Send a message to a session
   */
  async sendMessage(
    sessionCode: string,
    payload: SendMessagePayload
  ): Promise<{ success: boolean; row?: number; translation?: string; error?: string }> {
    return this.post(
      { mode: 'sendMessage', session: sessionCode },
      {
        text: payload.text,
        from: payload.from,
        language: payload.language,
        role: payload.role,
      }
    );
  }

  // ===== AUDIO QUEUE =====

  /**
   * Get audio queue items
   */
  async getAudioQueue(
    sessionCode: string,
    userName: string,
    lastId: number = 0
  ): Promise<AudioQueueResponse> {
    const response = await this.get<{ items: AudioQueueResponse['queue']; error?: string }>({
      mode: 'queue',
      session: sessionCode,
      to: userName,
      lastId: lastId.toString(),
    });

    return {
      queue: response.items || [],
      lastId: response.items?.length
        ? Math.max(...response.items.map((i) => i.id))
        : lastId,
    };
  }

  // ===== BABEL RESPONSES =====

  /**
   * Submit a Babel response
   */
  async submitBabelResponse(response: Omit<BabelResponse, 'id'>): Promise<{ success: boolean }> {
    return this.post(
      { mode: 'babelResponse' },
      {
        name: response.name,
        language: response.language,
        response: response.response,
        timestamp: response.timestamp,
      }
    );
  }

  /**
   * Get Babel responses
   */
  async getBabelResponses(limit: number = 20): Promise<BabelResponse[]> {
    const response = await this.get<{ responses: BabelResponse[] }>({
      mode: 'babelResponses',
      limit: limit.toString(),
    });

    return response.responses || [];
  }

  // ===== HELPERS =====

  /**
   * Convert language code to display name
   */
  private getLanguageName(code: Language): string {
    const map: Record<Language, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      pt: 'Portuguese',
      zh: 'Mandarin',
      ja: 'Japanese',
      ko: 'Korean',
      ar: 'Arabic',
      hi: 'Hindi',
      de: 'German',
      it: 'Italian',
      ru: 'Russian',
    };
    return map[code] || 'English';
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  /**
   * Get the base URL (for debugging)
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const api = new ApiService(BASE_URL);

export default api;
