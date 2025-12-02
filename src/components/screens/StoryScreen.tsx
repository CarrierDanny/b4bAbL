import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StoneBackground, Header, SkipButton } from '../layout';
import { StoneButton, EtchedPassage, DustParticles } from '../ui';
import { storage } from '../../services/storage';

const STORY_PARAGRAPHS = [
  'Before the tower, humanity spoke with one voice.',
  'In our ambition to touch the divine, we reached too high—and in that reaching, we lost each other.',
  'Languages scattered like stones from an unfinished monument.',
  'But now, through b4bAbL, we build again... not a tower of pride, but a bridge of understanding.',
];

const ATTRIBUTION = '— Genesis 11:1-9, Reimagined';

export default function StoryScreen() {
  const navigate = useNavigate();
  const [showContinue, setShowContinue] = useState(false);

  // Show continue button after story finishes
  const storyDuration = STORY_PARAGRAPHS.length * 2.5 + 2; // paragraphs * delay + buffer

  setTimeout(() => {
    setShowContinue(true);
    storage.setSeenStory(true);
  }, storyDuration * 1000);

  const handleContinue = () => {
    storage.setSeenStory(true);
    navigate('/menu');
  };

  const handleSkip = () => {
    storage.setSeenStory(true);
    navigate('/menu');
  };

  return (
    <StoneBackground showDust={false}>
      <DustParticles count={25} />

      <div className="min-h-screen flex flex-col">
        <Header compact showSubtitle={false} />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-xl w-full text-center">
            {/* Story text */}
            <EtchedPassage
              paragraphs={STORY_PARAGRAPHS}
              className="mb-8"
              paragraphDelay={2.5}
            />

            {/* Attribution */}
            <motion.p
              className="font-crimson text-stone-600 text-base italic mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: STORY_PARAGRAPHS.length * 2.5 + 1, duration: 0.8 }}
            >
              {ATTRIBUTION}
            </motion.p>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContinue ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {showContinue && (
                <StoneButton
                  onClick={handleContinue}
                  size="lg"
                  icon={<ArrowRight size={20} />}
                >
                  Continue
                </StoneButton>
              )}
            </motion.div>
          </div>
        </main>

        <SkipButton onClick={handleSkip} />
      </div>
    </StoneBackground>
  );
}
