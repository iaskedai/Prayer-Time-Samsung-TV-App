/**
 * High-performance Web Audio API synthesizer for prayer time alerts.
 * Generates an ethereal, calming harmonic chime chord with soft decay.
 * Zero external audio network dependencies.
 */
class ChimeService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a tranquil, warm 3-note harmonic chime chord (F4, A4, C5, E5) with soft bell harmonics.
   */
  public playGentleChime(volume: number = 0.5): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for a calming celestial chime: F4, A4, C5, E5
    const frequencies = [349.23, 440.0, 523.25, 659.25];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with slight triangle overtone for organic warmth
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Attack and exponential decay envelope
      const noteStart = now + idx * 0.08;
      const noteEnd = noteStart + 3.2;

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.25 * volume, noteStart + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }
}

export const chimeService = new ChimeService();
