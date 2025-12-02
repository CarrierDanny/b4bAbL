import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { StoneBackground, Header, Footer, SkipButton } from '../layout';
import { StoneTablet, StoneButton, StoneTextarea, SpeechBubbleContainer } from '../ui';
import { BabelResponse } from '../../types';
import { storage } from '../../services/storage';
import { useBabelResponses } from '../../hooks/useBabelResponses';

export default function BabelQuestionScreen() {
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { responses, submitResponse, fetchResponses } = useBabelResponses();
  const [visibleBubbles, setVisibleBubbles] = useState<BabelResponse[]>([]);

  const userName = storage.getUserName() || 'Guest';
  const userLanguage = storage.getUserLanguage() || 'en';

  // Fetch existing responses on mount
  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Gradually show bubbles as user types
  useEffect(() => {
    if (response.length > 10 && responses.length > 0) {
      const showCount = Math.min(
        Math.floor((response.length - 10) / 20) + 1,
        responses.length,
        5
      );
      setVisibleBubbles(responses.slice(0, showCount));
    }
  }, [response.length, responses]);

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      await submitResponse({
        name: userName,
        language: userLanguage,
        response: response.trim(),
        timestamp: new Date().toISOString(),
      });
      navigate('/story');
    } catch (error) {
      console.error('Failed to submit response:', error);
      // Continue anyway
      navigate('/story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/story');
  };

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header compact />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
          <StoneTablet className="w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-cinzel text-xl md:text-2xl text-center etched-text mb-2">
                "Do you know the story of Babel?"
              </h2>

              <p className="font-crimson text-stone-600 text-center italic mb-6">
                Share your thoughts...
              </p>

              <div className="space-y-4">
                <StoneTextarea
                  placeholder="What comes to mind when you think of the Tower of Babel? Share your thoughts, memories, or interpretation..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                  aria-label="Your thoughts on Babel"
                />

                <StoneButton
                  onClick={handleSubmit}
                  fullWidth
                  disabled={isSubmitting || !response.trim()}
                  icon={<Send size={18} />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Your Story'}
                </StoneButton>
              </div>
            </motion.div>
          </StoneTablet>

          {/* Floating speech bubbles */}
          <AnimatePresence>
            {visibleBubbles.length > 0 && (
              <motion.div
                className="w-full max-w-2xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <SpeechBubbleContainer
                  bubbles={visibleBubbles.map((b, i) => ({
                    id: b.id || i,
                    name: b.name,
                    text: b.response,
                  }))}
                  maxVisible={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer compact />
        <SkipButton onClick={handleSkip} />
      </div>
    </StoneBackground>
  );
}
