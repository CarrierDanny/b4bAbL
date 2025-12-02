import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Globe, Volume2 } from 'lucide-react';
import { StoneBackground, Header, Footer } from '../layout';
import { StoneTablet, StoneButton, StoneInput, LanguageSelect } from '../ui';
import { Language } from '../../types';
import { storage } from '../../services/storage';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState(storage.getUserName() || '');
  const [language, setLanguage] = useState<Language | null>(storage.getUserLanguage());
  const [audioEnabled, setAudioEnabled] = useState(storage.getAudioEnabled());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      storage.setUserName(name.trim());
    }
    if (language) {
      storage.setUserLanguage(language);
    }
    storage.setAudioEnabled(audioEnabled);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      storage.clearAll();
      setName('');
      setLanguage(null);
      setAudioEnabled(true);
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
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-cinzel">Back to Menu</span>
            </button>

            <StoneTablet>
              <h2 className="font-cinzel text-2xl text-center etched-text mb-8">
                Settings
              </h2>

              <div className="space-y-6">
                {/* Name Setting */}
                <div>
                  <label className="flex items-center gap-2 font-cinzel text-stone-700 text-sm mb-2 etched-text-light">
                    <User size={16} />
                    Your Name
                  </label>
                  <StoneInput
                    type="text"
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Language Setting */}
                <div>
                  <label className="flex items-center gap-2 font-cinzel text-stone-700 text-sm mb-2 etched-text-light">
                    <Globe size={16} />
                    Your Language
                  </label>
                  <LanguageSelect
                    value={language}
                    onChange={setLanguage}
                    placeholder="Select your language"
                  />
                </div>

                {/* Audio Setting */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-cinzel text-stone-700 text-sm etched-text-light">
                    <Volume2 size={16} />
                    Audio Playback
                  </label>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      audioEnabled ? 'bg-gold-accent' : 'bg-stone-400'
                    }`}
                    role="switch"
                    aria-checked={audioEnabled}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        audioEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <StoneButton
                    onClick={handleSave}
                    fullWidth
                    icon={<Save size={18} />}
                    variant={saved ? 'gold' : 'primary'}
                  >
                    {saved ? 'Saved!' : 'Save Settings'}
                  </StoneButton>
                </div>

                {/* Clear Data */}
                <div className="pt-4 border-t border-stone-400/30">
                  <button
                    onClick={handleClearData}
                    className="w-full font-crimson text-sm text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Clear all saved data
                  </button>
                </div>
              </div>
            </StoneTablet>
          </motion.div>
        </main>

        <Footer compact />
      </div>
    </StoneBackground>
  );
}
