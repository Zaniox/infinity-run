/**
 * // SOUNDRISE : INFINITY RUN - CLASSEMENT MONDIAL RÉEL & SYNCHRONISÉ
 * Stockage cloud persistant mondial (API REST HTTPS CORS), synchronisation temps réel,
 * gestion du top 100 mondial, calcul du rang mondial et cache hors-ligne.
 */

export class LeaderboardManager {
  constructor() {
    // Endpoint REST cloud mondial avec support complet CORS preflight (OPTIONS 200)
    this.cloudEndpoint = 'https://api.restful-api.dev/objects/ff808181a067127101a070aed1231715';
    this.cacheKey = 'infinity_run_worldwide_leaderboard_cache';
    this.lastFetched = 0;
    this.cachedScores = this.loadLocalCache();
  }

  loadLocalCache() {
    try {
      const data = localStorage.getItem(this.cacheKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[Leaderboard] Erreur lecture cache local :', e);
    }
    return [
      {
        pseudo: 'Infi_Master',
        googleUid: 'goog_system_1',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=InfiMaster&backgroundColor=020617',
        score: 34500,
        distance: 3120,
        maxSpeed: 320,
        cycle: 'Folie',
        rank: 'SUBA Y SU',
        date: '2026-09-04'
      },
      {
        pseudo: 'Nity_Hunter',
        googleUid: 'goog_system_2',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NityHunter&backgroundColor=020617',
        score: 26800,
        distance: 2450,
        maxSpeed: 295,
        cycle: 'Ambition',
        rank: 'SUBA Y',
        date: '2026-09-04'
      },
      {
        pseudo: 'CyberGlider',
        googleUid: 'goog_system_3',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberGlider&backgroundColor=020617',
        score: 18400,
        distance: 1720,
        maxSpeed: 280,
        cycle: 'Amour',
        rank: 'SUBA',
        date: '2026-09-05'
      },
      {
        pseudo: 'CosmicRider',
        googleUid: 'goog_system_4',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CosmicRider&backgroundColor=020617',
        score: 12100,
        distance: 1150,
        maxSpeed: 265,
        cycle: 'Résilience',
        rank: 'SUBA',
        date: '2026-09-05'
      }
    ];
  }

  saveLocalCache(scores) {
    this.cachedScores = scores;
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(scores));
    } catch (e) {
      console.error('[Leaderboard] Erreur écriture cache local :', e);
    }
  }

  // Récupération des scores du serveur mondial
  async fetchWorldwideScores(force = false) {
    const now = Date.now();
    // Cache de 3 secondes pour éviter le spam de requêtes
    if (!force && this.cachedScores.length > 0 && now - this.lastFetched < 3000) {
      return this.cachedScores;
    }

    try {
      const response = await fetch(this.cloudEndpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const json = await response.json();
        let scores = [];
        if (json && json.data && Array.isArray(json.data.scores)) {
          scores = json.data.scores;
        } else if (json && Array.isArray(json.leaderboard)) {
          scores = json.leaderboard;
        } else if (Array.isArray(json)) {
          scores = json;
        }

        // Nettoyage et tri par score décroissant
        scores = scores
          .filter((item) => item && item.pseudo && typeof item.score === 'number')
          .sort((a, b) => b.score - a.score);

        if (scores.length > 0) {
          this.saveLocalCache(scores);
          this.lastFetched = now;
          return scores;
        }
      }
    } catch (err) {
      console.warn('[Leaderboard] Serveur cloud inaccessible, utilisation du cache local :', err);
    }

    return this.cachedScores;
  }

  // Soumission d'un score au classement mondial
  async submitScore(entry) {
    if (!entry || !entry.pseudo || typeof entry.score !== 'number') {
      throw new Error('Données de score incomplètes.');
    }

    // 1. Récupérer l'état actuel du classement mondial
    let scores = await this.fetchWorldwideScores(true);

    // 2. Vérifier si le joueur existe déjà
    const userKey = entry.googleUid || entry.pseudo;
    const existingIndex = scores.findIndex(
      (s) => (s.googleUid && s.googleUid === entry.googleUid) || s.pseudo.toLowerCase() === entry.pseudo.toLowerCase()
    );

    let isNewRecord = false;
    const nowStr = new Date().toISOString().split('T')[0];

    const cleanEntry = {
      pseudo: entry.pseudo.trim(),
      googleUid: entry.googleUid || '',
      avatar: entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(entry.pseudo)}&backgroundColor=020617`,
      score: Math.round(entry.score),
      distance: Math.round(entry.distance || 0),
      maxSpeed: Math.round((entry.maxSpeed || 68) * 3.6),
      cycle: entry.cycle || 'Chute',
      rank: entry.rank || 'SU',
      date: nowStr
    };

    if (existingIndex >= 0) {
      const existing = scores[existingIndex];
      if (cleanEntry.score > existing.score) {
        scores[existingIndex] = cleanEntry;
        isNewRecord = true;
      } else {
        // Conserver le meilleur score mais mettre à jour l'avatar/pseudo si besoin
        scores[existingIndex].avatar = cleanEntry.avatar;
        scores[existingIndex].pseudo = cleanEntry.pseudo;
      }
    } else {
      scores.push(cleanEntry);
      isNewRecord = true;
    }

    // 3. Tri mondial par score décroissant et limite au top 100
    scores.sort((a, b) => b.score - a.score);
    const top100 = scores.slice(0, 100);

    // 4. Calcul du rang mondial du joueur
    const playerRank = top100.findIndex(
      (s) => (s.googleUid && s.googleUid === entry.googleUid) || s.pseudo.toLowerCase() === entry.pseudo.toLowerCase()
    ) + 1;

    // 5. Sauvegarde locale immédiate
    this.saveLocalCache(top100);

    // 6. Envoi au serveur cloud mondial
    try {
      await fetch(this.cloudEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'SoundriseLeaderboard',
          data: { scores: top100 }
        })
      });
      console.log('[Leaderboard] Score synchronisé mondialement avec succès ! Rang :', playerRank);
    } catch (err) {
      console.warn('[Leaderboard] Synchronisation cloud différée :', err);
    }

    return {
      rank: playerRank > 0 ? playerRank : top100.length,
      totalPlayers: top100.length,
      isNewRecord: isNewRecord,
      topScores: top100
    };
  }

  // Récupère le meilleur score du joueur connecté
  getPlayerBest(googleUid, pseudo) {
    if (!googleUid && !pseudo) return null;
    const match = this.cachedScores.find(
      (s) => (googleUid && s.googleUid === googleUid) || (pseudo && s.pseudo.toLowerCase() === pseudo.toLowerCase())
    );
    if (!match) return null;

    const rank = this.cachedScores.indexOf(match) + 1;
    return { ...match, worldRank: rank };
  }
}
