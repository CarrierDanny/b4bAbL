import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Volume2, VolumeX, Users, Copy, Check } from 'lucide-react';
import { StoneBackground } from '../layout';
import { StoneButton, StoneInput, StoneTablet } from '../ui';
import { Message } from '../../types';
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
  const sessionCodeParam = searchParams.get('session');
  const isCreator = searchParams.get('creator') === 'true';

  const [inputText, setInputText] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(storage.getAudioEnabled());
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = storage.getUserName() || 'Guest';
  const userLanguage = storage.getUserLanguage() || 'en';

  const {
    sessionCode,
    config,
    messages,
    isConnected,
    isLoading,
    error,
    myRole,
    connect,
    sendMessage,
  } = useTranslationSession();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect on mount
  useEffect(() => {
    if (sessionCodeParam && !isConnected && !isLoading) {
      connect(sessionCodeParam, userName, userLanguage, isCreator);
    }
  }, [sessionCodeParam, isConnected, isLoading, userName, userLanguage, isCreator, connect]);

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

  const handleCopyCode = async () => {
    if (sessionCode) {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Redirect if no session code
  if (!sessionCodeParam) {
    return (
      <StoneBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <StoneTablet className="max-w-sm text-center">
            <p className="font-crimson text-stone-600 mb-4">No session code provided</p>
            <StoneButton onClick={() => navigate('/session')}>
              Create or Join Session
            </StoneButton>
          </StoneTablet>
        </div>
      </StoneBackground>
    );
  }

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
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Connected as {myRole === 'A' ? 'Host' : 'Guest'}
                    </span>
                  ) : isLoading ? (
                    'Connecting...'
                  ) : (
                    'Disconnected'
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
            </div>
          </div>
        </header>

        {/* Session Info Bar */}
        <div className="bg-stone-300/50 px-4 py-2 border-b border-stone-400/30">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-stone-600">
              <Users size={16} />
              <span className="font-crimson">
                {config ? `${config.userA} & ${config.userB}` : 'Waiting for partner...'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-stone-500 text-xs">
                Room: <span className="font-bold tracking-wider">{sessionCodeParam}</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded hover:bg-stone-400/30 transition-colors"
                aria-label="Copy room code"
              >
                {copied ? (
                  <Check className="text-green-600" size={14} />
                ) : (
                  <Copy className="text-stone-500" size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border-b border-red-300 px-4 py-2">
            <p className="font-crimson text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full py-20">
                <motion.div
                  className="font-crimson text-stone-500 italic"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Connecting to session...
                </motion.div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <StoneTablet className="max-w-sm">
                  <p className="font-crimson text-stone-600 italic mb-4">
                    {isCreator
                      ? `Share the room code with your partner: `
                      : 'No messages yet. Start the conversation!'
                    }
                  </p>
                  {isCreator && (
                    <div className="bg-stone-300/50 rounded-lg p-3 flex items-center justify-center gap-2">
                      <span className="font-cinzel text-2xl tracking-[0.2em] etched-text">
                        {sessionCodeParam}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-2 rounded-lg hover:bg-stone-400/30 transition-colors"
                      >
                        {copied ? (
                          <Check className="text-green-600" size={18} />
                        ) : (
                          <Copy className="text-stone-600" size={18} />
                        )}
                      </button>
                    </div>
                  )}
                </StoneTablet>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.from === userName || (myRole === 'A' && message.side === 'A') || (myRole === 'B' && message.side === 'B')}
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
              disabled={!isConnected}
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
