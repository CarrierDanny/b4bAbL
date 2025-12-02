import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Users, Copy, Check, ArrowRight } from 'lucide-react';
import { StoneBackground, Header, Footer } from '../layout';
import { StoneTablet, StoneButton, StoneInput, LanguageSelect } from '../ui';
import { Language } from '../../types';
import { storage } from '../../services/storage';
import { api } from '../../services/api';

type SetupMode = 'select' | 'create' | 'join';

export default function SessionSetupScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') as SetupMode || 'select';

  const [mode, setMode] = useState<SetupMode>(initialMode === 'new' ? 'create' : initialMode === 'quick' ? 'join' : 'select');
  const [sessionId, setSessionId] = useState('');
  const [generatedSessionId, setGeneratedSessionId] = useState('');
  const [partnerLanguage, setPartnerLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const userName = storage.getUserName() || 'Guest';
  const userLanguage = storage.getUserLanguage() || 'en';

  // Generate a simple session ID
  const generateSessionId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0/O, 1/I
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create a new session
  const handleCreateSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newSessionId = generateSessionId();

      // Try to register with backend
      try {
        await api.createSession(userName, userLanguage);
      } catch {
        // Continue even if backend fails - we can work with local session
        console.log('Backend unavailable, using local session');
      }

      setGeneratedSessionId(newSessionId);
      storage.setLastSession(newSessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  // Join existing session
  const handleJoinSession = () => {
    if (!sessionId.trim()) {
      setError('Please enter a session code');
      return;
    }

    storage.setLastSession(sessionId.trim().toUpperCase());
    navigate(`/translate?session=${sessionId.trim().toUpperCase()}&creator=false`);
  };

  // Start the created session
  const handleStartSession = () => {
    navigate(`/translate?session=${generatedSessionId}&creator=true`);
  };

  // Copy session ID to clipboard
  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(generatedSessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedSessionId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header compact />

        <main className="flex-1 flex flex-col items-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Back button */}
            <button
              onClick={() => mode === 'select' ? navigate('/menu') : setMode('select')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-cinzel">{mode === 'select' ? 'Back to Menu' : 'Back'}</span>
            </button>

            {/* Mode Selection */}
            {mode === 'select' && (
              <StoneTablet>
                <h2 className="font-cinzel text-2xl text-center etched-text mb-8">
                  Translation Session
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setMode('create');
                      handleCreateSession();
                    }}
                    className="menu-tablet w-full flex items-center gap-4 p-4"
                  >
                    <Plus className="text-stone-600" size={24} />
                    <div className="text-left">
                      <h3 className="font-cinzel text-lg etched-text">Create New Session</h3>
                      <p className="font-crimson text-sm text-stone-600">
                        Get a code to share with your partner
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode('join')}
                    className="menu-tablet w-full flex items-center gap-4 p-4"
                  >
                    <Users className="text-stone-600" size={24} />
                    <div className="text-left">
                      <h3 className="font-cinzel text-lg etched-text">Join Session</h3>
                      <p className="font-crimson text-sm text-stone-600">
                        Enter a code to join an existing session
                      </p>
                    </div>
                  </button>
                </div>
              </StoneTablet>
            )}

            {/* Create Session */}
            {mode === 'create' && (
              <StoneTablet>
                <h2 className="font-cinzel text-2xl text-center etched-text mb-6">
                  New Session
                </h2>

                {isLoading ? (
                  <div className="text-center py-8">
                    <motion.p
                      className="font-crimson text-stone-600 italic"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Creating session...
                    </motion.p>
                  </div>
                ) : generatedSessionId ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="font-crimson text-stone-600 mb-2">
                        Share this code with your translation partner:
                      </p>
                      <div className="bg-stone-300/50 rounded-lg p-4 flex items-center justify-center gap-3">
                        <span className="font-cinzel text-3xl tracking-[0.3em] etched-text">
                          {generatedSessionId}
                        </span>
                        <button
                          onClick={handleCopySessionId}
                          className="p-2 rounded-lg hover:bg-stone-400/30 transition-colors"
                          aria-label="Copy session code"
                        >
                          {copied ? (
                            <Check className="text-green-600" size={20} />
                          ) : (
                            <Copy className="text-stone-600" size={20} />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <p className="font-crimson text-sm text-green-600 mt-2">
                          Copied to clipboard!
                        </p>
                      )}
                    </div>

                    <div className="border-t border-stone-400/30 pt-4">
                      <p className="font-crimson text-sm text-stone-600 mb-3 text-center">
                        Your language: <strong>{userLanguage.toUpperCase()}</strong>
                      </p>

                      <label className="block font-cinzel text-stone-700 text-sm mb-2 etched-text-light">
                        Partner's Language (optional)
                      </label>
                      <LanguageSelect
                        value={partnerLanguage}
                        onChange={setPartnerLanguage}
                        placeholder="Select partner's language"
                      />
                    </div>

                    <StoneButton
                      onClick={handleStartSession}
                      fullWidth
                      size="lg"
                      icon={<ArrowRight size={20} />}
                    >
                      Start Session
                    </StoneButton>

                    <p className="font-crimson text-xs text-stone-500 text-center">
                      Your partner can join anytime using the code above
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="font-crimson text-red-600">{error || 'Something went wrong'}</p>
                    <StoneButton onClick={handleCreateSession} className="mt-4">
                      Try Again
                    </StoneButton>
                  </div>
                )}
              </StoneTablet>
            )}

            {/* Join Session */}
            {mode === 'join' && (
              <StoneTablet>
                <h2 className="font-cinzel text-2xl text-center etched-text mb-6">
                  Join Session
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block font-cinzel text-stone-700 text-sm mb-2 etched-text-light">
                      Enter Session Code
                    </label>
                    <StoneInput
                      type="text"
                      placeholder="e.g., ABC123"
                      value={sessionId}
                      onChange={(e) => {
                        setSessionId(e.target.value.toUpperCase());
                        setError(null);
                      }}
                      className="text-center text-xl tracking-[0.2em] font-cinzel"
                      maxLength={6}
                      aria-label="Session code"
                    />
                    {error && (
                      <p className="font-crimson text-sm text-red-600 mt-2">{error}</p>
                    )}
                  </div>

                  <div className="border-t border-stone-400/30 pt-4">
                    <p className="font-crimson text-sm text-stone-600 mb-3 text-center">
                      Your language: <strong>{userLanguage.toUpperCase()}</strong>
                    </p>
                  </div>

                  <StoneButton
                    onClick={handleJoinSession}
                    fullWidth
                    size="lg"
                    disabled={!sessionId.trim()}
                    icon={<Users size={20} />}
                  >
                    Join Session
                  </StoneButton>

                  <p className="font-crimson text-xs text-stone-500 text-center">
                    Ask your translation partner for their session code
                  </p>
                </div>
              </StoneTablet>
            )}
          </motion.div>
        </main>

        <Footer compact />
      </div>
    </StoneBackground>
  );
}
