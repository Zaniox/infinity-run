/**
 * // SOUNDRISE : INFINITY RUN - MOTEUR AUDIO
 * Web Audio API + HTML5 Audio Streaming + Analyseur FFT 20-120 Hz + Fallback Synthétiseur
 */

export const TRACKS = [
  { id: 1, file: 'audio/Chute.mp3', name: 'Chute', cycle: 'Chute (Noir — Eau)', bpm: 128 },
  { id: 2, file: 'audio/Resilience.mp3', altFile: 'audio/Résilience.mp3', name: 'Résilience', cycle: 'Résilience (Vert & Marron — Terre)', bpm: 134 },
  { id: 3, file: 'audio/Obsession.mp3', name: 'Obsession', cycle: 'Obsession (Rouge — Feu)', bpm: 142 },
  { id: 4, file: 'audio/Amour.mp3', name: 'Amour', cycle: 'Amour (Jaune — Électricité)', bpm: 130 },
  { id: 5, file: 'audio/Bonheur.mp3', name: 'Bonheur', cycle: 'Bonheur (Blanc — Lumière)', bpm: 136 },
  { id: 6, file: 'audio/Chaos.mp3', name: 'Chaos', cycle: 'Chaos (Gris — Ombre)', bpm: 140 },
  { id: 7, file: 'audio/Ambition.mp3', name: 'Ambition', cycle: 'Ambition (Bleu — Vent)', bpm: 125 },
  { id: 8, file: 'audio/Folie.mp3', name: 'Folie', cycle: 'Folie (Violet — Vide / Cosmos)', bpm: 146 }
];

export class AudioManager {
  constructor(onTrackChangeCallback) {
    this.onTrackChange = onTrackChangeCallback;
    this.isInitialized = false;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentTrackIndex = 0;
    this.mode = 'synth'; // 'mp3' | 'synth'

    // Analyseur FFT
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.mediaSource = null;

    // Énergies fréquentielles normalisées [0, 1]
    this.bassEnergy = 0.0;
    this.midEnergy = 0.0;
    this.trebleEnergy = 0.0;

    // Lecteur HTML5 Audio
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    // Détection de fin de morceau pour passage automatique au cycle suivant
    this.audioElement.addEventListener('ended', () => {
      console.log(`[Audio] Piste ${this.getCurrentTrack().name} terminée. Passage au cycle suivant.`);
      if (this.currentTrackIndex === 7 && window.gameApp && window.gameApp.state === window.gameApp.STATE_PLAYING) {
        window.gameApp.triggerClimaxFeinte();
      } else {
        this.nextTrack();
      }
    });

    // Fallback automatique vers fichier alternatif puis synthé si le MP3 est absent
    this.audioElement.addEventListener('error', () => {
      const track = this.getCurrentTrack();
      if (track && track.altFile && !this.audioElement.src.includes(encodeURI(track.altFile))) {
        this.audioElement.src = track.altFile;
        this.audioElement.play().then(() => {
          this.mode = 'mp3';
          this.stopSynthLoop();
        }).catch(() => {
          this.fallbackToSynth();
        });
        return;
      }
      if (this.isPlaying && this.mode !== 'synth') {
        console.info(`[Audio] Fichier audio non trouvé. Activation du synthétiseur procédural.`);
        this.fallbackToSynth();
      }
    });

    // Variables du synthétiseur procédural
    this.synthInterval = null;
    this.synthMasterGain = null;
    this.synthTrackTimer = 0.0;
  }

  getCurrentTrack() {
    return TRACKS[this.currentTrackIndex];
  }

  // Initialisation déclenchée sur geste utilisateur ("Commencer la traversée")
  async init() {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Création de l'AnalyserNode FFT 256
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Tentative de connexion de l'audio HTML5 au contexte Web Audio
      try {
        this.mediaSource = this.audioCtx.createMediaElementSource(this.audioElement);
        this.mediaSource.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      } catch (err) {
        console.warn('[Audio] createMediaElementSource non disponible dans ce contexte:', err);
      }

      // Gain principal du synthétiseur
      this.synthMasterGain = this.audioCtx.createGain();
      this.synthMasterGain.gain.value = 0.35;
      this.synthMasterGain.connect(this.analyser);
      this.synthMasterGain.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.error('[Audio] Erreur initialisation Web Audio:', e);
    }
  }

  async start() {
    if (!this.isInitialized) {
      await this.init();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    this.isPlaying = true;
    this.playTrack(this.currentTrackIndex);
  }

  playTrack(index) {
    this.currentTrackIndex = (index + TRACKS.length) % TRACKS.length;
    const track = TRACKS[this.currentTrackIndex];

    if (this.onTrackChange) {
      this.onTrackChange(this.currentTrackIndex, track);
    }

    if (!this.isPlaying) return;

    this.audioElement.pause();
    this.audioElement.src = track.file;
    this.audioElement.currentTime = 0;
    this.synthTrackTimer = 0;

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.mode = 'mp3';
        this.stopSynthLoop();
      }).catch(() => {
        this.fallbackToSynth();
      });
    }
  }

  nextTrack() {
    this.playTrack(this.currentTrackIndex + 1);
  }

  prevTrack() {
    this.playTrack(this.currentTrackIndex - 1);
  }

  fallbackToSynth() {
    this.mode = 'synth';
    this.audioElement.pause();
    this.startSynthLoop();
  }

  startSynthLoop() {
    this.stopSynthLoop();
    if (!this.isInitialized || !this.audioCtx) return;

    const track = this.getCurrentTrack();
    const bpm = track.bpm || 130;
    const beatIntervalMs = (60.0 / bpm) * 1000.0;

    let step = 0;
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;

      const now = this.audioCtx.currentTime;

      // 1. Coup de Sub-Kick sur chaque temps (20 - 120 Hz)
      const kickOsc = this.audioCtx.createOscillator();
      const kickGain = this.audioCtx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(110, now);
      kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      kickGain.gain.setValueAtTime(0.85, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      kickOsc.connect(kickGain);
      kickGain.connect(this.synthMasterGain);

      kickOsc.start(now);
      kickOsc.stop(now + 0.35);

      // 2. Basse mélodique syncopée tous les 2 temps
      if (step % 2 === 0) {
        const bassNotes = [55, 65.4, 73.4, 82.4, 98]; // A1, C2, D2, E2, G2
        const freq = bassNotes[Math.floor(Math.random() * bassNotes.length)];

        const bassOsc = this.audioCtx.createOscillator();
        const bassFilter = this.audioCtx.createBiquadFilter();
        const bassGain = this.audioCtx.createGain();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(freq, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(380, now);
        bassFilter.Q.setValueAtTime(4.0, now);

        bassGain.gain.setValueAtTime(0.4, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.synthMasterGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.3);
      }

      step++;
    }, beatIntervalMs);
  }

  stopSynthLoop() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // SFX : Collecte de cœur (Carillon cristallin ascendant)
  playHeartCollect() {
    if (!this.isInitialized || !this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.22, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.4);
    });
  }

  // SFX : Crash / Dislocation (Bruit blanc filtré & sub-impact)
  playCrash() {
    if (!this.isInitialized || !this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;

    // Sub rumble
    const subOsc = this.audioCtx.createOscillator();
    const subGain = this.audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, now);
    subOsc.frequency.exponentialRampToValueAtTime(20, now + 0.6);
    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    subOsc.connect(subGain);
    subGain.connect(this.audioCtx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.7);

    // Buffer de bruit
    const bufferSize = this.audioCtx.sampleRate * 0.5;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.5);

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.audioCtx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.55);
  }

  // SFX : Feinte Cosmique / Téléportation Warp (Riser spectral + sub-warp)
  playCosmicWarp() {
    if (!this.isInitialized || !this.audioCtx || this.isMuted) return;

    const now = this.audioCtx.currentTime;

    // Riser oscillateur harmonique
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1280, now + 1.2);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(4500, now + 1.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // Progression de la piste courante (0.0 à 1.0)
  getTrackProgress() {
    if (this.mode === 'mp3' && this.audioElement.duration && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
      return {
        currentTime: this.audioElement.currentTime,
        duration: this.audioElement.duration,
        progress: Math.min(1.0, this.audioElement.currentTime / this.audioElement.duration)
      };
    }
    const synthDuration = 65.0;
    const cur = this.synthTrackTimer || 0;
    return {
      currentTime: cur,
      duration: synthDuration,
      progress: Math.min(1.0, cur / synthDuration)
    };
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.audioElement.muted = true;
      if (this.synthMasterGain) this.synthMasterGain.gain.value = 0;
    } else {
      this.audioElement.muted = false;
      if (this.synthMasterGain) this.synthMasterGain.gain.value = 0.35;
    }
    return this.isMuted;
  }

  // Analyse en direct des fréquences dans la boucle d'animation
  update(dt) {
    // Avancement automatique du timer synthétiseur
    if (this.isPlaying) {
      this.synthTrackTimer = (this.synthTrackTimer || 0) + dt;
      if (this.mode === 'synth' && this.synthTrackTimer >= 65.0) {
        this.synthTrackTimer = 0;
        if (this.currentTrackIndex === 7 && window.gameApp && window.gameApp.state === window.gameApp.STATE_PLAYING) {
          window.gameApp.triggerClimaxFeinte();
        } else {
          this.nextTrack();
        }
      }
    }

    if (!this.isInitialized || !this.analyser || !this.isPlaying || this.isMuted) {
      this.bassEnergy *= Math.max(0, 1 - 8 * dt);
      this.midEnergy *= Math.max(0, 1 - 8 * dt);
      this.trebleEnergy *= Math.max(0, 1 - 8 * dt);
      return;
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    // Isolation précise de la bande des basses fréquences (20 Hz - 120 Hz)
    // À 44.1kHz, taille FFT 256 => chaque bin = ~172 Hz, bins 0 et 1 couvrent 0 - 170 Hz
    let bassSum = 0;
    const bassBins = Math.min(2, this.dataArray.length);
    for (let i = 0; i < bassBins; i++) {
      bassSum += this.dataArray[i];
    }
    const targetBass = (bassSum / (bassBins * 255.0));

    // Médiums (120 Hz - 2500 Hz)
    let midSum = 0;
    const midStart = 2, midEnd = Math.min(14, this.dataArray.length);
    for (let i = midStart; i < midEnd; i++) {
      midSum += this.dataArray[i];
    }
    const targetMid = (midSum / ((midEnd - midStart) * 255.0));

    // Aigus (2500 Hz - 10000 Hz)
    let trebleSum = 0;
    const trebStart = 14, trebEnd = Math.min(48, this.dataArray.length);
    for (let i = trebStart; i < trebEnd; i++) {
      trebleSum += this.dataArray[i];
    }
    const targetTreble = (trebleSum / ((trebEnd - trebStart) * 255.0));

    // Lissage par interpolation (lerp)
    this.bassEnergy += (targetBass - this.bassEnergy) * 16.0 * dt;
    this.midEnergy += (targetMid - this.midEnergy) * 14.0 * dt;
    this.trebleEnergy += (targetTreble - this.trebleEnergy) * 14.0 * dt;
  }
}
