import React, { useState } from 'react';
import { PraiseItem } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { Play, Bookmark, BookmarkCheck, Heart, Sun, Moon, Flame, Sparkles, Trash2, Zap } from 'lucide-react';

interface PlaylistsViewProps {
  praises: PraiseItem[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
  onClearBookmarks: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  praises,
  bookmarks,
  onToggleBookmark,
  onClearBookmarks,
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<'bookmarks' | 'morning' | 'evening' | 'top100'>('bookmarks');

  // Curated Preset Playlists
  const morningPraises = praises.slice(0, 50); // First 50 items (அ - ஆ)
  const eveningPraises = praises.slice(50, 100); 
  const top100Praises = praises.filter(p => [1, 2, 8, 11, 21, 31, 50, 71, 91, 100, 150, 200, 250, 308, 400, 500, 600, 716, 800, 930, 1000].includes(p.id) || p.id % 10 === 0);

  const bookmarkedPraises = praises.filter(p => bookmarks.includes(p.id));

  const currentList = 
    selectedPlaylist === 'bookmarks' ? bookmarkedPraises :
    selectedPlaylist === 'morning' ? morningPraises :
    selectedPlaylist === 'evening' ? eveningPraises : top100Praises;

  const handlePlayQueue = () => {
    if (!currentList.length) return;
    const queue = currentList.map(p => ({
      id: p.id,
      text: p.text,
      reference: p.reference
    }));
    globalAudioEngine.playQueue(queue, 0);
  };

  const handlePlaySingle = (item: PraiseItem) => {
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  return (
    <div className="space-y-6">
      
      {/* Playlist Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Bookmarks */}
        <button
          onClick={() => setSelectedPlaylist('bookmarks')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
            selectedPlaylist === 'bookmarks'
              ? 'bg-gradient-to-br from-amber-600/30 via-[#1e1713] to-[#120e0c] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
              : 'bg-[#1a1411]/60 border-amber-900/30 hover:border-amber-900/60 hover:bg-[#201814]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Heart className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-100 font-serif">விருப்பமானவை</h3>
            <p className="text-[11px] text-amber-200/60 font-serif">{bookmarks.length} ஸ்தோத்திரங்கள்</p>
          </div>
        </button>

        {/* Morning Praises */}
        <button
          onClick={() => setSelectedPlaylist('morning')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
            selectedPlaylist === 'morning'
              ? 'bg-gradient-to-br from-amber-600/30 via-[#1e1713] to-[#120e0c] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
              : 'bg-[#1a1411]/60 border-amber-900/30 hover:border-amber-900/60 hover:bg-[#201814]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-100 font-serif">காலை ஜெப ஸ்தோத்திரம்</h3>
            <p className="text-[11px] text-amber-200/60 font-serif">50 துவக்க துதிகள்</p>
          </div>
        </button>

        {/* Evening Praises */}
        <button
          onClick={() => setSelectedPlaylist('evening')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
            selectedPlaylist === 'evening'
              ? 'bg-gradient-to-br from-amber-600/30 via-[#1e1713] to-[#120e0c] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
              : 'bg-[#1a1411]/60 border-amber-900/30 hover:border-amber-900/60 hover:bg-[#201814]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-100 font-serif">இரவு அமைதித் துதிகள்</h3>
            <p className="text-[11px] text-amber-200/60 font-serif">50 அமைதித் துதிகள்</p>
          </div>
        </button>

        {/* Key Highlights */}
        <button
          onClick={() => setSelectedPlaylist('top100')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden ${
            selectedPlaylist === 'top100'
              ? 'bg-gradient-to-br from-amber-600/30 via-[#1e1713] to-[#120e0c] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
              : 'bg-[#1a1411]/60 border-amber-900/30 hover:border-amber-900/60 hover:bg-[#201814]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-100 font-serif">முக்கிய 100 துதிகள்</h3>
            <p className="text-[11px] text-amber-200/60 font-serif">100 சிறப்பு ஸ்தோத்திரங்கள்</p>
          </div>
        </button>

      </div>

      {/* Playlist Details Banner */}
      <div className="bg-[#1a1411]/80 border border-amber-900/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-serif">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>தேர்ந்தெடுக்கப்பட்ட ஸ்தோத்திரத் தொகுப்பு</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-amber-100">
            {selectedPlaylist === 'bookmarks' ? 'சேமிக்கப்பட்ட விருப்பத் துதிகள்' :
             selectedPlaylist === 'morning' ? 'காலை வேளை 50 ஸ்தோத்திரங்கள்' :
             selectedPlaylist === 'evening' ? 'இரவு வேளை அமைதித் துதிகள்' : 'முக்கிய 100 ஸ்தோத்திரத் மாலை'}
          </h2>
          <p className="text-xs text-amber-200/60 font-serif mt-1">
            மொத்தம் {currentList.length} ஸ்தோத்திரங்கள் வாசிக்கத் தயாராக உள்ளன
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedPlaylist === 'bookmarks' && bookmarks.length > 0 && (
            <button
              onClick={onClearBookmarks}
              className="px-3.5 py-2 bg-[#28201a] hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 border border-amber-900/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>அழி</span>
            </button>
          )}

          {currentList.length > 0 && (
            <button
              onClick={handlePlayQueue}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-all border border-amber-400/30"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>இப்பட்டியலைத் தொடர்ச்சியாகக் கேட்க</span>
            </button>
          )}
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-[#1a1411]/40 border border-amber-900/20 rounded-2xl p-12 text-center text-stone-400 space-y-2 font-serif">
            <Heart className="w-8 h-8 text-amber-500/30 mx-auto" />
            <p>இப்பட்டியலில் ஸ்தோத்திரங்கள் எதுவும் இல்லை.</p>
            <p className="text-xs text-amber-200/50">
              ஒலிப்புத்தகப் பகுதியில் உள்ள சேமிப்பு சின்னத்தைக் கிளிக் செய்து ஸ்தோத்திரங்களை இங்கு சேமிக்கலாம்.
            </p>
          </div>
        ) : (
          currentList.map(item => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-[#1a1411]/80 border border-amber-900/30 hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-200 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0 mt-0.5">
                    #{item.id}
                  </span>
                  <div className="space-y-1 min-w-0 flex-1 font-serif">
                    <p className="text-base font-medium text-amber-50 group-hover:text-amber-200 transition-colors leading-relaxed">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-amber-200/60">
                      <span>பக்கம் {item.page}</span>
                      {item.reference && (
                        <>
                          <span className="text-amber-900/50">•</span>
                          <span className="text-amber-200/80 font-mono tracking-widest uppercase text-[10px]">📖 {item.reference}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30' : 'text-stone-400 hover:text-amber-300'}`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handlePlaySingle(item)}
                    className="p-2.5 bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 rounded-xl transition-all border border-amber-500/20"
                  >
                    <Play className="w-5 h-5 fill-amber-300" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
