import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showTitle?: boolean;
  showSubtitle?: boolean;
  compact?: boolean;
}

export default function Header({ showTitle = true, showSubtitle = true, compact = false }: HeaderProps) {
  return (
    <header className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
      <Link to="/" className="inline-block">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tower Silhouette */}
          <div className={`mx-auto ${compact ? 'mb-2' : 'mb-4'}`}>
            <svg
              viewBox="0 0 100 120"
              className={compact ? 'w-12 h-14' : 'w-20 h-24'}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="towerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4c4a8" />
                  <stop offset="50%" stopColor="#a67c5b" />
                  <stop offset="100%" stopColor="#6b5344" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.3" />
                </filter>
              </defs>
              <g filter="url(#shadow)">
                {/* Base level */}
                <rect x="15" y="85" width="70" height="30" rx="2" fill="url(#towerGrad)" stroke="#4a3728" strokeWidth="1.5" />
                {/* Second level */}
                <rect x="20" y="60" width="60" height="30" rx="2" fill="url(#towerGrad)" stroke="#4a3728" strokeWidth="1.5" />
                {/* Third level */}
                <rect x="25" y="40" width="50" height="25" rx="2" fill="url(#towerGrad)" stroke="#4a3728" strokeWidth="1.5" />
                {/* Fourth level */}
                <rect x="30" y="22" width="40" height="23" rx="2" fill="url(#towerGrad)" stroke="#4a3728" strokeWidth="1.5" />
                {/* Top level */}
                <rect x="35" y="8" width="30" height="18" rx="2" fill="url(#towerGrad)" stroke="#4a3728" strokeWidth="1.5" />
                {/* Peak */}
                <polygon points="50,0 62,8 38,8" fill="#c4a878" stroke="#4a3728" strokeWidth="1" />
                {/* Windows */}
                <rect x="45" y="92" width="10" height="18" rx="1" fill="#3d2b1f" />
                <rect x="30" y="68" width="8" height="12" rx="1" fill="#3d2b1f" />
                <rect x="62" y="68" width="8" height="12" rx="1" fill="#3d2b1f" />
                <rect x="45" y="46" width="10" height="12" rx="1" fill="#3d2b1f" />
                <rect x="45" y="26" width="10" height="10" rx="1" fill="#3d2b1f" />
              </g>
            </svg>
          </div>

          {/* Title */}
          {showTitle && (
            <motion.h1
              className={`font-cinzel font-bold etched-text ${compact ? 'text-2xl' : 'text-4xl md:text-5xl'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              b4bAbL
            </motion.h1>
          )}

          {/* Subtitle */}
          {showSubtitle && (
            <motion.p
              className={`font-cinzel text-stone-600 tracking-widest ${compact ? 'text-xs mt-1' : 'text-sm mt-2'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              A DANMAN Solution
            </motion.p>
          )}
        </motion.div>
      </Link>
    </header>
  );
}
