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
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  const handlePlayLetterSeries = () => {
    if (!filteredList.length) return;
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
      <div className="bg-[#1a1411]/90 border border-amber-900/40 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-base font-serif">
              அ
            </span>
            <div>
              <h2 className="text-base md:text-lg font-bold text-amber-100 font-serif">
                தமிழ் அகர வரிசை அகராதி
              </h2>
              <p className="text-xs text-amber-200/60 font-serif">
                எழுத்தைத் தேர்ந்தெடுத்து அந்த எழுத்தில் தொடங்கும் ஸ்தோத்திரங்களை அறியலாம்
              </p>
            </div>
          </div>
        </div>

        {/* Letter Grid */}
        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-1 scrollbar-none">
          {AGARA_VARISAI_LETTERS.map(letter => {
            const count = letterCounts.get(letter) || 0;
            const isSelected = selectedLetter === letter;

            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-stone-950 font-extrabold shadow-lg shadow-amber-950/60 scale-105'
                    : count > 0
                    ? 'bg-[#120e0c] text-amber-200 border border-amber-900/30 hover:border-amber-500/40 hover:bg-[#28201a]'
                    : 'bg-[#120e0c]/40 text-stone-600 border border-amber-900/10 cursor-not-allowed opacity-40'
                }`}
              >
                <span>{letter}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-stone-950/30 text-stone-950' : 'bg-[#241c18] text-amber-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Title & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a1411]/80 border border-amber-900/30 rounded-2xl p-4 md:p-5 shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-amber-100 font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>'{selectedLetter}' எழுத்தில் தொடங்கும் ஸ்தோத்திரங்கள் ({filteredList.length})</span>
          </h3>
          <p className="text-xs text-amber-200/60 font-serif">
            அகர வரிசைப்படி அமைக்கப்பட்ட 1000 தமிழ் ஸ்தோத்திர துதிகள்
          </p>
        </div>

        {filteredList.length > 0 && (
          <button
            onClick={handlePlayLetterSeries}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all border border-amber-400/30"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>இப்பகுதியைத் தொடர்ச்சியாகக் கேட்க</span>
          </button>
        )}
      </div>

      {/* Praises List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-[#1a1411]/40 border border-amber-900/20 rounded-2xl p-12 text-center text-stone-400 space-y-2 font-serif">
            <BookOpen className="w-8 h-8 text-amber-500/30 mx-auto" />
            <p>தேர்ந்தெடுக்கப்பட்ட எழுத்தில் ஸ்தோத்திரங்கள் காணப்படவில்லை.</p>
          </div>
        ) : (
          filteredList.map(item => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-[#1a1411]/80 border border-amber-900/30 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between space-y-3 group hover:shadow-xl hover:bg-[#201814]"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      #{item.id}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-serif text-amber-200/60">
                        பக்கம் {item.page}
                      </span>
                      {item.reference && (
                        <span className="text-amber-200/80 text-[10px] uppercase font-mono tracking-widest">
                          📖 {item.reference}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-base font-serif font-medium text-amber-50 leading-relaxed group-hover:text-amber-200 transition-colors">
                    {item.text}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/20">
                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    title="சேமி"
                    className={`p-2 rounded-xl transition-all ${isBookmarked ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30' : 'text-stone-400 hover:text-amber-300 hover:bg-[#28201a]'}`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handlePlaySingle(item)}
                    title="வாசிக்க"
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-500/20 flex items-center gap-1.5 text-xs font-serif"
                  >
                    <Play className="w-4 h-4 fill-amber-300" />
                    <span>கேட்க</span>
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
