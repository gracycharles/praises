import React, { useState } from 'react';
import { PraiseItem, PageData } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { Play, Bookmark, BookmarkCheck, Type, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImmersiveReaderProps {
  pages: PageData[];
  praises: PraiseItem[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
}

export const ImmersiveReader: React.FC<ImmersiveReaderProps> = ({
  pages,
  praises,
  bookmarks,
  onToggleBookmark,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(19);
  const [lineHeight] = useState<number>(1.8);

  const currentPage = pages.find(p => p.page === currentPageNum) || pages[0];
  const pagePraises = currentPage?.praises || [];

  const handlePlayItem = (item: PraiseItem) => {
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  const handlePlayEntirePage = () => {
    if (!currentPage?.praises?.length) return;
    const queue = currentPage.praises.map(p => ({
      id: p.id,
      text: p.text,
      reference: p.reference
    }));
    globalAudioEngine.playQueue(queue, 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Reading Controls Bar */}
      <div className="bg-[#1a1411]/90 border border-amber-900/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-xl">
        
        {/* Page Selector */}
        <div className="flex items-center gap-2.5">
          <button
            disabled={currentPageNum <= 1}
            onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
            className="p-2 rounded-xl bg-[#241c18] hover:bg-[#322722] border border-amber-900/30 disabled:opacity-30 transition-all text-amber-300"
            title="முந்தைய பக்கம்"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 font-serif">
            <span className="text-xs text-amber-300/80">பக்கம்:</span>
            <select
              value={currentPageNum}
              onChange={(e) => setCurrentPageNum(Number(e.target.value))}
              className="bg-[#120e0c] border border-amber-900/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {pages.map(p => (
                <option key={p.page} value={p.page} className="bg-[#120e0c] text-amber-100">
                  {p.page} ({p.praises[0]?.id || ''} - {p.praises[p.praises.length - 1]?.id || ''})
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={currentPageNum >= Math.max(...pages.map(p => p.page))}
            onClick={() => setCurrentPageNum(prev => prev + 1)}
            className="p-2 rounded-xl bg-[#241c18] hover:bg-[#322722] border border-amber-900/30 disabled:opacity-30 transition-all text-amber-300"
            title="அடுத்த பக்கம்"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayEntirePage}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-serif font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-950/50 transition-all border border-amber-400/30"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>முழுப் பக்கமும் வாசிக்க</span>
          </button>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-3 bg-[#120e0c] px-3.5 py-1.5 rounded-xl border border-amber-900/30">
          <Type className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 font-mono text-xs">{fontSize}px</span>
          <input
            type="range"
            min="15"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24 accent-amber-500 bg-[#3b2417] h-1.5 rounded-lg cursor-pointer"
          />
        </div>

      </div>

      {/* Book Manuscript Sheet */}
      <div className="p-6 md:p-12 rounded-3xl bg-gradient-to-b from-[#1e1713] via-[#1a1411] to-[#140f0c] border border-amber-900/40 shadow-2xl transition-all text-amber-50 font-serif">
        
        {/* Manuscript Header */}
        <div className="text-center space-y-2.5 pb-8 border-b border-amber-900/30">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 tracking-wide">
            {currentPage?.title}
          </h2>
        </div>

        {/* Verses Container */}
        <div className="mt-8 space-y-6">
          {pagePraises.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="group p-4 md:p-5 rounded-2xl hover:bg-amber-500/5 transition-all border border-transparent hover:border-amber-900/30 flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      #{item.id}
                    </span>
                    {item.reference && (
                      <span className="text-amber-200/60 text-xs font-mono tracking-widest uppercase">
                        📖 {item.reference}
                      </span>
                    )}
                  </div>

                  <p
                    style={{ fontSize: `${fontSize}px`, lineHeight }}
                    className="font-serif leading-relaxed tracking-wide font-medium text-amber-50"
                  >
                    {item.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    title="சேமி"
                    className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30' : 'text-stone-400 hover:text-amber-300 hover:bg-[#28201a]'}`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handlePlayItem(item)}
                    title="ஒலி வடிவில் கேட்க"
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-500/20"
                  >
                    <Play className="w-5 h-5 fill-amber-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-amber-900/30 flex items-center justify-between text-xs text-amber-300/60 font-serif">
          <span>அகர வரிசையில் நன்றி பலிகள் 1000</span>
          <span>பக்கம் {currentPageNum}</span>
        </div>

      </div>

    </div>
  );
};
