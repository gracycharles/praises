import React, { useState, useMemo } from 'react';
import { PageData, ExtractionValidation } from '../types';
import { validateTamilExtraction, normalizeTamilNFC, repairHyphenatedTamil } from '../utils/unicodeTamil';
import { FileUp, CheckCircle, AlertTriangle, Download, RefreshCw, Copy, Check, Sparkles, Eye, FileCode } from 'lucide-react';

interface PdfViewerEditorProps {
  initialPages: PageData[];
  onUpdatePages: (pages: PageData[]) => void;
}

export const PdfViewerEditor: React.FC<PdfViewerEditorProps> = ({ initialPages, onUpdatePages }) => {
  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activePage = pages[activePageIndex] || pages[0];

  // Validation Metrics for active page
  const pageValidation: ExtractionValidation = useMemo(() => {
    if (!activePage) {
      return {
        pageCount: 0,
        totalCharacters: 0,
        tamilCharacterCount: 0,
        tamilPercentage: 0,
        isNormalizedNFC: true,
        suspectedHyphenatedWords: [],
        unicodeRangeValid: true,
        issuesCount: 0
      };
    }
    return validateTamilExtraction(activePage.rawText, activePage.page);
  }, [activePage]);

  // Handle Text Edit
  const handlePageTextChange = (newText: string) => {
    const updated = [...pages];
    if (updated[activePageIndex]) {
      updated[activePageIndex] = {
        ...updated[activePageIndex],
        rawText: newText
      };
      setPages(updated);
      onUpdatePages(updated);
    }
  };

  // Auto Repair Hyphens & NFC Normalize
  const handleAutoRepair = () => {
    if (!activePage) return;
    const repaired = repairHyphenatedTamil(normalizeTamilNFC(activePage.rawText));
    handlePageTextChange(repaired);
  };

  // Upload JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed[0]?.page && parsed[0]?.text) {
          const loadedPages: PageData[] = parsed.map(p => ({
            page: p.page,
            title: `பக்கம் ${p.page}`,
            rawText: p.text,
            praises: []
          }));
          setPages(loadedPages);
          onUpdatePages(loadedPages);
        } else {
          alert("தயவுசெய்து சரியான Extracted JSON கோப்பினைத் தேர்ந்தெடுக்கவும்.");
        }
      } catch {
        alert("கோப்பினை வாசிப்பதில் பிழை ஏற்பட்டது.");
      }
    };
    reader.readAsText(file);
  };

  // Copy Active Page Text
  const handleCopyText = () => {
    if (!activePage) return;
    navigator.clipboard.writeText(activePage.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download All Extracted JSON
  const downloadJSON = () => {
    const exportData = pages.map(p => ({
      page: p.page,
      text: p.rawText
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_tamil_text_full_${pages.length}_pages.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-400" />
            <span>Lossless Tamil PDF Text Reviewer</span>
          </h2>
          <p className="text-xs text-slate-400">
            தமிழ் எழுத்துக்கள் விடுபடாமல் Unicode NFC முறையில் சரிபார்த்து திருத்தும் அரங்கம்.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all border border-slate-700">
            <FileUp className="w-4 h-4 text-amber-400" />
            <span>JSON / Text கோப்பு ஏற்று</span>
            <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={downloadJSON}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>JSON பதிவிறக்கு</span>
          </button>
        </div>
      </div>

      {/* Page Selector & Validation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Page List Sidebar */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            பக்கங்கள் ({pages.length})
          </div>
          <div className="space-y-1.5">
            {pages.map((p, idx) => (
              <button
                key={p.page}
                onClick={() => setActivePageIndex(idx)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                  activePageIndex === idx
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>பக்கம் {p.page}</span>
                <span className="text-[10px] opacity-75 font-mono">{p.rawText.length} எழுத்துக்கள்</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Review & Editor */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Quality Metrics Header */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500">மொத்த எழுத்துக்கள்:</span>
                <span className="font-mono font-bold text-white">{pageValidation.totalCharacters}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">தமிழ் விகிதம்:</span>
                <span className={`font-mono font-bold ${pageValidation.tamilPercentage > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pageValidation.tamilPercentage}%
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">NFC சரிபார்ப்பு:</span>
                <span className={`font-semibold ${pageValidation.isNormalizedNFC ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pageValidation.isNormalizedNFC ? '✓ NFC Normal' : '⚠️ தேவையாக்கம்'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoRepair}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-medium flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>சொல் பிளவு திருத்து</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'பிரதி எடுக்கப்பட்டது' : 'பிரதி எடு'}</span>
              </button>
            </div>
          </div>

          {/* Text Area Editor */}
          <div className="relative">
            <textarea
              value={activePage ? activePage.rawText : ''}
              onChange={(e) => handlePageTextChange(e.target.value)}
              placeholder="பக்க உரை இங்கு தோன்றும்..."
              rows={18}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 text-sm font-serif leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 custom-scrollbar"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
