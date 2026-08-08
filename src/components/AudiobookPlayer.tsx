import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PraiseItem, PlayerSettings } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { BOOK_METADATA } from '../data/tamildata';
import { 
  Play, Pause, Square, SkipForward, SkipBack, Volume2, 
  Settings, Bookmark, BookmarkCheck, 
  Sparkles, BookOpen, Zap
} from 'lucide-react';

interface AudiobookPlayerProps {
  praises: PraiseItem[];
}

export const AudiobookPlayer: React.FC<AudiobookPlayerProps> = ({ praises }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPage, setSelectedPage] = useState<number | 'ALL'>('ALL');
  const [activeItem, setActiveItem] = useState<PraiseItem | null>(praises[0] || null);
  const [activeItemId, setActiveItemId] = useState<number | null>(1);
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tamil_audiobook_bookmarks') || '[]');
    } catch {
      return [1, 2, 8, 308, 716, 930, 1000];
    }
  });

  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'playing' | 'paused' | 'error'; message: string }>({
    type: 'idle',
    message: 'வாசிக்கத் தயாராக உள்ளது'
  });

  const [settings, setSettings] = useState<PlayerSettings>({
    voice: 'ta-IN-Wavenet-A',
    speed: 1.0,
    pitch: 1.0,
    autoScroll: true,
    continuousPlay: true,
    gaplessMode: true,
    volume: 1.0,
    useBrowserFallback: false,
  });

  const activeCardRef = useRef<HTMLDivElement>(null);

  // Filter Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    praises.forEach(p => p.category && cats.add(p.category));
    return ['ALL', ...Array.from(cats).sort()];
  }, [praises]);

  // Filter Pages
  const pageNumbers = useMemo(() => {
    const pages = new Set<number>();
    praises.forEach(p => pages.add(p.page));
    return ['ALL', ...Array.from(pages).sort((a, b) => a - b)];
  }, [praises]);

  // Filtered List without Search
  const filteredPraises = useMemo(() => {
    return praises.filter(p => {
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchPage = selectedPage === 'ALL' || p.page === selectedPage;
      return matchCategory && matchPage;
    });
  }, [praises, selectedCategory, selectedPage]);

  // Sync callbacks with Audio Engine
  useEffect(() => {
    globalAudioEngine.setCallbacks({
      onStatusChange: (newStatus, msg) => {
        setStatus({ type: newStatus, message: msg || '' });
      },
      onItemStart: (itemId) => {
        setActiveItemId(itemId);
        const found = praises.find(p => p.id === itemId);
        if (found) setActiveItem(found);

        if (settings.autoScroll && activeCardRef.current) {
          activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      onItemEnd: () => {
        // Handled internally by queue processor
      }
    });
  }, [praises, settings.autoScroll]);

  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('tamil_audiobook_bookmarks', JSON.stringify(next));
  };

  const handlePlaySingle = (item: PraiseItem) => {
    setActiveItem(item);
    setActiveItemId(item.id);
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  const handlePlayFilteredList = () => {
    if (filteredPraises.length === 0) return;
    const items = filteredPraises.map(p => ({
      id: p.id,
      text: p.text,
      reference: p.reference
    }));
    globalAudioEngine.playQueue(items, 0);
  };

  const handlePauseResume = () => {
    const { isPlaying, isPaused } = globalAudioEngine.getStatus();
    if (isPaused) {
      globalAudioEngine.resume();
    } else if (isPlaying) {
      globalAudioEngine.pause();
    } else if (activeItem) {
      handlePlaySingle(activeItem);
    }
  };

  const handleStop = () => {
    globalAudioEngine.stop();
  };

  const handleNext = () => {
    if (!activeItemId) return;
    const idx = filteredPraises.findIndex(p => p.id === activeItemId);
    if (idx >= 0 && idx < filteredPraises.length - 1) {
      const nextItem = filteredPraises[idx + 1];
      handlePlaySingle(nextItem);
    }
  };

  const handlePrev = () => {
    if (!activeItemId) return;
    const idx = filteredPraises.findIndex(p => p.id === activeItemId);
    if (idx > 0) {
      const prevItem = filteredPraises[idx - 1];
      handlePlaySingle(prevItem);
    }
  };

  const updateSettingField = <K extends keyof PlayerSettings>(field: K, val: PlayerSettings[K]) => {
    const next = { ...settings, [field]: val };
    setSettings(next);
    globalAudioEngine.updateSettings(next);
  };

  return (
    <div className="space-y-6">
      
      {/* Audiobook Master Header Banner in Premium Dark Amber Theme */}
      <div className="bg-gradient-to-br from-amber-950 via-[#1c120c] to-amber-900 border border-amber-900 rounded-3xl p-5 md:p-8 shadow-md relative overflow-hidden text-amber-50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-900/80 text-amber-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-800 font-serif">
                {BOOK_METADATA.organization}
              </span>
              <span className="text-amber-200/80 text-[11px] font-semibold font-serif">ஆசிரியர்: {BOOK_METADATA.author}</span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-white font-serif tracking-wide leading-tight">
              {BOOK_METADATA.title}
            </h2>
            <p className="text-amber-200/60 text-xs font-serif italic">
              தூயத் தமிழில் அகர வரிசையில் அமைக்கப்பட்ட 1000 நன்றி பலிகள்
            </p>
          </div>

          {/* Master Audio Deck with High Contrast Dark Amber accents */}
          <div className="bg-amber-950/40 border border-amber-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-sm w-full lg:w-auto">
            <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                title="முந்தைய ஸ்தோத்திரம்"
                className="w-10 h-10 rounded-xl bg-[#1c120c]/80 hover:bg-amber-900 text-amber-100 flex items-center justify-center transition-all border border-amber-800/60"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePauseResume}
                className="w-12 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 flex items-center justify-center transition-all border border-amber-300 shadow-md"
              >
                {status.type === 'playing' ? <Pause className="w-5 h-5 fill-amber-950 text-amber-950" /> : <Play className="w-5 h-5 fill-amber-950 text-amber-950 ml-0.5" />}
              </button>

              <button
                onClick={handleStop}
                title="நிறுத்து"
                className="w-10 h-10 rounded-xl bg-[#1c120c]/80 hover:bg-amber-900 text-amber-100 flex items-center justify-center transition-all border border-amber-800/60"
              >
                <Square className="w-3.5 h-3.5 fill-current text-amber-100" />
              </button>

              <button
                onClick={handleNext}
                title="அடுத்த ஸ்தோத்திரம்"
                className="w-10 h-10 rounded-xl bg-[#1c120c]/80 hover:bg-amber-900 text-amber-100 flex items-center justify-center transition-all border border-amber-800/60"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full sm:w-auto shrink-0">
              <button
                onClick={handlePlayFilteredList}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-serif font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-700 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>தொடர் வாசிப்பு ({filteredPraises.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audio Status Line */}
        <div className="mt-4 pt-3 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200/95">
            <span className={`w-2 h-2 rounded-full ${
              status.type === 'playing' ? 'bg-amber-400 animate-pulse' :
              status.type === 'loading' ? 'bg-amber-500 animate-spin' :
              status.type === 'paused' ? 'bg-amber-400' : 'bg-[#5c4a40]'
            }`}></span>
            <span className="font-serif text-amber-100 font-semibold">{status.message}</span>
          </div>
        </div>
      </div>

      {/* Audio Voice & Filter Settings in Soft Pastel Theme */}
      <div className="bg-white border border-amber-100 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Voice Picker */}
          <div className="md:col-span-7 flex items-center gap-2 bg-[#faf8f5] p-2 rounded-xl border border-amber-200/30">
            <Settings className="w-3.5 h-3.5 text-amber-700 shrink-0 ml-1" />
            <span className="text-xs text-[#6e5d53] font-serif shrink-0">குரல்:</span>
            <select
              value={settings.voice}
              onChange={(e) => updateSettingField('voice', e.target.value)}
              className="w-full bg-transparent text-xs text-stone-900 font-serif font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ta-IN-Wavenet-A">தமிழ் பெண் குரல் 1</option>
              <option value="ta-IN-Wavenet-B">தமிழ் ஆண் குரல் 1</option>
              <option value="ta-IN-Neural2-A">இனிய தமிழ் நியூரல் குரல்</option>
              <option value="ta-IN-Standard-A">இயல்பு நிலை தமிழ் குரல்</option>
            </select>
          </div>

          {/* Speed Control */}
          <div className="md:col-span-5 flex items-center gap-3 bg-[#faf8f5] px-3 py-2 rounded-xl border border-amber-200/30">
            <span className="text-xs text-amber-950 font-serif font-bold shrink-0">வேகம்: {settings.speed}x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => updateSettingField('speed', parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-amber-200 h-1 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Category & Page Filter Chips using Beautiful Soft Pastels */}
        <div className="flex flex-col space-y-2 pt-3 border-t border-amber-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-amber-950 font-serif font-bold shrink-0">அகர வரிசை:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-serif text-[11px] font-bold transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-[#faf8f5] text-[#614e43] border-amber-200/30 hover:bg-amber-50'
                }`}
              >
                {cat === 'ALL' ? 'அனைத்தும்' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-amber-950 font-serif font-bold shrink-0">புத்தக பக்கம்:</span>
            {pageNumbers.map((p) => (
              <button
                key={p.toString()}
                onClick={() => setSelectedPage(p as number | 'ALL')}
                className={`px-3 py-1 rounded-lg text-[10px] font-serif font-bold transition-all shrink-0 border ${
                  selectedPage === p
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-[#faf8f5] text-[#614e43] border-amber-200/30 hover:bg-amber-50'
                }`}
              >
                {p === 'ALL' ? 'அனைத்து பக்கங்களும்' : `பக்கம் ${p}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Praise List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-[11px] font-serif text-[#6e5d53] font-semibold">
          <span>ஸ்தோத்திரங்கள்: <strong className="text-amber-950 font-bold">{filteredPraises.length}</strong> / {praises.length}</span>
          <span>அகர வரிசையில் நன்றி பலிகள்</span>
        </div>

        <div className="space-y-3">
          {filteredPraises.length === 0 ? (
            <div className="bg-white border border-amber-100 rounded-2xl p-10 text-center text-[#6e5d53] space-y-2 font-serif">
              <BookOpen className="w-8 h-8 text-amber-500/30 mx-auto" />
              <p>தேர்ந்தெடுக்கப்பட்ட பிரிவில் ஸ்தோத்திரங்கள் காணப்படவில்லை.</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSelectedPage('ALL'); }}
                className="text-xs text-amber-700 hover:underline font-bold"
              >
                வடிகட்டுதலை மீட்டமைக்க
              </button>
            </div>
          ) : (
            filteredPraises.map((item) => {
              const isActive = activeItemId === item.id;
              const isBookmarked = bookmarks.includes(item.id);

              return (
                <div
                  key={item.id}
                  ref={isActive ? activeCardRef : null}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1c120c] text-white border-amber-600 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-white text-[#261e19] border-amber-100 hover:border-amber-200 hover:bg-amber-50/10'
                  }`}
                >
                  {/* Vertical stack on mobile, horizontal row on desktop. Never squeezes Tamil text! */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Modern, compact ID Tag */}
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 mt-1 border ${
                        isActive 
                          ? 'bg-amber-900 text-amber-200 border-amber-700' 
                          : 'bg-[#faf8f5] text-amber-950 border-amber-200/50'
                      }`}>
                        #{item.id}
                      </span>

                      {/* Praise Tamil Text takes full horizontal space */}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <p className={`text-base leading-relaxed font-serif ${
                          isActive ? 'text-white font-bold' : 'text-[#261e19]'
                        }`}>
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & compact control buttons (stacked on bottom for mobile, aligned on right for desktop) */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-dashed border-amber-200/30 sm:border-0 shrink-0">
                      
                      {/* Scripture Reference (with page removed) */}
                      <div className="flex items-center">
                        {item.reference ? (
                          <span className={`${
                            isActive ? 'text-amber-300' : 'text-amber-800'
                          } uppercase tracking-widest font-mono font-bold text-[10px] sm:text-xs`}>
                            📖 {item.reference}
                          </span>
                        ) : (
                          <div />
                        )}
                      </div>

                      {/* Action buttons with soft, friendly pastel-style coloring */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleBookmark(item.id)}
                          title={isBookmarked ? "குறிப்பிலிருந்து நீக்குக" : "குறிப்பில் சேர்க்கவும்"}
                          className={`p-2 rounded-xl transition-all border ${
                            isBookmarked
                              ? isActive
                                ? 'text-amber-300 bg-amber-900/60 border-amber-700 shadow-sm'
                                : 'text-amber-950 bg-amber-100/70 border-amber-200 shadow-sm'
                              : isActive
                                ? 'text-stone-300 hover:text-white hover:bg-amber-900/40 border-transparent'
                                : 'text-stone-400 hover:text-amber-800 hover:bg-amber-50/40 border-transparent'
                          }`}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                        </button>

                        <button
                          onClick={() => handlePlaySingle(item)}
                          title="கேட்க"
                          className={`p-2 rounded-xl transition-all border ${
                            isActive && status.type === 'playing'
                              ? 'bg-amber-400 text-amber-950 font-bold border-amber-300'
                              : isActive
                                ? 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border-amber-700'
                                : 'bg-[#faf8f5] hover:bg-amber-50 text-amber-700 border-amber-200/60'
                          }`}
                        >
                          <Play className="w-4.5 h-4.5 fill-current" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
