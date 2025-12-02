import { motion, Variants } from 'framer-motion';

interface EtchedTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  animate?: boolean;
  wordDelay?: number;
  lineByLine?: boolean;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function EtchedText({
  text,
  className = '',
  as = 'p',
  animate = true,
  wordDelay = 0.1,
  lineByLine = false,
}: EtchedTextProps) {
  const Tag = as;

  if (!animate) {
    return (
      <Tag className={`etched-text font-crimson ${className}`}>
        {text}
      </Tag>
    );
  }

  if (lineByLine) {
    const lines = text.split('\n');
    return (
      <div className={className}>
        {lines.map((line, lineIndex) => (
          <motion.div
            key={lineIndex}
            className="etched-text font-crimson"
            custom={lineIndex}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            {line || '\u00A0'}
          </motion.div>
        ))}
      </div>
    );
  }

  const words = text.split(' ');

  return (
    <Tag className={`etched-text font-crimson ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          custom={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: (i: number) => ({
              opacity: 1,
              y: 0,
              transition: {
                delay: i * wordDelay,
                duration: 0.3,
                ease: 'easeOut',
              },
            }),
          }}
          initial="hidden"
          animate="visible"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

// For longer passages with multiple paragraphs
interface EtchedPassageProps {
  paragraphs: string[];
  className?: string;
  paragraphDelay?: number;
}

export function EtchedPassage({
  paragraphs,
  className = '',
  paragraphDelay = 2,
}: EtchedPassageProps) {
  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIndex) => {
        const words = paragraph.split(' ');
        const baseDelay = pIndex * paragraphDelay;

        return (
          <motion.p
            key={pIndex}
            className="etched-text font-crimson text-lg leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay, duration: 0.3 }}
          >
            {words.map((word, wIndex) => (
              <motion.span
                key={wIndex}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: baseDelay + wIndex * 0.08,
                  duration: 0.25,
                  ease: 'easeOut',
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        );
      })}
    </div>
  );
}
