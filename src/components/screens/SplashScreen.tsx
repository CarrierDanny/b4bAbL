import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StoneBackground, Header, Footer, SkipButton } from '../layout';
import { StoneButton, LanguageSelect } from '../ui';
import { Language } from '../../types';
import { storage } from '../../services/storage';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    storage.getUserLanguage()
  );

  const handleContinue = () => {
    if (selectedLanguage) {
      storage.setUserLanguage(selectedLanguage);
      navigate('/signin');
    }
  };

  const handleSkip = () => {
    if (selectedLanguage) {
      storage.setUserLanguage(selectedLanguage);
    }
    navigate('/menu');
  };

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          {/* Tagline */}
          <motion.p
            className="font-crimson text-stone-700 text-xl md:text-2xl italic text-center mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            "To unite the tongues of Humanity"
          </motion.p>

          {/* Language Selection */}
          <motion.div
            className="w-full max-w-sm space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <LanguageSelect
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              placeholder="Select Your Language"
            />

            <StoneButton
              onClick={handleContinue}
              disabled={!selectedLanguage}
              fullWidth
              size="lg"
              icon={<ArrowRight size={20} />}
            >
              Continue
            </StoneButton>
          </motion.div>
        </main>

        <Footer />
        <SkipButton to="/menu" label="Skip to Translator" onClick={handleSkip} />
      </div>
    </StoneBackground>
  );
}
