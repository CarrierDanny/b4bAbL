import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import { StoneBackground, Header, Footer, SkipButton } from '../layout';
import { StoneTablet, StoneButton, StoneInput } from '../ui';
import { storage } from '../../services/storage';

export default function SignInScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState(storage.getUserName() || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueAsGuest = () => {
    if (name.trim()) {
      storage.setUserName(name.trim());
    }
    navigate('/babel');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Google OAuth would be implemented here
    // For now, just continue with name
    setTimeout(() => {
      if (name.trim()) {
        storage.setUserName(name.trim());
      }
      setIsLoading(false);
      navigate('/babel');
    }, 500);
  };

  const handleSkip = () => {
    navigate('/menu');
  };

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header compact />

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <StoneTablet className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-cinzel text-2xl text-center etched-text mb-8">
                Enter Your Name
              </h2>

              <div className="space-y-6">
                <StoneInput
                  type="text"
                  placeholder="Your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Your name"
                />

                <div className="space-y-3">
                  <StoneButton
                    onClick={handleGoogleSignIn}
                    fullWidth
                    variant="secondary"
                    icon={<LogIn size={18} />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                  </StoneButton>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-stone-500/30" />
                    <span className="font-crimson text-stone-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-stone-500/30" />
                  </div>

                  <StoneButton
                    onClick={handleContinueAsGuest}
                    fullWidth
                    icon={<User size={18} />}
                  >
                    Continue as Guest
                  </StoneButton>
                </div>
              </div>
            </motion.div>
          </StoneTablet>
        </main>

        <Footer compact />
        <SkipButton onClick={handleSkip} />
      </div>
    </StoneBackground>
  );
}
