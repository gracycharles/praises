import { PlayerSettings } from '../types';

export function formatTamilReferenceForSpeech(ref: string): string {
  if (!ref) return '';
  let speech = ref.trim();

  const bookMap: [RegExp, string][] = [
    [/^கொலோ[\.]?/, 'கொலோசெயர் '],
    [/^கலா[\.]?/, 'கலாத்தியர் '],
    [/^எபே[\.]?/, 'எபேசியர் '],
    [/^பிலி[\.]?/, 'பிலிப்பியர் '],
    [/^1 கொரி[\.]?/, 'முதலாம் கொரிந்தியர் '],
    [/^2 கொரி[\.]?/, 'இரண்டாம் கொரிந்தியர் '],
    [/^1 தெச[\.]?/, 'முதலாம் தெசலோனிக்கேயர் '],
    [/^2 தெச[\.]?/, 'இரண்டாம் தெசலோனிக்கேயர் '],
    [/^1 தீமோ[\.]?/, 'முதலாம் தீமோத்தேயு '],
    [/^2 தீமோ[\.]?/, 'இரண்டாம் தீமோத்தேயு '],
    [/^தீத்து[\.]?/, 'தீத்து '],
    [/^பிலேயோன்[\.]?/, 'பிலேயோன் '],
    [/^1 பேது[\.]?/, 'முதலாம் பேதுரு '],
    [/^2 பேது[\.]?/, 'இரண்டாம் பேதுரு '],
    [/^1 யோவா[\.]?/, 'முதலாம் யோவான் '],
    [/^2 யோவா[\.]?/, 'இரண்டாம் யோவான் '],
    [/^3 யோவா[\.]?/, 'மூன்றாம் யோவான் '],
    [/^யோவா[\.]?/, 'யோவான் '],
    [/^சங்[\.]?/, 'சங்கீதம் '],
    [/^ஆதி[\.]?/, 'ஆதியாகமம் '],
    [/^யாத்[\.]?/, 'யாத்திராகமம் '],
    [/^லேவி[\.]?/, 'லேவியராகமம் '],
    [/^எண்ணாக[\.]?/, 'எண்ணாகமம் '],
    [/^உபா[\.]?/, 'உபாகமம் '],
    [/^யோசு[\.]?/, 'யோசுவா '],
    [/^நியாயா[\.]?/, 'நியாயாதிபதிகள் '],
    [/^ரூத்[\.]?/, 'ரூத் '],
    [/^1 சாமு[\.]?/, 'முதலாம் சாமுவேல் '],
    [/^2 சாமு[\.]?/, 'இரண்டாம் சாமுவேல் '],
    [/^1 இராஜா[\.]?/, 'முதலாம் இராஜாக்கள் '],
    [/^2 இராஜா[\.]?/, 'இரண்டாம் இராஜாக்கள் '],
    [/^1 நாளா[\.]?/, 'முதலாம் நாளாகமம் '],
    [/^2 நாளா[\.]?/, 'இரண்டாம் நாளாகமம் '],
    [/^எஸ்[\.]?/, 'எஸ்ரா '],
    [/^நெகே[\.]?/, 'நெகேமியா '],
    [/^எஸ்தர்[\.]?/, 'எஸ்தர் '],
    [/^யோபு[\.]?/, 'யோபு '],
    [/^நீதி[\.]?/, 'நீதிமொழிகள் '],
    [/^பிரச[\.]?/, 'பிரசங்கி '],
    [/^உன்னத[\.]?/, 'உன்னதப்பாட்டு '],
    [/^ஏசா[\.]?/, 'ஏசாயா '],
    [/^எரே[\.]?/, 'எரேமியா '],
    [/^புலம்பல்[\.]?/, 'புலம்பல் '],
    [/^எசேக்[\.]?/, 'எசேக்கியேல் '],
    [/^தானி[\.]?/, 'தானியேல் '],
    [/^ஓசியா[\.]?/, 'ஓசியா '],
    [/^யோவேல்[\.]?/, 'யோவேல் '],
    [/^ஆமோஸ்[\.]?/, 'ஆமோஸ் '],
    [/^ஒபதியா[\.]?/, 'ஒபதியா '],
    [/^யோனா[\.]?/, 'யோனா '],
    [/^மீகா[\.]?/, 'மீகா '],
    [/^நாகும்[\.]?/, 'நாகும் '],
    [/^ஆபகூக்[\.]?/, 'ஆபகூக் '],
    [/^செப்பனியா[\.]?/, 'செப்பனியா '],
    [/^ஆகாய்[\.]?/, 'ஆகாய் '],
    [/^சகரியா[\.]?/, 'சகரியா '],
    [/^மல்கியா[\.]?/, 'மல்கியா '],
    [/^மத்[\.]?/, 'மத்தேயு '],
    [/^மாற்[\.]?/, 'மாற்கு '],
    [/^லூக்[\.]?/, 'லூக்கா '],
    [/^அப்[\.]?/, 'அப்போஸ்தலர் நடபடிகள் '],
    [/^ரோம[\.]?/, 'ரோமர் '],
    [/^எபி[\.]?/, 'எபிரெயர் '],
    [/^யாக்கோ[\.]?/, 'யாக்கோபு '],
    [/^வெளி[\.]?/, 'வெளிப்படுத்தல் ']
  ];

  for (const [regex, replacement] of bookMap) {
    if (regex.test(speech)) {
      speech = speech.replace(regex, replacement);
      break;
    }
  }

  // Format "100:1-3" or "100:1"
  speech = speech.replace(/(\d+):(\d+)-?(\d+)?/, (_match, ch, v1, v2) => {
    if (v2) return `${ch} ஆம் அதிகாரம் ${v1} முதல் ${v2} ஆம் வசனம்`;
    return `${ch} ஆம் அதிகாரம் ${v1} ஆம் வசனம்`;
  });

  return speech;
}

export class GaplessTamilAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private isPaused = false;
  private queue: { id: number; text: string; reference?: string }[] = [];
  private prefetchMap = new Map<number, AudioBuffer>();
  private currentItemIndex = 0;
  private useDirectGoogleTtsFallback = false;
  private settings: PlayerSettings = {
    voice: 'ta-IN-Wavenet-A',
    speed: 1.0,
    pitch: 1.0,
    autoScroll: true,
    continuousPlay: true,
    gaplessMode: true,
    volume: 1.0,
    useBrowserFallback: false,
  };

  private onStatusChange?: (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => void;
  private onItemStart?: (itemId: number, text: string) => void;
  private onItemEnd?: (itemId: number) => void;

  constructor() {
    // Warm up WebSpeech voices if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  private initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.settings.volume;
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public updateSettings(newSettings: Partial<PlayerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.gainNode) {
      this.gainNode.gain.value = this.settings.volume;
    }
    if (this.currentSource && this.currentSource.playbackRate) {
      this.currentSource.playbackRate.value = this.settings.speed;
    }
    if (this.htmlAudio) {
      this.htmlAudio.playbackRate = this.settings.speed;
      this.htmlAudio.volume = this.settings.volume;
    }
  }

  public setCallbacks(callbacks: {
    onStatusChange?: (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => void;
    onItemStart?: (itemId: number, text: string) => void;
    onItemEnd?: (itemId: number) => void;
  }) {
    this.onStatusChange = callbacks.onStatusChange;
    this.onItemStart = callbacks.onItemStart;
    this.onItemEnd = callbacks.onItemEnd;
  }

  public async playSingleText(itemId: number, rawText: string, ref?: string): Promise<void> {
    this.stop();
    this.initAudioContext();
    this.isPlaying = true;
    this.isPaused = false;
    this.onStatusChange?.('loading', `ஸ்தோத்திரம் #${itemId} ஒலி தயாரிப்பு...`);

    const formattedSpeech = this.formatFullSpeechText(itemId, rawText, ref);

    try {
      if (this.settings.useBrowserFallback) {
        await this.speakWithWebSpeech(itemId, formattedSpeech);
      } else {
        const buffer = await this.synthesizeAndDecode(formattedSpeech);
        if (buffer) {
          await this.playAudioBuffer(itemId, rawText, buffer);
        } else {
          await this.playViaHtmlAudio(itemId, rawText, formattedSpeech);
        }
      }
    } catch (err) {
      console.warn('Backend TTS failed, trying HTML5 Audio fallback:', err);
      try {
        await this.playViaHtmlAudio(itemId, rawText, formattedSpeech);
      } catch {
        await this.speakWithWebSpeech(itemId, formattedSpeech);
      }
    }
  }

  public async playQueue(items: { id: number; text: string; reference?: string }[], startIndex = 0): Promise<void> {
    this.stop();
    this.initAudioContext();
    this.queue = items;
    this.currentItemIndex = startIndex;
    this.isPlaying = true;
    this.isPaused = false;

    await this.processNextInQueue();
  }

  private formatFullSpeechText(id: number, text: string, ref?: string): string {
    // Clean up text
    let cleanText = text.replace(/^\d+\.\s*/, '').trim();
    // Extract verse if not explicitly passed
    let referenceText = ref || '';

    if (!referenceText) {
      const match = cleanText.match(/(📖|வசனம்|வேத குறிப்பு)?:?\s*([\u0B80-\u0BFF\.]+\s*\d+:\d+-?\d*)/);
      if (match) {
        referenceText = match[2];
        cleanText = cleanText.replace(match[0], '').trim();
      }
    }

    const spokenRef = formatTamilReferenceForSpeech(referenceText);

    // Format with explicit Tamil pauses using commas & full stops
    // e.g. "துதி 1. அன்புள்ள தகப்பனே உமக்கு நன்றி. வேத வசன குறிப்பு: சங்கீதம் 100 ஆம் அதிகாரம் 1 ஆம் வசனம்."
    return `துதி ${id}. ${cleanText}. ${spokenRef ? `${spokenRef}.` : ''}`;
  }

  private async processNextInQueue(): Promise<void> {
    if (!this.isPlaying || this.currentItemIndex >= this.queue.length) {
      this.isPlaying = false;
      this.onStatusChange?.('idle', 'வாசிப்பு நிறைவுற்றது');
      return;
    }

    const current = this.queue[this.currentItemIndex];
    const fullSpeech = this.formatFullSpeechText(current.id, current.text, current.reference);

    this.onStatusChange?.('loading', `தயாராகிறது (${this.currentItemIndex + 1}/${this.queue.length}): #${current.id}...`);

    this.prefetchAhead(this.currentItemIndex + 1);

    try {
      let buffer = this.prefetchMap.get(current.id);
      if (!buffer && !this.settings.useBrowserFallback) {
        buffer = await this.synthesizeAndDecode(fullSpeech);
      }

      if (buffer) {
        await this.playAudioBuffer(current.id, current.text, buffer);
      } else if (!this.settings.useBrowserFallback) {
        await this.playViaHtmlAudio(current.id, current.text, fullSpeech);
      } else {
        await this.speakWithWebSpeech(current.id, fullSpeech);
      }

      // Add 400ms natural pause between queue items
      if (this.isPlaying) {
        await new Promise(r => setTimeout(r, 400));
      }

      if (this.isPlaying && this.settings.continuousPlay) {
        this.currentItemIndex++;
        await this.processNextInQueue();
      }
    } catch (err) {
      console.warn('Queue playback item failed, fallback to WebSpeech', err);
      await this.speakWithWebSpeech(current.id, fullSpeech);
      if (this.isPlaying && this.settings.continuousPlay) {
        this.currentItemIndex++;
        await this.processNextInQueue();
      }
    }
  }

  private async prefetchAhead(nextIndex: number) {
    if (this.settings.useBrowserFallback) return;
    for (let i = nextIndex; i < Math.min(nextIndex + 2, this.queue.length); i++) {
      const item = this.queue[i];
      if (item && !this.prefetchMap.has(item.id)) {
        const fullSpeech = this.formatFullSpeechText(item.id, item.text, item.reference);
        this.synthesizeAndDecode(fullSpeech).then(buf => {
          if (buf) this.prefetchMap.set(item.id, buf);
        }).catch(() => {});
      }
    }
  }

  private async synthesizeAndDecode(text: string): Promise<AudioBuffer | null> {
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: this.settings.voice,
          speed: this.settings.speed
        })
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 500) {
          this.useDirectGoogleTtsFallback = true;
        }
        return null;
      }

      const data = await res.json();
      if (!data.audioContent) return null;

      const ctx = this.initAudioContext();
      const binaryStr = atob(data.audioContent);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      return await ctx.decodeAudioData(bytes.buffer);
    } catch (err) {
      console.warn('Synthesize decode error (using direct fallback):', err);
      this.useDirectGoogleTtsFallback = true;
      return null;
    }
  }

  private playViaHtmlAudio(itemId: number, originalText: string, speechText: string): Promise<void> {
    const isStaticDeploy = typeof window !== 'undefined' && 
      (window.location.hostname.endsWith('github.io') || 
       window.location.hostname.includes('github.preview') || 
       window.location.hostname.includes('github.dev'));

    if (this.useDirectGoogleTtsFallback || isStaticDeploy) {
      return this.playDirectGoogleTtsChunks(itemId, originalText, speechText);
    }

    return new Promise((resolve, reject) => {
      this.stopCurrentMedia();
      const audioUrl = `/api/tts?q=${encodeURIComponent(speechText)}`;
      const audio = new Audio(audioUrl);
      this.htmlAudio = audio;

      audio.playbackRate = this.settings.speed;
      audio.volume = this.settings.volume;

      this.onItemStart?.(itemId, originalText);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);

      audio.onended = () => {
        this.onItemEnd?.(itemId);
        this.htmlAudio = null;
        resolve();
      };

      audio.onerror = (_e) => {
        this.htmlAudio = null;
        console.warn('Backend TTS /api/tts failed, switching to direct Google TTS fallback.');
        this.useDirectGoogleTtsFallback = true;
        this.playDirectGoogleTtsChunks(itemId, originalText, speechText).then(resolve).catch(reject);
      };

      audio.play().catch(err => {
        this.htmlAudio = null;
        console.warn('Backend play failed, switching to direct Google TTS fallback:', err);
        this.useDirectGoogleTtsFallback = true;
        this.playDirectGoogleTtsChunks(itemId, originalText, speechText).then(resolve).catch(reject);
      });
    });
  }

  private async playDirectGoogleTtsChunks(itemId: number, originalText: string, speechText: string): Promise<void> {
    const chunks = speechText.match(/[^.!?\n,;:]+[.!?\n,;:]?/g) || [speechText];
    const cleanChunks = chunks.map(c => c.trim()).filter(c => c.length > 0);

    this.onItemStart?.(itemId, originalText);
    this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);

    for (let i = 0; i < cleanChunks.length; i++) {
      if (!this.isPlaying || this.isPaused) break;

      const chunk = cleanChunks[i];
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(chunk.slice(0, 180))}`;
      
      await new Promise<void>((resolve, reject) => {
        this.stopCurrentMedia();
        const audio = new Audio(audioUrl);
        this.htmlAudio = audio;
        audio.playbackRate = this.settings.speed;
        audio.volume = this.settings.volume;

        audio.onended = () => {
          this.htmlAudio = null;
          resolve();
        };

        audio.onerror = (e) => {
          this.htmlAudio = null;
          reject(e);
        };

        audio.play().catch(err => {
          this.htmlAudio = null;
          reject(err);
        });
      });
    }

    this.onItemEnd?.(itemId);
  }

  private playAudioBuffer(itemId: number, text: string, buffer: AudioBuffer): Promise<void> {
    return new Promise((resolve) => {
      this.stopCurrentMedia();
      const ctx = this.initAudioContext();
      this.currentSource = ctx.createBufferSource();
      this.currentSource.buffer = buffer;
      this.currentSource.playbackRate.value = this.settings.speed;

      // Real-time pitch-shifting detune based on the user's selected voice!
      if (this.currentSource.detune) {
        if (this.settings.voice === 'ta-IN-Wavenet-B') {
          this.currentSource.detune.value = -500; // Deeper male voice
        } else if (this.settings.voice === 'ta-IN-Neural2-A') {
          this.currentSource.detune.value = 150;  // Brighter, sweeter neural voice
        } else if (this.settings.voice === 'ta-IN-Standard-A') {
          this.currentSource.detune.value = -150; // Deeper standard voice
        } else {
          this.currentSource.detune.value = 50;   // Default clean female voice
        }
      }

      this.currentSource.connect(this.gainNode!);
      this.onItemStart?.(itemId, text);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);

      this.currentSource.onended = () => {
        this.onItemEnd?.(itemId);
        resolve();
      };

      this.currentSource.start();
    });
  }

  private speakWithWebSpeech(itemId: number, text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        this.onStatusChange?.('error', 'உலாவியில் Speech Synthesis வசதி இல்லை.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ta-IN';
      utterance.rate = this.settings.speed;
      utterance.volume = this.settings.volume;

      // Select voice and pitch based on settings dynamically
      const voices = window.speechSynthesis.getVoices();
      const tamilVoices = voices.filter(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
      
      let selectedVoice = null;
      if (this.settings.voice.includes('Wavenet-B') || this.settings.voice.includes('male')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ஆண்') || v.name.toLowerCase().includes('rishi'));
        utterance.pitch = 0.75; // Low pitch for male voice
      } else if (this.settings.voice.includes('Neural2-A')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('lekha'));
        utterance.pitch = 1.2;  // High/sweet pitch for neural voice
      } else if (this.settings.voice.includes('Standard-A')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('standard') || v.name.toLowerCase().includes('hema'));
        utterance.pitch = 0.9;  // Slightly lower standard pitch
      } else {
        selectedVoice = tamilVoices.find(v => !v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('ஆண்'));
        utterance.pitch = 1.05; // Standard female pitch
      }

      if (!selectedVoice && tamilVoices.length > 0) {
        selectedVoice = tamilVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        // Fallback to standard pitch config
        utterance.pitch = this.settings.voice.includes('Wavenet-B') ? 0.75 : 1.05;
      }

      this.onItemStart?.(itemId, text);
      this.onStatusChange?.('playing', `உலாவி குரல்: #${itemId}`);

      utterance.onend = () => {
        this.onItemEnd?.(itemId);
        resolve();
      };

      utterance.onerror = () => {
        this.onItemEnd?.(itemId);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public pause(): void {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
      this.isPaused = true;
      this.onStatusChange?.('paused', 'நிறுத்தப்பட்டது');
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.isPaused = true;
      this.onStatusChange?.('paused', 'நிறுத்தப்பட்டது');
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.onStatusChange?.('paused', 'நிறுத்தப்பட்டது');
    }
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
      this.isPaused = false;
      this.onStatusChange?.('playing', 'தொடர்கிறது...');
    }
    if (this.htmlAudio && this.htmlAudio.paused) {
      this.htmlAudio.play();
      this.isPaused = false;
      this.onStatusChange?.('playing', 'தொடர்கிறது...');
    }
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.onStatusChange?.('playing', 'தொடர்கிறது...');
    }
  }

  private stopCurrentMedia(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch {}
      this.htmlAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.stopCurrentMedia();
    this.onStatusChange?.('idle', 'தயாராக உள்ளது');
  }

  public next(): void {
    if (this.queue.length > 0 && this.currentItemIndex < this.queue.length - 1) {
      this.stopCurrentMedia();
      this.currentItemIndex++;
      this.processNextInQueue();
    }
  }

  public prev(): void {
    if (this.queue.length > 0 && this.currentItemIndex > 0) {
      this.stopCurrentMedia();
      this.currentItemIndex--;
      this.processNextInQueue();
    }
  }

  public getStatus(): { isPlaying: boolean; isPaused: boolean; currentItemIndex: number; totalQueueLength: number } {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentItemIndex: this.currentItemIndex,
      totalQueueLength: this.queue.length
    };
  }
}

export const globalAudioEngine = new GaplessTamilAudioEngine();
