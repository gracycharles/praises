import React from 'react';
import { Volume2, BookOpen, Type, Bookmark, Settings } from 'lucide-react';

export type TabType = 'audiobook' | 'reader' | 'index' | 'playlists' | 'settings';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalPraises: number;
  currentPraiseId?: number | null;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  totalPraises,
  isPlaying 
}) => {
  return (
    <header className="bg-[#181310]/95 backdrop-blur-md border-b border-amber-900/40 text-amber-100 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-md shadow-amber-950/50">
            <div className="w-full h-full bg-[#1c1714] rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-amber-100 font-serif tracking-tight truncate max-w-[200px] sm:max-w-none">
              அகர வரிசையில் நன்றி பலிகள்
            </h1>
            <span className="hidden sm:inline-block bg-amber-500/10 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono">
              {totalPraises}
            </span>
          </div>
        </div>

        {/* Compact Icon-Based Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => setActiveTab('audiobook')}
            title="ஒலிப்புத்தகம் (Audio Player)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-medium transition-all ${
              activeTab === 'audiobook'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/30'
                : 'text-stone-300 hover:text-amber-200 hover:bg-[#1c120c]/60'
            }`}
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">ஒலிப்புத்தகம்</span>
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            title="வாசிக்கும் வடிவம் (Immersive Reader)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-medium transition-all ${
              activeTab === 'reader'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/30'
                : 'text-stone-300 hover:text-amber-200 hover:bg-[#1c120c]/60'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">வாசிப்பு</span>
          </button>

          <button
            onClick={() => setActiveTab('index')}
            title="அகர வரிசை அட்டவணை (Alphabetical Index)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-medium transition-all ${
              activeTab === 'index'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/30'
                : 'text-stone-300 hover:text-amber-200 hover:bg-[#1c120c]/60'
            }`}
          >
            <Type className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">அகராதி</span>
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            title="சேமித்த விருப்பத் துதிகள் (Saved Praises)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-medium transition-all ${
              activeTab === 'playlists'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/30'
                : 'text-stone-300 hover:text-amber-200 hover:bg-[#1c120c]/60'
            }`}
          >
            <Bookmark className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">பிடித்தவை</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            title="அமைப்புகள் (Settings)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/30'
                : 'text-stone-300 hover:text-amber-200 hover:bg-[#1c120c]/60'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">அமைப்புகள்</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
