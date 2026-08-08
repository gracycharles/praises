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

  private initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.settings.volume;
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    // Silent oscillator to guarantee iOS Web Audio context is fully unblocked
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      gain.gain.value = 0.001;
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(0);
      osc.stop(0.01);
    } catch {}
    return this.audioCtx;
  }

  public unlock(): void {
    try {
      // 1. Warm up and unlock Web Audio AudioContext
      this.initAudioContext();
    } catch (err) {
      console.warn('AudioContext unlock failed:', err);
    }

    try {
      // 2. Warm up and unlock HTML5 Audio
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
          console.log('HTML5 Audio unlock started (harmless on desktops):', err);
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
    // e.g. "நன்றி பலி 1. அன்புள்ள தகப்பனே உமக்கு நன்றி. வேத வசன குறிப்பு: சங்கீதம் 100 ஆம் அதிகாரம் 1 ஆம் வசனம்."
    const fullText = `நன்றி பலி ${id}. ${cleanText}. ${spokenRef ? `${spokenRef}.` : ''}`;
    return this.applyPhoneticCorrections(fullText);
  }

  private applyPhoneticCorrections(text: string): string {
    if (!text) return '';
    let result = text;
    // 1. "இயே" -> "யே" (e.g. "இயேசு" -> "யேசு", "இயேசுவே" -> "யேசுவே", "இயேசுவின்" -> "யேசுவின்")
    result = result.replace(/இயே/g, 'யே');

    // 2. "இரா" -> "ரா" (e.g. "இராஜா" -> "ராஜா", "இராச்சியம்" -> "ராச்சியம்", "இராகம்" -> "ராகம்")
    result = result.replace(/இரா/g, 'ரா');

    // 3. "இரட்ச" -> "ரட்ச" (e.g. "இரட்சகர்" -> "ரட்சகர்", "இரட்சிப்பு" -> "ரட்சிப்பு", "இரட்சண்ய" -> "ரட்சண்ய", "இரட்சிக்க" -> "ரட்சிக்க", "இரட்சிப்பை" -> "ரட்சிப்பை")
    result = result.replace(/இரட்ச/g, 'ரட்ச');

    // 4. "இலட்ச" -> "லட்ச" (e.g. "இலட்சம்" -> "லட்சம்", "இலட்சங்கள்" -> "லட்சங்கள்")
    result = result.replace(/இலட்ச/g, 'லட்ச');

    // 5. "இலா" -> "லா" (e.g. "இலாபம்" -> "லாபம்")
    result = result.replace(/இலா/g, 'லா');

    // 6. "இரக்க" -> "ரக்க" (e.g. "இரக்கம்" -> "ரக்கம்", "இரக்கங்கள்" -> "ரக்கங்கள்", "இரக்கமுள்ளவர்" -> "ரக்கமுள்ளவர்", "இரக்கத்தாலும்" -> "ரக்கத்தாலும்")
    result = result.replace(/இரக்க/g, 'ரக்க');

    // 7. "இரங்கு" -> "ரங்கு" (e.g. "இரங்குகிறார்" -> "ரங்குகிறார்", "இரங்குவீர்" -> "ரங்குவீர்")
    result = result.replace(/இரங்கு/g, 'ரங்கு');

    // 8. "இரண்டு" -> "ரண்டு" / "இரண்டா" -> "ரண்டா" (e.g. "இரண்டு" -> "ரண்டு", "இரண்டாவது" -> "ரண்டாவது")
    result = result.replace(/இரண்டு/g, 'ரண்டு');
    result = result.replace(/இரண்டா/g, 'ரண்டா');

    // 9. "இரட்டி" -> "ரட்டி" / "இரட்ட" -> "ரட்ட" (e.g. "இரட்டிப்பான" -> "ரட்டிப்பான", "இரட்டத்தனையாக" -> "ரட்டத்தனையாக")
    result = result.replace(/இரட்டி/g, 'ரட்டி');
    result = result.replace(/இரட்ட/g, 'ரட்ட');

    // 10. "இரத்த" -> "ரத்த" (e.g. "இரத்தம்" -> "ரத்தம்", "இரttத்தாலே" -> "ரத்தத்தாலே")
    result = result.replace(/இரttத்தாலே/g, 'ரத்தத்தாலே');
    result = result.replace(/இரத்த/g, 'ரத்த');

    // 11. "இரகசி" -> "ரகசி" (e.g. "இரகசியத்தை" -> "ரகசியத்தை")
    result = result.replace(/இரகசி/g, 'ரகசி');

    // 12. "இரதம" -> "ரதம" (e.g. "இரதமாக்கி" -> "இரதமாக்கி")
    result = result.replace(/இரதம/g, 'ரதம');

    // 13. "உரோம" -> "ரோம" (e.g. "உரோமர்" -> "ரோமர்", "உரோமர்கள்" -> "ரோமர்கள்")
    result = result.replace(/உரோம/g, 'ரோம');

    // 14. "உলোகம்" -> "லோகம்" (e.g. "உலோகங்கள்" -> "லோகங்கள்")
    result = result.replace(/உলোகம்/g, 'லோகம்');

    // 15. "எருச" -> "யெருச" (e.g. "எருசலேம்" -> "யெருசலேம்", "எருசலேமின்" -> "யெருசலேமின்")
    result = result.replace(/எருச/g, 'யெருச');

    // 16. "ஐசுவரிய" -> "ஐஸ்வரிய" (e.g. "ஐசுவரியம்" -> "ஐஸ்வரியம்", "ஐசுவரியவானாக" -> "ஐஸ்வரியவானாக")
    result = result.replace(/ஐசுவரிய/g, 'ஐஸ்வரிய');

    // 17. "ஒமெகா" -> "ஒமேகா" (e.g. "ஒமெகாவுமானவரே" -> "ஒமேகாவுமானவரே")
    result = result.replace(/ஒமெகா/g, 'ஒமேகா');

    return result;
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
      
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio();
        this.htmlAudio.setAttribute('playsinline', 'true');
        this.htmlAudio.setAttribute('webkit-playsinline', 'true');
      }
      const audio = this.htmlAudio;
      audio.onended = null;
      audio.onerror = null;

      audio.src = audioUrl;
      audio.playbackRate = this.settings.speed;
      audio.volume = this.settings.volume;

      this.onItemStart?.(itemId, originalText);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);

      audio.onended = () => {
        this.onItemEnd?.(itemId);
        resolve();
      };

      audio.onerror = (_e) => {
        console.warn('Backend TTS /api/tts failed, switching to direct Google TTS fallback.');
        this.useDirectGoogleTtsFallback = true;
        this.playDirectGoogleTtsChunks(itemId, originalText, speechText).then(resolve).catch(reject);
      };

      audio.play().catch(err => {
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
        if (!this.htmlAudio) {
          this.htmlAudio = new Audio();
          this.htmlAudio.setAttribute('playsinline', 'true');
          this.htmlAudio.setAttribute('webkit-playsinline', 'true');
        }
        const audio = this.htmlAudio;
        audio.onended = null;
        audio.onerror = null;

        audio.src = audioUrl;
        audio.playbackRate = this.settings.speed;
        audio.volume = this.settings.volume;

        audio.onended = () => {
          resolve();
        };

        audio.onerror = (e) => {
          reject(e);
        };

        audio.play().catch(err => {
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
        // Keep htmlAudio reference intact for iOS user gesture reuse, just clear callbacks & src if needed
        this.htmlAudio.onended = null;
        this.htmlAudio.onerror = null;
      } catch {}
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
