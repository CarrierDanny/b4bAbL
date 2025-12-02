import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkipButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export default function SkipButton({
  to = '/menu',
  label = 'Skip',
  onClick,
  position = 'bottom-left',
}: SkipButtonProps) {
  const navigate = useNavigate();

  const positionClasses = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'top-right': 'top-6 right-6',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <motion.button
      className={`fixed ${positionClasses[position]} z-50 flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-800/20 hover:bg-stone-800/30 text-stone-700 font-cinzel text-sm tracking-wide transition-colors backdrop-blur-sm border border-stone-600/20`}
      initial={{ opacity: 0, x: position.includes('left') ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${label} to translator`}
    >
      {label}
      <ChevronRight size={16} />
    </motion.button>
  );
}
