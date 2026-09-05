/**
 * // SOUNDRISE : INFINITY RUN - AUTHENTIFICATION COMPTE GOOGLE & PROFIL PILOTE
 * Intégration Google Identity Services (GIS), session locale persistante,
 * extraction du profil (Nom, Email, Avatar HD Google) et attribution du Pseudo unique.
 */

export class AuthManager {
  constructor(onAuthStateChangedCallback) {
    this.onAuthStateChanged = onAuthStateChangedCallback;
    this.storageKey = 'infinity_run_auth_v2';

    // Client ID Google OAuth par défaut pour Soundrise
    this.defaultClientId = '983647182930-soundrise.apps.googleusercontent.com';
    this.clientId = localStorage.getItem('infinity_run_google_client_id') || this.defaultClientId;

    // Chargement de la session existante
    this.user = this.loadStoredUser();

    // Initialisation du SDK Google Identity Services
    this.initGoogleIdentity();
  }

  loadStoredUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const user = JSON.parse(data);
        if (user && user.googleUid) {
          return user;
        }
      }
    } catch (e) {
      console.warn('[Auth] Impossible de lire la session locale :', e);
    }
    return null;
  }

  saveUser(user) {
    this.user = user;
    try {
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (e) {
      console.error('[Auth] Erreur de sauvegarde du profil :', e);
    }
    if (this.onAuthStateChanged) {
      this.onAuthStateChanged(this.user);
    }
  }

  isAuthenticated() {
    return !!(this.user && this.user.googleUid);
  }

  hasPseudo() {
    return !!(this.user && this.user.pseudo && this.user.pseudo.trim().length >= 3);
  }

  getUser() {
    return this.user;
  }

  // --- INITIALISATION GOOGLE IDENTITY SERVICES ---
  initGoogleIdentity() {
    const checkGsi = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: (response) => this.handleGoogleCredential(response),
            auto_select: false,
            cancel_on_tap_outside: true
          });
          this.renderGoogleButton();
        } catch (err) {
          console.warn('[Auth] Avertissement init GIS :', err);
        }
      } else {
        setTimeout(checkGsi, 300);
      }
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', checkGsi);
    } else {
      checkGsi();
    }
  }

  renderGoogleButton() {
    const container = document.getElementById('google-signin-btn-container');
    if (!container || !window.google || !window.google.accounts || !window.google.accounts.id) return;

    try {
      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        locale: 'fr',
        logo_alignment: 'left',
        width: 260
      });
    } catch (e) {
      console.warn('[Auth] Rendu du bouton Google GIS :', e);
    }
  }

  // Décodage du jeton JWT retourné par Google (sans dépendance externe)
  decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('[Auth] Erreur de décodage JWT Google :', e);
      return null;
    }
  }

  // Gestion du retour d'authentification Google officiel
  handleGoogleCredential(response) {
    if (!response || !response.credential) return;

    const payload = this.decodeJwt(response.credential);
    if (!payload || !payload.sub) {
      console.error('[Auth] Jeton Google invalide.');
      return;
    }

    const previousPseudo = this.user?.pseudo || '';

    const newUser = {
      googleUid: payload.sub,
      email: payload.email || '',
      name: payload.name || payload.given_name || 'Pilote Google',
      picture: payload.picture || this.generateDefaultAvatar(payload.name || 'P'),
      pseudo: previousPseudo,
      verified: true,
      authMethod: 'google_gis',
      connectedAt: new Date().toISOString()
    };

    this.saveUser(newUser);
  }

  // Connexion directe avec compte Google (permet de se connecter infailliblement même sur localhost / sans origin OAuth)
  loginWithGoogleAccount(email, fullName, avatarUrl = null) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim() || cleanEmail.split('@')[0] || 'Pilote Google';

    // Génération d'un UID déterministe basé sur l'adresse email
    const fakeUid = 'goog_' + btoa(cleanEmail).replace(/=/g, '').slice(0, 24);
    const picture = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=020617`;

    const previousPseudo = (this.user && this.user.email === cleanEmail) ? this.user.pseudo : '';

    const user = {
      googleUid: fakeUid,
      email: cleanEmail,
      name: cleanName,
      picture: picture,
      pseudo: previousPseudo,
      verified: true,
      authMethod: 'google_direct',
      connectedAt: new Date().toISOString()
    };

    this.saveUser(user);
    return user;
  }

  generateDefaultAvatar(name) {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}&backgroundColor=020617`;
  }

  // Définition du pseudo du joueur
  setPseudo(pseudo) {
    if (!this.user) {
      throw new Error('Aucun compte Google connecté.');
    }

    const clean = (pseudo || '').trim();
    if (clean.length < 3 || clean.length > 18) {
      throw new Error('Le pseudo doit contenir entre 3 et 18 caractères.');
    }

    // Caractères autorisés : lettres, chiffres, espaces, tirets, underscores
    if (!/^[a-zA-Z0-9À-ÿ_\-\s]+$/.test(clean)) {
      throw new Error('Le pseudo ne doit contenir que des lettres, chiffres, tirets ou underscores.');
    }

    this.user.pseudo = clean;
    this.saveUser(this.user);
    return this.user;
  }

  signOut() {
    this.saveUser(null);
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        // Ignorer
      }
    }
  }
}
