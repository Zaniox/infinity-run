// SOUNDRISE : INFINITY RUN - by zanioxx_off
// GESTIONNAIRE DES PARAMÈTRES DU JEU (AUDIO, MANIABILITÉ, CONFORT VISUEL)

export class SettingsManager {
  constructor(audioManager = null) {
    this.audio = audioManager;
    this.storageKey = 'soundrise_user_settings_v1';
    this.settings = this.loadSettings();
    this.listeners = [];
  }

  loadSettings() {
    const defaults = {
      musicVolume: 0.75,
      sfxVolume: 0.85,
      flightSensitivity: 1.0,
      screenShake: true,
      graphicsQuality: 'high',
      haptics: true,
      gyroControls: false,
      language: localStorage.getItem('soundrise_language') || 'fr'
    };

    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...defaults, ...parsed };
      }
    } catch (e) {
      console.warn('[Settings] Erreur lecture paramètres locaux :', e);
    }
    return defaults;
  }

  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error('[Settings] Erreur écriture paramètres locaux :', e);
    }
  }

  get(key) {
    return this.settings[key];
  }

  getAll() {
    return { ...this.settings };
  }

  set(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    if (key === 'musicVolume' && this.audio && this.audio.setMusicVolume) {
      this.audio.setMusicVolume(value);
    } else if (key === 'sfxVolume' && this.audio && this.audio.setSfxVolume) {
      this.audio.setSfxVolume(value);
    }
    this.notifyListeners(key, value);
  }

  onSettingChanged(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(key, val) {
    this.listeners.forEach(cb => {
      try { cb(key, val); } catch (e) { console.error(e); }
    });
  }

  setMusicVolume(val) {
    this.set('musicVolume', Math.max(0, Math.min(1, parseFloat(val))));
  }

  setSfxVolume(val) {
    this.set('sfxVolume', Math.max(0, Math.min(1, parseFloat(val))));
  }

  setSensitivity(val) {
    this.set('flightSensitivity', Math.max(0.5, Math.min(2.0, parseFloat(val))));
  }

  setFlightSensitivity(val) {
    this.setSensitivity(val);
  }

  setScreenShake(enabled) {
    this.set('screenShake', !!enabled);
  }

  setGraphicsQuality(level) {
    this.set('graphicsQuality', level);
  }

  setLanguage(lang) {
    this.set('language', lang);
  }

  setHaptics(enabled) {
    this.set('haptics', !!enabled);
  }

  setGyroControls(enabled) {
    this.set('gyroControls', !!enabled);
  }
}

export const settings = new SettingsManager();
