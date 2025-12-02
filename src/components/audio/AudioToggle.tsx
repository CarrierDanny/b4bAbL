import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioToggleProps {
  enabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function AudioToggle({
  enabled,
  onToggle,
  size = 'md',
  showLabel = false,
}: AudioToggleProps) {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <motion.button
      onClick={onToggle}
      className={`
        ${buttonSizes[size]}
        flex items-center gap-2
        rounded-lg
        transition-colors
        ${enabled
          ? 'bg-gold-accent/20 hover:bg-gold-accent/30 text-stone-700'
          : 'bg-stone-400/20 hover:bg-stone-400/30 text-stone-500'
        }
      `}
      whileTap={{ scale: 0.95 }}
      aria-label={enabled ? 'Disable audio' : 'Enable audio'}
      aria-pressed={enabled}
    >
      {enabled ? (
        <Volume2 size={iconSizes[size]} />
      ) : (
        <VolumeX size={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="font-crimson text-sm">
          {enabled ? 'Audio On' : 'Audio Off'}
        </span>
      )}
    </motion.button>
  );
}
