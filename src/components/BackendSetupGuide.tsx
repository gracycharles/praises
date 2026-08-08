import React, { useState } from 'react';
import { Server, Copy, Check, ShieldCheck, Cpu } from 'lucide-react';

export const BackendSetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [copiedPkg, setCopiedPkg] = useState(false);

  const indexJsCode = `// index.js - Google Cloud Function / Cloud Run TTS Proxy
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient();

exports.synthesize = async (req, res) => {
  // Set CORS headers for GitHub Pages origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { text, voice = 'ta-IN-Wavenet-A', audioEncoding = 'MP3', speakingRate = 1.0 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing Tamil text payload' });
    }

    const request = {
      input: { text },
      voice: { languageCode: 'ta-IN', name: voice },
      audioConfig: { audioEncoding, speakingRate },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64');
    
    res.json({ audioContent });
  } catch (err) {
    console.error('Google Cloud TTS Error:', err);
    res.status(500).json({ error: err.message || 'Synthesis error' });
  }
};
`;

  const packageJsonCode = `{
  "name": "tamil-tts-proxy",
  "version": "1.0.0",
  "description": "Secure Google Cloud TTS Proxy for Tamil Audiobook",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@google-cloud/text-to-speech": "^5.0.0"
  }
}
`;

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <span>Secure Node.js Cloud Function (Google Cloud TTS Proxy)</span>
          </h2>
          <p className="text-xs text-slate-400">
            GitHub Pages பயன்பாட்டில் கூகுள் TTS API விசையை பாதுகாப்பாக மறைக்கப் பயன்படும் சேவையகம்.
          </p>
        </div>

        {/* Security & Architecture Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
              <span>API Key Security</span>
            </div>
            <p className="text-slate-400">
              கூகுள் கிளவுட் TTS ரகசிய API விசை வாடிக்கையாளர் உலாவியில் தெரியாமல் சர்வர்லெஸ் முகப்பில் பாதுகாக்கப்படுகிறது.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Cpu className="w-4 h-4" />
              <span>Gapless Base64 Response</span>
            </div>
            <p className="text-slate-400">
              ஒவ்வொரு வாக்கியத்திற்கும் Base64 ஆடியோ துரிதமாகத் திரும்ப வழங்கப்பட்டு Web Audio API வழியாக தடையின்றி வாசிக்கப்படுகிறது.
            </p>
          </div>
        </div>

        {/* Code Block 1: index.js */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold text-indigo-400">index.js (Google Cloud Function Entry Point)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(indexJsCode);
                setCopiedIndex(true);
                setTimeout(() => setCopiedIndex(false), 2000);
              }}
              className="hover:text-white flex items-center gap-1 text-slate-400"
            >
              {copiedIndex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex ? 'பிரதி எடுத்தாச்சு' : 'பிரதி எடு'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto max-h-80 custom-scrollbar">
            <code>{indexJsCode}</code>
          </pre>
        </div>

        {/* Code Block 2: package.json */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold text-indigo-400">package.json</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(packageJsonCode);
                setCopiedPkg(true);
                setTimeout(() => setCopiedPkg(false), 2000);
              }}
              className="hover:text-white flex items-center gap-1 text-slate-400"
            >
              {copiedPkg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPkg ? 'பிரதி எடுத்தாச்சு' : 'பிரதி எடு'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto custom-scrollbar">
            <code>{packageJsonCode}</code>
          </pre>
        </div>

      </div>

    </div>
  );
};
