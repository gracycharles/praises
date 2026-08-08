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
    globalAudioEngine.unlock();
    globalAudioEngine.playSingleText(item.id, item.text, item.reference);
  };

  const handlePlayEntirePage = () => {
    if (!currentPage?.praises?.length) return;
    globalAudioEngine.unlock();
    const queue = currentPage.praises.map(p => ({
      id: p.id,
      text: p.text,
      reference: p.reference
    }));
    globalAudioEngine.playQueue(queue, 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Reading Controls Bar in Soft Pastel Theme */}
      <div className="bg-white border border-amber-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        
        {/* Page Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            disabled={currentPageNum <= 1}
            onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
            className="p-2 rounded-xl bg-[#faf8f5] hover:bg-amber-50 border border-amber-200/40 disabled:opacity-30 transition-all text-amber-950"
            title="முந்தைய பக்கம்"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 font-serif">
            <span className="text-xs text-[#6e5d53] font-bold">பக்கம்:</span>
            <select
              value={currentPageNum}
              onChange={(e) => setCurrentPageNum(Number(e.target.value))}
              className="bg-[#faf8f5] border border-amber-200/40 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none cursor-pointer"
            >
              {pages.map(p => (
                <option key={p.page} value={p.page} className="bg-white text-stone-900">
                  {p.page} ({p.praises[0]?.id || ''} - {p.praises[p.praises.length - 1]?.id || ''})
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={currentPageNum >= Math.max(...pages.map(p => p.page))}
            onClick={() => setCurrentPageNum(prev => prev + 1)}
            className="p-2 rounded-xl bg-[#faf8f5] hover:bg-amber-50 border border-amber-200/40 disabled:opacity-30 transition-all text-amber-950"
            title="அடுத்த பக்கம்"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayEntirePage}
            className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-white font-serif font-bold rounded-xl text-xs flex items-center gap-2 border border-amber-800 shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>முழுப் பக்கமும் வாசிக்க</span>
          </button>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-3 bg-[#faf8f5] px-3.5 py-1.5 rounded-xl border border-amber-200/30">
          <Type className="w-4 h-4 text-amber-700" />
          <span className="text-amber-950 font-mono text-xs font-bold">{fontSize}px</span>
          <input
            type="range"
            min="15"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24 accent-amber-600 bg-amber-200 h-1 rounded-lg cursor-pointer"
          />
        </div>

      </div>

      {/* Book Manuscript Sheet */}
      <div className="p-5 md:p-12 rounded-3xl bg-white border border-amber-100 shadow-sm transition-all text-[#261e19] font-serif">
        
        {/* Manuscript Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-amber-950/20">
          <h2 className="text-xl md:text-2xl font-serif font-extrabold text-amber-950 tracking-wide">
            {currentPage?.title}
          </h2>
        </div>

        {/* Verses Container */}
        <div className="mt-6 space-y-4">
          {pagePraises.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="group p-4 rounded-2xl bg-[#faf8f5]/40 hover:bg-amber-50/20 transition-all border-2 border-amber-200/50 hover:border-amber-400 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 shadow-sm"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-amber-100 bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-900 shadow-sm">
                      #{item.id}
                    </span>
                  </div>

                  <p
                    style={{ fontSize: `${fontSize}px`, lineHeight }}
                    className="font-serif leading-relaxed tracking-wide font-medium text-[#261e19]"
                  >
                    {item.text}
                  </p>
                </div>

                {/* Sub-container containing Scripture references & compact control buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-dashed border-amber-200/30 sm:border-0 shrink-0">
                  <div className="flex items-center">
                    {item.reference ? (
                      <span className="text-amber-800 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
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
                      onClick={() => handlePlayItem(item)}
                      title="கேட்க"
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-950 hover:text-white text-amber-900 border border-amber-200/60 transition-all"
                    >
                      <Play className="w-4.5 h-4.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-4 border-t border-amber-100 flex items-center justify-between text-[11px] text-[#6e5d53] font-serif font-bold">
          <span>அகர வரிசையில் நன்றி பலிகள் 1000</span>
          <span>பக்கம் {currentPageNum}</span>
        </div>

      </div>

    </div>
  );
};
