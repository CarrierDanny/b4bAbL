import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, ArrowLeft, RefreshCw } from 'lucide-react';
import { StoneBackground, Header, Footer } from '../layout';
import { StoneTablet, StoneButton } from '../ui';
import { AudioQueueItem } from '../../types';
import { storage } from '../../services/storage';
import { useAudioQueue } from '../../hooks/useAudioQueue';

export default function AudioPlayer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const userName = storage.getUserName() || 'Guest';

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<AudioQueueItem | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const { queue, isLoading, refresh } = useAudioQueue(sessionId || '', userName);

  // Play next item in queue
  const playNext = () => {
    const nextItem = queue.find((item) => !item.played);
    if (nextItem) {
      setCurrentItem(nextItem);
      if (audioRef.current) {
        audioRef.current.src = nextItem.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentItem(null);
      setIsPlaying(false);
    }
  };

  // Handle audio end
  const handleAudioEnd = () => {
    if (currentItem) {
      currentItem.played = true;
    }
    playNext();
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Skip current
  const skipCurrent = () => {
    if (currentItem) {
      currentItem.played = true;
    }
    playNext();
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Auto-play first item on queue load
  useEffect(() => {
    if (queue.length > 0 && !currentItem) {
      playNext();
    }
  }, [queue]);

  const pendingCount = queue.filter((item) => !item.played).length;

  return (
    <StoneBackground>
      <div className="min-h-screen flex flex-col">
        <Header compact />

        <main className="flex-1 flex flex-col items-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Back button */}
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-cinzel">Back to Menu</span>
            </button>

            <StoneTablet>
              <h2 className="font-cinzel text-2xl text-center etched-text mb-6">
                Audio Player
              </h2>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                onError={() => skipCurrent()}
              />

              {/* Now Playing */}
              <div className="bg-stone-300/50 rounded-lg p-4 mb-6">
                {currentItem ? (
                  <div>
                    <p className="font-cinzel text-sm text-stone-500 mb-1">Now Playing</p>
                    <p className="font-crimson text-stone-800">{currentItem.message}</p>
                    <p className="font-crimson text-sm text-stone-600 mt-1">
                      From: {currentItem.from}
                    </p>
                  </div>
                ) : (
                  <p className="font-crimson text-stone-500 italic text-center">
                    {isLoading ? 'Loading...' : 'No audio in queue'}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={toggleMute}
                  className="p-3 rounded-full bg-stone-300/50 hover:bg-stone-300 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="text-stone-600" size={20} />
                  ) : (
                    <Volume2 className="text-stone-600" size={20} />
                  )}
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 rounded-full bg-gold-accent hover:bg-gold-bright transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  disabled={!currentItem}
                >
                  {isPlaying ? (
                    <Pause className="text-stone-800" size={24} />
                  ) : (
                    <Play className="text-stone-800" size={24} />
                  )}
                </button>

                <button
                  onClick={skipCurrent}
                  className="p-3 rounded-full bg-stone-300/50 hover:bg-stone-300 transition-colors"
                  aria-label="Skip"
                  disabled={!currentItem}
                >
                  <SkipForward className="text-stone-600" size={20} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 mb-6">
                <Volume2 size={16} className="text-stone-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              {/* Queue Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-crimson text-stone-600">
                  {pendingCount} items in queue
                </span>
                <button
                  onClick={refresh}
                  className="flex items-center gap-1 text-stone-600 hover:text-stone-800 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  <span className="font-crimson">Refresh</span>
                </button>
              </div>

              {/* Session Info */}
              {sessionId && (
                <div className="mt-4 pt-4 border-t border-stone-400/30">
                  <p className="font-crimson text-xs text-stone-500 text-center">
                    Session: {sessionId}
                  </p>
                </div>
              )}
            </StoneTablet>
          </motion.div>
        </main>

        <Footer compact />
      </div>
    </StoneBackground>
  );
}
