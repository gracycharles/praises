import React, { useState, useEffect } from 'react';
import { PraiseItem } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, ArrowUp, X } from 'lucide-react';

interface AudioOverlayProps {
  currentPraise?: PraiseItem | null;
  praises: PraiseItem[];
}

export const AudioOverlay: React.FC<AudioOverlayProps> = ({ currentPraise, praises }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [activeItem, setActiveItem] = useState<{ id: number; text: string } | null>(null);
  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    globalAudioEngine.setCallbacks({
      onStatusChange: (s) => setStatus(s),
      onItemStart: (id, text) => setActiveItem({ id, text }),
      onItemEnd: () => {}
    });

    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlayPause = () => {
    if (status === 'playing') {
      globalAudioEngine.pause();
    } else if (status === 'paused') {
      globalAudioEngine.resume();
    } else {
      const startIndex = activeItem ? praises.findIndex(p => p.id === activeItem.id) : 0;
      globalAudioEngine.playQueue(praises, Math.max(0, startIndex));
    }
  };

  const handleStop = () => {
    globalAudioEngine.stop();
    setActiveItem(null);
  };

  const activePraiseFull = activeItem 
    ? praises.find(p => p.id === activeItem.id) || currentPraise 
    : currentPraise || praises[0];

  const isPlayingOrLoading = status === 'playing' || status === 'loading';
  const isActive = status !== 'idle';

  return (
    <>
      {/* Scroll To Top Floating Button */}
      {showGoTop && (
        <button
          onClick={scrollToTop}
          title="மேலே செல்ல (Go to Top)"
          className={`fixed right-4 z-40 p-3 rounded-full bg-[#2a1a11]/90 border border-amber-500/40 text-amber-300 shadow-2xl hover:bg-amber-500 hover:text-stone-950 transition-all backdrop-blur-md active:scale-95 ${isActive ? 'bottom-24' : 'bottom-20'}`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Audio Dock Overlay */}
      <div className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isActive 
          ? 'bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md w-auto rounded-2xl' 
          : 'bottom-4 right-4 w-14 h-14 rounded-full'
        } bg-[#1c120c]/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl ring-1 ring-amber-500/20`}
      >
        {isActive ? (
          <div className="flex items-center justify-between gap-3 p-3 animate-in fade-in duration-300">
            {/* Active Praise Info */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Volume2 className={`w-4 h-4 ${status === 'playing' ? 'animate-pulse text-amber-300' : ''}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                    #{activeItem?.id || activePraiseFull?.id || 1}
                  </span>
                  <span className="text-[11px] text-amber-200/80 font-mono truncate">
                    📖 {activePraiseFull?.reference || ''}
                  </span>
                </div>
                <p className="text-xs font-serif text-stone-100 truncate mt-0.5">
                  {activePraiseFull?.text || activeItem?.text || 'ஸ்தோத்திரம் வாசிக்கப்படுகிறது...'}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => globalAudioEngine.prev()}
                title="முந்தைய ஸ்தோத்திரம்"
                className="p-2 rounded-lg hover:bg-[#3b2417] text-stone-300 hover:text-amber-300 transition-all"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlayPause}
                title={status === 'playing' ? 'நிறுத்த (Pause)' : 'தொடர (Play)'}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 font-bold shadow-md hover:brightness-110 transition-all"
              >
                {status === 'playing' ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
              </button>

              <button
                onClick={() => globalAudioEngine.next()}
                title="அடுத்த ஸ்தோத்திரம்"
                className="p-2 rounded-lg hover:bg-[#3b2417] text-stone-300 hover:text-amber-300 transition-all"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleStop}
                title="நிறுத்து (Stop Audio)"
                className="p-2 rounded-lg hover:bg-rose-950/50 text-stone-400 hover:text-rose-400 transition-all ml-1"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleTogglePlayPause}
            className="w-full h-full flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors"
            title="தொடர (Play All)"
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        )}
      </div>
    </>
  );
};
