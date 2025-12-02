// User Types
export interface User {
  name: string;
  email?: string;
  language: Language;
  isGuest: boolean;
  googleId?: string;
}

// Language Types
export type Language =
  | 'en' | 'es' | 'fr' | 'pt' | 'zh'
  | 'ja' | 'ko' | 'ar' | 'hi' | 'de'
  | 'it' | 'ru';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

// Babel Response Types
export interface BabelResponse {
  id?: string;
  name: string;
  language: Language;
  response: string;
  timestamp: string;
}

// Translation Session Types
export interface TranslationSession {
  id: string;
  participants: Participant[];
  messages: Message[];
  createdAt: string;
  isActive: boolean;
}

export interface Participant {
  name: string;
  language: Language;
  role: 'A' | 'B';
}

export interface Message {
  id: string;
  from: string;
  originalText: string;
  translatedText: string;
  fromLanguage: Language;
  toLanguage: Language;
  timestamp: string;
  audioUrl?: string;
}

// Audio Queue Types
export interface AudioQueueItem {
  id: number;
  audioUrl: string;
  message: string;
  from: string;
  played: boolean;
}

export interface AudioQueueResponse {
  queue: AudioQueueItem[];
  lastId: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_NAME: 'b4babl_userName',
  USER_LANGUAGE: 'b4babl_userLanguage',
  SEEN_STORY: 'b4babl_seenStory',
  AUDIO_ENABLED: 'b4babl_audioEnabled',
  LAST_SESSION: 'b4babl_lastSession',
  THEME_PREFERENCE: 'b4babl_theme',
} as const;

// App State Types
export interface AppState {
  user: User | null;
  currentScreen: ScreenType;
  audioEnabled: boolean;
  hasSeenStory: boolean;
}

export type ScreenType =
  | 'splash'
  | 'signin'
  | 'babel-question'
  | 'story'
  | 'menu'
  | 'translation'
  | 'settings';
