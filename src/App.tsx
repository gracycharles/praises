import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { AudiobookPlayer } from './components/AudiobookPlayer';
import { ImmersiveReader } from './components/ImmersiveReader';
import { AgaraIndexView } from './components/AgaraIndexView';
import { PlaylistsView } from './components/PlaylistsView';
import { SettingsView } from './components/SettingsView';
import { AudioOverlay } from './components/AudioOverlay';
import { getCompletePraises, getGroupedPages, BOOK_METADATA } from './data/tamildata';
import { PraiseItem, PageData, PlayerSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('audiobook');
  const [praises] = useState<PraiseItem[]>(getCompletePraises());
  const [pages, setPages] = useState<PageData[]>(getGroupedPages());

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tamil_audiobook_bookmarks') || '[]');
    } catch {
      return [1, 2, 8, 308, 716, 930, 1000];
    }
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

  const handleToggleBookmark = (id: number) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('tamil_audiobook_bookmarks', JSON.stringify(next));
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
    localStorage.setItem('tamil_audiobook_bookmarks', JSON.stringify([]));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#261e19] font-serif selection:bg-amber-200 selection:text-amber-950 flex flex-col justify-between relative pb-20">
      <div>
        {/* Header Bar */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          totalPraises={praises.length} 
        />

        {/* Main Application Canvas */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'audiobook' && (
            <AudiobookPlayer praises={praises} />
          )}

          {activeTab === 'reader' && (
            <ImmersiveReader 
              pages={pages} 
              praises={praises} 
              bookmarks={bookmarks} 
              onToggleBookmark={handleToggleBookmark} 
            />
          )}

          {activeTab === 'index' && (
            <AgaraIndexView 
              praises={praises} 
              bookmarks={bookmarks} 
              onToggleBookmark={handleToggleBookmark} 
            />
          )}

          {activeTab === 'playlists' && (
            <PlaylistsView 
              praises={praises} 
              bookmarks={bookmarks} 
              onToggleBookmark={handleToggleBookmark} 
              onClearBookmarks={handleClearBookmarks} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings} 
              onUpdateSettings={setSettings} 
            />
          )}
        </main>
      </div>

      {/* Floating Audio Dock Overlay & Go To Top Button */}
      <AudioOverlay praises={praises} />

      {/* Footer */}
      <footer className="border-t border-amber-200/40 bg-[#f3ede4] py-8 text-center text-xs text-stone-600 space-y-1.5">
        <p className="font-serif text-amber-900 font-semibold px-4 text-sm tracking-wide">
          {BOOK_METADATA.title} • {BOOK_METADATA.author}
        </p>
        <p className="text-amber-800/80 text-[11px] font-serif">
          1000 அகர வரிசை நன்றி பலிகள் கொண்ட தமிழ் ஒலிப்புத்தகம்
        </p>
      </footer>
    </div>
  );
}
