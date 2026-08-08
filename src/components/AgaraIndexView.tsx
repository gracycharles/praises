import React, { useState, useMemo } from 'react';
import { PraiseItem } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { Play, Bookmark, BookmarkCheck, Sparkles, BookOpen } from 'lucide-react';

interface AgaraIndexViewProps {
  praises: PraiseItem[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
}

// Tamil Vowels & Consonants Series for Indexing
const AGARA_VARISAI_LETTERS = [
  'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
  'க', 'கா', 'கி', 'கீ', 'கு', 'கூ', 'கெ', 'கே', 'கை', 'கொ', 'கோ',
  'ச', 'சா', 'சி', 'சீ', 'சு', 'சூ', 'செ', 'சே', 'சை', 'சொ', 'சோ',
  'ஞா', 'த', 'தா', 'தி', 'தீ', 'து', 'தூ', 'தெ', 'தே', 'தை', 'தொ', 'தோ',
  'ந', 'நா', 'நி', 'நீ', 'நு', 'நூ', 'நெ', 'நே', 'நை', 'நொ', 'நோ',
  'ப', 'பா', 'பி', 'பீ', 'பு', 'பூ', 'பெ', 'பே', 'பை', 'பொ', 'போ',
  'ம', 'மா', 'மி', 'மீ', 'மு', 'மூ', 'மெ', 'மே', 'மை', 'மொ', 'மோ',
  'ய', 'யா', 'யெ', 'யே', 'யோ', 'யூ',
  'ர', 'ரா', 'ரி', 'ரீ', 'ரு', 'ரூ', 'ரெ', 'ரே', 'ரை', 'ரொ', 'ரோ',
  'ல', 'லா', 'லி', 'லீ', 'லு', 'லூ', 'லெ', 'லே', 'லை', 'லொ', 'லோ',
  'வ', 'வா', 'வி', 'வீ', 'வெ', 'வே', 'வை'
];

export const AgaraIndexView: React.FC<AgaraIndexViewProps> = ({
  praises,
  bookmarks,
  onToggleBookmark,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('அ');

  // Compute counts per letter
  const letterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    AGARA_VARISAI_LETTERS.forEach(l => counts.set(l, 0));

    praises.forEach(p => {
      AGARA_VARISAI_LETTERS.forEach(letter => {
        if (p.text.startsWith(letter)) {
          counts.set(letter, (counts.get(letter) || 0) + 1);
        }
      });
    });
    return counts;
  }, [praises]);

  // Filtered Praises based on letter
  const filteredList = useMemo(() => {
    return praises.filter(p => {
      return p.text.startsWith(selectedLetter) || (selectedLetter === 'ALL');
    });
  }, [praises, selectedLetter]);

  const handlePlaySingle = (item: PraiseItem) => {
    globalAudioEngine.unlock();
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  const handlePlayLetterSeries = () => {
    if (!filteredList.length) return;
    globalAudioEngine.unlock();
    const items = filteredList.map(p => ({
      id: p.id,
      text: p.text,
      reference: p.reference
    }));
    globalAudioEngine.playQueue(items, 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Tamil Agara Varisai Alphabet Ribbon */}
      <div className="bg-white border border-amber-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/40 font-bold flex items-center justify-center text-sm font-serif">
              அ
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-amber-950 font-serif">
                தமிழ் அகர வரிசை அகராதி
              </h2>
              <p className="text-[11px] text-[#6e5d53] font-serif font-medium">
                எழுத்தைத் தேர்ந்தெடுத்து அந்த எழுத்தில் தொடங்கும் ஸ்தோத்திரங்களை அறியலாம்
              </p>
            </div>
          </div>
        </div>

        {/* Letter Grid */}
        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-1 scrollbar-thin">
          {AGARA_VARISAI_LETTERS.map(letter => {
            const count = letterCounts.get(letter) || 0;
            const isSelected = selectedLetter === letter;

            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-950 text-white border border-amber-900 shadow-md font-bold scale-105'
                    : count > 0
                    ? 'bg-[#faf8f5] text-amber-900 border border-amber-200/40 hover:bg-amber-50'
                    : 'bg-[#faf8f5]/40 text-[#b5a99f] border border-amber-100 cursor-not-allowed opacity-30'
                }`}
              >
                <span>{letter}</span>
                {count > 0 && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-amber-800 text-amber-100' : 'bg-amber-100/60 text-amber-900 border border-amber-200/20'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Title & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-amber-100 rounded-2xl p-4 md:p-5 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-amber-950 font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>'{selectedLetter}' எழுத்தில் தொடங்கும் ஸ்தோத்திரங்கள் ({filteredList.length})</span>
          </h3>
          <p className="text-[11px] text-[#6e5d53] font-serif font-medium">
            அகர வரிசைப்படி அமைக்கப்பட்ட 1000 தமிழ் ஸ்தோத்திர துதிகள்
          </p>
        </div>

        {filteredList.length > 0 && (
          <button
            onClick={handlePlayLetterSeries}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-950 hover:bg-amber-900 text-white font-serif font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-800 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>இப்பகுதியைத் தொடர்ச்சியாகக் கேட்க</span>
          </button>
        )}
      </div>

      {/* Praises List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white border border-amber-100 rounded-2xl p-12 text-center text-[#6e5d53] space-y-2 font-serif">
            <BookOpen className="w-8 h-8 text-amber-500/30 mx-auto" />
            <p>தேர்ந்தெடுக்கப்பட்ட எழுத்தில் ஸ்தோத்திரங்கள் காணப்படவில்லை.</p>
          </div>
        ) : (
          filteredList.map(item => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border-2 border-amber-200/95 hover:border-amber-400 rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:bg-amber-50/10 shadow-sm"
              >
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
                        title="சேமி"
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
                        title="கேட்க"
                        className="p-2 rounded-xl bg-[#faf8f5] hover:bg-amber-50 text-amber-700 border border-amber-200/60"
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
