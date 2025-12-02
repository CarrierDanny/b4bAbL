import { motion, Variants } from 'framer-motion';

interface SpeechBubbleProps {
  name: string;
  text: string;
  index?: number;
  maxLength?: number;
}

const bubbleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      delay: i * 0.3,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function SpeechBubble({
  name,
  text,
  index = 0,
  maxLength = 80,
}: SpeechBubbleProps) {
  const truncatedText = text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;

  return (
    <motion.div
      className="speech-bubble max-w-xs"
      custom={index}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <p className="font-cinzel text-stone-700 text-xs font-semibold mb-1 tracking-wide">
        {name}
      </p>
      <p className="font-crimson text-stone-600 text-sm italic leading-snug">
        "{truncatedText}"
      </p>
    </motion.div>
  );
}

// Container for multiple floating bubbles
interface SpeechBubbleContainerProps {
  bubbles: Array<{ name: string; text: string; id: string | number }>;
  maxVisible?: number;
}

export function SpeechBubbleContainer({
  bubbles,
  maxVisible = 5,
}: SpeechBubbleContainerProps) {
  const visibleBubbles = bubbles.slice(0, maxVisible);

  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-center items-end"
      initial="hidden"
      animate="visible"
    >
      {visibleBubbles.map((bubble, index) => (
        <motion.div
          key={bubble.id}
          initial={{ x: (index % 2 === 0 ? -1 : 1) * (50 + Math.random() * 50) }}
          animate={{ x: 0 }}
          transition={{ delay: index * 0.2, type: 'spring', damping: 12 }}
        >
          <SpeechBubble
            name={bubble.name}
            text={bubble.text}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
