/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
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
    leaderboardManager = null,
    multiplayerManager = null
  ) {
    this.onStart = onStartCallback;
    this.onRestart = onRestartCallback;
    this.onAudioToggle = onAudioToggleCallback;
    this.onPrevCycle = onPrevCycleCallback;
    this.onNextCycle = onNextCycleCallback;
    this.auth = authManager;
    this.leaderboard = leaderboardManager;
    this.multiplayer = multiplayerManager;

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
    this.hudScore = document.getElementById('hud-score');
    this.hudDestroyed = document.getElementById('hud-destroyed');
    this.hudCycleName = document.getElementById('hud-cycle-name');
    this.hudShield = document.getElementById('hud-shield');
    this.starfoxReticle = document.getElementById('starfox-reticle');
    this.blasterHeatContainer = document.getElementById('blaster-heat-container');
    this.blasterHeatFill = document.getElementById('blaster-heat-fill');
    this.blasterHeatLabel = document.getElementById('blaster-heat-label');
    this.floatingCombatContainer = document.getElementById('floating-combat-container');
    this.deathVignette = document.getElementById('death-vignette');
    this.victoryConfettiLayer = document.getElementById('victory-confetti-layer');
    this.sayanfinityBanner = document.getElementById('sayanfinity-banner');
    this.sayanTimerBar = document.getElementById('sayan-timer-bar');
    this.sayanTimerText = document.getElementById('sayan-timer-text');

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
    this.finalDestroyed = document.getElementById('final-destroyed');
    this.finalScore = document.getElementById('final-score');
    this.finalRankBadge = document.getElementById('final-rank-badge');
    this.finalRankSub = document.getElementById('final-rank-sub');
    this.gameoverWorldStatus = document.getElementById('gameover-world-status');
    this.gameoverWorldRankText = document.getElementById('gameover-world-rank-text');
    this.btnGameoverLeaderboard = document.getElementById('btn-gameover-leaderboard');
    this.btnRestart = document.getElementById('btn-restart');

    // Menu Pause & Contrôles Mobiles
    this.pauseMenu = document.getElementById('pause-menu');
    this.btnPauseResume = document.getElementById('btn-pause-resume');
    this.btnPauseRestart = document.getElementById('btn-pause-restart');
    this.btnPauseAudio = document.getElementById('btn-pause-audio');
    this.btnPauseMenu = document.getElementById('btn-pause-menu');

    this.mobileControls = document.getElementById('mobile-controls');
    this.btnMobilePause = document.getElementById('btn-mobile-pause');
    this.touchJoystickZone = document.getElementById('touch-joystick-zone');
    this.touchJoystickBase = document.getElementById('touch-joystick-base');
    this.touchJoystickKnob = document.getElementById('touch-joystick-knob');
    this.btnMobileFire = document.getElementById('btn-mobile-fire');
    this.btnMobileBoost = document.getElementById('btn-mobile-boost');

    // Feinte Cosmique & Modal Troll du Cycle 8
    this.cosmicFlash = document.getElementById('cosmic-flash');
    this.hudLoop = document.getElementById('hud-loop');
    this.climaxAlert = document.getElementById('climax-alert');
    this.climaxTitle = document.getElementById('climax-title');
    this.trollModal = document.getElementById('troll-modal');
    this.trollLoopVal = document.getElementById('troll-loop-val');
    this.btnTrollContinue = document.getElementById('btn-troll-continue');

    // Éléments du Mode Multijoueur 1v1
    this.btnOpenMultiplayer = document.getElementById('btn-open-multiplayer');
    this.multiplayerModal = document.getElementById('multiplayer-modal');
    this.btnCloseMultiplayer = document.getElementById('btn-close-multiplayer');

    this.mpTabsNav = document.getElementById('mp-tabs-nav');
    this.tabBtnRooms = document.getElementById('tab-btn-rooms');
    this.tabBtnCreate = document.getElementById('tab-btn-create');
    this.tabBtnCode = document.getElementById('tab-btn-code');

    this.mpViewRooms = document.getElementById('mp-view-rooms');
    this.mpViewCreate = document.getElementById('mp-view-create');
    this.mpViewCode = document.getElementById('mp-view-code');
    this.mpLobbyView = document.getElementById('mp-lobby-view');

    this.mpRoomsList = document.getElementById('mp-rooms-list');
    this.btnRefreshRooms = document.getElementById('btn-refresh-rooms');

    this.formCreateRoom = document.getElementById('form-create-room');
    this.inputRoomName = document.getElementById('input-room-name');
    this.selectRoomCycle = document.getElementById('select-room-cycle');
    this.checkboxRoomPrivate = document.getElementById('checkbox-room-private');
    this.btnSubmitCreateRoom = document.getElementById('btn-submit-create-room');

    this.formJoinCode = document.getElementById('form-join-code');
    this.inputJoinCode = document.getElementById('input-join-code');
    this.joinCodeError = document.getElementById('join-code-error');
    this.btnSubmitJoinCode = document.getElementById('btn-submit-join-code');

    // Éléments du Lobby
    this.lobbyRoomName = document.getElementById('lobby-room-name');
    this.lobbyRoomCode = document.getElementById('lobby-room-code');
    this.lobbyHostAvatar = document.getElementById('lobby-host-avatar');
    this.lobbyHostPseudo = document.getElementById('lobby-host-pseudo');
    this.lobbyHostReady = document.getElementById('lobby-host-ready');
    this.lobbyGuestAvatar = document.getElementById('lobby-guest-avatar');
    this.lobbyGuestPseudo = document.getElementById('lobby-guest-pseudo');
    this.lobbyGuestReady = document.getElementById('lobby-guest-ready');
    this.lobbyStatusText = document.getElementById('lobby-status-text');
    this.btnLobbyToggleReady = document.getElementById('btn-lobby-toggle-ready');
    this.btnLobbyStartRace = document.getElementById('btn-lobby-start-race');
    this.btnLobbyLeave = document.getElementById('btn-lobby-leave');

    // Widget Télémétrie Rival en Vol
    this.hudRivalCard = document.getElementById('hud-rival-card');
    this.hudRivalAvatar = document.getElementById('hud-rival-avatar');
    this.hudRivalPseudo = document.getElementById('hud-rival-pseudo');
    this.hudRivalEnergy = document.getElementById('hud-rival-energy');
    this.hudRivalDelta = document.getElementById('hud-rival-delta');

    // Modal Résultat de Duel 1v1
    this.duelResultModal = document.getElementById('duel-result-modal');
    this.duelResultTitle = document.getElementById('duel-result-title');
    this.duelResultReason = document.getElementById('duel-result-reason');
    this.duelMyPseudo = document.getElementById('duel-my-pseudo');
    this.duelMyDist = document.getElementById('duel-my-dist');
    this.duelMyCycle = document.getElementById('duel-my-cycle');
    this.duelRivalPseudo = document.getElementById('duel-rival-pseudo');
    this.duelRivalDist = document.getElementById('duel-rival-dist');
    this.duelRivalCycle = document.getElementById('duel-rival-cycle');
    this.btnDuelRematch = document.getElementById('btn-duel-rematch');
    this.btnDuelQuit = document.getElementById('btn-duel-quit');
  }

  bindEvents() {
    // 1. Bouton JOUER principal (dépend de l'état d'authentification)
    if (this.btnPlayGame) {
      const handlePlayClick = (e) => {
        if (e) e.preventDefault();

        // Si connecté avec Google mais pas encore de pseudo -> ouvrir le modal Pseudo
        if (this.auth && this.auth.user && this.auth.user.googleUid && !this.auth.hasPseudo()) {
          this.openPseudoModal();
          return;
        }

        // Si non connecté avec Google -> activer session invité
        if (!this.auth || !this.auth.isAuthenticated()) {
          if (this.auth) this.auth.loginAsGuest();
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

    // 9b. Menu Pause & Contrôle Mobile Pause
    if (this.btnPauseResume) {
      this.btnPauseResume.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameApp) window.gameApp.resumeGame();
      });
    }

    if (this.btnPauseRestart) {
      this.btnPauseRestart.addEventListener('click', (e) => {
        e.preventDefault();
        this.hidePauseMenu();
        if (window.gameApp) {
          window.gameApp.isPaused = false;
          window.gameApp.restartGame();
        }
      });
    }

    if (this.btnPauseAudio) {
      this.btnPauseAudio.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameApp && window.gameApp.audio) {
          const isMuted = window.gameApp.audio.toggleMute();
          this.setAudioState(!isMuted);
          this.btnPauseAudio.textContent = isMuted ? '🔇 Son : Coupé' : '🔊 Son : Activé';
        }
      });
    }

    if (this.btnPauseMenu) {
      this.btnPauseMenu.addEventListener('click', (e) => {
        e.preventDefault();
        this.hidePauseMenu();
        this.hideGameOver();
        if (window.gameApp) {
          window.gameApp.isPaused = false;
          window.gameApp.state = window.gameApp.STATE_MENU;
          window.gameApp.world.reset();
          this.showStartMenu();
        }
      });
    }

    if (this.btnMobilePause) {
      this.btnMobilePause.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameApp) window.gameApp.togglePause();
      });
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

    // 11. Multijoueur 1v1 (Compte Google Requis)
    if (this.btnOpenMultiplayer) {
      this.btnOpenMultiplayer.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.auth || !this.auth.isAuthenticated()) {
          this.openGoogleDirectModal();
          if (this.googleLoginError) {
            this.googleLoginError.textContent = 'Connexion Google requise : Le mode multijoueur (1 vs 1) nécessite un compte Google vérifié.';
            this.googleLoginError.classList.remove('hidden');
          }
          return;
        }
        this.openMultiplayerModal();
      });
    }

    if (this.btnCloseMultiplayer) {
      this.btnCloseMultiplayer.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMultiplayerModal();
      });
    }

    if (this.tabBtnRooms) {
      this.tabBtnRooms.addEventListener('click', () => this.switchMpTab('rooms'));
    }
    if (this.tabBtnCreate) {
      this.tabBtnCreate.addEventListener('click', () => this.switchMpTab('create'));
    }
    if (this.tabBtnCode) {
      this.tabBtnCode.addEventListener('click', () => this.switchMpTab('code'));
    }

    if (this.btnRefreshRooms) {
      this.btnRefreshRooms.addEventListener('click', () => this.refreshPublicRooms());
    }

    if (this.formCreateRoom) {
      this.formCreateRoom.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.multiplayer) return;
        const name = this.inputRoomName?.value || '';
        const isPriv = !!this.checkboxRoomPrivate?.checked;
        const cycle = parseInt(this.selectRoomCycle?.value || '0', 10);
        try {
          const room = this.multiplayer.createRoom(name, isPriv, cycle);
          this.renderLobby(room);
        } catch (err) {
          alert(err.message || 'Erreur lors de la création de la salle.');
        }
      });
    }

    if (this.formJoinCode) {
      this.formJoinCode.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.multiplayer) return;
        const code = (this.inputJoinCode?.value || '').trim().toUpperCase();
        if (!code) {
          if (this.joinCodeError) {
            this.joinCodeError.textContent = 'Veuillez saisir un code valide.';
            this.joinCodeError.classList.remove('hidden');
          }
          return;
        }
        try {
          const room = this.multiplayer.joinRoom(code);
          if (room) this.renderLobby(room);
          if (this.joinCodeError) this.joinCodeError.classList.add('hidden');
        } catch (err) {
          if (this.joinCodeError) {
            this.joinCodeError.textContent = err.message || 'Impossible de rejoindre le salon.';
            this.joinCodeError.classList.remove('hidden');
          }
        }
      });
    }

    if (this.btnLobbyToggleReady) {
      this.btnLobbyToggleReady.addEventListener('click', () => {
        if (this.multiplayer) {
          const isReady = this.multiplayer.toggleReady();
          if (this.btnLobbyToggleReady) {
            this.btnLobbyToggleReady.innerHTML = isReady ? '<span>❌</span> <span>ANNULER PRÊT</span>' : '<span>✅</span> <span>SE DÉCLARER PRÊT</span>';
          }
        }
      });
    }

    if (this.btnLobbyStartRace) {
      this.btnLobbyStartRace.addEventListener('click', () => {
        if (this.multiplayer && this.multiplayer.isHost) {
          this.multiplayer.startCountdownAndRace();
        }
      });
    }

    if (this.btnLobbyLeave) {
      this.btnLobbyLeave.addEventListener('click', () => {
        if (this.multiplayer) this.multiplayer.leaveRoom();
        this.closeLobbyView();
      });
    }

    if (this.btnDuelQuit) {
      this.btnDuelQuit.addEventListener('click', () => {
        this.closeDuelResult();
        this.showStartMenu();
      });
    }

    if (this.btnDuelRematch) {
      this.btnDuelRematch.addEventListener('click', () => {
        this.closeDuelResult();
        if (this.multiplayer && this.multiplayer.isInRoom) {
          this.openMultiplayerModal();
          this.renderLobby(this.multiplayer.currentRoom);
        } else {
          this.openMultiplayerModal();
        }
      });
    }

    // 12. Raccourcis clavier (Espace / Entrée / Échap)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.isLeaderboardVisible()) this.closeLeaderboardModal();
        if (this.isGoogleModalVisible()) this.closeGoogleDirectModal();
        if (this.isMultiplayerModalVisible()) this.closeMultiplayerModal();
        if (this.isDuelResultVisible()) this.closeDuelResult();
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.isStartMenuVisible() && !this.isAnyModalOpen()) {
          e.preventDefault();
          if (this.auth && this.auth.user && this.auth.user.googleUid && !this.auth.hasPseudo()) {
            this.openPseudoModal();
          } else {
            if (!this.auth || !this.auth.isAuthenticated()) {
              if (this.auth) this.auth.loginAsGuest();
            }
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
      this.isTrollModalVisible() ||
      this.isMultiplayerModalVisible() ||
      this.isDuelResultVisible()
    );
  }

  // --- MISE À JOUR DE L'ÉTAT D'AUTHENTIFICATION & PROFIL ---
  updateAuthState(user) {
    if (user && user.googleUid && !user.isGuest) {
      // Connecté avec Compte Google
      if (this.authUnlogged) this.authUnlogged.classList.add('hidden');
      if (this.authLogged) this.authLogged.classList.remove('hidden');

      if (this.userAvatarImg) this.userAvatarImg.src = user.picture;
      if (this.userNameDisplay) this.userNameDisplay.textContent = user.name || 'Pilote';

      const pseudo = user.pseudo ? user.pseudo.trim() : '';

      if (pseudo) {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = `@${pseudo}`;
        // Déverrouiller le bouton JOUER avec statut mondial
        if (this.btnPlayGame) {
          this.btnPlayGame.classList.remove('locked', 'guest-mode');
        }
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '▶';
        if (this.btnPlayText) this.btnPlayText.textContent = 'DÉCOLLER';
        if (this.btnPlaySub) this.btnPlaySub.textContent = `[ CLASSEMENT ACTIF • @${pseudo} ]`;
      } else {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = 'Non défini';
        // Bouton invitant à choisir son pseudo
        if (this.btnPlayGame) {
          this.btnPlayGame.classList.add('locked');
          this.btnPlayGame.classList.remove('guest-mode');
        }
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '✍️';
        if (this.btnPlayText) this.btnPlayText.textContent = 'CHOISIR MON PSEUDO';
        if (this.btnPlaySub) this.btnPlaySub.textContent = '[ PSEUDO REQUIS POUR LE CLASSEMENT ]';
      }

      // Mettre à jour le résumé des scores personnels
      this.updatePersonalBestDisplay();
    } else {
      // Non connecté avec Google (Mode Invité Solo disponible immédiatement)
      if (this.authUnlogged) this.authUnlogged.classList.remove('hidden');
      if (this.authLogged) this.authLogged.classList.add('hidden');

      if (this.btnPlayGame) {
        this.btnPlayGame.classList.remove('locked');
        this.btnPlayGame.classList.add('guest-mode');
      }
      if (this.btnPlayIcon) this.btnPlayIcon.textContent = '▶';
      if (this.btnPlayText) this.btnPlayText.textContent = 'DÉCOLLER';
      if (this.btnPlaySub) this.btnPlaySub.textContent = '[ VOL SOLO IMMÉDIAT • ESPACE OU CLIC ]';
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

  updateHUD(energy, distance, speed, heartsCount, hasShield = false, armorCount = 0, saiyanActive = false, saiyanRemaining = 0, currentScore = 0, destroyedCount = 0, heatRatio = 0, isOverheated = false) {
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
    if (this.hudScore) this.hudScore.textContent = `${Math.round(currentScore).toLocaleString('fr-FR')} PTS`;
    if (this.hudDestroyed) this.hudDestroyed.textContent = `💥 ${destroyedCount}`;

    // Bouclier d'armure
    this.updateShield(hasShield, armorCount);

    // Sayanfinity / Mode Purity
    this.updateSayanfinity(saiyanActive, saiyanRemaining);

    // Jauge de Surchauffe du Blaster
    this.updateBlasterHeat(heatRatio, isOverheated);
  }

  updateBlasterHeat(heatRatio, isOverheated) {
    if (!this.blasterHeatFill) return;
    const pct = Math.max(0, Math.min(100, (heatRatio || 0) * 100));
    this.blasterHeatFill.style.width = `${pct}%`;

    if (isOverheated) {
      this.blasterHeatFill.style.background = '#ef4444';
      this.blasterHeatFill.style.boxShadow = '0 0 12px #ef4444';
      if (this.blasterHeatLabel) {
        this.blasterHeatLabel.textContent = '⚠️ SURCHAUFFE !';
        this.blasterHeatLabel.style.color = '#ef4444';
        this.blasterHeatLabel.classList.add('pulse-alert');
      }
      if (this.starfoxReticle) {
        this.starfoxReticle.classList.add('overheated');
      }
    } else {
      if (this.starfoxReticle) {
        this.starfoxReticle.classList.remove('overheated');
      }
      if (pct > 75) {
        this.blasterHeatFill.style.background = '#f59e0b';
        this.blasterHeatFill.style.boxShadow = '0 0 8px #f59e0b';
        if (this.blasterHeatLabel) {
          this.blasterHeatLabel.textContent = 'TEMP ÉLEVÉE';
          this.blasterHeatLabel.style.color = '#f59e0b';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
      } else if (pct > 35) {
        this.blasterHeatFill.style.background = '#38bdf8';
        this.blasterHeatFill.style.boxShadow = '0 0 6px #38bdf8';
        if (this.blasterHeatLabel) {
          this.blasterHeatLabel.textContent = 'CADENCE BLASTER';
          this.blasterHeatLabel.style.color = '#38bdf8';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
      } else {
        this.blasterHeatFill.style.background = '#00f0ff';
        this.blasterHeatFill.style.boxShadow = '0 0 6px #00f0ff';
        if (this.blasterHeatLabel) {
          this.blasterHeatLabel.textContent = 'BLASTER PRÊT';
          this.blasterHeatLabel.style.color = '#94a3b8';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
      }
    }
  }

  showFloatingScore(pts, isCrit = false, label = '') {
    if (!this.floatingCombatContainer) return;
    const el = document.createElement('div');
    el.className = `floating-score-item ${isCrit ? 'crit' : ''}`;
    el.textContent = `+${pts} PTS ${label}`.trim();
    const offX = (Math.random() - 0.5) * 120;
    const offY = (Math.random() - 0.5) * 60;
    el.style.left = `calc(50% + ${offX}px)`;
    el.style.top = `calc(50% + ${offY}px)`;
    this.floatingCombatContainer.appendChild(el);
    setTimeout(() => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 850);
  }

  triggerVictoryCelebration() {
    if (!this.victoryConfettiLayer) return;
    this.victoryConfettiLayer.classList.remove('hidden');
    this.victoryConfettiLayer.innerHTML = '';
    for (let i = 0; i < 48; i++) {
      const p = document.createElement('div');
      p.className = 'victory-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 0.8}s`;
      p.style.animationDuration = `${1.2 + Math.random() * 1.6}s`;
      const colors = ['#fde047', '#4ade80', '#00f0ff', '#ff2e93', '#ffd700'];
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      this.victoryConfettiLayer.appendChild(p);
    }
    setTimeout(() => {
      if (this.victoryConfettiLayer) {
        this.victoryConfettiLayer.classList.add('hidden');
        this.victoryConfettiLayer.innerHTML = '';
      }
    }, 3200);
  }

  pulseReticleHit() {
    if (this.starfoxReticle) {
      this.starfoxReticle.classList.add('hit');
      setTimeout(() => {
        if (this.starfoxReticle) this.starfoxReticle.classList.remove('hit');
      }, 130);
    }
  }

  updateShield(hasShield, armorCount = 0) {
    if (this.hudShield) {
      if (hasShield) {
        this.hudShield.textContent = `🛡️ ACTIF (${armorCount})`;
        this.hudShield.style.color = '#00f0ff';
        this.hudShield.style.textShadow = '0 0 12px rgba(0, 240, 255, 0.8)';
      } else {
        this.hudShield.textContent = 'INACTIF';
        this.hudShield.style.color = '#64748b';
        this.hudShield.style.textShadow = 'none';
      }
    }
  }

  updateSayanfinity(active, timeRemaining = 0, maxDuration = 20.0) {
    if (!this.sayanfinityBanner) return;
    if (active && timeRemaining > 0) {
      this.sayanfinityBanner.classList.remove('hidden');
      const pct = Math.max(0, Math.min(100, (timeRemaining / maxDuration) * 100));
      if (this.sayanTimerBar) this.sayanTimerBar.style.width = `${pct}%`;
      if (this.sayanTimerText) this.sayanTimerText.textContent = `${timeRemaining.toFixed(1)}S`;
    } else {
      this.sayanfinityBanner.classList.add('hidden');
    }
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
    if (score >= 75000) {
      return {
        rank: 'MUCH LOVE',
        title: 'RANG SUPRÊME • LÉGENDE COSMIQUE',
        desc: 'L\'amour absolu transcende l\'abysse et la folie de l\'espace-temps !',
        color: '#ff2e93',
        glow: 'rgba(255, 46, 147, 0.95)',
        isSupreme: true
      };
    } else if (score >= 45000) {
      return {
        rank: 'SUBA Y SU',
        title: 'LÉGENDAIRE / EXCEPTIONNEL',
        desc: 'Traversée divine au-delà de l\'horizon des événements !',
        color: '#fef08a',
        glow: 'rgba(254, 240, 138, 0.9)',
        isSupreme: false
      };
    } else if (score >= 28000) {
      return {
        rank: 'SUBA Y',
        title: 'TRÈS BON SCORE • PILOTE D\'ÉLITE',
        desc: 'Maîtrise transcendante de l\'ascension et du tir tactique !',
        color: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.8)',
        isSupreme: false
      };
    } else if (score >= 15000) {
      return {
        rank: 'SUBA',
        title: 'BON SCORE • CONFIRMÉ',
        desc: 'Belle endurance dans l\'abysse gravitationnel.',
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.7)',
        isSupreme: false
      };
    } else {
      return {
        rank: 'SU',
        title: 'SCORE STANDARD • APPRENTI',
        desc: 'Premier contact avec le sillage de Nity. Visez 15 000 PTS pour débloquer SUBA !',
        color: '#94a3b8',
        glow: 'rgba(148, 163, 184, 0.5)',
        isSupreme: false
      };
    }
  }

  // --- GAME OVER & ANIMATION CINÉMATIQUE DE MORT ---
  showGameOver(reason, distance, maxSpeed, heartsCount, destroyedCount = 0, totalScore = null, worldRankResult = null) {
    if (totalScore == null) {
      totalScore = Math.floor(distance * 10 + heartsCount * 250 + destroyedCount * 150);
    }
    const rankInfo = this.computeRank(totalScore);

    // 1. Flash d'alerte & effet de distorsion rouge sombre
    if (this.deathVignette) {
      this.deathVignette.classList.remove('hidden');
      this.deathVignette.classList.add('flash-death');
      setTimeout(() => {
        if (this.deathVignette) this.deathVignette.classList.remove('flash-death');
      }, 1100);
    }

    if (this.deathReason) {
      this.deathReason.textContent = reason === 'energy'
        ? 'ÉNERGIE DU CŒUR ÉPUISÉE • SIGNAL ÉTEINT'
        : 'IMPACT CRITIQUE • STRUCTURE DÉSINTÉGRÉE';
    }

    // 2. Défilement odomètre dynamique pour toutes les statistiques
    this.animateStatValue(this.finalDistance, 0, Math.round(distance), 750, ' M');
    this.animateStatValue(this.finalSpeed, 0, Math.round(maxSpeed * 3.6), 750, ' KM/H');
    this.animateStatValue(this.finalHearts, 0, heartsCount, 600, '');
    this.animateStatValue(this.finalDestroyed, 0, destroyedCount, 700, '');
    this.animateStatValue(this.finalScore, 0, totalScore, 900, ' PTS', true);

    // 3. Animation d'impact percutant sur le Badge de Rang ("Badge Slam")
    if (this.finalRankBadge) {
      this.finalRankBadge.textContent = rankInfo.rank;
      this.finalRankBadge.style.color = rankInfo.color;
      this.finalRankBadge.style.borderColor = rankInfo.color;
      this.finalRankBadge.style.boxShadow = `0 0 35px ${rankInfo.glow}`;

      this.finalRankBadge.classList.remove('badge-impact', 'badge-much-love');
      void this.finalRankBadge.offsetWidth; // Force reflow
      this.finalRankBadge.classList.add('badge-impact');
      if (rankInfo.isSupreme) {
        this.finalRankBadge.classList.add('badge-much-love');
      }
    }

    if (this.finalRankSub) {
      this.finalRankSub.textContent = `${rankInfo.title} — ${rankInfo.desc}`;
    }

    // Affichage du statut du classement mondial
    if (this.auth && this.auth.isGuest()) {
      if (this.gameoverWorldStatus) this.gameoverWorldStatus.textContent = 'SESSION INVITÉE (SOLO HORS CLASSEMENT)';
      if (this.gameoverWorldRankText) this.gameoverWorldRankText.textContent = 'Score non inscrit au classement mondial. Connectez votre compte Google pour immortaliser vos records !';
    } else if (worldRankResult) {
      this.updateGameOverWorldRank(worldRankResult);
    } else {
      if (this.gameoverWorldStatus) this.gameoverWorldStatus.textContent = 'ENREGISTREMENT AU CLASSEMENT MONDIAL...';
      if (this.gameoverWorldRankText) this.gameoverWorldRankText.textContent = 'Connexion au serveur cloud...';
    }

    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
      const card = this.gameOverModal.querySelector('.modal-card');
      if (card) {
        card.classList.remove('animate-death-enter');
        void card.offsetWidth;
        card.classList.add('animate-death-enter');
      }
    }
  }

  animateStatValue(element, startVal, endVal, durationMs = 700, suffix = '', formatLocale = false) {
    if (!element) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1.0, (now - start) / durationMs);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(startVal + (endVal - startVal) * ease);
      element.textContent = (formatLocale ? cur.toLocaleString('fr-FR') : cur) + suffix;
      if (p < 1.0) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
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

  // --- GESTION DU MENU PAUSE (ÉCHAP / BOUTON PAUSE) ---
  showPauseMenu() {
    if (this.pauseMenu) {
      this.pauseMenu.classList.remove('hidden');
    }
  }

  hidePauseMenu() {
    if (this.pauseMenu) {
      this.pauseMenu.classList.add('hidden');
    }
  }

  isPauseMenuVisible() {
    return this.pauseMenu && !this.pauseMenu.classList.contains('hidden');
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

  // --- GESTION DE L'INTERFACE MULTIJOUEUR 1V1 ---
  setMultiplayer(mp) {
    this.multiplayer = mp;
    if (this.multiplayer) {
      this.multiplayer.onRoomUpdate = (room) => this.renderLobby(room);
      this.multiplayer.onRoomsListChanged = (rooms) => this.renderPublicRooms(rooms);
      this.multiplayer.onDuelStart = (startCycle) => {
        this.closeMultiplayerModal();
        this.hideStartMenu();
        if (this.hudRivalCard) this.hudRivalCard.classList.remove('hidden');
        if (window.gameApp) {
          window.gameApp.startMultiplayerGame(startCycle);
        }
      };
      this.multiplayer.onDuelEnd = (result) => {
        this.showDuelResult(result);
      };
      this.multiplayer.onRivalTelemetry = (data) => {
        const myDist = window.gameApp ? window.gameApp.distance : 0;
        this.updateRivalTelemetry(data, data.distance - myDist);
      };
    }
  }

  openMultiplayerModal() {
    if (!this.auth || !this.auth.isAuthenticated()) {
      this.openGoogleDirectModal();
      return;
    }
    if (!this.auth.hasPseudo()) {
      this.openPseudoModal();
      return;
    }

    if (this.multiplayerModal) {
      this.multiplayerModal.classList.remove('hidden');
      if (this.multiplayer && this.multiplayer.isInRoom) {
        this.renderLobby(this.multiplayer.currentRoom);
      } else {
        this.switchMpTab('rooms');
        this.refreshPublicRooms();
      }
    }
  }

  closeMultiplayerModal() {
    if (this.multiplayerModal) this.multiplayerModal.classList.add('hidden');
  }

  isMultiplayerModalVisible() {
    return this.multiplayerModal && !this.multiplayerModal.classList.contains('hidden');
  }

  switchMpTab(tabName) {
    if (this.mpLobbyView) this.mpLobbyView.classList.add('hidden');
    if (this.mpTabsNav) this.mpTabsNav.classList.remove('hidden');

    [this.tabBtnRooms, this.tabBtnCreate, this.tabBtnCode].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    [this.mpViewRooms, this.mpViewCreate, this.mpViewCode].forEach(v => {
      if (v) v.classList.add('hidden');
    });

    if (tabName === 'rooms') {
      if (this.tabBtnRooms) this.tabBtnRooms.classList.add('active');
      if (this.mpViewRooms) this.mpViewRooms.classList.remove('hidden');
      this.refreshPublicRooms();
    } else if (tabName === 'create') {
      if (this.tabBtnCreate) this.tabBtnCreate.classList.add('active');
      if (this.mpViewCreate) this.mpViewCreate.classList.remove('hidden');
    } else if (tabName === 'code') {
      if (this.tabBtnCode) this.tabBtnCode.classList.add('active');
      if (this.mpViewCode) this.mpViewCode.classList.remove('hidden');
    }
  }

  async refreshPublicRooms() {
    if (!this.multiplayer) return;
    if (this.mpRoomsList) {
      this.mpRoomsList.innerHTML = `
        <div class="mp-empty-state">
          <span class="live-dot" style="display:inline-block;margin-right:6px;"></span>
          Recherche des salons mondiaux en direct sur le cloud...
        </div>
      `;
    }
    try {
      const rooms = await this.multiplayer.getPublicRooms();
      this.renderPublicRooms(rooms);
    } catch (e) {
      console.warn('Erreur chargement salons cloud:', e);
      this.renderPublicRooms([]);
    }
  }

  renderPublicRooms(rooms) {
    if (!this.mpRoomsList) return;
    this.mpRoomsList.innerHTML = '';

    const available = (rooms || []).filter(r => r.status === 'waiting' && !r.isPrivate);

    if (available.length === 0) {
      this.mpRoomsList.innerHTML = `
        <div class="mp-empty-state">
          Aucun salon public disponible pour le moment.<br>
          Créez le vôtre dans l'onglet « CRÉER UN SALON » ou partagez un code privé !
        </div>
      `;
      return;
    }

    available.forEach(r => {
      const item = document.createElement('div');
      item.className = 'mp-room-item';
      const avatarSrc = r.host.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(r.host.pseudo)}&backgroundColor=020617`;
      const cycleName = (CYCLES_NAMES && CYCLES_NAMES[r.startCycleIndex]) ? CYCLES_NAMES[r.startCycleIndex] : `Cycle ${(r.startCycleIndex || 0) + 1}`;

      item.innerHTML = `
        <div class="room-host-info">
          <img class="room-host-avatar" src="${avatarSrc}" alt="${r.host.pseudo}" />
          <div class="room-texts">
            <span class="room-name">${r.name}</span>
            <span class="room-meta">Hôte: <strong>@${r.host.pseudo}</strong> &bull; Départ: ${cycleName}</span>
          </div>
        </div>
        <button class="btn-join-room" type="button" data-room-id="${r.roomId}">
          REJOINDRE LE DUEL
        </button>
      `;

      item.querySelector('.btn-join-room').addEventListener('click', () => {
        if (this.multiplayer) {
          try {
            const room = this.multiplayer.joinRoom(r.roomId);
            if (room) this.renderLobby(room);
          } catch (err) {
            alert(err.message || 'Impossible de rejoindre le salon.');
          }
        }
      });

      this.mpRoomsList.appendChild(item);
    });
  }

  renderLobby(room) {
    if (!room && this.multiplayer) {
      room = this.multiplayer.currentRoom;
    }
    if (room && this.multiplayer && room.roomId) {
      const fresh = this.multiplayer.getRoomById(room.roomId);
      if (fresh) {
        room = fresh;
        this.multiplayer.currentRoom = fresh;
        if (this.multiplayer.isHost && fresh.guest) {
          this.multiplayer.opponentUser = fresh.guest;
          this.multiplayer.opponentReady = !!fresh.guestReady;
        } else if (!this.multiplayer.isHost && fresh.host) {
          this.multiplayer.opponentUser = fresh.host;
          this.multiplayer.opponentReady = !!fresh.hostReady;
        }
      }
    }
    if (!room) return;

    if (this.mpTabsNav) this.mpTabsNav.classList.add('hidden');
    [this.mpViewRooms, this.mpViewCreate, this.mpViewCode].forEach(v => {
      if (v) v.classList.add('hidden');
    });

    if (this.mpLobbyView) this.mpLobbyView.classList.remove('hidden');

    if (this.lobbyRoomName) this.lobbyRoomName.textContent = room.name || 'Salon 1v1';
    if (this.lobbyRoomCode) this.lobbyRoomCode.textContent = room.roomId || 'INFI-XXXX';

    // Infos Hôte
    if (this.lobbyHostPseudo) this.lobbyHostPseudo.textContent = `@${room.host.pseudo}`;
    if (this.lobbyHostAvatar) {
      this.lobbyHostAvatar.src = room.host.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(room.host.pseudo)}&backgroundColor=020617`;
    }
    if (this.lobbyHostReady) {
      if (room.hostReady) {
        this.lobbyHostReady.textContent = 'PRÊT !';
        this.lobbyHostReady.className = 'lobby-ready-tag ready';
      } else {
        this.lobbyHostReady.textContent = 'EN ATTENTE';
        this.lobbyHostReady.className = 'lobby-ready-tag not-ready';
      }
    }

    // Infos Guest
    if (room.guest) {
      if (this.lobbyGuestPseudo) this.lobbyGuestPseudo.textContent = `@${room.guest.pseudo}`;
      if (this.lobbyGuestAvatar) {
        this.lobbyGuestAvatar.src = room.guest.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(room.guest.pseudo)}&backgroundColor=020617`;
      }
      if (this.lobbyGuestReady) {
        if (room.guestReady) {
          this.lobbyGuestReady.textContent = 'PRÊT !';
          this.lobbyGuestReady.className = 'lobby-ready-tag ready';
        } else {
          this.lobbyGuestReady.textContent = 'EN PRÉPARATION';
          this.lobbyGuestReady.className = 'lobby-ready-tag not-ready';
        }
      }
      if (this.lobbyStatusText) {
        if (room.hostReady && room.guestReady) {
          this.lobbyStatusText.textContent = 'Les 2 pilotes sont prêts ! Lancement du duel imminent !';
          this.lobbyStatusText.style.color = '#4ade80';
        } else {
          this.lobbyStatusText.textContent = 'Adversaire connecté ! Cliquez sur « SE DÉCLARER PRÊT »';
          this.lobbyStatusText.style.color = '#facc15';
        }
      }
    } else {
      if (this.lobbyGuestPseudo) this.lobbyGuestPseudo.textContent = 'En attente...';
      if (this.lobbyGuestAvatar) this.lobbyGuestAvatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=waiting&backgroundColor=020617';
      if (this.lobbyGuestReady) {
        this.lobbyGuestReady.textContent = 'NON CONNECTÉ';
        this.lobbyGuestReady.className = 'lobby-ready-tag not-ready';
      }
      if (this.lobbyStatusText) {
        this.lobbyStatusText.textContent = `Partagez le code [ ${room.roomId} ] pour inviter un ami ou attendez un joueur public.`;
        this.lobbyStatusText.style.color = '#94a3b8';
      }
    }

    // Déverrouillage du bouton de lancement pour l'hôte
    if (this.btnLobbyStartRace) {
      const canStart = this.multiplayer && this.multiplayer.isHost && room.guest && room.hostReady && room.guestReady;
      if (canStart) {
        this.btnLobbyStartRace.classList.remove('locked');
      } else {
        this.btnLobbyStartRace.classList.add('locked');
      }
    }
  }

  closeLobbyView() {
    if (this.mpLobbyView) this.mpLobbyView.classList.add('hidden');
    if (this.mpTabsNav) this.mpTabsNav.classList.remove('hidden');
    this.switchMpTab('rooms');
  }

  updateRivalTelemetry(data, deltaDistance) {
    if (!data) return;
    if (this.hudRivalCard && this.hudRivalCard.classList.contains('hidden')) {
      this.hudRivalCard.classList.remove('hidden');
    }
    if (this.hudRivalPseudo && this.multiplayer && this.multiplayer.opponentUser) {
      this.hudRivalPseudo.textContent = `@${this.multiplayer.opponentUser.pseudo}`;
    }
    if (this.hudRivalAvatar && this.multiplayer && this.multiplayer.opponentUser) {
      this.hudRivalAvatar.src = this.multiplayer.opponentUser.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(this.multiplayer.opponentUser.pseudo)}&backgroundColor=020617`;
    }
    if (this.hudRivalEnergy) {
      const e = Math.max(0, Math.min(100, data.energy || 0));
      this.hudRivalEnergy.style.width = `${e}%`;
    }
    if (this.hudRivalDelta) {
      const d = Math.round(deltaDistance || 0);
      this.hudRivalDelta.textContent = d >= 0 ? `+${d} M` : `${d} M`;
      this.hudRivalDelta.style.color = d >= 0 ? '#4ade80' : '#f87171';
    }
  }

  hideRivalTelemetry() {
    if (this.hudRivalCard) this.hudRivalCard.classList.add('hidden');
  }

  showDuelResult(result) {
    if (!this.duelResultModal) return;
    this.duelResultModal.classList.remove('hidden');

    const isWinner = !!result.isWinner;
    const card = this.duelResultModal.querySelector('.modal-card');
    if (card) {
      card.classList.remove('animate-victory-enter', 'animate-death-enter');
      void card.offsetWidth;
      card.classList.add(isWinner ? 'animate-victory-enter' : 'animate-death-enter');
    }

    if (isWinner) {
      this.triggerVictoryCelebration();
      if (window.gameApp && window.gameApp.audio && window.gameApp.audio.playVictoryFanfare) {
        window.gameApp.audio.playVictoryFanfare();
      }
    }

    if (this.duelResultTitle) {
      this.duelResultTitle.textContent = isWinner ? '🏆 VICTOIRE ÉCLATANTE !' : '💀 DÉFAITE HONORABLE !';
      this.duelResultTitle.style.color = isWinner ? '#4ade80' : '#f87171';
    }
    if (this.duelResultReason) {
      this.duelResultReason.textContent = result.reason || (isWinner ? 'Vous avez survécu le plus loin !' : 'Votre vaisseau a été neutralisé.');
    }

    const myUser = this.auth ? this.auth.getUser() : null;
    const rivalUser = this.multiplayer ? this.multiplayer.opponentUser : null;

    if (this.duelMyPseudo) this.duelMyPseudo.textContent = myUser ? `@${myUser.pseudo}` : '@VOUS';
    if (this.duelRivalPseudo) this.duelRivalPseudo.textContent = rivalUser ? `@${rivalUser.pseudo}` : '@RIVAL';

    const myDist = window.gameApp ? Math.round(window.gameApp.distance) : 0;
    const myCycle = window.gameApp && window.gameApp.world ? window.gameApp.world.cycle.name : 'Cycle 1';

    if (this.duelMyDist) this.duelMyDist.textContent = `${myDist} M`;
    if (this.duelMyCycle) this.duelMyCycle.textContent = myCycle;

    if (this.duelRivalDist) this.duelRivalDist.textContent = `${Math.round(result.rivalDistance || 0)} M`;
    if (this.duelRivalCycle) {
      const cIdx = typeof result.rivalCycle === 'number' ? result.rivalCycle : 0;
      this.duelRivalCycle.textContent = (CYCLES_NAMES && CYCLES_NAMES[cIdx]) ? CYCLES_NAMES[cIdx] : `Cycle ${cIdx + 1}`;
    }
  }

  closeDuelResult() {
    if (this.duelResultModal) this.duelResultModal.classList.add('hidden');
    this.hideRivalTelemetry();
  }

  isDuelResultVisible() {
    return this.duelResultModal && !this.duelResultModal.classList.contains('hidden');
  }
}

const CYCLES_NAMES = [
  'Chute (Eau)',
  'Résilience (Terre)',
  'Obsession (Feu)',
  'Amour (Électricité)',
  'Bonheur (Lumière)',
  'Chaos (Ombre)',
  'Ambition (Vent)',
  'Folie (Cosmos)'
];

