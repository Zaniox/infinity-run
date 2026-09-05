/**
 * // SOUNDRISE : INFINITY RUN - INTERFACE UTILISATEUR & RANGS SUBA
 * Écran d'accueil, HUD minimaliste, Jauge d'énergie et Écran de fin avec calcul du Score et Rangs SUBA.
 */

export class UIManager {
  constructor(onStartCallback, onRestartCallback, onAudioToggleCallback, onPrevCycleCallback, onNextCycleCallback) {
    this.onStart = onStartCallback;
    this.onRestart = onRestartCallback;
    this.onAudioToggle = onAudioToggleCallback;
    this.onPrevCycle = onPrevCycleCallback;
    this.onNextCycle = onNextCycleCallback;

    this.cacheDOMElements();
    this.bindEvents();
    this.toastTimer = null;
  }

  cacheDOMElements() {
    // Menu d'accueil cinématique
    this.startMenu = document.getElementById('start-menu');
    this.btnPlayGame = document.getElementById('btn-play-game');
    this.menuBtnPrev = document.getElementById('menu-btn-prev');
    this.menuBtnNext = document.getElementById('menu-btn-next');
    this.menuCycleIcon = document.getElementById('menu-cycle-icon');
    this.menuCycleBadge = document.getElementById('menu-cycle-badge');
    this.menuCycleTitle = document.getElementById('menu-cycle-title');
    this.menuCycleTroll = document.getElementById('menu-cycle-troll');

    // HUD en jeu
    this.hudOverlay = document.getElementById('hud-overlay');
    this.energyBar = document.getElementById('heart-energy-fill');
    this.hudDistance = document.getElementById('hud-distance');
    this.hudSpeed = document.getElementById('hud-speed');
    this.hudHearts = document.getElementById('hud-hearts');
    this.hudCycleName = document.getElementById('hud-cycle-name');

    // Audio & Navigation de cycle dans le HUD
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
    this.btnRestart = document.getElementById('btn-restart');

    // Éléments de la Feinte Cosmique & Modal Troll du Cycle 8
    this.cosmicFlash = document.getElementById('cosmic-flash');
    this.hudLoop = document.getElementById('hud-loop');
    this.climaxAlert = document.getElementById('climax-alert');
    this.climaxTitle = document.getElementById('climax-title');
    this.trollModal = document.getElementById('troll-modal');
    this.trollLoopVal = document.getElementById('troll-loop-val');
    this.btnTrollContinue = document.getElementById('btn-troll-continue');
  }

  bindEvents() {
    // Clic sur JOUER dans le Menu Principal
    if (this.btnPlayGame) {
      const handlePlay = (e) => {
        if (e) e.preventDefault();
        this.hideStartMenu();
        if (this.onStart) this.onStart();
      };
      this.btnPlayGame.addEventListener('click', handlePlay);
      this.btnPlayGame.addEventListener('pointerdown', handlePlay);
    }

    // Sélecteur de cycle dans le Menu Principal
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

    // Audio toggle
    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => {
        if (this.onAudioToggle) {
          const isMuted = this.onAudioToggle();
          this.setAudioState(!isMuted);
        }
      });
    }

    // Navigation des cycles en vol (HUD)
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

    // Bouton de redémarrage robuste (Game Over)
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

    // Bouton de continuation du Troll Modal
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

    // Raccourcis clavier
    window.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'Enter')) {
        if (this.isStartMenuVisible()) {
          e.preventDefault();
          this.hideStartMenu();
          if (this.onStart) this.onStart();
        } else if (this.isTrollModalVisible()) {
          e.preventDefault();
          this.hideTrollModal();
          if (this.onTrollContinue) this.onTrollContinue();
        } else if (this.isGameOverVisible()) {
          e.preventDefault();
          this.hideGameOver();
          if (this.onRestart) this.onRestart();
        }
      }
    });
  }

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
    // Jauge d'énergie vitale
    if (this.energyBar) {
      this.energyBar.style.width = `${Math.max(0, Math.min(100, energy))}%`;
      if (energy < 25) {
        this.energyBar.classList.add('critical');
      } else {
        this.energyBar.classList.remove('critical');
      }
    }

    // Télémétrie
    if (this.hudDistance) {
      this.hudDistance.textContent = `${Math.round(distance)} M`;
    }
    if (this.hudSpeed) {
      this.hudSpeed.textContent = `${Math.round(speed * 3.6)} KM/H`;
    }
    if (this.hudHearts) {
      this.hudHearts.textContent = `♥ ${heartsCount}`;
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
    if (this.climaxTitle) {
      this.climaxTitle.textContent = text;
    }
    if (isFeinte) {
      this.climaxAlert.classList.add('feinte-mode');
    } else {
      this.climaxAlert.classList.remove('feinte-mode');
    }
    this.climaxAlert.classList.remove('hidden');
  }

  hideClimaxAlert() {
    if (this.climaxAlert) {
      this.climaxAlert.classList.add('hidden');
    }
  }

  // Calcul du score et attribution des Rangs officiels SUBA
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

  showGameOver(reason, distance, maxSpeed, heartsCount) {
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

    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
    }
  }

  hideGameOver() {
    if (this.gameOverModal) {
      this.gameOverModal.classList.add('hidden');
    }
  }

  isGameOverVisible() {
    return this.gameOverModal && !this.gameOverModal.classList.contains('hidden');
  }

  // --- GESTION DU MENU PRINCIPAL PLAY ---
  hideStartMenu() {
    if (this.startMenu) {
      this.startMenu.classList.add('hidden');
    }
    if (this.hudOverlay) {
      this.hudOverlay.classList.remove('hidden');
    }
  }

  showStartMenu() {
    if (this.startMenu) {
      this.startMenu.classList.remove('hidden');
    }
    if (this.hudOverlay) {
      this.hudOverlay.classList.add('hidden');
    }
  }

  isStartMenuVisible() {
    return this.startMenu && !this.startMenu.classList.contains('hidden');
  }

  updateMenuCycle(cycle) {
    const CYCLE_ICONS = {
      1: '🌊',
      2: '🌍',
      3: '🔥',
      4: '⚡',
      5: '✨',
      6: '🌑',
      7: '🌪️',
      8: '🌌'
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
    if (this.menuCycleTroll) {
      this.menuCycleTroll.textContent = cycle.troll || cycle.subtitle;
    }
  }

  // --- GESTION DU MODAL TROLL DU CYCLE 8 ---
  showTrollModal(loopCount, onContinue) {
    this.onTrollContinue = onContinue;
    if (this.trollLoopVal) {
      this.trollLoopVal.textContent = `∞ ${loopCount}`;
    }
    if (this.trollModal) {
      this.trollModal.classList.remove('hidden');
    }
  }

  hideTrollModal() {
    if (this.trollModal) {
      this.trollModal.classList.add('hidden');
    }
  }

  isTrollModalVisible() {
    return this.trollModal && !this.trollModal.classList.contains('hidden');
  }
}
