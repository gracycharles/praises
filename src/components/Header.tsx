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
    <header className="bg-amber-950 border-b border-amber-900 text-amber-100/90 sticky top-0 z-50 shadow-md w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & Title */}
        <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-900/60 border border-amber-800 p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight leading-tight">
                அகர வரிசையில் நன்றி பலிகள்
              </h1>
              <span className="text-[10px] text-amber-300/80 font-medium font-serif leading-none mt-0.5">
                1000 தமிழ் ஸ்தோத்திரங்கள்
              </span>
            </div>
          </div>

          <span className="md:hidden bg-amber-900 text-amber-100 text-[10px] px-2 py-0.5 rounded-full border border-amber-800 font-mono font-bold shrink-0">
            {totalPraises}
          </span>
        </div>

        {/* Compact, Scrollable Tab Navigation on Mobile (no overflow) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 py-1 shrink-0">
          
          {/* Audiobook Button */}
          <button
            onClick={() => setActiveTab('audiobook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition-all shrink-0 ${
              activeTab === 'audiobook'
                ? 'bg-amber-800 text-white border border-amber-600 shadow-inner'
                : 'bg-amber-950/40 text-amber-200/70 border border-transparent hover:text-white hover:bg-amber-900/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>ஒலிப்புத்தகம்</span>
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-450 animate-pulse shrink-0" />
            )}
          </button>

          {/* Reader Button */}
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition-all shrink-0 ${
              activeTab === 'reader'
                ? 'bg-amber-800 text-white border border-amber-600 shadow-inner'
                : 'bg-amber-950/40 text-amber-200/70 border border-transparent hover:text-white hover:bg-amber-900/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>வாசிப்பு</span>
          </button>

          {/* Index Button */}
          <button
            onClick={() => setActiveTab('index')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition-all shrink-0 ${
              activeTab === 'index'
                ? 'bg-amber-800 text-white border border-amber-600 shadow-inner'
                : 'bg-amber-950/40 text-amber-200/70 border border-transparent hover:text-white hover:bg-amber-900/40'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>அகராதி</span>
          </button>

          {/* Playlists/Bookmarks Button */}
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition-all shrink-0 ${
              activeTab === 'playlists'
                ? 'bg-amber-800 text-white border border-amber-600 shadow-inner'
                : 'bg-amber-950/40 text-amber-200/70 border border-transparent hover:text-white hover:bg-amber-900/40'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>பிடித்தவை</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-amber-800 text-white border border-amber-600 shadow-inner'
                : 'bg-amber-950/40 text-amber-200/70 border border-transparent hover:text-white hover:bg-amber-900/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>அமைப்புகள்</span>
          </button>

        </nav>

      </div>
    </header>
  );
};
