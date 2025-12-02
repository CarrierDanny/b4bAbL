import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Volume2, VolumeX, Users } from 'lucide-react';
import { StoneBackground, Header } from '../layout';
import { StoneButton, StoneInput, StoneTablet } from '../ui';
import { Message, Language, SUPPORTED_LANGUAGES } from '../../types';
import { storage } from '../../services/storage';
import { useTranslationSession } from '../../hooks/useTranslationSession';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <motion.div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isOwn
            ? 'bg-gradient-to-br from-gold-accent/30 to-stone-400/30 border border-gold-accent/50'
            : 'bg-gradient-to-br from-stone-200 to-stone-300 border border-stone-400'
        }`}
      >
        <p className="font-cinzel text-xs text-stone-600 mb-1">{message.from}</p>
        <p className="font-crimson text-stone-800 text-sm">{message.originalText}</p>
        {message.translatedText && message.translatedText !== message.originalText && (
          <p className="font-crimson text-stone-600 text-sm italic mt-2 pt-2 border-t border-stone-400/30">
            {message.translatedText}
          </p>
        )}
        <p className="font-crimson text-xs text-stone-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function TranslationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'quick';
  const sessionId = searchParams.get('session');

  const [inputText, setInputText] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(storage.getAudioEnabled());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = storage.getUserName() || 'Guest';
  const userLanguage = storage.getUserLanguage() || 'en';

  const {
    session,
    messages,
    isConnected,
    isLoading,
    sendMessage,
    connect,
  } = useTranslationSession(sessionId || undefined);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect on mount
  useEffect(() => {
    if (!session && mode === 'quick') {
      connect(userName, userLanguage);
    }
  }, [session, mode, userName, userLanguage, connect]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    await sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleAudio = () => {
    const newValue = !audioEnabled;
    setAudioEnabled(newValue);
    storage.setAudioEnabled(newValue);
  };

  const getLanguageName = (code: Language) => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <StoneBackground showDust={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-b from-stone-700 to-stone-800 px-4 py-3 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/menu')}
                className="p-2 rounded-lg hover:bg-stone-600/50 transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="text-stone-200" size={20} />
              </button>
              <div>
                <h1 className="font-cinzel text-stone-100 text-lg">Translation Session</h1>
                <p className="font-crimson text-stone-400 text-sm">
                  {isConnected ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      Connected
                    </span>
                  ) : (
                    'Connecting...'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 rounded-lg hover:bg-stone-600/50 transition-colors"
                aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
              >
                {audioEnabled ? (
                  <Volume2 className="text-stone-200" size={20} />
                ) : (
                  <VolumeX className="text-stone-400" size={20} />
                )}
              </button>
              <div className="px-3 py-1 bg-stone-600/50 rounded-lg">
                <span className="font-crimson text-stone-200 text-sm">
                  {getLanguageName(userLanguage)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Session Info */}
        {session && (
          <div className="bg-stone-300/50 px-4 py-2 border-b border-stone-400/30">
            <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <Users size={16} />
                <span className="font-crimson">
                  {session.participants.map((p) => p.name).join(' & ')}
                </span>
              </div>
              <span className="font-crimson text-stone-500">
                Session: {session.id}
              </span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  className="font-crimson text-stone-500 italic"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading messages...
                </motion.div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <StoneTablet className="max-w-sm">
                  <p className="font-crimson text-stone-600 italic">
                    No messages yet. Start the conversation by typing below.
                  </p>
                </StoneTablet>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.from === userName}
                  />
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="bg-gradient-to-t from-stone-300 to-stone-200 px-4 py-3 border-t border-stone-400">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <StoneInput
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              aria-label="Message input"
            />
            <StoneButton
              onClick={handleSend}
              disabled={!inputText.trim() || !isConnected}
              icon={<Send size={18} />}
            >
              Send
            </StoneButton>
          </div>
        </footer>
      </div>
    </StoneBackground>
  );
}
