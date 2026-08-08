// Web Audio API Synth for soft ambient background sound during prayer/audiobook

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private type: 'off' | 'harp' | 'drone' | 'waves' = 'off';
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private intervalId: any = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundType(type: 'off' | 'harp' | 'drone' | 'waves') {
    this.type = type;
    if (type === 'off') {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    this.initCtx();
    if (!this.ctx) return;
    this.stop();

    this.isPlaying = true;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.08; // Soft background level
    this.gainNode.connect(this.ctx.destination);

    if (this.type === 'drone') {
      // Warm C-Major 432Hz ambient chord
      const freqs = [130.81, 164.81, 196.00, 261.63, 329.63];
      freqs.forEach(f => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        oscGain.gain.value = 0.03;
        osc.connect(oscGain);
        oscGain.connect(this.gainNode);
        osc.start();
        this.oscillators.push(osc);
      });
    } else if (this.type === 'harp') {
      // Arpeggiated soft devotional harp tones
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        const note = scale[Math.floor(Math.random() * scale.length)];
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.6);
      }, 1200);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.oscillators = [];
  }
}

export const ambientSound = new AmbientSoundEngine();
