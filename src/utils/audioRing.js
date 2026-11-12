// Web Audio API 10-Second Ringtone Synthesizer for Barber Station
class AudioRingtoneManager {
  constructor() {
    this.audioCtx = null;
    this.activeNodes = [];
    this.cycleInterval = null;
    this.tickInterval = null;
    this.stopTimeout = null;
    this.isRinging = false;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  playRingBurst(duration = 1.3) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);

      // Smooth attack and decay envelope
      masterGain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      masterGain.gain.setValueAtTime(0.25, now + duration - 0.15);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // Tremolo LFO for realistic telephone bell flutter
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(14, now); // 14 Hz ring flutter
      lfoGain.gain.setValueAtTime(0.08, now);
      lfo.connect(lfoGain.gain);

      // Harmonious twin bell frequencies: 659.25Hz (E5) and 880Hz (A5)
      const freqs = [659.25, 880.0];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + duration);
        this.activeNodes.push(osc);
      });

      // Cleanup nodes after burst
      setTimeout(() => {
        this.activeNodes = this.activeNodes.filter((n) => n !== null);
      }, duration * 1000 + 100);
    } catch (e) {
      console.warn("AudioRingtoneManager play burst error:", e);
    }
  }

  start10SecondRing({ onTick, onEnd } = {}) {
    // If already ringing, stop previous first
    this.stop();

    this.isRinging = true;
    this.getAudioContext();

    // Trigger phone vibration if available on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([400, 200, 400, 200, 400]);
      } catch (e) {}
    }

    // Play initial burst immediately
    this.playRingBurst(1.3);

    // Repeat every 1.85 seconds (total ~5 cycles in 10s)
    this.cycleInterval = setInterval(() => {
      if (!this.isRinging) return;
      this.playRingBurst(1.3);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([300, 150, 300]);
        } catch (e) {}
      }
    }, 1850);

    // 1-second countdown ticks (10 -> 0)
    let secondsLeft = 10;
    if (onTick) onTick(secondsLeft);

    this.tickInterval = setInterval(() => {
      secondsLeft -= 1;
      if (onTick) onTick(Math.max(0, secondsLeft));
      if (secondsLeft <= 0) {
        clearInterval(this.tickInterval);
        this.tickInterval = null;
      }
    }, 1000);

    // Hard stop after exactly 10 seconds
    this.stopTimeout = setTimeout(() => {
      this.stop();
      if (onEnd) onEnd();
    }, 10000);
  }

  stop() {
    this.isRinging = false;

    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
    }
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    // Stop and disconnect any playing oscillators
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    // Cancel vibration
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  }
}

export const ringtoneManager = new AudioRingtoneManager();
