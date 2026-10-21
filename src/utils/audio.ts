/**
 * Sintetizador de áudio ambiente de terror analógico usando Web Audio API nativo.
 * Sem arquivos externos pesados ou dependências de terceiros que possam falhar.
 */

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private mainGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Inicia o drone atmosférico de TV analógica e fita VHS
   */
  public startAmbientDrone() {
    try {
      this.initContext();
      if (!this.ctx || this.isRunning) return;

      this.isRunning = true;
      const now = this.ctx.currentTime;

      // Ganho principal
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, now);
      this.mainGain.connect(this.ctx.destination);

      // 1. Sub-drone grave (48Hz oscilante)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sawtooth';
      this.subOsc.frequency.setValueAtTime(46, now);

      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(80, now);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.4, now);

      this.subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(this.mainGain);
      this.subOsc.start(now);

      // 2. Ruído analógico VHS estático sutil
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        // Brown noise suave
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(600, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.mainGain);
      whiteNoise.start(now);
      this.noiseNode = whiteNoise;
    } catch {
      // Ignora silenciosamente se o navegador bloquear áudio automático
    }
  }

  /**
   * Dispara um estrondo de estática / glitch na tela (ao sofrer falha de sinal)
   */
  public playGlitchBurst() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(400, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
    } catch {
      // Ignora em caso de áudio não disponível
    }
  }

  /**
   * Bip misterioso de tecla CRT
   */
  public playKeyBeep() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      //
    }
  }

  public pauseAmbientDrone() {
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public resumeAmbientDrone() {
    if (this.mainGain && this.ctx && !this.isMuted) {
      this.mainGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(muted ? 0 : 0.15, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public stopAll() {
    try {
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
        this.subOsc = null;
      }
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
        this.droneOsc = null;
      }
      if (this.noiseNode) {
        (this.noiseNode as AudioScheduledSourceNode).stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.ctx) {
        this.ctx.close();
        this.ctx = null;
      }
      this.isRunning = false;
    } catch {
      //
    }
  }
}

export const horrorAudio = new HorrorAudioEngine();
