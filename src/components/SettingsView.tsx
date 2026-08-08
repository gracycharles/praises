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
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Primary Audio & Voice Settings Card */}
      <div className="bg-[#1a1411]/90 border border-amber-900/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        <div className="flex items-center gap-3 border-b border-amber-900/30 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-100 font-serif">
              ஒலி & குரல் அமைப்புகள்
            </h2>
            <p className="text-xs text-amber-200/60 font-serif">
              வாசிக்கும் குரல், வேகம் மற்றும் பின்னணி ஜெப இசை அமைப்புகள்
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-serif">
          
          {/* Voice Selector */}
          <div className="space-y-2.5 bg-[#120e0c] p-4 rounded-2xl border border-amber-900/30">
            <label className="font-semibold text-amber-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>வாசிக்கும் குரல் தேர்வு</span>
            </label>
            <select
              value={settings.voice}
              onChange={(e) => updateField('voice', e.target.value)}
              className="w-full bg-[#1a1411] border border-amber-900/40 rounded-xl px-3 py-2.5 text-amber-100 font-serif focus:outline-none cursor-pointer"
            >
              <option value="ta-IN-Wavenet-A">தமிழ் பெண் குரல் 1</option>
              <option value="ta-IN-Wavenet-B">தமிழ் ஆண் குரல் 1</option>
              <option value="ta-IN-Neural2-A">இனிய தமிழ் நியூரல் குரல்</option>
              <option value="ta-IN-Standard-A">இயல்பு நிலை தமிழ் குரல்</option>
            </select>
          </div>

          {/* Ambient Background Music Synth */}
          <div className="space-y-2.5 bg-[#120e0c] p-4 rounded-2xl border border-amber-900/30">
            <label className="font-semibold text-amber-200 flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>பின்னணி ஜெப இசை</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleAmbientChange('off')}
                className={`py-2 px-3 rounded-xl border text-center font-serif transition-all ${
                  ambientType === 'off'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-[#1a1411] text-stone-400 border-amber-900/30 hover:bg-[#28201a]'
                }`}
              >
                இசை வேண்டாம்
              </button>
              <button
                onClick={() => handleAmbientChange('harp')}
                className={`py-2 px-3 rounded-xl border text-center font-serif transition-all ${
                  ambientType === 'harp'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-[#1a1411] text-amber-200 border-amber-900/30 hover:bg-[#28201a]'
                }`}
              >
                வீணை இசை
              </button>
              <button
                onClick={() => handleAmbientChange('drone')}
                className={`py-2 px-3 rounded-xl border text-center font-serif transition-all ${
                  ambientType === 'drone'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-[#1a1411] text-amber-200 border-amber-900/30 hover:bg-[#28201a]'
                }`}
              >
                அமைதி நாதம்
              </button>
            </div>
          </div>

          {/* Speech Speed */}
          <div className="space-y-2.5 bg-[#120e0c] p-4 rounded-2xl border border-amber-900/30">
            <div className="flex justify-between items-center text-amber-200 font-semibold">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>வாசிக்கும் வேகம்</span>
              </span>
              <span className="font-mono text-amber-300">{settings.speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => updateField('speed', parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-[#3b2417] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-amber-200/50 font-serif">
              <span>0.5x (மெதுவாக)</span>
              <span>1.0x (இயல்பு)</span>
              <span>2.0x (வேகமாக)</span>
            </div>
          </div>

          {/* Speech Pitch */}
          <div className="space-y-2.5 bg-[#120e0c] p-4 rounded-2xl border border-amber-900/30">
            <div className="flex justify-between items-center text-amber-200 font-semibold">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>குரல் சுருதி</span>
              </span>
              <span className="font-mono text-amber-300">{settings.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => updateField('pitch', parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-[#3b2417] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Playback Preferences */}
        <div className="pt-4 border-t border-amber-900/30 flex flex-wrap gap-6 text-xs text-amber-200/80 font-serif">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) => updateField('autoScroll', e.target.checked)}
              className="rounded text-amber-500 bg-[#120e0c] border-amber-900/40 focus:ring-0"
            />
            <span>வாசிக்கும் போது தானாக கீழே நகருதல்</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.continuousPlay}
              onChange={(e) => updateField('continuousPlay', e.target.checked)}
              className="rounded text-amber-500 bg-[#120e0c] border-amber-900/40 focus:ring-0"
            />
            <span>தொடர் வாசிப்பு</span>
          </label>
        </div>

      </div>

    </div>
  );
};
