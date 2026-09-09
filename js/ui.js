/**
 * // SOUNDRISE : INFINITY RUN - by zanioxx_off
 * // SOUNDRISE : INFINITY RUN - INTERFACE UTILISATEUR, AUTHENTIFICATION & CLASSEMENT MONDIAL
 * Écran d'accueil épuré, Authentification Compte Pilote, Gestion du Pseudo,
 * Leaderboard mondial en direct, Jauge d'énergie et Écran de Game Over synchronisé.
 */
import { i18n, t } from './i18n.js';
import { settings } from './settings.js';

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
    this.applyLanguage();
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

    // Profil joueur & Session
    this.authUnlogged = document.getElementById('auth-unlogged');
    this.authLogged = document.getElementById('auth-logged');

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
    this.pseudoPilotName = document.getElementById('pseudo-pilot-name');
    this.pseudoPilotEmail = document.getElementById('pseudo-pilot-email');
    this.formPseudo = document.getElementById('form-pseudo');
    this.inputPlayerPseudo = document.getElementById('input-player-pseudo');
    this.pseudoErrorMsg = document.getElementById('pseudo-error-msg');
    this.btnConfirmPseudo = document.getElementById('btn-confirm-pseudo');

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

    // Modal Paramètres (Audio, Langue, Commandes, Graphismes)
    this.settingsModal = document.getElementById('settings-modal');
    this.btnOpenSettings = document.getElementById('btn-open-settings');
    this.btnPauseSettings = document.getElementById('btn-pause-settings');
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.sliderMusicVol = document.getElementById('slider-music-vol');
    this.musicVolVal = document.getElementById('music-vol-val');
    this.sliderSfxVol = document.getElementById('slider-sfx-vol');
    this.sfxVolVal = document.getElementById('sfx-vol-val');
    this.sliderSensitivity = document.getElementById('slider-sensitivity');
    this.sensVal = document.getElementById('sens-val');
    this.toggleScreenShake = document.getElementById('toggle-screen-shake');
    this.toggleHaptics = document.getElementById('toggle-haptics');
    this.toggleGyro = document.getElementById('toggle-gyro');
    this.mobilePortraitBanner = document.getElementById('mobile-portrait-banner');
    this.btnDismissPortrait = document.getElementById('btn-dismiss-portrait');
    this.langFlagButtons = document.querySelectorAll('.btn-lang-flag');
    this.qualityButtons = document.querySelectorAll('.btn-quality-opt');

    // Modal Compte Pilote (Connexion, Inscription, Rôle Fondateur)
    this.accountModal = document.getElementById('account-modal');
    this.btnOpenAccountModal = document.getElementById('btn-open-account-modal');
    this.btnOpenAccountProfile = document.getElementById('btn-open-account-profile');
    this.btnCloseAccount = document.getElementById('btn-close-account');
    this.accountProfileView = document.getElementById('account-profile-view');
    this.accountFormsView = document.getElementById('account-forms-view');
    this.tabBtnRegister = document.getElementById('tab-btn-register');
    this.tabBtnLogin = document.getElementById('tab-btn-login');
    this.formRegister = document.getElementById('form-register');
    this.formLogin = document.getElementById('form-login');
    this.regEmail = document.getElementById('reg-email');
    this.regPseudo = document.getElementById('reg-pseudo');
    this.regPassword = document.getElementById('reg-password');
    this.regError = document.getElementById('reg-error');
    this.logEmail = document.getElementById('log-email');
    this.logPassword = document.getElementById('log-password');
    this.logError = document.getElementById('log-error');
    this.accountAvatarLarge = document.getElementById('account-avatar-large');
    this.accountPseudoLarge = document.getElementById('account-pseudo-large');
    this.accountFounderTag = document.getElementById('account-founder-tag');
    this.accountEmailDisplay = document.getElementById('account-email-display');
    this.asScore = document.getElementById('as-score');
    this.asDist = document.getElementById('as-dist');
    this.asRank = document.getElementById('as-rank');
    this.btnAccountLogout = document.getElementById('btn-account-logout');
    this.userFounderBadge = document.getElementById('user-founder-badge');

    // HUD Duel 1v1 (3 vies)
    this.hudDuelLivesBar = document.getElementById('hud-duel-lives-bar');
    this.myLivesDisplay = document.getElementById('my-lives-display');
    this.rivalLivesDisplay = document.getElementById('rival-lives-display');
    this.rivalLivesLabel = document.getElementById('rival-lives-label');

    // Panel Fondateur (administration exclusive @zanioxx_off)
    this.founderModal = document.getElementById('founder-modal');
    this.btnOpenFounderPanel = document.getElementById('btn-open-founder-panel');
    this.btnCloseFounder = document.getElementById('btn-close-founder');
    this.ftabBtnMaintenance = document.getElementById('ftab-btn-maintenance');
    this.ftabBtnLeaderboard = document.getElementById('ftab-btn-leaderboard');
    this.ftabBtnUsers = document.getElementById('ftab-btn-users');
    this.ftabBtnLogs = document.getElementById('ftab-btn-logs');
    this.ftabMaintenance = document.getElementById('ftab-maintenance');
    this.ftabLeaderboard = document.getElementById('ftab-leaderboard');
    this.ftabUsers = document.getElementById('ftab-users');
    this.ftabLogs = document.getElementById('ftab-logs');
    this.toggleMaintenanceMode = document.getElementById('toggle-maintenance-mode');
    this.maintenanceStatusLabel = document.getElementById('maintenance-status-label');
    this.inputMaintenanceReason = document.getElementById('input-maintenance-reason');
    this.btnFounderResetLb = document.getElementById('btn-founder-reset-lb');
    this.founderResetConfirm = document.getElementById('founder-reset-confirm');
    this.inputResetConfirm = document.getElementById('input-reset-confirm');
    this.btnConfirmResetLb = document.getElementById('btn-confirm-reset-lb');
    this.founderUsersCount = document.getElementById('founder-users-count');
    this.btnRefreshUsers = document.getElementById('btn-refresh-users');
    this.founderUsersBody = document.getElementById('founder-users-body');
    this.founderLogsCount = document.getElementById('founder-logs-count');
    this.btnClearLogs = document.getElementById('btn-clear-logs');
    this.founderLogsConsole = document.getElementById('founder-logs-console');

    // Écran de Maintenance Globale
    this.maintenanceOverlay = document.getElementById('maintenance-overlay');
    this.maintenanceReasonDisplay = document.getElementById('maintenance-reason-display');
    this.maintenanceByDisplay = document.getElementById('maintenance-by-display');
  }

  bindEvents() {
    // 1. Bouton JOUER principal (dépend de l'état d'authentification)
    if (this.btnPlayGame) {
      const handlePlayClick = (e) => {
        if (e) e.preventDefault();

        // Si non connecté -> activer la session invité
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

    // 2. Bouton Modification du Pseudo
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

    // 3. Déconnexion
    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
          if (this.auth) this.auth.logout();
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
      const handleMobilePause = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (window.gameApp) {
          window.gameApp.togglePause();
          if (typeof window.gameApp.triggerHaptic === 'function') {
            window.gameApp.triggerHaptic(18);
          }
        }
      };
      this.btnMobilePause.addEventListener('touchstart', handleMobilePause, { passive: false });
      this.btnMobilePause.addEventListener('click', handleMobilePause);
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

    // 11. Multijoueur 1v1 (Compte Pilote Requis)
    if (this.btnOpenMultiplayer) {
      this.btnOpenMultiplayer.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.auth || !this.auth.isAuthenticated() || this.auth.isGuest()) {
          this.openAccountModal();
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

    // 12. Paramètres (Bouton d'ouverture, fermeture, sliders et langue)
    if (this.btnOpenSettings) {
      this.btnOpenSettings.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSettingsModal();
      });
    }
    if (this.btnPauseSettings) {
      this.btnPauseSettings.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSettingsModal();
      });
    }
    if (this.btnCloseSettings) {
      this.btnCloseSettings.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeSettingsModal();
      });
    }

    if (this.sliderMusicVol) {
      this.sliderMusicVol.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.musicVolVal) this.musicVolVal.textContent = `${val}%`;
        settings.setMusicVolume(val / 100);
      });
    }
    if (this.sliderSfxVol) {
      this.sliderSfxVol.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.sfxVolVal) this.sfxVolVal.textContent = `${val}%`;
        settings.setSfxVolume(val / 100);
      });
    }
    if (this.sliderSensitivity) {
      this.sliderSensitivity.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.sensVal) this.sensVal.textContent = `${val}%`;
        settings.setFlightSensitivity(val / 100);
      });
    }
    if (this.toggleScreenShake) {
      this.toggleScreenShake.addEventListener('change', (e) => {
        settings.setScreenShake(e.target.checked);
      });
    }

    if (this.toggleHaptics) {
      this.toggleHaptics.addEventListener('change', (e) => {
        settings.setHaptics(e.target.checked);
      });
    }

    if (this.toggleGyro) {
      this.toggleGyro.addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        if (enabled && window.gameApp && window.gameApp.requestGyroPermission) {
          const granted = await window.gameApp.requestGyroPermission();
          if (!granted) {
            e.target.checked = false;
            return;
          }
        }
        settings.setGyroControls(enabled);
      });
    }

    if (this.btnDismissPortrait) {
      this.btnDismissPortrait.addEventListener('click', () => {
        if (this.mobilePortraitBanner) this.mobilePortraitBanner.classList.add('hidden');
        sessionStorage.setItem('dismiss_portrait_banner', '1');
      });
    }

    if (this.langFlagButtons) {
      this.langFlagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.dataset.lang;
          settings.setLanguage(lang);
          i18n.setLanguage(lang);
          this.langFlagButtons.forEach(b => b.classList.toggle('active', b === btn));
          this.applyLanguage();
        });
      });
    }

    if (this.qualityButtons) {
      this.qualityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.quality;
          settings.setGraphicsQuality(q);
          this.qualityButtons.forEach(b => b.classList.toggle('active', b === btn));
        });
      });
    }

    // 13. Compte Pilote (Connexion, Inscription, Rôle Fondateur)
    if (this.btnOpenAccountModal) {
      this.btnOpenAccountModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAccountModal();
      });
    }
    if (this.btnOpenAccountProfile) {
      this.btnOpenAccountProfile.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAccountModal();
      });
    }
    if (this.btnCloseAccount) {
      this.btnCloseAccount.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeAccountModal();
      });
    }

    if (this.tabBtnRegister) {
      this.tabBtnRegister.addEventListener('click', () => this.switchAccountTab('register'));
    }
    if (this.tabBtnLogin) {
      this.tabBtnLogin.addEventListener('click', () => this.switchAccountTab('login'));
    }

    if (this.formRegister) {
      this.formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.regEmail?.value || '';
        const pseudo = this.regPseudo?.value || '';
        const password = this.regPassword?.value || '';

        if (!this.auth) return;
        const res = this.auth.register(email, pseudo, password);
        if (res.success) {
          this.closeAccountModal();
          this.updateAuthState(this.auth.getUser());
          this.showClimaxAlert(res.user.role === 'founder' ? '👑 BIENVENUE FONDATEUR ZANIOXX_OFF !' : '✨ COMPTE CRÉÉ AVEC SUCCÈS !', true);
          setTimeout(() => this.hideClimaxAlert(), 3000);
        } else {
          if (this.regError) {
            this.regError.textContent = res.message || 'Erreur d\'inscription.';
            this.regError.classList.remove('hidden');
          }
        }
      });
    }

    if (this.formLogin) {
      this.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.logEmail?.value || '';
        const password = this.logPassword?.value || '';

        if (!this.auth) return;
        const res = this.auth.login(email, password);
        if (res.success) {
          this.closeAccountModal();
          this.updateAuthState(this.auth.getUser());
          this.showClimaxAlert(res.user.role === 'founder' ? '👑 HEUREUX DE VOUS REVOIR FONDATEUR !' : `👋 BON RETOUR @${res.user.pseudo} !`, true);
          setTimeout(() => this.hideClimaxAlert(), 3000);
        } else {
          if (this.logError) {
            this.logError.textContent = res.message || 'Identifiants invalides.';
            this.logError.classList.remove('hidden');
          }
        }
      });
    }

    if (this.btnAccountLogout) {
      this.btnAccountLogout.addEventListener('click', () => {
        if (this.auth) {
          this.auth.logout();
          this.closeAccountModal();
          this.updateAuthState(this.auth.getUser());
        }
      });
    }

    // 14. Panel Fondateur Officiel
    if (this.btnOpenFounderPanel) {
      this.btnOpenFounderPanel.addEventListener('click', (e) => {
        e.preventDefault();
        this.openFounderPanel();
      });
    }
    if (this.btnCloseFounder) {
      this.btnCloseFounder.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeFounderPanel();
      });
    }

    // Navigation des 4 onglets du panel fondateur
    const founderTabBtns = [this.ftabBtnMaintenance, this.ftabBtnLeaderboard, this.ftabBtnUsers, this.ftabBtnLogs];
    const founderTabViews = [this.ftabMaintenance, this.ftabLeaderboard, this.ftabUsers, this.ftabLogs];
    founderTabBtns.forEach((btn, idx) => {
      if (btn) {
        btn.addEventListener('click', () => {
          founderTabBtns.forEach(b => { if (b) b.classList.remove('active'); });
          founderTabViews.forEach(v => { if (v) v.classList.add('hidden'); });
          btn.classList.add('active');
          if (founderTabViews[idx]) founderTabViews[idx].classList.remove('hidden');
          if (idx === 2) this.populateUserRegistry();
          if (idx === 3) this.refreshAuditLogs();
        });
      }
    });

    // Basculement Mode Maintenance
    if (this.toggleMaintenanceMode) {
      this.toggleMaintenanceMode.addEventListener('change', () => this.handleMaintenanceToggle());
    }

    // Réinitialisation du Classement Mondial
    if (this.btnFounderResetLb) {
      this.btnFounderResetLb.addEventListener('click', () => {
        if (this.founderResetConfirm) this.founderResetConfirm.classList.remove('hidden');
      });
    }
    if (this.btnConfirmResetLb) {
      this.btnConfirmResetLb.addEventListener('click', () => this.handleResetLeaderboard());
    }

    // Actualisation du Registre Utilisateurs
    if (this.btnRefreshUsers) {
      this.btnRefreshUsers.addEventListener('click', () => this.populateUserRegistry());
    }

    // Vidage des Logs
    if (this.btnClearLogs) {
      this.btnClearLogs.addEventListener('click', () => this.handleClearLogs());
    }

    // 15. Raccourcis clavier (Espace / Entrée / Échap)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.isFounderModalVisible()) this.closeFounderPanel();
        if (this.isLeaderboardVisible()) this.closeLeaderboardModal();
        if (this.isMultiplayerModalVisible()) this.closeMultiplayerModal();
        if (this.isDuelResultVisible()) this.closeDuelResult();
        if (this.isSettingsModalVisible()) this.closeSettingsModal();
        if (this.isAccountModalVisible()) this.closeAccountModal();
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.isStartMenuVisible() && !this.isAnyModalOpen()) {
          e.preventDefault();
          if (!this.auth || !this.auth.isAuthenticated()) {
            if (this.auth) this.auth.loginAsGuest();
          }
          this.hideStartMenu();
          if (this.onStart) this.onStart();
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
      this.isLeaderboardVisible() ||
      this.isGameOverVisible() ||
      this.isTrollModalVisible() ||
      this.isMultiplayerModalVisible() ||
      this.isDuelResultVisible() ||
      this.isSettingsModalVisible() ||
      this.isAccountModalVisible() ||
      this.isFounderModalVisible()
    );
  }

  // --- MODAL PARAMÈTRES ---
  openSettingsModal() {
    if (!this.settingsModal) return;
    this.updateSettingsUI();
    this.settingsModal.classList.remove('hidden');
  }

  closeSettingsModal() {
    if (this.settingsModal) this.settingsModal.classList.add('hidden');
  }

  isSettingsModalVisible() {
    return this.settingsModal && !this.settingsModal.classList.contains('hidden');
  }

  updateSettingsUI() {
    const s = settings.getAll();
    if (this.sliderMusicVol) this.sliderMusicVol.value = Math.round(s.musicVolume * 100);
    if (this.musicVolVal) this.musicVolVal.textContent = `${Math.round(s.musicVolume * 100)}%`;
    if (this.sliderSfxVol) this.sliderSfxVol.value = Math.round(s.sfxVolume * 100);
    if (this.sfxVolVal) this.sfxVolVal.textContent = `${Math.round(s.sfxVolume * 100)}%`;
    if (this.sliderSensitivity) this.sliderSensitivity.value = Math.round(s.flightSensitivity * 100);
    if (this.sensVal) this.sensVal.textContent = `${Math.round(s.flightSensitivity * 100)}%`;
    if (this.toggleScreenShake) this.toggleScreenShake.checked = !!s.screenShake;
    if (this.toggleHaptics) this.toggleHaptics.checked = s.haptics !== false;
    if (this.toggleGyro) this.toggleGyro.checked = !!s.gyroControls;

    if (this.langFlagButtons) {
      this.langFlagButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === s.language);
      });
    }
    if (this.qualityButtons) {
      this.qualityButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.quality === s.graphicsQuality);
      });
    }
  }

  checkOrientation(isMobile, isPortrait) {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('is-mobile', !!isMobile);
      document.body.classList.toggle('is-portrait', !!isPortrait);
    }
  }

  // --- MODAL COMPTE PILOTE ---
  openAccountModal() {
    if (!this.accountModal) return;
    const user = this.auth ? this.auth.getUser() : null;
    if (user && !user.isGuest) {
      if (this.accountProfileView) this.accountProfileView.classList.remove('hidden');
      if (this.accountFormsView) this.accountFormsView.classList.add('hidden');
      if (this.accountAvatarLarge) this.accountAvatarLarge.src = user.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=pilot';
      if (this.accountPseudoLarge) this.accountPseudoLarge.textContent = `@${user.pseudo || 'Pilote'}`;
      if (this.accountEmailDisplay) this.accountEmailDisplay.textContent = user.email || '';
      if (this.accountFounderTag) {
        if (this.auth && this.auth.isFounder && this.auth.isFounder()) {
          this.accountFounderTag.classList.remove('hidden');
        } else {
          this.accountFounderTag.classList.add('hidden');
        }
      }
      if (this.asScore) this.asScore.textContent = `${(user.bestScore || 0).toLocaleString('fr-FR')} PTS`;
      if (this.asDist) this.asDist.textContent = `${Math.round(user.bestDistance || 0)} M`;
      if (this.asRank) this.asRank.textContent = user.bestRank || 'SU';
    } else {
      if (this.accountProfileView) this.accountProfileView.classList.add('hidden');
      if (this.accountFormsView) this.accountFormsView.classList.remove('hidden');
      this.switchAccountTab('register');
    }
    this.accountModal.classList.remove('hidden');
  }

  closeAccountModal() {
    if (this.accountModal) this.accountModal.classList.add('hidden');
    if (this.regError) this.regError.classList.add('hidden');
    if (this.logError) this.logError.classList.add('hidden');
  }

  isAccountModalVisible() {
    return this.accountModal && !this.accountModal.classList.contains('hidden');
  }

  switchAccountTab(tab) {
    if (this.tabBtnRegister) this.tabBtnRegister.classList.toggle('active', tab === 'register');
    if (this.tabBtnLogin) this.tabBtnLogin.classList.toggle('active', tab === 'login');
    if (this.formRegister) this.formRegister.classList.toggle('hidden', tab !== 'register');
    if (this.formLogin) this.formLogin.classList.toggle('hidden', tab !== 'login');
    if (this.regError) this.regError.classList.add('hidden');
    if (this.logError) this.logError.classList.add('hidden');
  }

  // --- DUEL 1V1 : GESTION DES 3 VIES ---
  updateDuelLives(myLives = 3, rivalLives = 3, rivalPseudo = null, leadDelta = null) {
    if (this.hudDuelLivesBar) {
      this.hudDuelLivesBar.classList.remove('hidden');
    }
    const renderHearts = (n) => {
      let str = '';
      for (let i = 0; i < 3; i++) {
        str += i < n ? '❤️' : '🖤';
      }
      return str;
    };
    if (this.myLivesDisplay) {
      this.myLivesDisplay.textContent = renderHearts(myLives);
    }
    if (this.rivalLivesDisplay) {
      this.rivalLivesDisplay.textContent = renderHearts(rivalLives);
    }
    if (this.rivalLivesLabel && rivalPseudo) {
      this.rivalLivesLabel.textContent = rivalPseudo.toUpperCase();
    }

    if (this.hudDuelLivesBar && leadDelta !== null && !isNaN(leadDelta)) {
      if (!this.duelLeadTag) {
        this.duelLeadTag = document.createElement('span');
        this.duelLeadTag.className = 'duel-life-lead-tag';
        this.hudDuelLivesBar.appendChild(this.duelLeadTag);
      }
      const d = Math.round(leadDelta);
      if (d > 0) {
        this.duelLeadTag.className = 'duel-life-lead-tag lead';
        this.duelLeadTag.textContent = `▲ +${d}M (${t('rival_behind', 'VOUS MENEZ')})`;
      } else if (d < 0) {
        this.duelLeadTag.className = 'duel-life-lead-tag behind';
        this.duelLeadTag.textContent = `▼ ${d}M (${t('rival_leads', 'LE RIVAL MÈNE')})`;
      } else {
        this.duelLeadTag.className = 'duel-life-lead-tag lead';
        this.duelLeadTag.textContent = `= 0M (${t('rival_tied', 'ÉGALITÉ PARFAITE')})`;
      }
    }
  }

  hideDuelLives() {
    if (this.hudDuelLivesBar) {
      this.hudDuelLivesBar.classList.add('hidden');
    }
    if (this.duelLeadTag) {
      this.duelLeadTag.remove();
      this.duelLeadTag = null;
    }
  }

  // Application dynamique de la langue active
  applyLanguage() {
    // 1. Appliquer toutes les traductions statiques via le DOM (data-i18n)
    i18n.applyToDOM();

    // 2. Mettre à jour l'état actif des boutons drapeaux dans les paramètres
    const currentLang = i18n.getLanguage();
    if (this.langFlagButtons) {
      this.langFlagButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
      });
    }

    // 3. Mettre à jour le bouton de lancement principal selon le statut du joueur
    if (this.auth) {
      const user = this.auth.getUser();
      this.updateAuthState(user);
    } else {
      if (this.btnPlayText) this.btnPlayText.textContent = t('play_takeoff', 'DÉCOLLER');
      if (this.btnPlaySub) this.btnPlaySub.textContent = t('menu_click_to_play', '[ VOL SOLO IMMÉDIAT • ESPACE OU CLIC ]');
    }

    // 4. Mettre à jour les cycles dans le menu et le HUD
    if (this.currentCycle) {
      this.updateMenuCycle(this.currentCycle);
      this.updateCycleBadge(this.currentCycle);
    }

    // 5. Mettre à jour les options du sélecteur de cycle en multijoueur
    if (this.selectRoomCycle && this.selectRoomCycle.options) {
      for (let i = 0; i < this.selectRoomCycle.options.length; i++) {
        const opt = this.selectRoomCycle.options[i];
        const cycleIdx = parseInt(opt.value, 10);
        const cycleId = cycleIdx + 1;
        const cName = t(`cycle_${cycleId}_name`, `Cycle ${cycleId}`);
        const cElem = t(`cycle_${cycleId}_element`, '');
        const cColor = t(`cycle_${cycleId}_color`, '');
        opt.textContent = `Cycle ${cycleId} • ${cName} (${cElem} / ${cColor})`;
      }
    }

    // 6. Mettre à jour l'état audio dans le HUD
    if (this.btnAudioToggle) {
      this.setAudioState(this.btnAudioToggle.classList.contains('active'));
    }

    // 7. Mettre à jour l'état du blaster au repos
    if (this.blasterHeatLabel && !this.isBlasterOverheated) {
      this.blasterHeatLabel.textContent = t('blaster_ready', 'BLASTER PRÊT');
    }

    // 8. Mettre à jour les étiquettes de maintenance
    if (this.system && this.maintenanceStatusLabel) {
      const state = this.system.getMaintenanceState ? this.system.getMaintenanceState() : null;
      this.updateMaintenanceLabel(state ? !!state.active : false);
    }
  }

  // --- MISE À JOUR DE L'ÉTAT D'AUTHENTIFICATION & PROFIL ---
  updateAuthState(user) {
    if (user && !user.isGuest) {
      // Connecté avec Compte Pilote
      if (this.authUnlogged) this.authUnlogged.classList.add('hidden');
      if (this.authLogged) this.authLogged.classList.remove('hidden');

      if (this.userAvatarImg) this.userAvatarImg.src = user.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=pilot';
      if (this.userNameDisplay) this.userNameDisplay.textContent = user.name || user.pseudo || 'Pilote';

      const pseudo = user.pseudo ? user.pseudo.trim() : '';

      // Badge Fondateur Officiel 👑 & Bouton Panel Fondateur
      const isFounder = !!(this.auth && this.auth.isFounder && this.auth.isFounder());
      if (this.userFounderBadge) {
        this.userFounderBadge.classList.toggle('hidden', !isFounder);
      }
      if (this.btnOpenFounderPanel) {
        this.btnOpenFounderPanel.classList.toggle('hidden', !isFounder);
      }

      if (pseudo) {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = `@${pseudo}`;
        if (this.btnPlayGame) {
          this.btnPlayGame.classList.remove('locked', 'guest-mode');
        }
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '▶';
        if (this.btnPlayText) this.btnPlayText.textContent = t('play_takeoff', 'DÉCOLLER');
        if (this.btnPlaySub) this.btnPlaySub.textContent = `[ ${t('menu_click_to_play', 'CLASSEMENT ACTIF')} • @${pseudo} ]`;
      } else {
        if (this.userPseudoDisplay) this.userPseudoDisplay.textContent = t('pseudo_undefined', 'Non défini');
        if (this.btnPlayGame) {
          this.btnPlayGame.classList.add('locked');
          this.btnPlayGame.classList.remove('guest-mode');
        }
        if (this.btnPlayIcon) this.btnPlayIcon.textContent = '✍️';
        if (this.btnPlayText) this.btnPlayText.textContent = t('pseudo_btn_choose', 'CHOISIR MON PSEUDO');
        if (this.btnPlaySub) this.btnPlaySub.textContent = t('pseudo_req_hint', '[ PSEUDO REQUIS POUR LE CLASSEMENT ]');
      }

      // Mettre à jour le résumé des scores personnels
      this.updatePersonalBestDisplay();
    } else {
      // Non connecté (Mode Invité Solo disponible immédiatement)
      if (this.authUnlogged) this.authUnlogged.classList.remove('hidden');
      if (this.authLogged) this.authLogged.classList.add('hidden');
      if (this.userFounderBadge) this.userFounderBadge.classList.add('hidden');
      if (this.btnOpenFounderPanel) this.btnOpenFounderPanel.classList.add('hidden');

      if (this.btnPlayGame) {
        this.btnPlayGame.classList.remove('locked');
        this.btnPlayGame.classList.add('guest-mode');
      }
      if (this.btnPlayIcon) this.btnPlayIcon.textContent = '▶';
      if (this.btnPlayText) this.btnPlayText.textContent = t('play_takeoff', 'DÉCOLLER');
      if (this.btnPlaySub) this.btnPlaySub.textContent = t('menu_click_to_play', '[ VOL SOLO IMMÉDIAT • ESPACE OU CLIC ]');
    }
  }

  updatePersonalBestDisplay() {
    if (!this.auth || !this.leaderboard) return;
    const user = this.auth.getUser();
    if (!user) return;

    const best = this.leaderboard.getPlayerBest(user.googleUid || user.email || user.id, user.pseudo);
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
      if (this.pseudoPilotName) this.pseudoPilotName.textContent = user.name || user.pseudo || 'Pilote Soundrise';
      if (this.pseudoPilotEmail) this.pseudoPilotEmail.textContent = user.email || '';
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

  // --- MODAL DU CLASSEMENT MONDIAL ---
  async openLeaderboardModal() {
    this.updatePersonalBestDisplay();
    if (this.leaderboardModal) this.leaderboardModal.classList.remove('hidden');

    if (this.lbTableBody) {
      this.lbTableBody.innerHTML = `<div class="lb-loading">${t('lb_loading', 'Connexion au serveur cloud mondial en cours...')}</div>`;
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
      this.lbTableBody.innerHTML = `<div class="lb-loading">${t('lb_empty', 'Aucun score enregistré pour l\'instant. Soyez le premier !')}</div>`;
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

      const isMyRow = user && (((user.googleUid || user.email) && (user.googleUid === entry.googleUid || user.email === entry.googleUid)) || user.pseudo === entry.pseudo);
      const rowClass = isMyRow ? 'lb-row my-row' : 'lb-row';
      const youBadge = isMyRow ? ` <span style="color:#00f0ff;font-size:0.65rem;font-weight:900;">(${t('duel_you', 'VOUS')})</span>` : '';

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
        if (this.audioLabel) this.audioLabel.textContent = t('audio_on', 'SON ACTIVÉ');
      } else {
        this.btnAudioToggle.classList.remove('active');
        if (this.audioIcon) this.audioIcon.textContent = '🔇';
        if (this.audioLabel) this.audioLabel.textContent = t('audio_off', 'SON COUPÉ');
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

    this.isBlasterOverheated = isOverheated;
    if (isOverheated) {
      this.blasterHeatFill.style.background = '#ef4444';
      this.blasterHeatFill.style.boxShadow = '0 0 12px #ef4444';
      if (this.blasterHeatLabel) {
        this.blasterHeatLabel.textContent = `⚠️ ${t('blaster_overheat', 'SURCHAUFFE !')}`;
        this.blasterHeatLabel.style.color = '#ef4444';
        this.blasterHeatLabel.classList.add('pulse-alert');
      }
      if (this.starfoxReticle) {
        this.starfoxReticle.classList.remove('warning');
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
          this.blasterHeatLabel.textContent = t('blaster_high_temp', 'TEMP ÉLEVÉE');
          this.blasterHeatLabel.style.color = '#f59e0b';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
        if (this.starfoxReticle) {
          this.starfoxReticle.classList.add('warning');
        }
      } else if (pct > 35) {
        if (this.starfoxReticle) {
          this.starfoxReticle.classList.remove('warning');
        }
        this.blasterHeatFill.style.background = '#38bdf8';
        this.blasterHeatFill.style.boxShadow = '0 0 6px #38bdf8';
        if (this.blasterHeatLabel) {
          this.blasterHeatLabel.textContent = t('blaster_cadence', 'CADENCE BLASTER');
          this.blasterHeatLabel.style.color = '#38bdf8';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
      } else {
        if (this.starfoxReticle) {
          this.starfoxReticle.classList.remove('warning');
        }
        this.blasterHeatFill.style.background = '#00f0ff';
        this.blasterHeatFill.style.boxShadow = '0 0 6px #00f0ff';
        if (this.blasterHeatLabel) {
          this.blasterHeatLabel.textContent = t('blaster_ready', 'BLASTER PRÊT');
          this.blasterHeatLabel.style.color = '#94a3b8';
          this.blasterHeatLabel.classList.remove('pulse-alert');
        }
      }
    }
  }

  showFloatingScore(pts, isCrit = false, label = '', extraClass = '') {
    if (!this.floatingCombatContainer) return;
    const el = document.createElement('div');
    el.className = `floating-score-item ${isCrit ? 'crit' : ''} ${extraClass}`.trim();
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
        this.hudShield.textContent = `${t('hud_shield_active', 'ACTIF')} (${armorCount})`;
        this.hudShield.style.color = '#00f0ff';
        this.hudShield.style.textShadow = '0 0 12px rgba(0, 240, 255, 0.8)';
        if (this.hudShield.parentElement) {
          this.hudShield.parentElement.classList.remove('is-inactive');
        }
      } else {
        this.hudShield.textContent = t('hud_shield_inactive', 'INACTIF');
        this.hudShield.style.color = '#64748b';
        this.hudShield.style.textShadow = 'none';
        if (this.hudShield.parentElement) {
          this.hudShield.parentElement.classList.add('is-inactive');
        }
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
    if (this.hudCycleName && cycle) {
      this.currentCycle = cycle;
      const cycleName = t(`cycle_${cycle.id}_name`, cycle.name).toUpperCase();
      this.hudCycleName.textContent = `${t('cycle_badge', 'CYCLE {id}', { id: cycle.id })} • ${cycleName}`;
      const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
      this.hudCycleName.style.borderColor = hex;
      this.hudCycleName.style.color = hex;
    }
  }

  showCycleToast(cycle) {
    if (!this.cycleToast || !cycle) return;
    this.currentCycle = cycle;

    const cycleName = t(`cycle_${cycle.id}_name`, cycle.name).toUpperCase();
    const cycleSub = t(`cycle_${cycle.id}_sub`, cycle.subtitle || '');
    if (this.cycleToastTitle) {
      this.cycleToastTitle.textContent = `${t('cycle_badge', 'CYCLE {id}', { id: cycle.id })} • ${cycleName}`;
      this.cycleToastTitle.style.color = `#${cycle.primary.toString(16).padStart(6, '0')}`;
    }
    if (this.cycleToastDesc) {
      this.cycleToastDesc.textContent = `${cycleSub} — ${cycle.troll || ''}`;
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
    if (score >= 160000) {
      return {
        rank: 'MUCH LOVE',
        title: 'RANG SUPRÊME • LÉGENDE COSMIQUE',
        desc: t('rank_much_love_desc', 'L\'amour absolu transcende l\'abysse et la folie de l\'espace-temps !'),
        color: '#ff2e93',
        glow: 'rgba(255, 46, 147, 0.95)',
        isSupreme: true
      };
    } else if (score >= 110000) {
      return {
        rank: 'SUBA Y SU',
        title: 'LÉGENDAIRE / EXCEPTIONNEL',
        desc: t('rank_suba_y_su_desc', 'Traversée divine au-delà de l\'horizon des événements !'),
        color: '#fef08a',
        glow: 'rgba(254, 240, 138, 0.9)',
        isSupreme: false
      };
    } else if (score >= 70000) {
      return {
        rank: 'SUBA Y',
        title: 'TRÈS BON SCORE • PILOTE D\'ÉLITE',
        desc: t('rank_suba_y_desc', 'Maîtrise transcendante de l\'ascension et du tir tactique !'),
        color: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.8)',
        isSupreme: false
      };
    } else if (score >= 35000) {
      return {
        rank: 'SUBA',
        title: 'BON SCORE • CONFIRMÉ',
        desc: t('rank_suba_desc', 'Belle endurance dans l\'abysse gravitationnel.'),
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.7)',
        isSupreme: false
      };
    } else {
      return {
        rank: 'SU',
        title: 'SCORE STANDARD • APPRENTI',
        desc: t('rank_su_desc', 'Premier contact avec le sillage de Nity. Visez 35 000 PTS pour débloquer SUBA !'),
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
      if (reason === 'energy') {
        this.deathReason.textContent = t('death_energy', 'ÉNERGIE DU CŒUR ÉPUISÉE • SIGNAL ÉTEINT');
      } else if (reason === 'abyss') {
        this.deathReason.textContent = t('death_abyss', 'CHUTE DANS L\'ABYSSE GRAVITATIONNEL');
      } else {
        this.deathReason.textContent = t('death_collision', 'IMPACT CRITIQUE • STRUCTURE DÉSINTÉGRÉE');
      }
    }

    // 2. Défilement odomètre dynamique pour les statistiques épurées (Distance & Score uniquement)
    if (this.finalDistance) this.animateStatValue(this.finalDistance, 0, Math.round(distance), 750, ' M');
    if (this.finalScore) this.animateStatValue(this.finalScore, 0, totalScore, 900, ' PTS', true);

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

    // Affichage du statut du classement mondial (Enregistrement universel pour 100% des pilotes)
    if (worldRankResult) {
      this.updateGameOverWorldRank(worldRankResult);
    } else {
      if (this.gameoverWorldStatus) this.gameoverWorldStatus.textContent = t('gw_saving', 'ENREGISTREMENT AU CLASSEMENT MONDIAL...');
      if (this.gameoverWorldRankText) this.gameoverWorldRankText.textContent = t('gw_connecting', 'Connexion au serveur cloud synchronisé...');
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
          ? t('gw_new_record', '🏆 NOUVEAU RECORD PERSONNEL ENREGISTRÉ !')
          : t('gw_saved', '✓ SCORE ENREGISTRÉ AU CLASSEMENT MONDIAL !');
      }
      if (this.gameoverWorldRankText) {
        this.gameoverWorldRankText.textContent = t('gw_saved_rank', 'Record cloud synchronisé ! Rang : #{rank}', { rank: result.rank });
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
    if (!cycle) return;
    this.currentCycle = cycle;
    const CYCLE_ICONS = {
      1: '🌊', 2: '🌍', 3: '🔥', 4: '⚡',
      5: '✨', 6: '🌑', 7: '🌪️', 8: '🌌'
    };

    if (this.menuCycleBadge) {
      this.menuCycleBadge.textContent = t('cycle_badge', 'CYCLE {id}', { id: cycle.id });
      const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
      this.menuCycleBadge.style.borderColor = hex;
      this.menuCycleBadge.style.color = hex;
      this.menuCycleBadge.style.boxShadow = `0 0 12px ${hex}`;
    }
    if (this.menuCycleIcon) {
      this.menuCycleIcon.textContent = CYCLE_ICONS[cycle.id] || '✨';
    }
    if (this.menuCycleTitle) {
      const cName = t(`cycle_${cycle.id}_name`, cycle.name).toUpperCase();
      const cColor = t(`cycle_${cycle.id}_color`, cycle.colorName || '').toUpperCase();
      const cElem = t(`cycle_${cycle.id}_element`, cycle.element || '').toUpperCase();
      this.menuCycleTitle.textContent = `${cName} • ${cColor} (${cElem})`;
    }
  }

  // --- MODAL TROLL DU CYCLE 8 ---
  showTrollModal(loopCount, onContinue) {
    this.onTrollContinue = onContinue;
    if (this.trollLoopVal) this.trollLoopVal.textContent = `BOUCLE ∞ ${loopCount}`;
    if (this.trollModal) {
      this.trollModal.classList.remove('hidden');
      const card = this.trollModal.querySelector('.troll-card');
      if (card) {
        card.classList.remove('animate-troll-enter');
        void card.offsetWidth; // Force reflow
        card.classList.add('animate-troll-enter');
      }
    }
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
      this.multiplayer.onRoomsListChanged = async (rooms) => {
        if (!rooms && this.multiplayer) {
          try {
            rooms = await this.multiplayer.getPublicRooms();
          } catch (_) {
            rooms = [];
          }
        }
        this.renderPublicRooms(rooms || []);
      };
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
        const lead = myDist - (data.distance || 0);
        this.updateRivalTelemetry(data, lead);
        if (window.gameApp && window.gameApp.isMultiplayerDuel) {
          const rivalName = this.multiplayer.opponentUser ? this.multiplayer.opponentUser.pseudo : 'RIVAL';
          this.updateDuelLives(this.multiplayer.lives, this.multiplayer.opponentData.lives, rivalName, lead);
        }
      };
    }
  }

  openMultiplayerModal() {
    if (!this.auth || !this.auth.isAuthenticated()) {
      this.openAccountModal();
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
          ${t('mp_searching_rooms', 'Recherche des salons mondiaux en direct sur le cloud...')}
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
          ${t('mp_no_rooms', 'Aucun salon public disponible pour le moment.')}<br>
          ${t('mp_no_rooms_sub', 'Créez le vôtre dans l\'onglet « CRÉER UN SALON » ou partagez un code privé !')}
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
            <span class="room-meta">${t('mp_role_host', 'Hôte')}: <strong>@${r.host.pseudo}</strong> &bull; ${t('mp_stat_start', 'Départ')}: ${cycleName}</span>
          </div>
        </div>
        <button class="btn-join-room" type="button" data-room-id="${r.roomId}">
          ${t('mp_btn_join', 'REJOINDRE LE DUEL')}
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
        this.lobbyHostReady.textContent = t('mp_status_ready', 'PRÊT !');
        this.lobbyHostReady.className = 'lobby-ready-tag ready';
      } else {
        this.lobbyHostReady.textContent = t('mp_status_waiting', 'EN ATTENTE');
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
          this.lobbyGuestReady.textContent = t('mp_status_ready', 'PRÊT !');
          this.lobbyGuestReady.className = 'lobby-ready-tag ready';
        } else {
          this.lobbyGuestReady.textContent = t('mp_status_waiting', 'EN PRÉPARATION');
          this.lobbyGuestReady.className = 'lobby-ready-tag not-ready';
        }
      }
      if (this.lobbyStatusText) {
        if (room.hostReady && room.guestReady) {
          this.lobbyStatusText.textContent = t('mp_ready_imminent', 'Les 2 pilotes sont prêts ! Lancement du duel imminent !');
          this.lobbyStatusText.style.color = '#4ade80';
        } else {
          this.lobbyStatusText.textContent = t('mp_peer_connected_ready_prompt', 'Adversaire connecté ! Cliquez sur « SE DÉCLARER PRÊT »');
          this.lobbyStatusText.style.color = '#facc15';
        }
      }
    } else {
      if (this.lobbyGuestPseudo) this.lobbyGuestPseudo.textContent = t('mp_waiting_dots', 'En attente...');
      if (this.lobbyGuestAvatar) this.lobbyGuestAvatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=waiting&backgroundColor=020617';
      if (this.lobbyGuestReady) {
        this.lobbyGuestReady.textContent = t('mp_status_disconnected', 'NON CONNECTÉ');
        this.lobbyGuestReady.className = 'lobby-ready-tag not-ready';
      }
      if (this.lobbyStatusText) {
        this.lobbyStatusText.textContent = t('mp_share_code_hint', 'Partagez le code [ {code} ] pour inviter un ami ou attendez un joueur public.', { code: room.roomId });
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
      this.hudRivalDelta.textContent = d >= 0 ? `▲ +${d} M` : `▼ ${d} M`;
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
      this.duelResultTitle.textContent = isWinner ? t('duel_victory', '🏆 VICTOIRE ÉCLATANTE !') : t('duel_defeat', '💀 DÉFAITE HONORABLE !');
      this.duelResultTitle.style.color = isWinner ? '#4ade80' : '#f87171';
    }
    if (this.duelResultReason) {
      this.duelResultReason.textContent = result.reason || (isWinner ? t('duel_reason_win', 'Vous avez survécu le plus loin !') : t('duel_reason_lose', 'Votre vaisseau a été neutralisé.'));
    }

    const myUser = this.auth ? this.auth.getUser() : null;
    const rivalUser = this.multiplayer ? this.multiplayer.opponentUser : null;

    if (this.duelMyPseudo) this.duelMyPseudo.textContent = myUser ? `@${myUser.pseudo}` : `@${t('duel_you', 'VOUS')}`;
    if (this.duelRivalPseudo) this.duelRivalPseudo.textContent = rivalUser ? `@${rivalUser.pseudo}` : `@${t('duel_rival', 'RIVAL')}`;

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

  // ============================================================
  // PANEL FONDATEUR — MÉTHODES D'ADMINISTRATION EXCLUSIVES
  // ============================================================

  setSystemManager(systemManager) {
    this.system = systemManager;
    if (this.system) {
      this.system.onMaintenanceChanged((state) => this.handleMaintenanceStateUpdate(state));
      this.system.onLogAdded(() => {
        if (this.isFounderModalVisible()) this.refreshAuditLogs();
      });
      this.system.onLeaderboardReset(() => {
        this.refreshLeaderboard();
      });
      // Vérification initiale de la maintenance au chargement
      this.handleMaintenanceStateUpdate(this.system.getMaintenanceState());
    }
  }

  isFounderModalVisible() {
    return this.founderModal && !this.founderModal.classList.contains('hidden');
  }

  openFounderPanel() {
    if (!this.auth || !this.auth.isFounder || !this.auth.isFounder()) {
      alert('Accès refusé : Ce panel est réservé exclusivement au Fondateur @zanioxx_off.');
      return;
    }
    if (this.founderModal) this.founderModal.classList.remove('hidden');
    this.populateUserRegistry();
    this.refreshAuditLogs();

    // Synchronisation du commutateur de maintenance
    if (this.system && this.toggleMaintenanceMode) {
      const state = this.system.getMaintenanceState();
      this.toggleMaintenanceMode.checked = !!state.active;
      this.updateMaintenanceLabel(!!state.active);
      if (this.inputMaintenanceReason && state.reason) {
        this.inputMaintenanceReason.value = state.reason;
      }
    }
  }

  closeFounderPanel() {
    if (this.founderModal) this.founderModal.classList.add('hidden');
    if (this.founderResetConfirm) this.founderResetConfirm.classList.add('hidden');
    if (this.inputResetConfirm) {
      this.inputResetConfirm.value = '';
      this.inputResetConfirm.style.borderColor = '';
    }
  }

  updateMaintenanceLabel(active) {
    if (this.maintenanceStatusLabel) {
      if (active) {
        this.maintenanceStatusLabel.textContent = t('founder_status_on', '🔴 ACTIVÉ');
        this.maintenanceStatusLabel.className = 'maintenance-status-on';
      } else {
        this.maintenanceStatusLabel.textContent = t('founder_status_off', '⚫ DÉSACTIVÉ');
        this.maintenanceStatusLabel.className = 'maintenance-status-off';
      }
    }
  }

  async handleMaintenanceToggle() {
    if (!this.system || !this.auth) return;
    const user = this.auth.getUser();
    const isActive = this.toggleMaintenanceMode ? this.toggleMaintenanceMode.checked : false;
    const reason = this.inputMaintenanceReason ? this.inputMaintenanceReason.value.trim() : '';

    try {
      await this.system.setMaintenance(isActive, reason, user);
      this.updateMaintenanceLabel(isActive);
    } catch (err) {
      console.error('[Founder] Erreur lors de la modification de la maintenance :', err);
      if (this.toggleMaintenanceMode) this.toggleMaintenanceMode.checked = !isActive;
      alert(err.message || 'Erreur d\'autorisation.');
    }
  }

  handleMaintenanceStateUpdate(state) {
    if (!state) return;
    const isFounder = !!(this.auth && typeof this.auth.isFounder === 'function' && this.auth.isFounder());

    if (state.active) {
      if (!isFounder) {
        // Blocage total et affichage de l'animation de maintenance pour tous les non-fondateurs
        if (this.maintenanceOverlay) this.maintenanceOverlay.classList.remove('hidden');
        if (this.startMenu) this.startMenu.style.display = 'none';
        if (this.hudOverlay) this.hudOverlay.classList.add('hidden');
      } else {
        // Le fondateur est prévenu par un bandeau discret mais continue d'avoir accès au jeu
        this.showFounderBypassBanner(state.reason);
        if (this.maintenanceOverlay) this.maintenanceOverlay.classList.add('hidden');
        if (this.startMenu) this.startMenu.style.display = '';
      }

      if (this.maintenanceReasonDisplay) this.maintenanceReasonDisplay.textContent = state.reason || '';
      if (this.maintenanceByDisplay) this.maintenanceByDisplay.textContent = state.by || 'zanioxx_off';
    } else {
      // Fin de maintenance : réouverture pour tout le monde
      if (this.maintenanceOverlay) this.maintenanceOverlay.classList.add('hidden');
      if (this.startMenu) this.startMenu.style.display = '';
      this.removeFounderBypassBanner();
    }

    if (this.toggleMaintenanceMode) this.toggleMaintenanceMode.checked = !!state.active;
    this.updateMaintenanceLabel(!!state.active);
  }

  showFounderBypassBanner(reason) {
    this.removeFounderBypassBanner();
    const banner = document.createElement('div');
    banner.className = 'founder-bypass-banner';
    banner.id = 'founder-bypass-banner';
    banner.innerHTML = `👑 MODE MAINTENANCE ACTIF — Accès maintenu pour le Fondateur @zanioxx_off &bull; <em>${reason || ''}</em>`;
    document.body.appendChild(banner);
  }

  removeFounderBypassBanner() {
    const existing = document.getElementById('founder-bypass-banner');
    if (existing) existing.remove();
  }

  async handleResetLeaderboard() {
    if (!this.auth || !this.leaderboard || !this.system) return;
    const user = this.auth.getUser();
    const confirmText = this.inputResetConfirm ? this.inputResetConfirm.value.trim().toUpperCase() : '';

    if (confirmText !== 'PURGE') {
      if (this.inputResetConfirm) {
        this.inputResetConfirm.style.borderColor = '#ff2222';
        this.inputResetConfirm.focus();
      }
      return;
    }

    try {
      await this.leaderboard.resetLeaderboard(user, this.system);
      if (this.founderResetConfirm) this.founderResetConfirm.classList.add('hidden');
      if (this.inputResetConfirm) {
        this.inputResetConfirm.value = '';
        this.inputResetConfirm.style.borderColor = '';
      }
      alert('Classement mondial réinitialisé avec succès !');
      this.refreshLeaderboard();
      this.refreshAuditLogs();
    } catch (err) {
      console.error('[Founder] Erreur purge leaderboard :', err);
      alert('Erreur : ' + (err.message || 'Action impossible.'));
    }
  }

  populateUserRegistry() {
    if (!this.auth || !this.founderUsersBody) return;
    const user = this.auth.getUser();
    if (!user) return;

    try {
      const accounts = this.auth.getRegisteredAccounts(user);
      if (this.founderUsersCount) {
        this.founderUsersCount.textContent = t('founder_users_count', '{count} compte(s) enregistré(s)', { count: accounts.length });
      }

      if (accounts.length === 0) {
        this.founderUsersBody.innerHTML = `<div class="founder-empty">${t('founder_no_users', 'Aucun pilote enregistré pour le moment.')}</div>`;
        return;
      }

      let html = '';
      accounts.forEach((acc, idx) => {
        const isF = acc.role === 'FONDATEUR' || acc.isFounder || acc.email === 'maximenax05@gmail.com' || acc.pseudo === 'zanioxx_off';
        const roleClass = isF ? 'user-role-founder' : 'user-role-player';
        const roleText = isF ? `👑 ${t('founder_role_founder', 'FONDATEUR')}` : t('founder_role_pilot', 'Pilote');
        const dateStr = acc.createdAt ? new Date(acc.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--';

        html += `
          <div class="founder-user-row">
            <span>#${idx + 1}</span>
            <span><strong>@${acc.pseudo || '--'}</strong></span>
            <span>${acc.email || '--'}</span>
            <span class="${roleClass}">${roleText}</span>
            <span>${dateStr}</span>
          </div>
        `;
      });

      this.founderUsersBody.innerHTML = html;
    } catch (err) {
      this.founderUsersBody.innerHTML = `<div class="founder-empty">${err.message || 'Erreur de lecture du registre.'}</div>`;
    }
  }

  refreshAuditLogs() {
    if (!this.system || !this.founderLogsConsole) return;
    const logs = this.system.getLogs();

    if (this.founderLogsCount) {
      this.founderLogsCount.textContent = t('founder_logs_count', '{count} entrée(s)', { count: logs.length });
    }

    if (logs.length === 0) {
      this.founderLogsConsole.innerHTML = `<div class="founder-empty">${t('founder_no_events', 'Aucun événement dans le journal système.')}</div>`;
      return;
    }

    let html = '';
    logs.forEach((log) => {
      const catClass = 'cat-' + (log.category || 'info').toLowerCase();
      html += `
        <div class="log-entry">
          <span class="log-time">[${log.timeFormatted || '--:--:--'}]</span>
          <span class="log-category ${catClass}">${log.category || 'INFO'}</span>
          <span class="log-message">${log.message || ''}</span>
        </div>
      `;
    });

    this.founderLogsConsole.innerHTML = html;
  }

  handleClearLogs() {
    if (!this.system || !this.auth) return;
    try {
      this.system.clearLogs(this.auth.getUser());
      this.refreshAuditLogs();
    } catch (err) {
      console.error('[Founder] Erreur vidage journal :', err);
    }
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

