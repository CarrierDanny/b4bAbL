import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface StoneTabletProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const tabletVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function StoneTablet({
  children,
  className = '',
  animate = true,
  delay = 0,
}: StoneTabletProps) {
  if (!animate) {
    return (
      <div className={`stone-tablet ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`stone-tablet ${className}`}
      variants={tabletVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
