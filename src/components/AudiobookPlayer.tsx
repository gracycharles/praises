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
      
      {/* Audiobook Master Header Banner */}
      <div className="bg-gradient-to-br from-[#241c18] via-[#1a1411] to-[#120e0c] border border-amber-900/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/20 font-serif">
                {BOOK_METADATA.organization}
              </span>
              <span className="text-stone-400 text-xs font-serif">ஆசிரியர்: {BOOK_METADATA.author}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-amber-100 font-serif tracking-wide leading-tight">
              {BOOK_METADATA.title}
            </h2>
            <p className="text-amber-200/70 text-xs md:text-sm font-serif italic">
              தூயத் தமிழில் அகர வரிசையில் அமைக்கப்பட்ட 1000 நன்றி பலிகள்
            </p>
          </div>

          {/* Master Audio Deck */}
          <div className="bg-[#120e0c]/90 border border-amber-900/50 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-2xl ring-1 ring-amber-500/10">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                title="முந்தைய ஸ்தோத்திரம்"
                className="w-11 h-11 rounded-xl bg-[#28201a] hover:bg-[#342a22] text-amber-200 flex items-center justify-center transition-all border border-amber-900/30"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePauseResume}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-950/80 transition-all transform active:scale-95 border border-amber-400/40"
              >
                {status.type === 'playing' ? <Pause className="w-7 h-7 fill-stone-950" /> : <Play className="w-7 h-7 fill-stone-950 ml-0.5" />}
              </button>

              <button
                onClick={handleStop}
                title="நிறுத்து"
                className="w-11 h-11 rounded-xl bg-[#28201a] hover:bg-[#342a22] text-amber-200 flex items-center justify-center transition-all border border-amber-900/30"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleNext}
                title="அடுத்த ஸ்தோத்திரம்"
                className="w-11 h-11 rounded-xl bg-[#28201a] hover:bg-[#342a22] text-amber-200 flex items-center justify-center transition-all border border-amber-900/30"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={handlePlayFilteredList}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40 transition-all border border-amber-400/30"
              >
                <Zap className="w-4 h-4" />
                <span>தொடர் வாசிப்பு ({filteredPraises.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audio Status Line */}
        <div className="mt-6 pt-4 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-amber-200/80">
            <span className={`w-2.5 h-2.5 rounded-full ${
              status.type === 'playing' ? 'bg-amber-400 animate-pulse shadow-md shadow-amber-400' :
              status.type === 'loading' ? 'bg-amber-500 animate-spin' :
              status.type === 'paused' ? 'bg-amber-600' : 'bg-[#3b2417]'
            }`}></span>
            <span className="font-serif text-amber-100 font-medium">{status.message}</span>
          </div>
        </div>
      </div>

      {/* Audio Voice & Filter Settings */}
      <div className="bg-[#1a1411]/90 border border-amber-900/30 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Voice Picker */}
          <div className="md:col-span-7 flex items-center gap-2.5 bg-[#120e0c] p-2 rounded-xl border border-amber-900/30">
            <Settings className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
            <span className="text-xs text-amber-200/80 font-serif shrink-0">குரல்:</span>
            <select
              value={settings.voice}
              onChange={(e) => updateSettingField('voice', e.target.value)}
              className="w-full bg-transparent text-xs text-amber-100 font-serif focus:outline-none cursor-pointer"
            >
              <option value="ta-IN-Wavenet-A" className="bg-[#120e0c] text-amber-100">தமிழ் பெண் குரல் 1</option>
              <option value="ta-IN-Wavenet-B" className="bg-[#120e0c] text-amber-100">தமிழ் ஆண் குரல் 1</option>
              <option value="ta-IN-Neural2-A" className="bg-[#120e0c] text-amber-100">இனிய தமிழ் நியூரல் குரல்</option>
              <option value="ta-IN-Standard-A" className="bg-[#120e0c] text-amber-100">இயல்பு நிலை தமிழ் குரல்</option>
            </select>
          </div>

          {/* Speed Control */}
          <div className="md:col-span-5 flex items-center gap-3 bg-[#120e0c] px-3.5 py-2.5 rounded-xl border border-amber-900/30">
            <span className="text-xs text-amber-300 font-serif shrink-0">வேகம்: {settings.speed}x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => updateSettingField('speed', parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-[#3b2417] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Category & Page Filter Chips */}
        <div className="flex flex-col space-y-2.5 pt-3 border-t border-amber-900/20">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-amber-400/80 font-serif font-medium shrink-0">அகர வரிசை:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-serif transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-900/40'
                    : 'bg-[#120e0c] text-stone-300 hover:bg-[#28201a] hover:text-amber-200 border border-amber-900/20'
                }`}
              >
                {cat === 'ALL' ? 'அனைத்தும்' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-amber-400/80 font-serif font-medium shrink-0">புத்தக பக்கம்:</span>
            {pageNumbers.map((p) => (
              <button
                key={p.toString()}
                onClick={() => setSelectedPage(p as number | 'ALL')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-serif transition-all shrink-0 ${
                  selectedPage === p
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'bg-[#120e0c] text-stone-400 hover:bg-[#28201a] border border-amber-900/20'
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
        <div className="flex items-center justify-between px-2 text-xs font-serif text-amber-300/80">
          <span>ஸ்தோத்திரங்கள்: <strong className="text-amber-200">{filteredPraises.length}</strong> / {praises.length}</span>
          <span>அகர வரிசையில் நன்றி பலிகள்</span>
        </div>

        <div className="space-y-3">
          {filteredPraises.length === 0 ? (
            <div className="bg-[#1a1411]/50 border border-amber-900/30 rounded-2xl p-10 text-center text-stone-400 space-y-2 font-serif">
              <BookOpen className="w-8 h-8 text-amber-500/40 mx-auto" />
              <p>தேர்ந்தெடுக்கப்பட்ட பிரிவில் ஸ்தோத்திரங்கள் காணப்படவில்லை.</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSelectedPage('ALL'); }}
                className="text-xs text-amber-400 hover:underline"
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
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-[#241c18] border-amber-500/80 shadow-xl shadow-amber-950/60 ring-1 ring-amber-500/40'
                      : 'bg-[#1a1411]/70 border-amber-900/20 hover:border-amber-900/50 hover:bg-[#201814]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold shrink-0 mt-0.5 border ${
                        isActive 
                          ? 'bg-amber-500 text-stone-950 border-amber-400' 
                          : 'bg-[#120e0c] text-amber-300/90 border-amber-900/30'
                      }`}>
                        #{item.id}
                      </span>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <p className={`text-base sm:text-lg leading-relaxed font-serif ${
                          isActive ? 'text-amber-100 font-bold' : 'text-stone-100'
                        }`}>
                          {item.text}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-400 font-serif">
                          <span>பக்கம் {item.page}</span>
                          {item.reference && (
                            <>
                              <span className="text-amber-900/50">•</span>
                              <span className="text-amber-200/80 uppercase tracking-widest font-mono font-medium">📖 {item.reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        title={isBookmarked ? "குறிப்பிலிருந்து நீக்குக" : "குறிப்பில் சேர்க்கவும்"}
                        className={`p-2.5 rounded-xl transition-all ${
                          isBookmarked
                            ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                            : 'text-stone-400 hover:text-amber-300 hover:bg-[#28201a]'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => handlePlaySingle(item)}
                        title="வாசிக்க"
                        className={`p-2.5 rounded-xl transition-all ${
                          isActive && status.type === 'playing'
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-900/50'
                            : 'bg-[#28201a] hover:bg-[#342a22] text-amber-300 border border-amber-900/30'
                        }`}
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </button>
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
