import React, { useState } from 'react';
import { PlayerSettings } from '../types';
import { globalAudioEngine } from '../utils/audioEngine';
import { ambientSound } from '../utils/ambientAudio';
import { Settings, Volume2, Music, Sliders } from 'lucide-react';

interface SettingsViewProps {
  settings: PlayerSettings;
  onUpdateSettings: (settings: PlayerSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [ambientType, setAmbientType] = useState<'off' | 'harp' | 'drone'>('off');

  const updateField = <K extends keyof PlayerSettings>(field: K, val: PlayerSettings[K]) => {
    const next = { ...settings, [field]: val };
    onUpdateSettings(next);
    globalAudioEngine.updateSettings(next);
  };

  const handleAmbientChange = (type: 'off' | 'harp' | 'drone') => {
    setAmbientType(type);
    ambientSound.setSoundType(type);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full overflow-hidden">
      
      {/* Primary Audio & Voice Settings Card in Soft Pastel Theme */}
      <div className="bg-white border border-amber-100 rounded-3xl p-5 md:p-8 shadow-sm space-y-6 w-full">
        
        <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/40 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-950 font-serif">
              ஒலி & குரல் அமைப்புகள்
            </h2>
            <p className="text-[11px] text-[#6e5d53] font-serif font-medium">
              வாசிக்கும் குரல், வேகம் மற்றும் பின்னணி ஜெப இசை அமைப்புகள்
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-serif">
          
          {/* Voice Selector */}
          <div className="space-y-2 bg-[#faf8f5] p-4 rounded-2xl border border-amber-200/20">
            <label className="font-bold text-amber-950 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>வாசிக்கும் குரல் தேர்வு</span>
            </label>
            <select
              value={settings.voice}
              onChange={(e) => updateField('voice', e.target.value)}
              className="w-full bg-white border border-amber-200/40 rounded-xl px-3 py-2.5 text-amber-950 font-serif focus:outline-none focus:border-amber-400 cursor-pointer text-xs font-semibold"
            >
              <option value="ta-IN-Wavenet-A">தமிழ் பெண் குரல் 1</option>
              <option value="ta-IN-Wavenet-B">தமிழ் ஆண் குரல் 1</option>
              <option value="ta-IN-Neural2-A">இனிய தமிழ் நியூரல் குரல்</option>
              <option value="ta-IN-Standard-A">இயல்பு நிலை தமிழ் குரல்</option>
            </select>
          </div>

          {/* Ambient Background Music Synth with Soft Pastel Buttons */}
          <div className="space-y-2 bg-[#faf8f5] p-4 rounded-2xl border border-amber-200/20">
            <label className="font-bold text-amber-950 flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-700" />
              <span>பின்னணி ஜெப இசை</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <button
                onClick={() => handleAmbientChange('off')}
                className={`py-2 px-2 rounded-xl border text-center font-serif transition-all text-[11px] font-bold ${
                  ambientType === 'off'
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-white text-stone-600 border-amber-200/30 hover:bg-amber-50'
                }`}
              >
                இசை வேண்டாம்
              </button>
              <button
                onClick={() => handleAmbientChange('harp')}
                className={`py-2 px-2 rounded-xl border text-center font-serif transition-all text-[11px] font-bold ${
                  ambientType === 'harp'
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-white text-stone-600 border-amber-200/30 hover:bg-amber-50'
                }`}
              >
                வீணை இசை
              </button>
              <button
                onClick={() => handleAmbientChange('drone')}
                className={`py-2 px-2 rounded-xl border text-center font-serif transition-all text-[11px] font-bold ${
                  ambientType === 'drone'
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-white text-stone-600 border-amber-200/30 hover:bg-amber-50'
                }`}
              >
                அமைதி நாதம்
              </button>
            </div>
          </div>

          {/* Speech Speed */}
          <div className="space-y-2 bg-[#faf8f5] p-4 rounded-2xl border border-amber-200/20">
            <div className="flex justify-between items-center text-amber-950 font-bold">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>வாசிக்கும் வேகம்</span>
              </span>
              <span className="font-mono text-amber-900 font-bold">{settings.speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => updateField('speed', parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-amber-200 h-1 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-stone-400 font-serif font-semibold">
              <span>0.5x (மெதுவாக)</span>
              <span>1.0x (இயல்பு)</span>
              <span>2.0x (வேகமாக)</span>
            </div>
          </div>

          {/* Speech Pitch */}
          <div className="space-y-2 bg-[#faf8f5] p-4 rounded-2xl border border-amber-200/20">
            <div className="flex justify-between items-center text-amber-950 font-bold">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>குரல் சுருதி</span>
              </span>
              <span className="font-mono text-amber-900 font-bold">{settings.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => updateField('pitch', parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-amber-200 h-1 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-stone-400 font-serif font-semibold">
              <span>0.5x (தாழ்ந்த குரல்)</span>
              <span>1.0x (இயல்பு)</span>
              <span>1.5x (உயர்ந்த குரல்)</span>
            </div>
          </div>

        </div>

        {/* Playback Preferences */}
        <div className="pt-4 border-t border-amber-100 flex flex-wrap gap-6 text-xs text-stone-700 font-serif font-semibold">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) => updateField('autoScroll', e.target.checked)}
              className="rounded text-amber-600 bg-white border-amber-200 focus:ring-amber-500/30"
            />
            <span>வாசிக்கும் போது தானாக கீழே நகருதல்</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.continuousPlay}
              onChange={(e) => updateField('continuousPlay', e.target.checked)}
              className="rounded text-amber-600 bg-white border-amber-200 focus:ring-amber-500/30"
            />
            <span>தொடர் வாசிப்பு</span>
          </label>
        </div>

      </div>

    </div>
  );
};
