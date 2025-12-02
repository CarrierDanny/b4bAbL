import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StoneBackgroundProps {
  children: ReactNode;
  showDust?: boolean;
}

export default function StoneBackground({ children, showDust = true }: StoneBackgroundProps) {
  return (
    <div className="stone-background min-h-screen relative overflow-hidden">
      {/* Stone texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating dust particles */}
      {showDust && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="dust-particle"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                opacity: 0,
              }}
              animate={{
                y: -50,
                opacity: [0, 0.6, 0.6, 0],
                rotate: 720,
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear',
              }}
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
