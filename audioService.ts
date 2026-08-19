import { AUDIO_SCRIPTS } from '../constants';

class AudioService {
  private isMuted: boolean = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Official Audio Voice Announcements
  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any active utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select Portuguese Brazilian voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) =>
          v.lang.startsWith('pt') ||
          v.lang === 'pt-BR' ||
          v.name.includes('Portuguese') ||
          v.name.includes('Brasil') ||
          v.name.includes('Luciana') ||
          v.name.includes('Yelda')
      );
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Audio synthesis error:', err);
    }
  }

  public playWelcomeMessage(onEnd?: () => void) {
    this.speak(AUDIO_SCRIPTS.startRide, onEnd);
  }

  public playDestinationArrivedMessage(onEnd?: () => void) {
    this.speak(AUDIO_SCRIPTS.endRide, onEnd);
  }

  public playDriverArrivedMessage(onEnd?: () => void) {
    this.speak(AUDIO_SCRIPTS.driverArrived, onEnd);
  }

  public playWaitExpiredMessage(onEnd?: () => void) {
    this.speak(AUDIO_SCRIPTS.waitExpired, onEnd);
  }

  // Synthesized Web Audio Chimes for Alerts & Notifications
  public playChime(type: 'notification' | 'alert' | 'emergency' | 'success') {
    if (this.isMuted) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const now = ctx.currentTime;

      if (type === 'notification' || type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'alert') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.setValueAtTime(659.25, now + 0.12);

        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.start(now);
        osc1.stop(now + 0.35);
      } else if (type === 'emergency') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.setValueAtTime(600, now + 0.2);
        osc.frequency.setValueAtTime(900, now + 0.4);
        osc.frequency.setValueAtTime(600, now + 0.6);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch {
      // Audio context catch
    }
  }
}

export const audioService = new AudioService();
