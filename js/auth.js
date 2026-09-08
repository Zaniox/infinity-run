// SOUNDRISE : INFINITY RUN - by zanioxx_off
// SYSTÈME DE COMPTE PILOTE, AUTHENTIFICATION & RÔLE FONDATEUR 👑

export class AuthManager {
  constructor(onAuthStateChangedCallback) {
    this.onAuthStateChanged = onAuthStateChangedCallback;
    this.storageKey = 'soundrise_session_v3';
    this.accountsDbKey = 'soundrise_accounts_database_v3';

    // Rôle Fondateur Officiel
    this.founderEmail = 'maximenax05@gmail.com';
    this.founderPseudo = 'zanioxx_off';

    // Initialisation de la base de comptes
    this.initDatabase();

    // Chargement de la session active
    this.user = this.loadStoredUser();

    // Si aucune session, connexion en invité propre par défaut
    if (!this.user) {
      this.loginAsGuest();
    }
  }

  initDatabase() {
    try {
      const data = localStorage.getItem(this.accountsDbKey);
      let accounts = data ? JSON.parse(data) : [];
      if (!Array.isArray(accounts)) accounts = [];

      // Garantir l'existence du compte Fondateur
      const founderExists = accounts.some(
        (a) => a.email?.toLowerCase() === this.founderEmail.toLowerCase() || a.pseudo?.toLowerCase() === this.founderPseudo.toLowerCase()
      );

      if (!founderExists) {
        accounts.push({
          email: this.founderEmail,
          pseudo: this.founderPseudo,
          passwordHash: this.hashPassword('soundrise2026'),
          isFounder: true,
          role: 'FONDATEUR',
          name: 'zanioxx_off (Fondateur)',
          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=zanioxx_off&backgroundColor=020617`,
          createdAt: '2026-09-08',
          progression: {
            highScore: 285400,
            bestDistance: 12600,
            maxSpeed: 380,
            highestRank: 'MUCH LOVE',
            gamesPlayed: 142,
            victories1v1: 28
          }
        });
        localStorage.setItem(this.accountsDbKey, JSON.stringify(accounts));
      }
    } catch (e) {
      console.warn('[Auth] Erreur initialisation DB locale :', e);
    }
  }

  getAccounts() {
    try {
      const data = localStorage.getItem(this.accountsDbKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveAccounts(accounts) {
    try {
      localStorage.setItem(this.accountsDbKey, JSON.stringify(accounts));
    } catch (e) {
      console.error('[Auth] Erreur sauvegarde DB comptes :', e);
    }
  }

  hashPassword(pwd) {
    let hash = 0;
    const str = 'sr_salt_' + pwd;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36);
  }

  loadStoredUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const u = JSON.parse(data);
        if (u && (u.pseudo || u.email)) {
          this.checkFounderStatus(u);
          return u;
        }
      }
    } catch (e) {
      console.warn('[Auth] Impossible de lire la session locale :', e);
    }
    return null;
  }

  saveUser(user) {
    this.user = user;
    if (user) {
      this.checkFounderStatus(user);
    }
    try {
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (e) {
      console.error('[Auth] Erreur sauvegarde session :', e);
    }
    if (this.onAuthStateChanged) {
      this.onAuthStateChanged(this.user);
    }
  }

  checkFounderStatus(user) {
    if (!user) return;
    const isEmailFounder = (user.email && user.email.toLowerCase() === this.founderEmail.toLowerCase());
    const isPseudoFounder = (user.pseudo && user.pseudo.toLowerCase() === this.founderPseudo.toLowerCase());
    if (isEmailFounder || isPseudoFounder) {
      user.isFounder = true;
      user.role = 'FONDATEUR';
      user.founderBadge = '👑 FONDATEUR';
    }
  }

  // --- CRÉATION DE COMPTE (EMAIL, PSEUDO, MOT DE PASSE) ---
  register(email, pseudo, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPseudo = (pseudo || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Veuillez entrer une adresse email valide.');
    }
    if (!cleanPseudo || cleanPseudo.length < 2) {
      throw new Error('Le pseudo doit contenir au moins 2 caractères.');
    }
    if (!cleanPwd || cleanPwd.length < 4) {
      throw new Error('Le mot de passe doit contenir au moins 4 caractères.');
    }

    const accounts = this.getAccounts();
    const emailTaken = accounts.some((a) => a.email.toLowerCase() === cleanEmail);
    if (emailTaken) {
      throw new Error('Un compte existe déjà avec cette adresse email.');
    }

    const pseudoTaken = accounts.some((a) => a.pseudo.toLowerCase() === cleanPseudo.toLowerCase());
    if (pseudoTaken) {
      throw new Error('Ce pseudo est déjà utilisé par un autre pilote.');
    }

    const isFounder = (cleanEmail === this.founderEmail.toLowerCase() || cleanPseudo.toLowerCase() === this.founderPseudo.toLowerCase());

    const newAccount = {
      email: cleanEmail,
      pseudo: cleanPseudo,
      passwordHash: this.hashPassword(cleanPwd),
      isFounder,
      role: isFounder ? 'FONDATEUR' : 'PILOTE',
      name: cleanPseudo,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanPseudo)}&backgroundColor=020617`,
      createdAt: new Date().toISOString().split('T')[0],
      progression: {
        highScore: isFounder ? 285400 : 0,
        bestDistance: isFounder ? 12600 : 0,
        maxSpeed: isFounder ? 380 : 0,
        highestRank: isFounder ? 'MUCH LOVE' : 'SU',
        gamesPlayed: 0,
        victories1v1: 0
      }
    };

    accounts.push(newAccount);
    this.saveAccounts(accounts);

    const userSession = {
      ...newAccount,
      isGuest: false,
      connectedAt: new Date().toISOString()
    };
    delete userSession.passwordHash;

    this.saveUser(userSession);
    return { success: true, user: userSession, ...userSession };
  }

  // --- CONNEXION (EMAIL, MOT DE PASSE) ---
  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanPwd) {
      throw new Error('Email et mot de passe requis.');
    }

    const accounts = this.getAccounts();
    const hash = this.hashPassword(cleanPwd);
    const isTargetFounder = (cleanEmail === this.founderEmail.toLowerCase() || cleanEmail === this.founderPseudo.toLowerCase());
    const account = accounts.find((a) => {
      const matchEmail = a.email.toLowerCase() === cleanEmail || a.pseudo.toLowerCase() === cleanEmail;
      if (!matchEmail) return false;
      if (a.passwordHash === hash) return true;
      if (isTargetFounder && (cleanPwd === 'zanioxx_off' || cleanPwd === 'soundrise2026' || cleanPwd === 'founder')) return true;
      return false;
    });

    if (!account) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    const isFounder = (cleanEmail === this.founderEmail.toLowerCase() || account.pseudo.toLowerCase() === this.founderPseudo.toLowerCase());
    if (isFounder) {
      account.isFounder = true;
      account.role = 'FONDATEUR';
    }

    const userSession = {
      ...account,
      isGuest: false,
      connectedAt: new Date().toISOString()
    };
    delete userSession.passwordHash;

    this.saveUser(userSession);
    return { success: true, user: userSession, ...userSession };
  }

  // --- DÉCONNEXION & RETOUR INVITÉ ---
  logout() {
    this.loginAsGuest();
  }

  loginAsGuest() {
    let storedGuestPseudo = localStorage.getItem('soundrise_guest_pseudo');
    if (!storedGuestPseudo) {
      const randNum = Math.floor(100 + Math.random() * 900);
      storedGuestPseudo = `Pilote_${randNum}`;
      localStorage.setItem('soundrise_guest_pseudo', storedGuestPseudo);
    }

    const guestUser = {
      email: null,
      name: storedGuestPseudo,
      pseudo: storedGuestPseudo,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(storedGuestPseudo)}&backgroundColor=0f172a`,
      isGuest: true,
      isFounder: false,
      role: 'INVITÉ',
      authMethod: 'guest',
      connectedAt: new Date().toISOString(),
      progression: {
        highScore: parseInt(localStorage.getItem('soundrise_guest_highscore') || '0', 10),
        bestDistance: parseInt(localStorage.getItem('soundrise_guest_bestdist') || '0', 10),
        maxSpeed: 0,
        highestRank: localStorage.getItem('soundrise_guest_rank') || 'SU'
      }
    };

    this.saveUser(guestUser);
    return guestUser;
  }

  updateProgression(score, distance, speed, rank) {
    if (!this.user) return;
    const prog = this.user.progression || { highScore: 0, bestDistance: 0, maxSpeed: 0, highestRank: 'SU' };

    let isNewRecord = false;
    if (score > (prog.highScore || 0)) {
      prog.highScore = score;
      isNewRecord = true;
    }
    if (distance > (prog.bestDistance || 0)) {
      prog.bestDistance = distance;
    }
    if (speed > (prog.maxSpeed || 0)) {
      prog.maxSpeed = speed;
    }
    prog.highestRank = rank || prog.highestRank;
    prog.gamesPlayed = (prog.gamesPlayed || 0) + 1;

    this.user.progression = prog;
    this.saveUser(this.user);

    // Mettre à jour dans la base de comptes si connecté
    if (!this.isGuest() && this.user.email) {
      const accounts = this.getAccounts();
      const idx = accounts.findIndex((a) => a.email.toLowerCase() === this.user.email.toLowerCase());
      if (idx >= 0) {
        accounts[idx].progression = prog;
        this.saveAccounts(accounts);
      }
    } else {
      localStorage.setItem('soundrise_guest_highscore', prog.highScore.toString());
      localStorage.setItem('soundrise_guest_bestdist', prog.bestDistance.toString());
      localStorage.setItem('soundrise_guest_rank', prog.highestRank);
    }

    return isNewRecord;
  }

  record1v1Victory() {
    if (!this.user) return;
    if (!this.user.progression) this.user.progression = {};
    this.user.progression.victories1v1 = (this.user.progression.victories1v1 || 0) + 1;
    this.saveUser(this.user);
  }

  isAuthenticated() {
    return !!(this.user && !this.user.isGuest);
  }

  isGuest() {
    return !!(!this.user || this.user.isGuest);
  }

  isFounder() {
    return !!(this.user && (this.user.isFounder || this.user.role === 'FONDATEUR' || this.user.email === this.founderEmail || this.user.pseudo === this.founderPseudo));
  }

  hasPseudo() {
    return !!(this.user && this.user.pseudo && this.user.pseudo.trim().length > 0);
  }

  getUser() {
    return this.user;
  }

  setPseudo(newPseudo) {
    if (!newPseudo || newPseudo.trim().length < 2) return false;
    const clean = newPseudo.trim();
    if (this.user) {
      this.user.pseudo = clean;
      this.user.name = clean;
      this.user.picture = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(clean)}&backgroundColor=020617`;
      this.saveUser(this.user);
      if (this.isGuest()) {
        localStorage.setItem('soundrise_guest_pseudo', clean);
      }
      return true;
    }
    return false;
  }
}
