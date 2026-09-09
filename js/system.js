// SOUNDRISE : INFINITY RUN - by zanioxx_off
// GESTIONNAIRE SYSTÈME GLOBAL : MODE MAINTENANCE & LOGS D'AUDIT

export class SystemManager {
  constructor(authManager) {
    this.auth = authManager;
    this.storageKeyMaintenance = 'soundrise_maintenance_state_v1';
    this.storageKeyLogs = 'soundrise_audit_logs_v1';
    this.channelName = 'soundrise_system_channel';
    this.systemChannel = new BroadcastChannel(this.channelName);
    this.ntfyEndpoint = 'https://ntfy.sh/soundrise_infinity_system_status';

    this.maintenanceListeners = [];
    this.logListeners = [];
    this.leaderboardResetListeners = [];

    // État initial de la maintenance
    this.maintenanceState = this.loadMaintenanceState();

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
      }
    });

    // Souscription globale en temps réel (Server-Sent Events via ntfy.sh)
    this.initGlobalSSE();

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

  // Souscription SSE temps réel cross-devices
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
      if (this.maintenanceState && this.maintenanceState.timestamp && data.state.timestamp && data.state.timestamp < this.maintenanceState.timestamp) {
        return;
      }
      this.maintenanceState = data.state;
      try {
        localStorage.setItem(this.storageKeyMaintenance, JSON.stringify(data.state));
      } catch (_) {}
      this.notifyMaintenanceChanged();
    } else if (data.type === 'leaderboard_reset') {
      this.logEvent('LEADERBOARD', 'Réinitialisation du classement mondial par le Fondateur');
      this.notifyLeaderboardReset();
    }
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
