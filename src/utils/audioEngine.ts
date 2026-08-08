import { PlayerSettings } from '../types';

export function formatTamilReferenceForSpeech(ref: string): string {
  if (!ref) return '';
  
  // Split by / or ; or , if they represent multiple references
  const parts = ref.split(/\s*[\/;]\s*/);
  const formattedParts = parts.map(part => {
    let speech = part.trim();
    if (!speech) return '';

    const bookMap: [RegExp, string][] = [
      // New Testament
      [/^கொலோ(செயர்)?[\.]?/, 'கொலோசெயர் '],
      [/^கலா(த்தியர்|த்)?[\.]?/, 'கலாத்தியர் '],
      [/^எபே(சியர்|சி)?[\.]?/, 'எபேசியர் '],
      [/^பிலி(ப்பியர்|ப்)?[\.]?/, 'பிலிப்பியர் '],
      [/^1\s*கொரி(ந்தியர்)?[\.]?/, 'முதலாம் கொரிந்தியர் '],
      [/^2\s*கொரி(ந்தியர்)?[\.]?/, 'இரண்டாம் கொரிந்தியர் '],
      [/^1\s*தெச(லோனிக்கேயர்)?[\.]?/, 'முதலாம் தெசலோனிக்கேயர் '],
      [/^2\s*தெச(லோனிக்கேயர்)?[\.]?/, 'இரண்டாம் தெசலோனிக்கேயர் '],
      [/^1\s*தீமோ(த்தேயு)?[\.]?/, 'முதலாம் தீமோத்தேயு '],
      [/^2\s*தீமோ(த்தேயு)?[\.]?/, 'இரண்டாம் தீமோத்தேயு '],
      [/^தீத்து[\.]?/, 'தீத்து '],
      [/^பிலேயோன்[\.]?/, 'பிலேயோன் '],
      [/^1\s*பேது(ரு)?[\.]?/, 'முதலாம் பேதுரு '],
      [/^2\s*பேது(ரு)?[\.]?/, 'இரண்டாம் பேதுரு '],
      [/^1\s*யோவா(ன்)?[\.]?/, 'முதலாம் யோவான் '],
      [/^2\s*யோவா(ன்)?[\.]?/, 'இரண்டாம் யோவான் '],
      [/^3\s*யோவா(ன்)?[\.]?/, 'மூன்றாம் யோவான் '],
      [/^யோவா(ன்)?[\.]?/, 'யோவான் '],
      [/^ரோம(ர்)?[\.]?/, 'ரோமர் '],
      [/^எபி(ரெயர்|ரெ)?[\.]?/, 'எபிரெயர் '],
      [/^யாக்(கோபு)?[\.]?/, 'யாக்கோபு '],
      [/^யூதா[\.]?/, 'யூதா '],
      [/^வெளி(ப்படுத்தல்)?[\.]?/, 'வெளிப்படுத்தல் '],
      [/^அப்(போஸ்தலர்)?[\.]?/, 'அப்போஸ்தலர் நடபடிகள் '],
      [/^மத்(தேயு)?[\.]?/, 'மத்தேயு '],
      [/^மாற்(கு)?[\.]?/, 'மாற்கு '],
      [/^லூக்(கா)?[\.]?/, 'லூக்கா '],

      // Old Testament
      [/^சங்(கீதம்)?[\.]?/, 'சங்கீதம் '],
      [/^ஆதி(யாகமம்)?[\.]?/, 'ஆதியாகமம் '],
      [/^யாத்(திராகமம்)?[\.]?/, 'யாத்திராகமம் '],
      [/^லேவி(யராகமம்)?[\.]?/, 'லேவியராகமம் '],
      [/^எண்(ணாகமம்|ணா|ணாக)?[\.]?/, 'எண்ணாகமம் '],
      [/^உபா(கமம்)?[\.]?/, 'உபாகமம் '],
      [/^யோசு(வா)?[\.]?/, 'யோசுவா '],
      [/^நியா(யா)?[\.]?/, 'நியாயாதிபதிகள் '],
      [/^ரூத்[\.]?/, 'ரூத் '],
      [/^1\s*சாமு(வேல்)?[\.]?/, 'முதலாம் சாமுவேல் '],
      [/^2\s*சாமு(வேல்)?[\.]?/, 'இரண்டாம் சாமுவேல் '],
      [/^1\s*இரா(ஜாக்கள்|ஜா)?[\.]?/, 'முதலாம் இராஜாக்கள் '],
      [/^2\s*இரா(ஜாக்கள்|ஜா)?[\.]?/, 'இரண்டாம் இராஜாக்கள் '],
      [/^1\s*நா(ளாகமம்|ளா)?[\.]?/, 'முதலாம் நாளாகமம் '],
      [/^2\s*நா(ளாகமம்|ளா)?[\.]?/, 'இரண்டாம் நாளாகமம் '],
      [/^எஸ்(ரா)?[\.]?/, 'எஸ்ரா '],
      [/^நெகே(மியா)?[\.]?/, 'நெகேமியா '],
      [/^எஸ்தர்[\.]?/, 'எஸ்தர் '],
      [/^யோபு[\.]?/, 'யோபு '],
      [/^நீதி(மொழிகள்)?[\.]?/, 'நீதிமொழிகள் '],
      [/^பிரச(ங்கி|ங்)?[\.]?/, 'பிரசங்கி '],
      [/^உன்னத(ப்பாட்டு)?[\.]?/, 'உன்னதப்பாட்டு '],
      [/^ஏசா(யா)?[\.]?/, 'ஏசாயா '],
      [/^எரே(மியா)?[\.]?/, 'எரேமியா '],
      [/^புலம்பல்[\.]?/, 'புலம்பல் '],
      [/^எசேக்(கியேல்)?[\.]?/, 'எசேக்கியேல் '],
      [/^தானி(யேல்)?[\.]?/, 'தானியேல் '],
      [/^ஓசி(யா)?[\.]?/, 'ஓசியா '],
      [/^யோவேல்[\.]?/, 'யோவேல் '],
      [/^ஆமோஸ்[\.]?/, 'ஆமோஸ் '],
      [/^ஒப(தியா)?[\.]?/, 'ஒபதியா '],
      [/^யோனா[\.]?/, 'யோனா '],
      [/^மீகா[\.]?/, 'மீகா '],
      [/^நாகு(ம்)?[\.]?/, 'நாகும் '],
      [/^ஆப(கூக்)?[\.]?/, 'ஆபகூக் '],
      [/^செப்(bபனியா|பனியா)?[\.]?/, 'செப்பனியா '],
      [/^ஆகா(ய்)?[\.]?/, 'ஆகாய் '],
      [/^சக(ரியா)?[\.]?/, 'சகரியா '],
      [/^மல்(கியா)?[\.]?/, 'மல்கியா ']
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
  });

  return formattedParts.filter(p => p.length > 0).join(' மற்றும் ');
}

export class GaplessTamilAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  private keepAliveOsc: OscillatorNode | null = null;
  private keepAliveGain: GainNode | null = null;
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

  private listeners = new Set<{
    onStatusChange?: (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => void;
    onItemStart?: (itemId: number, text: string) => void;
    onItemEnd?: (itemId: number) => void;
  }>();

  constructor() {
    // Warm up WebSpeech voices if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  private async ensureAudioContextRunning(): Promise<AudioContext> {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.settings.volume;
      this.gainNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (err) {
        console.warn('AudioContext resume error:', err);
      }
    }

    this.startKeepAlive();
    return this.audioCtx;
  }

  private startKeepAlive(): void {
    if (!this.audioCtx) return;
    if (this.keepAliveOsc) return; // Already running

    try {
      this.keepAliveOsc = this.audioCtx.createOscillator();
      this.keepAliveGain = this.audioCtx.createGain();
      // Ultra low silent gain so context stays active on iOS Safari without producing audible sound
      this.keepAliveGain.gain.value = 0.00001;
      this.keepAliveOsc.connect(this.keepAliveGain);
      this.keepAliveGain.connect(this.audioCtx.destination);
      this.keepAliveOsc.start();
    } catch (e) {
      console.warn('Keep-alive oscillator start failed:', e);
    }
  }

  private stopKeepAlive(): void {
    if (this.keepAliveOsc) {
      try {
        this.keepAliveOsc.stop();
        this.keepAliveOsc.disconnect();
      } catch {}
      this.keepAliveOsc = null;
    }
    if (this.keepAliveGain) {
      try {
        this.keepAliveGain.disconnect();
      } catch {}
      this.keepAliveGain = null;
    }
  }

  public unlock(): void {
    try {
      // 1. Warm up and unlock Web Audio AudioContext
      this.ensureAudioContextRunning();
    } catch (err) {
      console.warn('AudioContext unlock failed:', err);
    }

    try {
      // 2. Warm up and unlock HTML5 Audio for iOS
      if (!this.htmlAudio && typeof window !== 'undefined') {
        this.htmlAudio = new Audio();
        this.htmlAudio.setAttribute('playsinline', 'true');
        this.htmlAudio.setAttribute('webkit-playsinline', 'true');
      }
      if (this.htmlAudio) {
        // Play a silent audio data URL to register user interaction gesture on iOS
        this.htmlAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        this.htmlAudio.play().then(() => {
          console.log('HTML5 Audio successfully unlocked on iOS');
        }).catch(err => {
          console.log('HTML5 Audio unlock started:', err);
        });
      }
    } catch (err) {
      console.warn('HTMLAudio unlock failed:', err);
    }
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

  public subscribe(callbacks: {
    onStatusChange?: (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => void;
    onItemStart?: (itemId: number, text: string) => void;
    onItemEnd?: (itemId: number) => void;
  }) {
    this.listeners.add(callbacks);
    return () => {
      this.listeners.delete(callbacks);
    };
  }

  public setCallbacks(callbacks: {
    onStatusChange?: (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => void;
    onItemStart?: (itemId: number, text: string) => void;
    onItemEnd?: (itemId: number) => void;
  }) {
    this.listeners.add(callbacks);
  }

  private onStatusChange = (status: 'idle' | 'loading' | 'playing' | 'paused' | 'error', message?: string) => {
    this.listeners.forEach(l => l.onStatusChange?.(status, message));
  };

  private onItemStart = (itemId: number, text: string) => {
    this.listeners.forEach(l => l.onItemStart?.(itemId, text));
  };

  private onItemEnd = (itemId: number) => {
    this.listeners.forEach(l => l.onItemEnd?.(itemId));
  };

  private setupMediaSession(itemId: number, text: string) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `ஸ்தோத்திரம் #${itemId}`,
        artist: text.slice(0, 60),
        album: '1000 தமிழ் ஸ்தோத்திர துதிகள்',
      });

      navigator.mediaSession.setActionHandler('play', () => {
        this.resume();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.prev();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.next();
      });
    } catch (e) {
      console.warn('MediaSession setup failed:', e);
    }
  }

  public async playSingleText(itemId: number, rawText: string, ref?: string): Promise<void> {
    this.stop();
    await this.ensureAudioContextRunning();
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
      console.warn('TTS playback failed, trying HTML5 Audio fallback:', err);
      try {
        await this.playViaHtmlAudio(itemId, rawText, formattedSpeech);
      } catch {
        await this.speakWithWebSpeech(itemId, formattedSpeech);
      }
    }
  }

  public async playQueue(items: { id: number; text: string; reference?: string }[], startIndex = 0): Promise<void> {
    this.stop();
    await this.ensureAudioContextRunning();
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
    // e.g. "நன்றி பலி 1. அன்புள்ள தகப்பனே உமக்கு நன்றி. வேத வசன குறிப்பு: சங்கீதம் 100 ஆம் அதிகாரம் 1 ஆம் வசனம்."
    const fullText = `நன்றி பலி ${id}. ${cleanText}. ${spokenRef ? `${spokenRef}.` : ''}`;
    return this.applyPhoneticCorrections(fullText);
  }

  private applyPhoneticCorrections(text: string): string {
    if (!text) return '';
    let result = text;
    // Phonetic corrections for natural Tamil pronunciation
    result = result.replace(/இயே/g, 'யே');
    result = result.replace(/இரா/g, 'ரா');
    result = result.replace(/இரட்ச/g, 'ரட்ச');
    result = result.replace(/இலட்ச/g, 'லட்ச');
    result = result.replace(/இலா/g, 'லா');
    result = result.replace(/இரக்க/g, 'ரக்க');
    result = result.replace(/இரங்கு/g, 'ரங்கு');
    result = result.replace(/இரண்டு/g, 'ரண்டு');
    result = result.replace(/இரண்டா/g, 'ரண்டா');
    result = result.replace(/இரட்டி/g, 'ரட்டி');
    result = result.replace(/இரட்ட/g, 'ரட்ட');
    result = result.replace(/இரttத்தாலே/g, 'ரத்தத்தாலே');
    result = result.replace(/இரத்த/g, 'ரத்த');
    result = result.replace(/இரகசி/g, 'ரகசி');
    result = result.replace(/இரதம/g, 'ரதம');
    result = result.replace(/உரோம/g, 'ரோம');
    result = result.replace(/உலோகம்/g, 'லோகங்கள்');
    result = result.replace(/எருச/g, 'யெருச');
    result = result.replace(/ஐசுவரிய/g, 'ஐஸ்வரிய');
    result = result.replace(/ஒமெகா/g, 'ஒமேகா');

    return result;
  }

  private async processNextInQueue(): Promise<void> {
    if (!this.isPlaying || this.currentItemIndex >= this.queue.length) {
      this.isPlaying = false;
      this.stopKeepAlive();
      this.onStatusChange?.('idle', 'வாசிப்பு நிறைவுற்றது');
      return;
    }

    const current = this.queue[this.currentItemIndex];
    const fullSpeech = this.formatFullSpeechText(current.id, current.text, current.reference);

    this.onStatusChange?.('loading', `தயாராகிறது (${this.currentItemIndex + 1}/${this.queue.length}): #${current.id}...`);

    // Prefetch upcoming items
    this.prefetchAhead(this.currentItemIndex + 1);

    try {
      let buffer = this.prefetchMap.get(current.id);
      this.prefetchMap.delete(current.id); // Clean up used buffer

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

      // Add 300ms natural pause between queue items
      if (this.isPlaying) {
        await new Promise(r => setTimeout(r, 300));
      }

      if (this.isPlaying && this.settings.continuousPlay) {
        this.currentItemIndex++;
        await this.processNextInQueue();
      }
    } catch (err) {
      console.warn('Queue playback item failed, attempting next verse:', err);
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

      const ctx = await this.ensureAudioContextRunning();
      const binaryStr = atob(data.audioContent);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Safe decodeAudioData promise with callback fallback for older Safari
      return await new Promise<AudioBuffer>((resolve, reject) => {
        const promise = ctx.decodeAudioData(
          bytes.buffer,
          (decoded) => resolve(decoded),
          (err) => reject(err)
        );
        if (promise && typeof promise.then === 'function') {
          promise.then(resolve).catch(reject);
        }
      });
    } catch (err) {
      console.warn('Synthesize decode error:', err);
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

    return new Promise((resolve) => {
      this.stopCurrentMediaSourceOnly();
      const audioUrl = `/api/tts?q=${encodeURIComponent(speechText)}`;
      
      if (!this.htmlAudio && typeof window !== 'undefined') {
        this.htmlAudio = new Audio();
        this.htmlAudio.setAttribute('playsinline', 'true');
        this.htmlAudio.setAttribute('webkit-playsinline', 'true');
      }
      const audio = this.htmlAudio!;

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        audio.onended = null;
        audio.onerror = null;
        this.onItemEnd?.(itemId);
        resolve();
      };

      audio.src = audioUrl;
      audio.playbackRate = this.settings.speed;
      audio.volume = this.settings.volume;

      audio.onended = done;
      audio.onerror = () => {
        console.warn('Backend TTS /api/tts HTMLAudio error.');
        done();
      };

      this.onItemStart?.(itemId, originalText);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);
      this.setupMediaSession(itemId, originalText);

      audio.play().then(() => {}).catch(err => {
        console.warn('Backend HTMLAudio play rejected:', err);
        done();
      });
    });
  }

  private async playDirectGoogleTtsChunks(itemId: number, originalText: string, speechText: string): Promise<void> {
    const chunks = speechText.match(/[^.!?\n,;:]+[.!?\n,;:]?/g) || [speechText];
    const cleanChunks = chunks.map(c => c.trim()).filter(c => c.length > 0);

    this.onItemStart?.(itemId, originalText);
    this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);
    this.setupMediaSession(itemId, originalText);

    for (let i = 0; i < cleanChunks.length; i++) {
      if (!this.isPlaying || this.isPaused) break;

      const chunk = cleanChunks[i];
      const audioUrl = `/api/tts?q=${encodeURIComponent(chunk.slice(0, 180))}`;
      
      await new Promise<void>((resolve) => {
        this.stopCurrentMediaSourceOnly();
        if (!this.htmlAudio && typeof window !== 'undefined') {
          this.htmlAudio = new Audio();
          this.htmlAudio.setAttribute('playsinline', 'true');
          this.htmlAudio.setAttribute('webkit-playsinline', 'true');
        }
        const audio = this.htmlAudio!;

        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          audio.onended = null;
          audio.onerror = null;
          resolve();
        };

        audio.src = audioUrl;
        audio.playbackRate = this.settings.speed;
        audio.volume = this.settings.volume;

        audio.onended = done;
        audio.onerror = done;

        audio.play().catch(() => done());
      });
    }

    this.onItemEnd?.(itemId);
  }

  private async playAudioBuffer(itemId: number, text: string, buffer: AudioBuffer): Promise<void> {
    const ctx = await this.ensureAudioContextRunning();

    return new Promise((resolve) => {
      this.stopCurrentMediaSourceOnly();

      this.currentSource = ctx.createBufferSource();
      this.currentSource.buffer = buffer;
      this.currentSource.playbackRate.value = this.settings.speed;

      // Pitch shifting
      if (this.currentSource.detune) {
        if (this.settings.voice === 'ta-IN-Wavenet-B') {
          this.currentSource.detune.value = -500;
        } else if (this.settings.voice === 'ta-IN-Neural2-A') {
          this.currentSource.detune.value = 150;
        } else if (this.settings.voice === 'ta-IN-Standard-A') {
          this.currentSource.detune.value = -150;
        } else {
          this.currentSource.detune.value = 50;
        }
      }

      this.currentSource.connect(this.gainNode!);
      this.onItemStart?.(itemId, text);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);
      this.setupMediaSession(itemId, text);

      let finished = false;
      const handleEnded = () => {
        if (finished) return;
        finished = true;
        this.onItemEnd?.(itemId);
        resolve();
      };

      this.currentSource.onended = handleEnded;

      try {
        this.currentSource.start();
      } catch (err) {
        console.error('AudioBufferSourceNode start failed:', err);
        handleEnded();
      }
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

      const voices = window.speechSynthesis.getVoices();
      const tamilVoices = voices.filter(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
      
      let selectedVoice = null;
      if (this.settings.voice.includes('Wavenet-B') || this.settings.voice.includes('male')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ஆண்') || v.name.toLowerCase().includes('rishi'));
        utterance.pitch = 0.75;
      } else if (this.settings.voice.includes('Neural2-A')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('lekha'));
        utterance.pitch = 1.2;
      } else if (this.settings.voice.includes('Standard-A')) {
        selectedVoice = tamilVoices.find(v => v.name.toLowerCase().includes('standard') || v.name.toLowerCase().includes('hema'));
        utterance.pitch = 0.9;
      } else {
        selectedVoice = tamilVoices.find(v => !v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('ஆண்'));
        utterance.pitch = 1.05;
      }

      if (!selectedVoice && tamilVoices.length > 0) {
        selectedVoice = tamilVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.pitch = this.settings.voice.includes('Wavenet-B') ? 0.75 : 1.05;
      }

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timeoutId);
        this.onItemEnd?.(itemId);
        resolve();
      };

      // 18s safety fallback timeout so iOS WebSpeech never hangs the queue if onend is silent
      const timeoutId = setTimeout(done, 18000);

      utterance.onend = done;
      utterance.onerror = done;

      this.onItemStart?.(itemId, text);
      this.onStatusChange?.('playing', `உலாவி குரல்: #${itemId}`);
      this.setupMediaSession(itemId, text);

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

  private stopCurrentMediaSourceOnly(): void {
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
        this.htmlAudio.onended = null;
        this.htmlAudio.onerror = null;
      } catch {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private stopCurrentMedia(): void {
    this.stopCurrentMediaSourceOnly();
    this.stopKeepAlive();
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.stopCurrentMedia();
    this.onStatusChange?.('idle', 'தயாராக உள்ளது');
  }

  public next(): void {
    if (this.queue.length > 0 && this.currentItemIndex < this.queue.length - 1) {
      this.stopCurrentMediaSourceOnly();
      this.currentItemIndex++;
      this.processNextInQueue();
    }
  }

  public prev(): void {
    if (this.queue.length > 0 && this.currentItemIndex > 0) {
      this.stopCurrentMediaSourceOnly();
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
