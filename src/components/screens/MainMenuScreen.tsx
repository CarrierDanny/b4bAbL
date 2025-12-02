import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Plus, ScrollText, Settings, Volume2 } from 'lucide-react';
import { StoneBackground, Header, Footer } from '../layout';
import { storage } from '../../services/storage';

interface MenuTabletProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  delay?: number;
}

function MenuTablet({ icon, title, subtitle, onClick, delay = 0 }: MenuTabletProps) {
  return (
    <motion.button
      className="menu-tablet flex flex-col items-center justify-center text-center min-h-[140px] w-full"
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-3xl mb-2 text-stone-600">{icon}</div>
      <h3 className="font-cinzel text-lg font-semibold etched-text">{title}</h3>
      {subtitle && (
        <p className="font-crimson text-sm text-stone-600 mt-1">{subtitle}</p>
      )}
    </motion.button>
  );
}

export default function MainMenuScreen() {
  const navigate = useNavigate();
  const userName = storage.getUserName();

  const menuItems = [
    {
      icon: <Zap />,
      title: 'QUICK',
      subtitle: 'SESSION',
      onClick: () => navigate('/translate?mode=quick'),
    },
    {
      icon: <Plus />,
      title: 'NEW',
      subtitle: 'SESSION',
      onClick: () => navigate('/translate?mode=new'),
    },
    {
      icon: <ScrollText />,
      title: 'MY',
      subtitle: 'SESSIONS',
      onClick: () => navigate('/sessions'),
    },
    {
      icon: <Settings />,
      title: 'SETTINGS',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center px-4 py-8">
          {/* Welcome message */}
          {userName && (
            <motion.p
              className="font-crimson text-stone-600 text-lg mb-8 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome, {userName}
            </motion.p>
          )}

          {/* Menu Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md w-full mb-8">
            {menuItems.map((item, index) => (
              <MenuTablet
                key={item.title}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onClick={item.onClick}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>

          {/* Audio Player Section */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              className="menu-tablet w-full flex items-center justify-center gap-3 py-4"
              onClick={() => navigate('/audio')}
            >
              <Volume2 className="text-stone-600" size={24} />
              <span className="font-cinzel text-lg etched-text">Audio Player</span>
            </button>
          </motion.div>
        </main>

        <Footer />
      </div>
    </StoneBackground>
  );
}
