// SOUNDRISE : INFINITY RUN - by zanioxx_off
// GESTIONNAIRE SYSTÈME GLOBAL : MODE MAINTENANCE & LOGS D'AUDIT

export class SystemManager {
  constructor(authManager) {
    this.auth = authManager;
    this.storageKeyMaintenance = 'soundrise_maintenance_state_v1';
    this.storageKeyEvent = 'soundrise_active_event_v1';
    this.storageKeyLogs = 'soundrise_audit_logs_v1';
    this.channelName = 'soundrise_system_channel';
    this.systemChannel = new BroadcastChannel(this.channelName);
    this.ntfyEndpoint = 'https://ntfy.sh/soundrise_infinity_system_status';

    this.maintenanceListeners = [];
    this.eventListeners = [];
    this.announcementListeners = [];
    this.logListeners = [];
    this.leaderboardResetListeners = [];

    // État initial de la maintenance & des événements cosmiques
    this.maintenanceState = this.loadMaintenanceState();
    this.activeEvent = this.loadActiveEvent();

    // Écouteur local inter-onglets
    this.systemChannel.onmessage = (e) => this.handleSystemMessage(e.data);

    // Écouteur de stockage local pour synchronisation
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKeyMaintenance && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          this.maintenanceState = parsed;
          this.notifyMaintenanceChanged();
        } catch (_) {}
      } else if (e.key === this.storageKeyEvent) {
        this.activeEvent = this.loadActiveEvent();
        this.notifyEventChanged();
      }
    });

    // Souscription globale en temps réel (Server-Sent Events via ntfy.sh uniquement les futurs messages)
    this.initGlobalSSE();
    // Synchronisation cloud initiale du dernier état valide
    this.fetchInitialCloudState();

    // Journaliser le démarrage de la session
    this.logEvent('SYSTEM', 'Initialisation du moteur système SOUNDRISE');
  }

  // --- 1. GESTION DU MODE MAINTENANCE ---
  loadMaintenanceState() {
    try {
      const data = localStorage.getItem(this.storageKeyMaintenance);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('[System] Erreur lecture état maintenance :', e);
    }
    return {
      active: false,
      reason: 'Mise à niveau des serveurs quantiques & maintenance des réacteurs',
      by: 'zanioxx_off',
      timestamp: Date.now()
    };
  }

  isMaintenanceActive() {
    return !!(this.maintenanceState && this.maintenanceState.active);
  }

  getMaintenanceState() {
    return { ...this.maintenanceState };
  }

  async setMaintenance(active, reason, founderUser) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== 'maximenax@gmail.com' && founderUser.email !== 'maximenax05@gmail.com' && founderUser.pseudo !== 'zanioxx_off')) {
      throw new Error('Accès refusé : Action réservée exclusivement au Fondateur @zanioxx_off.');
    }

    const updatedState = {
      active: !!active,
      reason: (reason && reason.trim()) || 'Mise à niveau des serveurs quantiques & maintenance des réacteurs',
      by: founderUser.pseudo || 'zanioxx_off',
      timestamp: Date.now()
    };

    this.maintenanceState = updatedState;

    try {
      localStorage.setItem(this.storageKeyMaintenance, JSON.stringify(updatedState));
    } catch (e) {
      console.error('[System] Erreur sauvegarde locale maintenance :', e);
    }

    // 1. Diffusion locale inter-onglets instantanée
    try {
      this.systemChannel.postMessage({
        type: 'maintenance_update',
        state: updatedState
      });
    } catch (_) {}

    // 2. Diffusion mondiale en direct (HTTP pub/sub mondial)
    try {
      await fetch(this.ntfyEndpoint, {
        method: 'POST',
        headers: { 'Title': 'SOUNDRISE Maintenance Status' },
        body: JSON.stringify({
          type: 'maintenance_update',
          state: updatedState
        })
      });
    } catch (err) {
      console.warn('[System] Notification cloud maintenance non envoyée :', err);
    }

    const logMsg = active 
      ? `Activation du Mode Maintenance Globale : « ${updatedState.reason} »`
      : 'Désactivation du Mode Maintenance Globale (Accès rétabli pour tous les joueurs)';
    this.logEvent('MAINTENANCE', logMsg, { by: updatedState.by });

    this.notifyMaintenanceChanged();
    return updatedState;
  }

  // Récupérer le dernier état cloud au démarrage sans rejouer les vieux messages expirés
  async fetchInitialCloudState() {
    try {
      const res = await fetch(`${this.ntfyEndpoint}/json?poll=1`);
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item && item.message) {
            const data = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
            if (data && data.type === 'maintenance_update' && data.state) {
              const cloudTimestamp = Number(data.state.timestamp) || 0;
              const localTimestamp = Number(this.maintenanceState && this.maintenanceState.timestamp) || 0;
              if (cloudTimestamp > localTimestamp) {
                this.maintenanceState = data.state;
                try {
                  localStorage.setItem(this.storageKeyMaintenance, JSON.stringify(data.state));
                } catch (_) {}
                this.notifyMaintenanceChanged();
              }
            } else if (data && data.type === 'system_event' && data.event) {
              const cloudTimestamp = Number(data.event.timestamp) || 0;
              const localTimestamp = Number(this.activeEvent && this.activeEvent.timestamp) || 0;
              if (cloudTimestamp > localTimestamp) {
                this.activeEvent = data.event;
                try {
                  if (data.event.type && data.event.type !== 'none' && data.event.endsAt > Date.now()) {
                    localStorage.setItem(this.storageKeyEvent, JSON.stringify(data.event));
                  } else {
                    localStorage.removeItem(this.storageKeyEvent);
                  }
                } catch (_) {}
                this.notifyEventChanged();
              }
            }
          }
        } catch (_) {}
      }
    } catch (e) {
      console.warn('[System] Impossible de vérifier l\'état cloud initial :', e);
    }
  }

  // Souscription SSE temps réel cross-devices (écoute en direct des nouveaux événements cloud)
  initGlobalSSE() {
    if (typeof EventSource === 'undefined') return;
    try {
      this.sse = new EventSource(`${this.ntfyEndpoint}/sse`);
      this.sse.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.message) {
            const data = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            this.handleSystemMessage(data);
          }
        } catch (_) {}
      };
      this.sse.onerror = () => {
        // Reconnexion automatique gérée nativement par EventSource
      };
    } catch (e) {
      console.warn('[System] Erreur connexion SSE maintenance :', e);
    }
  }

  handleSystemMessage(data) {
    if (!data || !data.type) return;

    if (data.type === 'maintenance_update' && data.state) {
      const incomingTime = Number(data.state.timestamp) || 0;
      const currentTime = Number(this.maintenanceState && this.maintenanceState.timestamp) || 0;

      // Rejet strict : le message doit avoir un timestamp valide et strictement plus récent
      if (incomingTime <= 0 || (currentTime > 0 && incomingTime <= currentTime)) {
        return;
      }

      this.maintenanceState = data.state;
      try {
        localStorage.setItem(this.storageKeyMaintenance, JSON.stringify(data.state));
      } catch (_) {}
      this.notifyMaintenanceChanged();
    } else if (data.type === 'system_event' && data.event) {
      const incomingTime = Number(data.event.timestamp) || 0;
      const currentTime = Number(this.activeEvent && this.activeEvent.timestamp) || 0;

      if (incomingTime > 0 && incomingTime > currentTime) {
        this.activeEvent = data.event;
        try {
          if (data.event.type && data.event.type !== 'none' && data.event.endsAt > Date.now()) {
            localStorage.setItem(this.storageKeyEvent, JSON.stringify(data.event));
          } else {
            localStorage.removeItem(this.storageKeyEvent);
          }
        } catch (_) {}
        this.notifyEventChanged();
      }
    } else if (data.type === 'founder_announcement') {
      this.notifyAnnouncement(data);
    } else if (data.type === 'leaderboard_reset') {
      this.logEvent('LEADERBOARD', 'Réinitialisation du classement mondial par le Fondateur');
      this.notifyLeaderboardReset();
    }
  }

  // --- 2. GESTION DES ÉVÉNEMENTS SPÉCIAUX (ÉCLIPSE & VORTEX) ---
  loadActiveEvent() {
    try {
      const data = localStorage.getItem(this.storageKeyEvent);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.endsAt && Date.now() < parsed.endsAt && parsed.type && parsed.type !== 'none') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[System] Erreur lecture état événement :', e);
    }
    return {
      type: 'none',
      duration: 0,
      endsAt: 0,
      by: 'zanioxx_off',
      timestamp: 0
    };
  }

  getActiveEvent() {
    if (this.activeEvent && this.activeEvent.endsAt && Date.now() >= this.activeEvent.endsAt && this.activeEvent.type !== 'none') {
      this.activeEvent = { type: 'none', duration: 0, endsAt: 0, by: this.activeEvent.by, timestamp: Date.now() };
      try { localStorage.removeItem(this.storageKeyEvent); } catch (_) {}
    }
    return { ...this.activeEvent };
  }

  isEventActive(type = null) {
    const current = this.getActiveEvent();
    if (!current || current.type === 'none') return false;
    if (type) return current.type === type;
    return true;
  }

  async triggerEvent(eventType, durationSeconds = 30, founderUser = null) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== 'maximenax@gmail.com' && founderUser.email !== 'maximenax05@gmail.com' && founderUser.pseudo !== 'zanioxx_off')) {
      throw new Error('Action réservée exclusivement au Fondateur @zanioxx_off.');
    }

    const type = (eventType || 'none').toLowerCase();
    const duration = Math.max(5, Math.min(3600, parseInt(durationSeconds, 10) || 30));
    const now = Date.now();

    let updatedEvent;
    if (type === 'none') {
      updatedEvent = {
        success: true,
        type: 'none',
        duration: 0,
        endsAt: 0,
        by: founderUser.pseudo || 'zanioxx_off',
        timestamp: now
      };
      try { localStorage.removeItem(this.storageKeyEvent); } catch (_) {}
      this.logEvent('EVENT', 'Arrêt anticipé de l\'événement cosmique par le Fondateur', { by: updatedEvent.by });
    } else {
      const endsAt = now + duration * 1000;
      updatedEvent = {
        success: true,
        type: type, // 'eclipse' | 'vortex'
        duration: duration,
        endsAt: endsAt,
        by: founderUser.pseudo || 'zanioxx_off',
        timestamp: now
      };
      try {
        localStorage.setItem(this.storageKeyEvent, JSON.stringify(updatedEvent));
      } catch (e) {
        console.error('[System] Erreur sauvegarde locale événement :', e);
      }

      const eventName = type === 'eclipse' ? '🌑 ÉCLIPSE TOTALE' : '🌀 FAILLE VORTEX';
      this.logEvent('EVENT', `Déclenchement événement « ${eventName} » pour ${duration}s`, { by: updatedEvent.by, duration });
    }

    this.activeEvent = updatedEvent;

    // 1. Diffusion locale inter-onglets instantanée
    try {
      this.systemChannel.postMessage({
        type: 'system_event',
        event: updatedEvent
      });
    } catch (_) {}

    // 2. Diffusion mondiale cloud
    try {
      await fetch(this.ntfyEndpoint, {
        method: 'POST',
        headers: { 'Title': 'SOUNDRISE Event Trigger' },
        body: JSON.stringify({
          type: 'system_event',
          event: updatedEvent
        })
      });
    } catch (err) {
      console.warn('[System] Notification cloud événement non envoyée :', err);
    }

    this.notifyEventChanged();
    return updatedEvent;
  }

  onEventChanged(callback) {
    if (typeof callback === 'function') {
      this.eventListeners.push(callback);
    }
  }

  notifyEventChanged() {
    const current = this.getActiveEvent();
    this.eventListeners.forEach((cb) => {
      try { cb(current); } catch (e) { console.error(e); }
    });
  }

  // --- 3. DIFFUSION D'ANNONCES EN DIRECT AUX PILOTES ---
  async broadcastAnnouncement(message, durationSeconds = 10, founderUser = null) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== 'maximenax@gmail.com' && founderUser.email !== 'maximenax05@gmail.com' && founderUser.pseudo !== 'zanioxx_off')) {
      throw new Error('Action réservée exclusivement au Fondateur @zanioxx_off.');
    }

    const cleanMsg = (message || '').trim();
    if (!cleanMsg) {
      throw new Error('Veuillez renseigner un message d\'annonce.');
    }

    const duration = Math.max(3, Math.min(60, parseInt(durationSeconds, 10) || 10));
    const payload = {
      success: true,
      type: 'founder_announcement',
      message: cleanMsg,
      duration: duration,
      by: founderUser.pseudo || 'zanioxx_off',
      timestamp: Date.now()
    };

    // 1. Diffusion locale inter-onglets
    try {
      this.systemChannel.postMessage(payload);
    } catch (_) {}

    // 2. Diffusion mondiale cloud
    try {
      await fetch(this.ntfyEndpoint, {
        method: 'POST',
        headers: { 'Title': 'SOUNDRISE Founder Announcement' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('[System] Notification cloud annonce non envoyée :', err);
    }

    this.logEvent('ANNONCE', `Annonce Fondateur diffusée : « ${cleanMsg} » (${duration}s)`, { by: payload.by });
    this.notifyAnnouncement(payload);
    return payload;
  }

  onAnnouncementReceived(callback) {
    if (typeof callback === 'function') {
      this.announcementListeners.push(callback);
    }
  }

  notifyAnnouncement(payload) {
    this.announcementListeners.forEach((cb) => {
      try { cb(payload); } catch (e) { console.error(e); }
    });
  }

  onMaintenanceChanged(callback) {
    if (typeof callback === 'function') {
      this.maintenanceListeners.push(callback);
    }
  }

  notifyMaintenanceChanged() {
    this.maintenanceListeners.forEach((cb) => {
      try { cb(this.maintenanceState); } catch (e) { console.error(e); }
    });
  }

  onLeaderboardReset(callback) {
    if (typeof callback === 'function') {
      this.leaderboardResetListeners.push(callback);
    }
  }

  notifyLeaderboardReset() {
    this.leaderboardResetListeners.forEach((cb) => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  // --- 2. JOURNAL D'AUDIT ET LOGS SYSTÈME ---
  getLogs() {
    try {
      const data = localStorage.getItem(this.storageKeyLogs);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  }

  logEvent(category, message, details = {}) {
    const logs = this.getLogs();
    const entry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      category: (category || 'INFO').toUpperCase(),
      message: message || '',
      details: details || {}
    };

    logs.unshift(entry);
    // Limite à 200 entrées d'audit
    if (logs.length > 200) logs.length = 200;

    try {
      localStorage.setItem(this.storageKeyLogs, JSON.stringify(logs));
    } catch (_) {}

    this.logListeners.forEach((cb) => {
      try { cb(entry, logs); } catch (e) { console.error(e); }
    });

    return entry;
  }

  clearLogs(founderUser) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== 'maximenax@gmail.com' && founderUser.email !== 'maximenax05@gmail.com' && founderUser.pseudo !== 'zanioxx_off')) {
      throw new Error('Action réservée au Fondateur.');
    }
    localStorage.removeItem(this.storageKeyLogs);
    this.logEvent('SYSTEM', 'Journal d\'audit vidé par le Fondateur @' + founderUser.pseudo);
    return [];
  }

  onLogAdded(callback) {
    if (typeof callback === 'function') {
      this.logListeners.push(callback);
    }
  }

  // Diffusion de la réinitialisation du leaderboard
  broadcastLeaderboardReset(founderUser) {
    const payload = {
      type: 'leaderboard_reset',
      by: (founderUser && founderUser.pseudo) || 'zanioxx_off',
      timestamp: Date.now()
    };

    try {
      this.systemChannel.postMessage(payload);
    } catch (_) {}

    try {
      fetch(this.ntfyEndpoint, {
        method: 'POST',
        headers: { 'Title': 'SOUNDRISE Leaderboard Reset' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {}

    this.logEvent('ADMIN', 'Purge et réinitialisation officielle du classement mondial', { by: payload.by });
  }
}
