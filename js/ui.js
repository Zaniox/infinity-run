/**
 * // SOUNDRISE : INFINITY RUN - INTERFACE UTILISATEUR, AUTHENTIFICATION & CLASSEMENT MONDIAL
 * Écran d'accueil épuré, Authentification Google (GIS & Direct), Gestion du Pseudo,
 * Leaderboard mondial en direct, Jauge d'énergie et Écran de Game Over synchronisé.
 */

export class UIManager {
  constructor(
    onStartCallback,
    onRestartCallback,
    onAudioToggleCallback,
    onPrevCycleCallback,
    onNextCycleCallback,
    authManager = null,
    leaderboardManager = null
  ) {
    this.onStart = onStartCallback;
    this.onRestart = onRestartCallback;
    this.onAudioToggle = onAudioToggleCallback;
    this.onPrevCycle = onPrevCycleCallback;
    this.onNextCycle = onNextCycleCallback;
    this.auth = authManager;
    this.leaderboard = leaderboardManager;

    this.cacheDOMElements();
    this.bindEvents();
    this.toastTimer = null;

    if (this.auth) {
      this.updateAuthState(this.auth.getUser());
    }
  }

  cacheDOMElements() {
    // Menu d'accueil cinématique
    this.startMenu = document.getElementById('start-menu');
    this.btnPlayGame = document.getElementById('btn-play-game');
    this.btnPlayIcon = document.getElementById('btn-play-icon');
    this.btnPlayText = document.getElementById('btn-play-text');
    this.btnPlaySub = document.getElementById('btn-play-sub');

    // Sélecteur de cycle dans le Menu
    this.menuBtnPrev = document.getElementById('menu-btn-prev');
    this.menuBtnNext = document.getElementById('menu-btn-next');
    this.menuCycleIcon = document.getElementById('menu-cycle-icon');
    this.menuCycleBadge = document.getElementById('menu-cycle-badge');
    this.menuCycleTitle = document.getElementById('menu-cycle-title');

    // Authentification Google & Profil joueur
    this.authUnlogged = document.getElementById('auth-unlogged');
    this.authLogged = document.getElementById('auth-logged');
    this.googleBtnSlot = document.getElementById('google-signin-btn-container');
    this.btnOpenGoogleLogin = document.getElementById('btn-open-google-login');

    this.userAvatarImg = document.getElementById('user-avatar-img');
    this.userNameDisplay = document.getElementById('user-name-display');
    this.userPseudoDisplay = document.getElementById('user-pseudo-display');
    this.btnEditPseudo = document.getElementById('btn-edit-pseudo');
    this.userBestScore = document.getElementById('user-best-score');
    this.userBestRank = document.getElementById('user-best-rank');
    this.btnLogout = document.getElementById('btn-logout');

    // Bouton Classement Mondial Menu
    this.btnOpenLeaderboard = document.getElementById('btn-open-leaderboard');

    // Modal Choix du Pseudo
    this.pseudoModal = document.getElementById('pseudo-modal');
    this.pseudoAvatarPreview = document.getElementById('pseudo-avatar-preview');
    this.pseudoGoogleName = document.getElementById('pseudo-google-name');
    this.pseudoGoogleEmail = document.getElementById('pseudo-google-email');
    this.formPseudo = document.getElementById('form-pseudo');
    this.inputPlayerPseudo = document.getElementById('input-player-pseudo');
    this.pseudoErrorMsg = document.getElementById('pseudo-error-msg');
    this.btnConfirmPseudo = document.getElementById('btn-confirm-pseudo');

    // Modal Connexion Directe Google
    this.googleLoginModal = document.getElementById('google-login-modal');
    this.btnCloseGoogleModal = document.getElementById('btn-close-google-modal');
    this.formGoogleLogin = document.getElementById('form-google-login');
    this.inputGoogleEmail = document.getElementById('input-google-email');
    this.inputGoogleName = document.getElementById('input-google-name');
    this.googleLoginError = document.getElementById('google-login-error');
    this.btnConfirmGoogleLogin = document.getElementById('btn-confirm-google-login');

    // Modal Leaderboard Mondial
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.btnCloseLeaderboard = document.getElementById('btn-close-leaderboard');
    this.btnDismissLeaderboard = document.getElementById('btn-dismiss-leaderboard');
    this.btnRefreshLeaderboard = document.getElementById('btn-refresh-leaderboard');
    this.lbTableBody = document.getElementById('lb-table-body');
    this.lbMyAvatar = document.getElementById('lb-my-avatar');
    this.lbMyPseudo = document.getElementById('lb-my-pseudo');
    this.lbMyRank = document.getElementById('lb-my-rank');
    this.lbMyScore = document.getElementById('lb-my-score');

    // HUD en vol
    this.hudOverlay = document.getElementById('hud-overlay');
    this.energyBar = document.getElementById('heart-energy-fill');
    this.hudDistance = document.getElementById('hud-distance');
    this.hudSpeed = document.getElementById('hud-speed');
    this.hudHearts = document.getElementById('hud-hearts');
    this.hudCycleName = document.getElementById('hud-cycle-name');

    // Audio & Navigation dans le HUD
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioLabel = document.getElementById('audio-label');
    this.btnPrevCycle = document.getElementById('btn-prev-cycle');
    this.btnNextCycle = document.getElementById('btn-next-cycle');

    // Toast de transition de cycle
    this.cycleToast = document.getElementById('cycle-toast');
    this.cycleToastTitle = document.getElementById('cycle-toast-title');
    this.cycleToastDesc = document.getElementById('cycle-toast-desc');

    // Écran de Game Over
    this.gameOverModal = document.getElementById('game-over-modal');
    this.deathReason = document.getElementById('death-reason');
    this.finalDistance = document.getElementById('final-distance');
    this.finalSpeed = document.getElementById('final-speed');
    this.finalHearts = document.getElementById('final-hearts');
    this.finalScore = document.getElementById('final-score');
    this.finalRankBadge = document.getElementById('final-rank-badge');
    this.finalRankSub = document.getElementById('final-rank-sub');
    this.gameoverWorldStatus = document.getElementById('gameover-world-status');
    this.gameoverWorldRankText = document.getElementById('gameover-world-rank-text');
    this.btnGameoverLeaderboard = document.getElementById('btn-gameover-leaderboard');
    this.btnRestart = document.getElementById('btn-restart');

    // Feinte Cosmique & Modal Troll du Cycle 8
    this.cosmicFlash = document.getElementById('cosmic-flash');
    this.hudLoop = document.getElementById('hud-loop');
    this.climaxAlert = document.getElementById('climax-alert');
    this.climaxTitle = document.getElementById('climax-title');
    this.trollModal = document.getElementById('troll-modal');
    this.trollLoopVal = document.getElementById('troll-loop-val');
    this.btnTrollContinue = document.getElementById('btn-troll-continue');
  }

  bindEvents() {
    // 1. Bouton JOUER principal (dépend de l'état d'authentification)
    if (this.btnPlayGame) {
      const handlePlayClick = (e) => {
        if (e) e.preventDefault();

        // Si non connecté -> ouvrir le modal Google
        if (!this.auth || !this.auth.isAuthenticated()) {
          this.openGoogleDirectModal();
          return;
        }

        // Si connecté mais pas de pseudo -> ouvrir le modal Pseudo
        if (!this.auth.hasPseudo()) {
          this.openPseudoModal();
          return;
        }

        // Prêt à décoller !
        this.hideStartMenu();
        if (this.onStart) this.onStart();
      };

      this.btnPlayGame.addEventListener('click', handlePlayClick);
      this.btnPlayGame.addEventListener('pointerdown', handlePlayClick);
    }

    // 2. Bouton Connexion Google Directe
    if (this.btnOpenGoogleLogin) {
      this.btnOpenGoogleLogin.addEventListener('click', (e) => {
        e.preventDefault();
        this.openGoogleDirectModal();
      });
    }

    if (this.btnCloseGoogleModal) {
      this.btnCloseGoogleModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeGoogleDirectModal();
      });
    }

    if (this.formGoogleLogin) {
      this.formGoogleLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.inputGoogleEmail?.value || '';
        const name = this.inputGoogleName?.value || '';

        if (!email || !email.includes('@')) {
          if (this.googleLoginError) {
            this.googleLoginError.textContent = 'Veuillez saisir une adresse email valide.';
            this.googleLoginError.classList.remove('hidden');
          }
          return;
        }

        try {
          const user = this.auth.loginWithGoogleAccount(email, name);
          this.closeGoogleDirectModal();
          if (!user.pseudo) {
            this.openPseudoModal();
          }
        } catch (err) {
          if (this.googleLoginError) {
            this.googleLoginError.textContent = err.message || 'Erreur de connexion.';
            this.googleLoginError.classList.remove('hidden');
          }
        }
      });
    }

    // 3. Bouton Modification du Pseudo
    if (this.btnEditPseudo) {
      this.btnEditPseudo.addEventListener('click', (e) => {
        e.preventDefault();
        this.openPseudoModal();
      });
    }

    if (this.formPseudo) {
      this.formPseudo.addEventListener('submit', (e) => {
        e.preventDefault();
        const pseudo = this.inputPlayerPseudo?.value || '';
        try {
          this.auth.setPseudo(pseudo);
          this.closePseudoModal();
        } catch (err) {
          if (this.pseudoErrorMsg) {
            this.pseudoErrorMsg.textContent = err.message || 'Pseudo invalide.';
            this.pseudoErrorMsg.classList.remove('hidden');
          }
        }
      });
    }

    // 4. Déconnexion
    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment vous déconnecter de votre compte Google ?')) {
          if (this.auth) this.auth.signOut();
        }
      });
    }

    // 5. Leaderboard Mondial
    if (this.btnOpenLeaderboard) {
      this.btnOpenLeaderboard.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLeaderboardModal();
      });
    }

    if (this.btnGameoverLeaderboard) {
      this.btnGameoverLeaderboard.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLeaderboardModal();
      });
    }

    if (this.btnCloseLeaderboard) {
      this.btnCloseLeaderboard.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeLeaderboardModal();
      });
    }

    if (this.btnDismissLeaderboard) {
      this.btnDismissLeaderboard.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeLeaderboardModal();
      });
    }

    if (this.btnRefreshLeaderboard) {
      this.btnRefreshLeaderboard.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.refreshLeaderboard();
      });
    }

    // 6. Navigation de cycle
    if (this.menuBtnPrev) {
      this.menuBtnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.onPrevCycle) this.onPrevCycle();
      });
    }
    if (this.menuBtnNext) {
      this.menuBtnNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.onNextCycle) this.onNextCycle();
      });
    }

    // 7. Audio toggle
    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => {
        if (this.onAudioToggle) {
          const isMuted = this.onAudioToggle();
          this.setAudioState(!isMuted);
        }
      });
    }

    // 8. Navigation en vol (HUD)
    if (this.btnPrevCycle) {
      this.btnPrevCycle.addEventListener('click', () => {
        if (this.onPrevCycle) this.onPrevCycle();
      });
    }
    if (this.btnNextCycle) {
      this.btnNextCycle.addEventListener('click', () => {
        if (this.onNextCycle) this.onNextCycle();
      });
    }

    // 9. Bouton Restart (Game Over)
    if (this.btnRestart) {
      const handleRestart = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.hideGameOver();
        if (this.onRestart) this.onRestart();
      };
      this.btnRestart.addEventListener('click', handleRestart);
      this.btnRestart.addEventListener('pointerdown', handleRestart);
    }

    // 10. Bouton Troll Continue
    if (this.btnTrollContinue) {
      const handleTrollContinue = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.hideTrollModal();
        if (this.onTrollContinue) this.onTrollContinue();
      };
      this.btnTrollContinue.addEventListener('click', handleTrollContinue);
      this.btnTrollContinue.addEventListener('pointerdown', handleTrollContinue);
    }

    // 11. Raccourcis clavier (Espace / Entrée / Échap)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.isLeaderboardVisible()) this.closeLeaderboardModal();
        if (this.isGoogleModalVisible()) this.closeGoogleDirectModal();
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.isStartMenuVisible() && !this.isAnyModalOpen()) {
          e.preventDefault();
          if (!this.auth || !this.auth.isAuthenticated()) {
            this.openGoogleDirectModal();
          } else if (!this.auth.hasPseudo()) {
            this.openPseudoModal();
          } else {
            this.hideStartMenu();
            if (this.onStart) this.onStart();
          }
        } else if (this.isTrollModalVisible()) {
          e.preventDefault();
          this.hideTrollModal();
          if (this.onTrollContinue) this.onTrollContinue();
        } else if (this.isGameOverVisible() && !this.isLeaderboardVisible()) {
          e.preventDefault();
          this.hideGameOver();
          if (this.onRestart) this.onRestart();
        }
      }
    });
  }

  isAnyModalOpen() {
    return (
      this.isPseudoModalVisible() ||
      this.isGoogleModalVisible() ||
      this.isLeaderboardVisible() ||
      this.isGameOverVisible() ||
      this.isTrollModalVisible()
    );
  }

  // --- MISE À JOUR DE L'ÉTAT D'AUTHENTIFICATION & PROFIL ---
  updateAuthState(user) {
    if (user && user.googleUid) {
      // Connecté
      if (this.authUnlogged) this.authUnlogged.classList.add('hidden');
      if (this.authLogged) this.authLogged.classList.remove('hidden');

      if (this.userAvatarImg) this.userAvatarImg.src = user.picture;
      if (this.userNameDisplay) this.userNameDisplay.textContent = user.name || 'Pilote';

      const pseudo = user.pseudo ? user.pseudo.trim() : '';

      if (pseudo) {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = `@${pseudo}`;
        // Déverrouiller le bouton JOUER
        if (this.btnPlayGame) this.btnPlayGame.classList.remove('locked');
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '▶';
        if (this.btnPlayText) this.btnPlayText.textContent = 'JOUER • DÉCOLLER';
        if (this.btnPlaySub) this.btnPlaySub.textContent = '[ ESPACE ou CLIQUEZ POUR VOLER ]';
      } else {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = 'Non défini';
        // Bouton invitant à choisir son pseudo
        if (this.btnPlayGame) this.btnPlayGame.classList.add('locked');
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '✍️';
        if (this.btnPlayText) this.btnPlayText.textContent = 'CHOISIR MON PSEUDO';
        if (this.btnPlaySub) this.btnPlaySub.textContent = '[ PSEUDO REQUIS POUR LE CLASSEMENT ]';
      }

      // Mettre à jour le résumé des scores personnels
      this.updatePersonalBestDisplay();
    } else {
      // Non connecté
      if (this.authUnlogged) this.authUnlogged.classList.remove('hidden');
      if (this.authLogged) this.authLogged.classList.add('hidden');

      if (this.btnPlayGame) this.btnPlayGame.classList.add('locked');
      if (this.btnPlayIcon) this.btnPlayIcon.textContent = '🔒';
      if (this.btnPlayText) this.btnPlayText.textContent = 'CONNEXION GOOGLE REQUISE';
      if (this.btnPlaySub) this.btnPlaySub.textContent = '[ CONNECTEZ-VOUS POUR DÉCOLLER ]';
    }
  }

  updatePersonalBestDisplay() {
    if (!this.auth || !this.leaderboard) return;
    const user = this.auth.getUser();
    if (!user) return;

    const best = this.leaderboard.getPlayerBest(user.googleUid, user.pseudo);
    if (best) {
      if (this.userBestScore) this.userBestScore.textContent = `${best.score.toLocaleString('fr-FR')} PTS`;
      if (this.userBestRank) this.userBestRank.textContent = `#${best.worldRank}`;
      if (this.lbMyScore) this.lbMyScore.textContent = `${best.score.toLocaleString('fr-FR')} PTS`;
      if (this.lbMyRank) this.lbMyRank.textContent = `#${best.worldRank}`;
    } else {
      if (this.userBestScore) this.userBestScore.textContent = '0 PTS';
      if (this.userBestRank) this.userBestRank.textContent = '#--';
      if (this.lbMyScore) this.lbMyScore.textContent = '0 PTS';
      if (this.lbMyRank) this.lbMyRank.textContent = '#--';
    }
    if (this.lbMyPseudo) this.lbMyPseudo.textContent = user.pseudo ? `@${user.pseudo}` : user.name;
    if (this.lbMyAvatar) this.lbMyAvatar.src = user.picture;
  }

  // --- MODAL DE CHOIX DU PSEUDO ---
  openPseudoModal() {
    const user = this.auth ? this.auth.getUser() : null;
    if (user) {
      if (this.pseudoAvatarPreview) this.pseudoAvatarPreview.src = user.picture;
      if (this.pseudoGoogleName) this.pseudoGoogleName.textContent = user.name || 'Pilote Google';
      if (this.pseudoGoogleEmail) this.pseudoGoogleEmail.textContent = user.email || '';
      if (this.inputPlayerPseudo) this.inputPlayerPseudo.value = user.pseudo || '';
    }
    if (this.pseudoErrorMsg) this.pseudoErrorMsg.classList.add('hidden');
    if (this.pseudoModal) this.pseudoModal.classList.remove('hidden');
    setTimeout(() => this.inputPlayerPseudo?.focus(), 150);
  }

  closePseudoModal() {
    if (this.pseudoModal) this.pseudoModal.classList.add('hidden');
  }

  isPseudoModalVisible() {
    return this.pseudoModal && !this.pseudoModal.classList.contains('hidden');
  }

  // --- MODAL DE CONNEXION DIRECTE GOOGLE ---
  openGoogleDirectModal() {
    if (this.googleLoginError) this.googleLoginError.classList.add('hidden');
    if (this.googleLoginModal) this.googleLoginModal.classList.remove('hidden');
    setTimeout(() => this.inputGoogleEmail?.focus(), 150);
  }

  closeGoogleDirectModal() {
    if (this.googleLoginModal) this.googleLoginModal.classList.add('hidden');
  }

  isGoogleModalVisible() {
    return this.googleLoginModal && !this.googleLoginModal.classList.contains('hidden');
  }

  // --- MODAL DU CLASSEMENT MONDIAL ---
  async openLeaderboardModal() {
    this.updatePersonalBestDisplay();
    if (this.leaderboardModal) this.leaderboardModal.classList.remove('hidden');

    if (this.lbTableBody) {
      this.lbTableBody.innerHTML = '<div class="lb-loading">Connexion au serveur cloud mondial en cours...</div>';
    }

    await this.refreshLeaderboard();
  }

  closeLeaderboardModal() {
    if (this.leaderboardModal) this.leaderboardModal.classList.add('hidden');
  }

  isLeaderboardVisible() {
    return this.leaderboardModal && !this.leaderboardModal.classList.contains('hidden');
  }

  async refreshLeaderboard() {
    if (!this.leaderboard) return;
    try {
      const scores = await this.leaderboard.fetchWorldwideScores(true);
      this.renderLeaderboard(scores);
      this.updatePersonalBestDisplay();
    } catch (err) {
      if (this.lbTableBody) {
        this.lbTableBody.innerHTML = `<div class="lb-loading" style="color:#fca5a5;">Erreur de chargement : ${err.message}</div>`;
      }
    }
  }

  renderLeaderboard(scores) {
    if (!this.lbTableBody) return;

    if (!scores || scores.length === 0) {
      this.lbTableBody.innerHTML = '<div class="lb-loading">Aucun score enregistré pour l\'instant. Soyez le premier !</div>';
      return;
    }

    const user = this.auth ? this.auth.getUser() : null;
    let html = '';

    scores.forEach((entry, idx) => {
      const rank = idx + 1;
      let rankBadge = `#${rank}`;
      if (rank === 1) rankBadge = '<span class="lb-medal-gold">🥇 1er</span>';
      else if (rank === 2) rankBadge = '<span class="lb-medal-silver">🥈 2e</span>';
      else if (rank === 3) rankBadge = '<span class="lb-medal-bronze">🥉 3e</span>';

      const isMyRow = user && ((user.googleUid && user.googleUid === entry.googleUid) || user.pseudo === entry.pseudo);
      const rowClass = isMyRow ? 'lb-row my-row' : 'lb-row';
      const youBadge = isMyRow ? ' <span style="color:#00f0ff;font-size:0.65rem;font-weight:900;">(VOUS)</span>' : '';

      html += `
        <div class="${rowClass}">
          <span class="col-rank">${rankBadge}</span>
          <span class="col-pilot">
            <img class="lb-item-avatar" src="${entry.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=pilot&backgroundColor=020617'}" alt="" />
            <span class="lb-item-pseudo">@${entry.pseudo}${youBadge}</span>
          </span>
          <span class="col-score">${(entry.score || 0).toLocaleString('fr-FR')} PTS</span>
          <span class="col-distance">${(entry.distance || 0).toLocaleString('fr-FR')} M</span>
          <span class="col-speed">${entry.maxSpeed || 0} KM/H</span>
          <span class="col-cycle">${entry.cycle || 'Chute'}</span>
          <span class="col-date">${entry.date || '--'}</span>
        </div>
      `;
    });

    this.lbTableBody.innerHTML = html;
  }

  // --- AUDIO & HUD ---
  setAudioState(active) {
    if (this.btnAudioToggle) {
      if (active) {
        this.btnAudioToggle.classList.add('active');
        if (this.audioIcon) this.audioIcon.textContent = '🔊';
        if (this.audioLabel) this.audioLabel.textContent = 'SON ACTIVÉ';
      } else {
        this.btnAudioToggle.classList.remove('active');
        if (this.audioIcon) this.audioIcon.textContent = '🔇';
        if (this.audioLabel) this.audioLabel.textContent = 'SON COUPÉ';
      }
    }
  }

  updateHUD(energy, distance, speed, heartsCount) {
    if (this.energyBar) {
      this.energyBar.style.width = `${Math.max(0, Math.min(100, energy))}%`;
      if (energy < 25) {
        this.energyBar.classList.add('critical');
      } else {
        this.energyBar.classList.remove('critical');
      }
    }

    if (this.hudDistance) this.hudDistance.textContent = `${Math.round(distance)} M`;
    if (this.hudSpeed) this.hudSpeed.textContent = `${Math.round(speed * 3.6)} KM/H`;
    if (this.hudHearts) this.hudHearts.textContent = `♥ ${heartsCount}`;
  }

  updateCycleBadge(cycle) {
    if (this.hudCycleName) {
      this.hudCycleName.textContent = `CYCLE ${cycle.id} • ${cycle.name.toUpperCase()}`;
      const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
      this.hudCycleName.style.borderColor = hex;
      this.hudCycleName.style.color = hex;
    }
  }

  showCycleToast(cycle) {
    if (!this.cycleToast) return;

    if (this.cycleToastTitle) {
      this.cycleToastTitle.textContent = `CYCLE ${cycle.id} • ${cycle.name.toUpperCase()}`;
      this.cycleToastTitle.style.color = `#${cycle.primary.toString(16).padStart(6, '0')}`;
    }
    if (this.cycleToastDesc) {
      this.cycleToastDesc.textContent = `${cycle.subtitle} — ${cycle.troll}`;
    }

    const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
    this.cycleToast.style.borderColor = hex;
    this.cycleToast.style.boxShadow = `0 0 35px ${hex}, 0 0 70px rgba(0, 0, 0, 0.8)`;
    this.cycleToast.classList.remove('hidden');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.cycleToast.classList.add('hidden');
    }, 3200);
  }

  triggerFlash() {
    if (this.cosmicFlash) {
      this.cosmicFlash.classList.add('active');
      setTimeout(() => {
        this.cosmicFlash.classList.remove('active');
      }, 420);
    }
  }

  updateLoopCount(loop) {
    if (this.hudLoop) {
      this.hudLoop.textContent = `∞ ${loop}`;
    }
  }

  showClimaxAlert(text, isFeinte = false) {
    if (!this.climaxAlert) return;
    if (this.climaxTitle) this.climaxTitle.textContent = text;
    if (isFeinte) {
      this.climaxAlert.classList.add('feinte-mode');
    } else {
      this.climaxAlert.classList.remove('feinte-mode');
    }
    this.climaxAlert.classList.remove('hidden');
  }

  hideClimaxAlert() {
    if (this.climaxAlert) this.climaxAlert.classList.add('hidden');
  }

  computeRank(score) {
    if (score >= 20000) {
      return {
        rank: 'SUBA Y SU',
        title: 'LÉGENDAIRE / EXCEPTIONNEL',
        desc: 'Traversée divine au-delà de l\'horizon des événements !',
        color: '#fef08a',
        glow: 'rgba(254, 240, 138, 0.9)'
      };
    } else if (score >= 10000) {
      return {
        rank: 'SUBA Y',
        title: 'TRÈS BON SCORE',
        desc: 'Maîtrise transcendante de l\'ascension et du piqué !',
        color: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.8)'
      };
    } else if (score >= 4000) {
      return {
        rank: 'SUBA',
        title: 'BON SCORE',
        desc: 'Belle endurance dans l\'abysse gravitationnel.',
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.7)'
      };
    } else {
      return {
        rank: 'SU',
        title: 'SCORE STANDARD',
        desc: 'Premier contact avec le sillage de Nity.',
        color: '#94a3b8',
        glow: 'rgba(148, 163, 184, 0.5)'
      };
    }
  }

  // --- GAME OVER & SYNCHRONISATION DU CLASSEMENT ---
  showGameOver(reason, distance, maxSpeed, heartsCount, worldRankResult = null) {
    const totalScore = Math.floor(distance * 10 + heartsCount * 250);
    const rankInfo = this.computeRank(totalScore);

    if (this.deathReason) {
      this.deathReason.textContent = reason === 'energy'
        ? 'ÉNERGIE DU CŒUR ÉPUISÉE • SIGNAL ÉTEINT'
        : 'IMPACT CRITIQUE • STRUCTURE DÉSINTÉGRÉE';
    }

    if (this.finalDistance) this.finalDistance.textContent = `${Math.round(distance)} M`;
    if (this.finalSpeed) this.finalSpeed.textContent = `${Math.round(maxSpeed * 3.6)} KM/H`;
    if (this.finalHearts) this.finalHearts.textContent = `${heartsCount}`;
    if (this.finalScore) this.finalScore.textContent = `${totalScore.toLocaleString('fr-FR')} PTS`;

    if (this.finalRankBadge) {
      this.finalRankBadge.textContent = rankInfo.rank;
      this.finalRankBadge.style.color = rankInfo.color;
      this.finalRankBadge.style.borderColor = rankInfo.color;
      this.finalRankBadge.style.boxShadow = `0 0 25px ${rankInfo.glow}`;
    }

    if (this.finalRankSub) {
      this.finalRankSub.textContent = `${rankInfo.title} — ${rankInfo.desc}`;
    }

    // Affichage du statut du classement mondial
    if (worldRankResult) {
      this.updateGameOverWorldRank(worldRankResult);
    } else {
      if (this.gameoverWorldStatus) this.gameoverWorldStatus.textContent = 'ENREGISTREMENT AU CLASSEMENT MONDIAL...';
      if (this.gameoverWorldRankText) this.gameoverWorldRankText.textContent = 'Connexion au serveur cloud...';
    }

    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
    }
  }

  updateGameOverWorldRank(result) {
    if (result && result.rank) {
      if (this.gameoverWorldStatus) {
        this.gameoverWorldStatus.textContent = result.isNewRecord
          ? '🏆 NOUVEAU RECORD PERSONNEL ENREGISTRÉ !'
          : '✓ SCORE ENREGISTRÉ AU CLASSEMENT MONDIAL !';
      }
      if (this.gameoverWorldRankText) {
        this.gameoverWorldRankText.textContent = `Votre rang mondial : #${result.rank} sur ${result.totalPlayers || '--'} pilotes`;
      }
    }
  }

  hideGameOver() {
    if (this.gameOverModal) this.gameOverModal.classList.add('hidden');
  }

  isGameOverVisible() {
    return this.gameOverModal && !this.gameOverModal.classList.contains('hidden');
  }

  // --- GESTION DU MENU PRINCIPAL PLAY ---
  hideStartMenu() {
    if (this.startMenu) this.startMenu.classList.add('hidden');
    if (this.hudOverlay) this.hudOverlay.classList.remove('hidden');
  }

  showStartMenu() {
    if (this.startMenu) this.startMenu.classList.remove('hidden');
    if (this.hudOverlay) this.hudOverlay.classList.add('hidden');
    if (this.auth) this.updateAuthState(this.auth.getUser());
  }

  isStartMenuVisible() {
    return this.startMenu && !this.startMenu.classList.contains('hidden');
  }

  updateMenuCycle(cycle) {
    const CYCLE_ICONS = {
      1: '🌊', 2: '🌍', 3: '🔥', 4: '⚡',
      5: '✨', 6: '🌑', 7: '🌪️', 8: '🌌'
    };

    if (this.menuCycleBadge) {
      this.menuCycleBadge.textContent = `CYCLE ${cycle.id}`;
      const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
      this.menuCycleBadge.style.borderColor = hex;
      this.menuCycleBadge.style.color = hex;
      this.menuCycleBadge.style.boxShadow = `0 0 12px ${hex}`;
    }
    if (this.menuCycleIcon) {
      this.menuCycleIcon.textContent = CYCLE_ICONS[cycle.id] || '✨';
    }
    if (this.menuCycleTitle) {
      this.menuCycleTitle.textContent = `${cycle.name.toUpperCase()} • ${cycle.colorName.toUpperCase()} (${cycle.element.toUpperCase()})`;
    }
  }

  // --- MODAL TROLL DU CYCLE 8 ---
  showTrollModal(loopCount, onContinue) {
    this.onTrollContinue = onContinue;
    if (this.trollLoopVal) this.trollLoopVal.textContent = `∞ ${loopCount}`;
    if (this.trollModal) this.trollModal.classList.remove('hidden');
  }

  hideTrollModal() {
    if (this.trollModal) this.trollModal.classList.add('hidden');
  }

  isTrollModalVisible() {
    return this.trollModal && !this.trollModal.classList.contains('hidden');
  }
}
