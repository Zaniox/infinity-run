// SOUNDRISE : INFINITY RUN - by zanioxx_off
// SYSTÈME DE COMPTE PILOTE, AUTHENTIFICATION & RÔLE FONDATEUR 👑

export class AuthManager {
  constructor(onAuthStateChangedCallback) {
    this.onAuthStateChanged = onAuthStateChangedCallback;
    this.storageKey = 'soundrise_session_v3';
    this.accountsDbKey = 'soundrise_accounts_database_v3';

    // Rôle Fondateur Officiel
    this.founderEmail = 'maximenax@gmail.com';
    this.founderEmailAlt = 'maximenax05@gmail.com';
    this.founderPseudo = 'zanioxx_off';
    this.founderDefaultPassword = 'Mealyana@@@@1122';

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

      const founderHash = this.hashPassword(this.founderDefaultPassword);

      // Rechercher le compte Fondateur (par pseudo ou email actuel / historique)
      const founderIdx = accounts.findIndex(
        (a) => (a.email && (a.email.toLowerCase() === this.founderEmail.toLowerCase() || a.email.toLowerCase() === this.founderEmailAlt.toLowerCase())) ||
               (a.pseudo && a.pseudo.toLowerCase() === this.founderPseudo.toLowerCase())
      );

      if (founderIdx >= 0) {
        // Garantir les identifiants demandés et le mot de passe Fondateur
        accounts[founderIdx].email = this.founderEmail;
        accounts[founderIdx].pseudo = this.founderPseudo;
        accounts[founderIdx].passwordHash = founderHash;
        accounts[founderIdx].isFounder = true;
        accounts[founderIdx].role = 'FONDATEUR';
        accounts[founderIdx].name = 'zanioxx_off (Fondateur)';
        if (!accounts[founderIdx].progression) {
          accounts[founderIdx].progression = {
            highScore: 285400,
            bestDistance: 12600,
            maxSpeed: 380,
            highestRank: 'MUCH LOVE',
            gamesPlayed: 142,
            victories1v1: 28
          };
        }
      } else {
        accounts.push({
          email: this.founderEmail,
          pseudo: this.founderPseudo,
          passwordHash: founderHash,
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
      }
      localStorage.setItem(this.accountsDbKey, JSON.stringify(accounts));
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
          if (u.isFounder) {
            u.email = this.founderEmail;
            u.pseudo = this.founderPseudo;
            localStorage.setItem(this.storageKey, JSON.stringify(u));
          }
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
    const isEmailFounder = (user.email && (user.email.toLowerCase() === this.founderEmail.toLowerCase() || user.email.toLowerCase() === this.founderEmailAlt.toLowerCase()));
    const isPseudoFounder = (user.pseudo && user.pseudo.toLowerCase() === this.founderPseudo.toLowerCase());
    if (isEmailFounder || isPseudoFounder) {
      user.isFounder = true;
      user.role = 'FONDATEUR';
      user.founderBadge = '👑 FONDATEUR';
      user.email = this.founderEmail;
    }
  }

  // --- CONNEXION IMMÉDIATE DU FONDATEUR OFFICIEL ---
  loginAsFounder(password = null) {
    let accounts = this.getAccounts();
    const founderHash = this.hashPassword(password || this.founderDefaultPassword);
    let founderIdx = accounts.findIndex(
      (a) => (a.email && (a.email.toLowerCase() === this.founderEmail.toLowerCase() || a.email.toLowerCase() === this.founderEmailAlt.toLowerCase())) ||
             (a.pseudo && a.pseudo.toLowerCase() === this.founderPseudo.toLowerCase())
    );

    let founderAcc;
    if (founderIdx >= 0) {
      accounts[founderIdx].email = this.founderEmail;
      accounts[founderIdx].pseudo = this.founderPseudo;
      accounts[founderIdx].passwordHash = founderHash;
      accounts[founderIdx].isFounder = true;
      accounts[founderIdx].role = 'FONDATEUR';
      founderAcc = accounts[founderIdx];
    } else {
      founderAcc = {
        email: this.founderEmail,
        pseudo: this.founderPseudo,
        passwordHash: founderHash,
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
      };
      accounts.push(founderAcc);
    }
    this.saveAccounts(accounts);

    const userSession = {
      ...founderAcc,
      isGuest: false,
      connectedAt: new Date().toISOString()
    };
    delete userSession.passwordHash;

    this.saveUser(userSession);
    return { success: true, user: userSession, ...userSession };
  }

  // --- CRÉATION DE COMPTE (EMAIL, PSEUDO, MOT DE PASSE) ---
  register(email, pseudo, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPseudo = (pseudo || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Veuillez renseigner une adresse email valide.');
    }
    if (!cleanPseudo || cleanPseudo.length < 2) {
      throw new Error('Le pseudo doit comporter au moins 2 caractères.');
    }
    if (!cleanPwd || cleanPwd.length < 4) {
      throw new Error('Le mot de passe doit contenir au moins 4 caractères.');
    }

    const isFounder = (
      cleanEmail === this.founderEmail.toLowerCase() ||
      cleanEmail === this.founderEmailAlt.toLowerCase() ||
      cleanPseudo.toLowerCase() === this.founderPseudo.toLowerCase()
    );

    // Protection critique du compte Fondateur : mot de passe officiel requis
    if (isFounder) {
      if (cleanPwd === this.founderDefaultPassword) {
        return this.loginAsFounder(cleanPwd);
      } else {
        throw new Error('Ce compte est strictement réservé au Fondateur officiel. Veuillez vous connecter dans l\'onglet "Se connecter" avec vos identifiants.');
      }
    }

    let accounts = this.getAccounts();

    // Pour les autres pilotes : si le compte existe déjà avec le même mot de passe, connecter directement
    const existingIdx = accounts.findIndex((a) =>
      (a.email && a.email.toLowerCase() === cleanEmail) ||
      (a.pseudo && a.pseudo.toLowerCase() === cleanPseudo.toLowerCase())
    );

    if (existingIdx >= 0) {
      const existing = accounts[existingIdx];
      const hash = this.hashPassword(cleanPwd);
      if (existing.passwordHash === hash) {
        return this.login(existing.pseudo || existing.email, cleanPwd);
      } else {
        throw new Error('Ce compte existe déjà. Connectez-vous dans l\'onglet "Se connecter" ou utilisez la récupération.');
      }
    }

    const newAccount = {
      email: cleanEmail,
      pseudo: cleanPseudo,
      passwordHash: this.hashPassword(cleanPwd),
      isFounder: false,
      role: 'PILOTE',
      name: cleanPseudo,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanPseudo)}&backgroundColor=020617`,
      createdAt: new Date().toISOString().split('T')[0],
      progression: {
        highScore: 0,
        bestDistance: 0,
        maxSpeed: 0,
        highestRank: 'SU',
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

  // --- CONNEXION (PSEUDO OU EMAIL, MOT DE PASSE) ---
  login(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPwd = (password || '').trim();

    if (!cleanId || !cleanPwd) {
      throw new Error('Veuillez renseigner votre pseudo (ou email) et votre mot de passe.');
    }

    const isTargetFounder = (
      cleanId === this.founderEmail.toLowerCase() ||
      cleanId === this.founderEmailAlt.toLowerCase() ||
      cleanId === this.founderPseudo.toLowerCase()
    );

    // Détection immédiate du Fondateur : mot de passe officiel requis
    if (isTargetFounder) {
      if (cleanPwd === this.founderDefaultPassword) {
        return this.loginAsFounder(cleanPwd);
      }
    }

    const accounts = this.getAccounts();
    const hash = this.hashPassword(cleanPwd);

    const account = accounts.find((a) => {
      const matchPseudo = a.pseudo && a.pseudo.toLowerCase() === cleanId;
      const matchEmail = a.email && (a.email.toLowerCase() === cleanId || (cleanId === this.founderEmail.toLowerCase() && a.email.toLowerCase() === this.founderEmailAlt.toLowerCase()));
      if (!matchPseudo && !matchEmail) return false;

      if (a.passwordHash === hash) return true;
      if (isTargetFounder && cleanPwd === this.founderDefaultPassword) return true;
      return false;
    });

    if (!account) {
      throw new Error('Pseudo/email ou mot de passe incorrect.');
    }

    const isFounder = (
      (account.email && (account.email.toLowerCase() === this.founderEmail.toLowerCase() || account.email.toLowerCase() === this.founderEmailAlt.toLowerCase())) ||
      (account.pseudo && account.pseudo.toLowerCase() === this.founderPseudo.toLowerCase())
    );
    if (isFounder) {
      account.isFounder = true;
      account.role = 'FONDATEUR';
      account.email = this.founderEmail;
      account.pseudo = this.founderPseudo;
      account.passwordHash = this.hashPassword(cleanPwd === this.founderDefaultPassword ? this.founderDefaultPassword : cleanPwd);
      this.saveAccounts(accounts);
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

    // Mettre à jour dans la base de comptes si connecté (recherche par email OU pseudo)
    if (!this.isGuest()) {
      const accounts = this.getAccounts();
      const uEmail = this.user.email ? this.user.email.toLowerCase() : '';
      const uPseudo = this.user.pseudo ? this.user.pseudo.toLowerCase() : '';
      const idx = accounts.findIndex((a) =>
        (uEmail && a.email && a.email.toLowerCase() === uEmail) ||
        (uPseudo && a.pseudo && a.pseudo.toLowerCase() === uPseudo)
      );
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

  // Alias direct pour garantir la compatibilité avec main.js
  saveProgression(score, distance, rank, speed = 0) {
    return this.updateProgression(score, distance, speed, rank);
  }

  getGuestPseudo() {
    return localStorage.getItem('soundrise_guest_pseudo') || (this.user?.pseudo) || 'Pilote_Anonyme';
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
    return !!(this.user && (
      this.user.isFounder ||
      this.user.role === 'FONDATEUR' ||
      (this.user.email && (this.user.email.toLowerCase() === this.founderEmail.toLowerCase() || this.user.email.toLowerCase() === this.founderEmailAlt.toLowerCase())) ||
      (this.user.pseudo && this.user.pseudo.toLowerCase() === this.founderPseudo.toLowerCase())
    ));
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

  // --- GESTION DES COMPTES INSCRITS (PANEL FONDATEUR) ---
  getRegisteredAccounts(founderUser) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== this.founderEmail && founderUser.email !== this.founderEmailAlt && founderUser.pseudo !== this.founderPseudo)) {
      throw new Error('Accès refusé : Action réservée exclusivement au Fondateur.');
    }
    const accounts = this.getAccounts();
    return accounts.map(a => ({
      email: a.email,
      pseudo: a.pseudo,
      isFounder: !!a.isFounder,
      role: a.role || (a.isFounder ? 'FONDATEUR' : 'PILOTE'),
      createdAt: a.createdAt || '2026-09-08',
      highScore: a.progression?.highScore || 0,
      bestDistance: a.progression?.bestDistance || 0,
      victories1v1: a.progression?.victories1v1 || 0,
      gamesPlayed: a.progression?.gamesPlayed || 0,
      picture: a.picture
    }));
  }

  deleteAccount(pseudoOrEmail, founderUser) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== this.founderEmail && founderUser.pseudo !== this.founderPseudo)) {
      throw new Error('Accès refusé : Action réservée exclusivement au Fondateur.');
    }
    const target = (pseudoOrEmail || '').trim().toLowerCase();
    if (target === this.founderEmail.toLowerCase() || target === this.founderPseudo.toLowerCase()) {
      throw new Error('Protection critique : Impossible de supprimer le compte Fondateur.');
    }
    let accounts = this.getAccounts();
    const countBefore = accounts.length;
    accounts = accounts.filter(a => a.email.toLowerCase() !== target && a.pseudo.toLowerCase() !== target);
    if (accounts.length === countBefore) {
      throw new Error('Compte introuvable : ' + pseudoOrEmail);
    }
    this.saveAccounts(accounts);
    return true;
  }

  resetAccountPassword(pseudoOrEmail, newPassword, founderUser) {
    if (!founderUser || (!founderUser.isFounder && founderUser.email !== this.founderEmail && founderUser.pseudo !== this.founderPseudo)) {
      throw new Error('Accès refusé : Action réservée exclusivement au Fondateur.');
    }
    const target = (pseudoOrEmail || '').trim().toLowerCase();
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === target || a.pseudo.toLowerCase() === target);
    if (!account) {
      throw new Error('Compte introuvable : ' + pseudoOrEmail);
    }
    account.passwordHash = this.hashPassword(newPassword || 'soundrise123');
    this.saveAccounts(accounts);
    return true;
  }

  // --- RÉCUPÉRATION DE COMPTE (MOT DE PASSE OUBLIÉ & CHANGEMENT DE PSEUDO) ---
  maskEmail(email) {
    if (!email || !email.includes('@')) return email || '';
    const [user, domain] = email.split('@');
    if (user.length <= 2) return `${user[0]}***@${domain}`;
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  }

  requestAccountRecovery(emailOrPseudo) {
    const clean = (emailOrPseudo || '').trim().toLowerCase();
    if (!clean) {
      throw new Error('Veuillez renseigner votre pseudo ou votre adresse email.');
    }

    const accounts = this.getAccounts();
    const account = accounts.find((a) =>
      (a.email && (a.email.toLowerCase() === clean || (clean === this.founderEmail.toLowerCase() && a.email.toLowerCase() === this.founderEmailAlt.toLowerCase()))) ||
      (a.pseudo && a.pseudo.toLowerCase() === clean)
    );

    if (!account) {
      throw new Error('Aucun compte trouvé pour ce pseudo ou cette adresse email.');
    }

    // Code de sécurité unique à 6 chiffres
    const securityCode = Math.floor(100000 + Math.random() * 900000).toString();
    account.recoveryCode = securityCode;
    account.recoveryCodeExpires = Date.now() + 15 * 60 * 1000; // Valable 15 minutes
    this.saveAccounts(accounts);

    const masked = this.maskEmail(account.email);
    const mailSubject = encodeURIComponent("SOUNDRISE : Récupération de votre compte pilote");
    const mailBody = encodeURIComponent(
      `Bonjour Pilote ${account.pseudo},\n\n` +
      `Vous avez demandé la récupération de vos identifiants sur Soundrise : Infinity Run.\n\n` +
      `👉 VOTRE CODE DE SÉCURITÉ : ${securityCode}\n\n` +
      `Ce code est valable pendant 15 minutes.\n\n` +
      `Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.\n\n` +
      `L'équipe Soundrise`
    );
    const mailtoUrl = `mailto:${account.email}?subject=${mailSubject}&body=${mailBody}`;

    return {
      success: true,
      pseudo: account.pseudo,
      maskedEmail: masked,
      email: account.email,
      securityCode: securityCode,
      mailtoUrl: mailtoUrl
    };
  }

  resetPasswordWithCode(emailOrPseudo, code, newPassword, newPseudo = null) {
    const clean = (emailOrPseudo || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();
    const cleanPwd = (newPassword || '').trim();
    const cleanNewPseudo = (newPseudo || '').trim();

    if (!clean || !cleanCode) {
      throw new Error('Identifiant et code de sécurité requis.');
    }
    if (cleanPwd && cleanPwd.length < 4) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 4 caractères.');
    }
    if (cleanNewPseudo && cleanNewPseudo.length < 2) {
      throw new Error('Le nouveau pseudo doit contenir au moins 2 caractères.');
    }

    const accounts = this.getAccounts();
    const account = accounts.find((a) =>
      (a.email && (a.email.toLowerCase() === clean || (clean === this.founderEmail.toLowerCase() && a.email.toLowerCase() === this.founderEmailAlt.toLowerCase()))) ||
      (a.pseudo && a.pseudo.toLowerCase() === clean)
    );

    if (!account) {
      throw new Error('Compte pilote introuvable.');
    }

    if (!account.recoveryCode || account.recoveryCode !== cleanCode) {
      throw new Error('Code de sécurité incorrect.');
    }

    if (Date.now() > (account.recoveryCodeExpires || 0)) {
      throw new Error('Ce code de sécurité a expiré. Veuillez relancer une demande de récupération.');
    }

    // Mise à jour du pseudo si demandé
    if (cleanNewPseudo && cleanNewPseudo.toLowerCase() !== account.pseudo.toLowerCase()) {
      const pseudoTaken = accounts.some((a) => a.pseudo.toLowerCase() === cleanNewPseudo.toLowerCase());
      if (pseudoTaken) throw new Error('Ce pseudo est déjà pris par un autre pilote.');
      account.pseudo = cleanNewPseudo;
      account.name = cleanNewPseudo;
      account.picture = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanNewPseudo)}&backgroundColor=020617`;
    }

    // Mise à jour du mot de passe si renseigné
    if (cleanPwd) {
      account.passwordHash = this.hashPassword(cleanPwd);
    }

    delete account.recoveryCode;
    delete account.recoveryCodeExpires;
    this.saveAccounts(accounts);

    // Connexion immédiate avec la session mise à jour
    const userSession = {
      ...account,
      isGuest: false,
      connectedAt: new Date().toISOString()
    };
    delete userSession.passwordHash;
    this.saveUser(userSession);

    return { success: true, user: userSession, ...userSession };
  }
}
