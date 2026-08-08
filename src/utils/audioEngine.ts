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
  private htmlAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isPaused = false;
  private queue: { id: number; text: string; reference?: string }[] = [];
  private currentItemIndex = 0;
  private useDirectGoogleTts = false;
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  private getOrCreateHtmlAudio(): HTMLAudioElement {
    if (!this.htmlAudio && typeof window !== 'undefined') {
      this.htmlAudio = new Audio();
      this.htmlAudio.setAttribute('playsinline', 'true');
      this.htmlAudio.setAttribute('webkit-playsinline', 'true');
    }
    return this.htmlAudio!;
  }

  public unlock(): void {
    try {
      const audio = this.getOrCreateHtmlAudio();
      if (audio.paused && (!audio.src || audio.src === '')) {
        // Silent WAV data URI to unlock audio on iOS user gesture
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        audio.play().then(() => {
          console.log('HTML5 Audio successfully unlocked on iOS');
        }).catch(err => {
          console.log('HTML5 Audio unlock attempt:', err);
        });
      }
    } catch (err) {
      console.warn('HTMLAudio unlock error:', err);
    }
  }

  public updateSettings(newSettings: Partial<PlayerSettings>) {
    this.settings = { ...this.settings, ...newSettings };
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
        title: `நன்றி பலி #${itemId}`,
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

  public formatFullSpeechText(id: number, text: string, ref?: string): string {
    let cleanText = text.replace(/^\d+\.\s*/, '').trim();
    let referenceText = ref || '';

    if (!referenceText) {
      const match = cleanText.match(/(📖|வசனம்|வேத குறிப்பு)?:?\s*([\u0B80-\u0BFF\.]+\s*\d+:\d+-?\d*)/);
      if (match) {
        referenceText = match[2];
        cleanText = cleanText.replace(match[0], '').trim();
      }
    }

    const spokenRef = formatTamilReferenceForSpeech(referenceText);
    const fullText = `நன்றி பலி ${id}. ${cleanText}. ${spokenRef ? `${spokenRef}.` : ''}`;
    return this.applyPhoneticCorrections(fullText);
  }

  private applyPhoneticCorrections(text: string): string {
    if (!text) return '';
    let result = text;
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

  public playSingleText(itemId: number, rawText: string, ref?: string): void {
    const singleQueue = [{ id: itemId, text: rawText, reference: ref }];
    this.playQueue(singleQueue, 0);
  }

  public playQueue(items: { id: number; text: string; reference?: string }[], startIndex = 0): void {
    this.stop();
    this.unlock();
    this.queue = items;
    this.currentItemIndex = startIndex;
    this.isPlaying = true;
    this.isPaused = false;

    this.playCurrentQueueItem();
  }

  private playCurrentQueueItem(): void {
    if (!this.isPlaying || this.currentItemIndex >= this.queue.length) {
      this.isPlaying = false;
      this.onStatusChange?.('idle', 'வாசிப்பு நிறைவுற்றது');
      return;
    }

    const current = this.queue[this.currentItemIndex];
    const speechText = this.formatFullSpeechText(current.id, current.text, current.reference);

    if (this.settings.useBrowserFallback) {
      this.speakWithWebSpeech(current.id, speechText);
      return;
    }

    // Detect if we are hosted on a static server like GitHub Pages where /api/tts is not available
    const isStaticDeploy = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('github.preview') ||
      window.location.hostname.includes('github.dev') ||
      window.location.protocol === 'file:'
    );

    const useDirect = this.useDirectGoogleTts || isStaticDeploy;

    let chunks: string[] = [];
    if (useDirect) {
      if (speechText.length <= 180) {
        chunks = [speechText];
      } else {
        const rawChunks = speechText.match(/[^.!?\n,;:]+[.!?\n,;:]?/g) || [speechText];
        let currentBlock = '';
        for (const c of rawChunks) {
          if ((currentBlock + c).length <= 180) {
            currentBlock += c;
          } else {
            if (currentBlock.trim()) chunks.push(currentBlock.trim());
            currentBlock = c;
          }
        }
        if (currentBlock.trim()) chunks.push(currentBlock.trim());
      }
    } else {
      chunks = [speechText];
    }

    this.playChunksForQueueItem(current.id, current.text, chunks, 0, useDirect);
  }

  private playChunksForQueueItem(
    itemId: number,
    originalText: string,
    chunks: string[],
    chunkIndex: number,
    isDirect: boolean
  ): void {
    if (!this.isPlaying || this.isPaused) return;

    if (chunkIndex >= chunks.length) {
      // Finished all chunks for this verse
      this.onItemEnd?.(itemId);
      this.currentItemIndex++;

      if (this.settings.continuousPlay && this.currentItemIndex < this.queue.length) {
        // Synchronous continuation keeps iOS Safari media privilege alive
        this.playCurrentQueueItem();
      } else {
        this.isPlaying = false;
        this.onStatusChange?.('idle', 'தயாராக உள்ளது');
      }
      return;
    }

    const chunkText = chunks[chunkIndex];
    let audioUrl = '';

    if (isDirect) {
      audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(chunkText)}`;
    } else {
      audioUrl = `/api/tts?q=${encodeURIComponent(chunkText)}`;
    }

    const audio = this.getOrCreateHtmlAudio();
    audio.onended = null;
    audio.onerror = null;

    if (chunkIndex === 0) {
      this.onItemStart?.(itemId, originalText);
      this.onStatusChange?.('playing', `வாசிக்கிறது: #${itemId}`);
      this.setupMediaSession(itemId, originalText);
    }

    audio.onended = () => {
      if (!this.isPlaying || this.isPaused) return;
      this.playChunksForQueueItem(itemId, originalText, chunks, chunkIndex + 1, isDirect);
    };

    audio.onerror = (err) => {
      console.warn(`Audio play error on verse #${itemId} (chunk ${chunkIndex}, direct=${isDirect}):`, err);

      if (!isDirect) {
        // On static hosting (e.g. GitHub Pages), /api/tts fails with 404.
        // Switch to direct Google TTS URL and retry this item!
        this.useDirectGoogleTts = true;
        console.log('Backend /api/tts unavailable. Switched to Direct Google TTS for static deploy.');
        this.playCurrentQueueItem();
        return;
      }

      // If direct Google TTS failed, fallback to Web Speech API
      this.speakWithWebSpeech(itemId, chunks.join(' '));
    };

    audio.src = audioUrl;
    audio.playbackRate = this.settings.speed;
    audio.volume = this.settings.volume;

    audio.play().catch(err => {
      console.warn('HTML5 Audio play rejected on iOS:', err);
      if (!isDirect) {
        this.useDirectGoogleTts = true;
        this.playCurrentQueueItem();
      } else {
        this.speakWithWebSpeech(itemId, chunks.join(' '));
      }
    });
  }

  private speakWithWebSpeech(itemId: number, text: string): void {
    if (!('speechSynthesis' in window)) {
      this.onStatusChange?.('error', 'உலாவியில் Speech Synthesis வசதி இல்லை.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = this.settings.speed;
    utterance.volume = this.settings.volume;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoices = voices.filter(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
    
    if (tamilVoices.length > 0) {
      utterance.voice = tamilVoices[0];
    }

    utterance.onend = () => {
      if (!this.isPlaying || this.isPaused) return;
      this.onItemEnd?.(itemId);

      this.currentItemIndex++;
      if (this.settings.continuousPlay && this.currentItemIndex < this.queue.length) {
        this.playCurrentQueueItem();
      } else {
        this.isPlaying = false;
        this.onStatusChange?.('idle', 'தயாராக உள்ளது');
      }
    };

    utterance.onerror = () => {
      if (!this.isPlaying || this.isPaused) return;
      this.onItemEnd?.(itemId);
      this.currentItemIndex++;
      if (this.settings.continuousPlay && this.currentItemIndex < this.queue.length) {
        this.playCurrentQueueItem();
      }
    };

    this.onItemStart?.(itemId, text);
    this.onStatusChange?.('playing', `உலாவி குரல்: #${itemId}`);
    this.setupMediaSession(itemId, text);

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    this.onStatusChange?.('paused', 'நிறுத்தப்பட்டது');
  }

  public resume(): void {
    this.isPaused = false;
    if (this.htmlAudio && this.htmlAudio.paused) {
      this.htmlAudio.play().catch(console.warn);
    }
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    this.onStatusChange?.('playing', 'தொடர்கிறது...');
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.onended = null;
      this.htmlAudio.onerror = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.onStatusChange?.('idle', 'தயாராக உள்ளது');
  }

  public next(): void {
    if (this.queue.length > 0 && this.currentItemIndex < this.queue.length - 1) {
      this.currentItemIndex++;
      this.playCurrentQueueItem();
    }
  }

  public prev(): void {
    if (this.queue.length > 0 && this.currentItemIndex > 0) {
      this.currentItemIndex--;
      this.playCurrentQueueItem();
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
