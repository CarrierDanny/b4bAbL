import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  SplashScreen,
  SignInScreen,
  BabelQuestionScreen,
  StoryScreen,
  MainMenuScreen,
  SessionSetupScreen,
  TranslationScreen,
  SettingsScreen,
} from './components/screens';
import { AudioPlayer } from './components/audio';
import { storage } from './services/storage';

function App() {
  // Check if user has seen the story to determine initial route
  const hasSeenStory = storage.hasSeenStory();
  const hasUserName = !!storage.getUserName();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Splash / Language Selection */}
        <Route path="/" element={<SplashScreen />} />

        {/* Sign In */}
        <Route path="/signin" element={<SignInScreen />} />

        {/* Babel Question */}
        <Route path="/babel" element={<BabelQuestionScreen />} />

        {/* Story */}
        <Route path="/story" element={<StoryScreen />} />

        {/* Main Menu */}
        <Route path="/menu" element={<MainMenuScreen />} />

        {/* Session Setup - Create or Join */}
        <Route path="/session" element={<SessionSetupScreen />} />

        {/* Translation Session */}
        <Route path="/translate" element={<TranslationScreen />} />

        {/* Sessions List (placeholder for future) */}
        <Route
          path="/sessions"
          element={
            <div className="min-h-screen flex items-center justify-center bg-stone-300">
              <p className="font-cinzel text-stone-700">Sessions - Coming Soon</p>
            </div>
          }
        />

        {/* Settings */}
        <Route path="/settings" element={<SettingsScreen />} />

        {/* Audio Player */}
        <Route path="/audio" element={<AudioPlayer />} />

        {/* Catch all - redirect to appropriate screen */}
        <Route
          path="*"
          element={
            <Navigate
              to={hasSeenStory && hasUserName ? '/menu' : '/'}
              replace
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
