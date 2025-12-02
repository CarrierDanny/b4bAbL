import { Language, STORAGE_KEYS } from '../types';

class StorageService {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private get(key: string): string | null {
    if (!this.isAvailable) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private set(key: string, value: string): void {
    if (!this.isAvailable) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private remove(key: string): void {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }

  // User Name
  getUserName(): string | null {
    return this.get(STORAGE_KEYS.USER_NAME);
  }

  setUserName(name: string): void {
    this.set(STORAGE_KEYS.USER_NAME, name);
  }

  // User Language
  getUserLanguage(): Language | null {
    const language = this.get(STORAGE_KEYS.USER_LANGUAGE);
    return language as Language | null;
  }

  setUserLanguage(language: Language): void {
    this.set(STORAGE_KEYS.USER_LANGUAGE, language);
  }

  // Seen Story
  hasSeenStory(): boolean {
    return this.get(STORAGE_KEYS.SEEN_STORY) === 'true';
  }

  setSeenStory(seen: boolean): void {
    this.set(STORAGE_KEYS.SEEN_STORY, seen.toString());
  }

  // Audio Enabled
  getAudioEnabled(): boolean {
    const value = this.get(STORAGE_KEYS.AUDIO_ENABLED);
    return value !== 'false'; // Default to true
  }

  setAudioEnabled(enabled: boolean): void {
    this.set(STORAGE_KEYS.AUDIO_ENABLED, enabled.toString());
  }

  // Last Session
  getLastSession(): string | null {
    return this.get(STORAGE_KEYS.LAST_SESSION);
  }

  setLastSession(sessionId: string): void {
    this.set(STORAGE_KEYS.LAST_SESSION, sessionId);
  }

  // Theme Preference
  getThemePreference(): 'light' | 'dark' | null {
    const theme = this.get(STORAGE_KEYS.THEME_PREFERENCE);
    return theme as 'light' | 'dark' | null;
  }

  setThemePreference(theme: 'light' | 'dark'): void {
    this.set(STORAGE_KEYS.THEME_PREFERENCE, theme);
  }

  // Clear all b4bAbL data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.remove(key);
    });
  }

  // Get all stored data (for debugging)
  getAllData(): Record<string, string | null> {
    const data: Record<string, string | null> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data[name] = this.get(key);
    });
    return data;
  }
}

// Export singleton instance
export const storage = new StorageService();

export default storage;
