import React, { useState } from 'react';
import { PraiseItem } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { Play, Bookmark, BookmarkCheck, Heart, Sun, Moon, Sparkles, Trash2, Zap } from 'lucide-react';

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
      
      {/* Playlist Selector Cards in Premium Dark Contrast Theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Bookmarks */}
        <button
          onClick={() => setSelectedPlaylist('bookmarks')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 relative overflow-hidden ${
            selectedPlaylist === 'bookmarks'
              ? 'bg-amber-950 text-white border-amber-900 shadow-md font-bold'
              : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50 hover:border-amber-200'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            selectedPlaylist === 'bookmarks' ? 'bg-amber-900 text-amber-100 border border-amber-800' : 'bg-amber-50 text-amber-600 border border-amber-200/40'
          }`}>
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className={`text-xs font-bold font-serif ${selectedPlaylist === 'bookmarks' ? 'text-white' : 'text-amber-950'}`}>
              விருப்பமானவை
            </h3>
            <p className={`text-[11px] font-serif font-semibold ${selectedPlaylist === 'bookmarks' ? 'text-amber-200/70' : 'text-[#6e5d53]'}`}>
              {bookmarks.length} ஸ்தோத்திரங்கள்
            </p>
          </div>
        </button>

        {/* Morning Praises */}
        <button
          onClick={() => setSelectedPlaylist('morning')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 relative overflow-hidden ${
            selectedPlaylist === 'morning'
              ? 'bg-amber-950 text-white border-amber-900 shadow-md font-bold'
              : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50 hover:border-amber-200'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            selectedPlaylist === 'morning' ? 'bg-amber-900 text-amber-100 border border-amber-800' : 'bg-amber-50 text-amber-600 border border-amber-200/40'
          }`}>
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-xs font-bold font-serif ${selectedPlaylist === 'morning' ? 'text-white' : 'text-amber-950'}`}>
              காலை ஜெபம்
            </h3>
            <p className={`text-[11px] font-serif font-semibold ${selectedPlaylist === 'morning' ? 'text-amber-200/70' : 'text-[#6e5d53]'}`}>
              50 துவக்க துதிகள்
            </p>
          </div>
        </button>

        {/* Evening Praises */}
        <button
          onClick={() => setSelectedPlaylist('evening')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 relative overflow-hidden ${
            selectedPlaylist === 'evening'
              ? 'bg-amber-950 text-white border-amber-900 shadow-md font-bold'
              : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50 hover:border-amber-200'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            selectedPlaylist === 'evening' ? 'bg-amber-900 text-amber-100 border border-amber-800' : 'bg-amber-50 text-amber-600 border border-amber-200/40'
          }`}>
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-xs font-bold font-serif ${selectedPlaylist === 'evening' ? 'text-white' : 'text-amber-950'}`}>
              இரவு அமைதி
            </h3>
            <p className={`text-[11px] font-serif font-semibold ${selectedPlaylist === 'evening' ? 'text-amber-200/70' : 'text-[#6e5d53]'}`}>
              50 அமைதித் துதிகள்
            </p>
          </div>
        </button>

        {/* Key Highlights */}
        <button
          onClick={() => setSelectedPlaylist('top100')}
          className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 relative overflow-hidden ${
            selectedPlaylist === 'top100'
              ? 'bg-amber-950 text-white border-amber-900 shadow-md font-bold'
              : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50 hover:border-amber-200'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            selectedPlaylist === 'top100' ? 'bg-amber-900 text-amber-100 border border-amber-800' : 'bg-amber-50 text-amber-600 border border-amber-200/40'
          }`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-xs font-bold font-serif ${selectedPlaylist === 'top100' ? 'text-white' : 'text-amber-950'}`}>
              சிறப்புத் துதிகள்
            </h3>
            <p className={`text-[11px] font-serif font-semibold ${selectedPlaylist === 'top100' ? 'text-amber-200/70' : 'text-[#6e5d53]'}`}>
              100 சிறப்புத் துதிகள்
            </p>
          </div>
        </button>

      </div>

      {/* Playlist Details Banner in Pastel styles */}
      <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-serif">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>தேர்ந்தெடுக்கப்பட்ட ஸ்தோத்திரத் தொகுப்பு</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-amber-950">
            {selectedPlaylist === 'bookmarks' ? 'சேமிக்கப்பட்ட விருப்பத் துதிகள்' :
             selectedPlaylist === 'morning' ? 'காலை வேளை 50 ஸ்தோத்திரங்கள்' :
             selectedPlaylist === 'evening' ? 'இரவு வேளை அமைதித் துதிகள்' : 'முக்கிய 100 ஸ்தோத்திரத் மாலை'}
          </h2>
          <p className="text-xs text-[#6e5d53] font-serif font-medium mt-0.5">
            மொத்தம் {currentList.length} ஸ்தோத்திரங்கள் வாசிக்கத் தயாராக உள்ளன
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedPlaylist === 'bookmarks' && bookmarks.length > 0 && (
            <button
              onClick={onClearBookmarks}
              className="px-3.5 py-2 bg-[#faf8f5] hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-amber-200/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>அழி</span>
            </button>
          )}

          {currentList.length > 0 && (
            <button
              onClick={handlePlayQueue}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-950 hover:bg-amber-900 text-white font-serif font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-800 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>இப்பட்டியலைத் தொடர்ச்சியாகக் கேட்க</span>
            </button>
          )}
        </div>
      </div>

      {/* List Items in responsive layout */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-white border border-amber-100 rounded-2xl p-12 text-center text-[#6e5d53] space-y-2 font-serif">
            <Heart className="w-8 h-8 text-amber-500/30 mx-auto" />
            <p>இப்பட்டியலில் ஸ்தோத்திரங்கள் எதுவும் இல்லை.</p>
            <p className="text-xs text-stone-400">
              ஒலிப்புத்தகப் பகுதியில் உள்ள சேமிப்பு சின்னத்தைக் கிளிக் செய்து ஸ்தோத்திரங்களை இங்கு சேமிக்கலாம்.
            </p>
          </div>
        ) : (
          currentList.map(item => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-amber-100 hover:border-amber-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-sm hover:bg-amber-50/10"
              >
                {/* Responsive vertical stacking on mobile so Tamil text gets full viewport width */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 mt-1 bg-[#faf8f5] text-amber-950 border border-amber-200/50">
                      #{item.id}
                    </span>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <p className="text-base font-serif font-medium text-[#261e19] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section with scripture and compact controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-dashed border-amber-200/30 sm:border-0 shrink-0">
                    <div className="flex items-center">
                      {item.reference ? (
                        <span className="text-amber-800 uppercase tracking-widest font-mono font-bold text-[10px] sm:text-xs">
                          📖 {item.reference}
                        </span>
                      ) : (
                        <div />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onToggleBookmark(item.id)}
                        className={`p-2 rounded-xl transition-all border ${
                          isBookmarked 
                            ? 'text-amber-950 bg-amber-100/70 border-amber-200 shadow-sm' 
                            : 'text-stone-400 hover:text-amber-800 hover:bg-amber-50/40 border-transparent'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                      </button>

                      <button
                        onClick={() => handlePlaySingle(item)}
                        className="p-2 bg-[#faf8f5] hover:bg-amber-50 text-amber-700 border border-amber-200/60 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Play className="w-4.5 h-4.5 fill-amber-700 text-amber-700" />
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
  );
};
