/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
 * // SOUNDRISE : INFINITY RUN - MOTEUR PRINCIPAL (ES6)
 * Orchestrateur Three.js 60 FPS, Entrées, Caméra 3e personne,
 * Boucle de vol et Synchronisation Audio-Réactive.
 */
import * as THREE from 'three';
import { AudioManager, TRACKS } from './audio.js';
import { TargetManager } from './target.js';
import { Player } from './player.js';
import { World, CYCLES_DATA, CYCLE_FLIGHT_PROFILES } from './world.js';
import { UIManager } from './ui.js';
import { AuthManager } from './auth.js';
import { LeaderboardManager } from './leaderboard.js';
import { MultiplayerManager } from './multiplayer.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();
    window.gameApp = this;
    window.game = this;

    // Gestionnaires d'Authentification Google et de Classement Mondial
    this.auth = new AuthManager((user) => {
      if (this.ui) this.ui.updateAuthState(user);
    });
    this.leaderboard = new LeaderboardManager();

    // États de jeu
    this.STATE_MENU = 'MENU';
    this.STATE_PLAYING = 'PLAYING';
    this.STATE_DYING = 'DYING';
    this.STATE_GAMEOVER = 'GAMEOVER';
    this.state = this.STATE_MENU;
    this.isMultiplayerDuel = false;
    this.isPaused = false;

    // Statistiques de vol
    this.distance = 0;
    this.maxSpeed = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.heartsCount = 0;
    this.obstacleScore = 0;
    this.obstaclesDestroyed = 0;
    this.loopCount = 1;
    this.cycle8Distance = 0.0;
    this.isClimaxFeinteActive = false;

    // Entrées utilisateur
    this.inputAxisX = 0;
    this.inputAxisY = 0;
    this.keyLeft = false; this.keyRight = false;
    this.keyUp = false; this.keyDown = false;
    this.isPointerDown = false;
    this.pointerStartX = 0; this.pointerStartY = 0;

    // Initialisation du Moteur 3D
    this.initThree();

    // Instanciation des Modules
    this.world = new World(this.scene);
    this.player = new Player(this.scene);
    this.player.group.position.set(0, 3.5, 0); // Altitude de vol saine initiale
    this.target = new TargetManager(this.scene);

    this.audio = new AudioManager((cycleIndex, track) => {
      this.onTrackChange(cycleIndex, track);
    });

    this.multiplayer = new MultiplayerManager(this.scene, this.auth);

    this.ui = new UIManager(
      () => this.startGame(),
      () => this.restartGame(),
      () => this.audio.toggleMute(),
      () => this.audio.prevTrack(),
      () => this.audio.nextTrack(),
      this.auth,
      this.leaderboard,
      this.multiplayer
    );
    this.ui.setMultiplayer(this.multiplayer);

    // Lasers tirés par l'adversaire en multijoueur
    this.multiplayer.onRivalLaserFire = (x, y, z) => {
      this.spawnRivalLaser(x, y, z);
    };

    window.gameApp = this;

    // Initialisation du premier cycle
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);
    this.ui.updateMenuCycle(this.world.cycle);

    // Déclenchement automatique de l'audio au premier clic ou touche
    const startAudioOnGesture = () => {
      if (this.audio && !this.audio.isPlaying) {
        this.audio.start();
        if (this.ui) this.ui.setAudioState(true);
      }
    };
    window.addEventListener('keydown', startAudioOnGesture, { once: true });
    window.addEventListener('pointerdown', startAudioOnGesture, { once: true });

    // Événements d'entrées et redimensionnement
    this.bindInputEvents();
    this.bindResize();

    // Boucle d'animation 60 FPS
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // Configuration Three.js avec ShadowMap PCFSoft
  initThree() {
    this.scene = new THREE.Scene();

    this.baseFOV = 62;
    this.camera = new THREE.PerspectiveCamera(
      this.baseFOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget = new THREE.Vector3(0, 2.0, -16);
    this.camera.lookAt(this.cameraTarget);

    this.isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 820;
    if (this.isMobile) {
      document.body.classList.add('touch-device');
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2.0));

    // Ombres nettes et douces (Race the Sun style)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  togglePause() {
    if (this.state === this.STATE_PLAYING) {
      if (this.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    } else if (this.state === this.STATE_GAMEOVER) {
      if (this.ui && this.ui.isPauseMenuVisible()) {
        this.ui.hidePauseMenu();
      } else if (this.ui) {
        this.ui.showPauseMenu();
      }
    }
  }

  pauseGame() {
    if (this.state !== this.STATE_PLAYING) return;
    this.isPaused = true;
    if (this.ui) this.ui.showPauseMenu();
    if (this.audio && this.audio.audioElement && !this.audio.audioElement.paused) {
      this.audio.audioElement.pause();
    }
  }

  resumeGame() {
    this.isPaused = false;
    if (this.ui) this.ui.hidePauseMenu();
    this.clock.getDelta(); // Réinitialiser le delta pour éviter un bond brutal après la pause
    if (this.audio && this.audio.isPlaying && this.audio.audioElement && this.audio.audioElement.paused && !this.audio.isMuted) {
      this.audio.audioElement.play().catch(() => {});
    }
  }

  startGame() {
    // Si l'utilisateur est connecté avec Google mais n'a pas encore choisi de pseudo
    if (this.auth && this.auth.user && this.auth.user.googleUid && !this.auth.hasPseudo()) {
      if (this.ui) this.ui.openPseudoModal();
      return;
    }
    // Si non connecté avec Google, s'assurer que la session invité est active
    if (this.auth && !this.auth.isAuthenticated() && !this.auth.isGuest()) {
      this.auth.loginAsGuest();
    }

    this.isPaused = false;
    this.state = this.STATE_PLAYING;
    if (this.ui) {
      this.ui.hideStartMenu();
      this.ui.hidePauseMenu();
    }
    // Réinitialisation intégrale pour garantir un décollage propre sans drops accumulés
    this.player.reset();
    this.target.reset();
    this.world.reset();
    this.distance = 0;
    this.heartsCount = 0;
    if (!this.audio.isPlaying) this.audio.start();
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);
  }

  restartGame() {
    this.isPaused = false;
    if (this.ui) this.ui.hidePauseMenu();
    this.isMultiplayerDuel = false;
    if (this.multiplayer) {
      this.multiplayer.leaveRoom();
    }
    if (this.rivalLasers) {
      this.rivalLasers.forEach(rl => {
        this.scene.remove(rl.mesh);
        rl.mesh.geometry.dispose();
        rl.mesh.material.dispose();
      });
      this.rivalLasers = [];
    }

    this.distance = 0;
    this.heartsCount = 0;
    this.obstacleScore = 0;
    this.obstaclesDestroyed = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.loopCount = 1;
    this.cycle8Distance = 0;
    this.isClimaxFeinteActive = false;
    this.ui.updateLoopCount(this.loopCount);
    this.ui.hideClimaxAlert();

    // Réinitialisation des touches et axes d'entrée
    this.keyLeft = false; this.keyRight = false;
    this.keyUp = false; this.keyDown = false;
    this.inputAxisX = 0; this.inputAxisY = 0;
    this.isPointerDown = false;

    // Réinitialisation du joueur, de la cible et du monde
    this.player.reset();
    this.target.reset();
    this.world.reset();

    // Recalibrage de la caméra en vue de poursuite
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget.set(0, 2.0, -16);
    this.camera.lookAt(this.cameraTarget);
    this.camera.fov = this.baseFOV;
    this.camera.updateProjectionMatrix();

    // Relance de la musique depuis le début du morceau
    if (this.audio) {
      if (!this.audio.isPlaying) {
        this.audio.start();
      } else {
        this.audio.playTrack(this.audio.currentTrackIndex);
      }
    }

    // Mise à jour de la télémétrie du HUD
    this.ui.updateHUD(100, 0, this.currentSpeed, 0, false, 0, false, 0, 0, 0, 0, false);
    this.state = this.STATE_PLAYING;
  }

  startMultiplayerGame(startCycleIndex = 0) {
    this.isPaused = false;
    if (this.ui) this.ui.hidePauseMenu();
    this.isMultiplayerDuel = true;
    if (this.rivalLasers) {
      this.rivalLasers.forEach(rl => {
        this.scene.remove(rl.mesh);
        rl.mesh.geometry.dispose();
        rl.mesh.material.dispose();
      });
      this.rivalLasers = [];
    }

    this.distance = 0;
    this.heartsCount = 0;
    this.obstacleScore = 0;
    this.obstaclesDestroyed = 0;
    this.baseSpeed = 70.0;
    this.currentSpeed = 70.0;
    this.loopCount = 1;
    this.cycle8Distance = 0;
    this.isClimaxFeinteActive = false;

    this.player.reset();
    this.target.reset();
    this.world.reset();

    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget.set(0, 2.0, -16);
    this.camera.lookAt(this.cameraTarget);

    this.audio.playTrack(startCycleIndex);
    this.onTrackChange(startCycleIndex, this.audio.getCurrentTrack());

    this.ui.updateHUD(100, 0, this.currentSpeed, 0);
    this.state = this.STATE_PLAYING;
  }

  firePlayerLaser() {
    if (this.state !== this.STATE_PLAYING) return;
    this.player.fireLaser(this.audio);
    if (this.multiplayer && this.multiplayer.isDuelActive) {
      const p = this.player.group.position;
      this.multiplayer.sendLaserFire(p.x, p.y, p.z);
    }
  }

  spawnRivalLaser(x, y, z) {
    if (!this.rivalLasers) this.rivalLasers = [];
    const geo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.rivalLasers.push({ mesh, timer: 0 });
    if (this.audio) this.audio.playLaserShoot();
  }

  // Callback lors d'un changement de cycle / piste
  onTrackChange(index, track) {
    const isPlaying = this.state === this.STATE_PLAYING;
    this.world.setCycle(index, !isPlaying);
    const cycle = this.world.cycle;
    this.target.setCycleColors(cycle.primary, cycle.secondary);
    this.target.setCycleIndex(index);
    this.ui.updateCycleBadge(cycle);
    this.ui.updateMenuCycle(cycle);
    this.ui.showCycleToast(cycle);
    this.cycle8Distance = 0;
    this.cycleTimer = 0;
    this.currentCycleDistance = 0;
    if (index !== 7) {
      this.ui.hideClimaxAlert();
    }
  }

  bindInputEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        this.togglePause();
        return;
      }
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = true;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = true;
      if (e.code === 'Space') {
        this.keyFire = true;
        if (this.state === this.STATE_PLAYING && !this.isPaused) {
          this.firePlayerLaser();
          e.preventDefault();
        }
      }
      this.updateInputAxes();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = false;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = false;
      if (e.code === 'Space') this.keyFire = false;
      this.updateInputAxes();
    });

    // Tir au clic gauche de souris pendant le vol Star Fox
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.state === this.STATE_PLAYING && !this.isPaused) {
        if (e.target && e.target.closest && (e.target.closest('.modal-overlay') || e.target.closest('#mobile-controls') || e.target.closest('#hud-overlay button'))) {
          return;
        }
        this.firePlayerLaser();
      }
    });

    // Contrôles tactiles dédiés smartphone
    const joyZone = document.getElementById('touch-joystick-zone');
    const joyBase = document.getElementById('touch-joystick-base');
    const joyKnob = document.getElementById('touch-joystick-knob');
    const btnMobileFire = document.getElementById('btn-mobile-fire');
    const btnMobileBoost = document.getElementById('btn-mobile-boost');

    if (btnMobileFire) {
      const handleTouchFire = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (this.state === this.STATE_PLAYING && !this.isPaused) {
          this.firePlayerLaser();
        }
      };
      btnMobileFire.addEventListener('touchstart', handleTouchFire, { passive: false });
      btnMobileFire.addEventListener('click', handleTouchFire);
    }

    if (btnMobileBoost) {
      const handleTouchBoost = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (this.state === this.STATE_PLAYING && !this.isPaused && this.player) {
          this.player.activateBoost(3.5, 28.0);
        }
      };
      btnMobileBoost.addEventListener('touchstart', handleTouchBoost, { passive: false });
      btnMobileBoost.addEventListener('click', handleTouchBoost);
    }

    if (joyZone && joyBase && joyKnob) {
      let joyTouchId = null;
      let baseCenterX = 0;
      let baseCenterY = 0;
      const maxRadius = 46;

      joyZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (joyTouchId !== null) return;
        const touch = e.changedTouches[0];
        joyTouchId = touch.identifier;
        const rect = joyZone.getBoundingClientRect();
        baseCenterX = touch.clientX - rect.left;
        baseCenterY = touch.clientY - rect.top;

        joyBase.style.left = `${baseCenterX}px`;
        joyBase.style.top = `${baseCenterY}px`;
        joyBase.classList.remove('hidden');
        joyKnob.style.transform = 'translate(-50%, -50%)';
        this.isPointerDown = true;
      }, { passive: false });

      joyZone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (joyTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === joyTouchId) {
            const rect = joyZone.getBoundingClientRect();
            const curX = touch.clientX - rect.left;
            const curY = touch.clientY - rect.top;
            let dx = curX - baseCenterX;
            let dy = curY - baseCenterY;
            const dist = Math.hypot(dx, dy);
            if (dist > maxRadius) {
              dx = (dx / dist) * maxRadius;
              dy = (dy / dist) * maxRadius;
            }
            joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            this.inputAxisX = dx / maxRadius;
            this.inputAxisY = -dy / maxRadius; // Glisser vers le haut élève l'altitude
            break;
          }
        }
      }, { passive: false });

      const endJoy = (e) => {
        if (joyTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joyTouchId) {
            joyTouchId = null;
            joyBase.classList.add('hidden');
            joyKnob.style.transform = 'translate(-50%, -50%)';
            this.isPointerDown = false;
            this.inputAxisX = 0;
            this.inputAxisY = 0;
            break;
          }
        }
      };

      joyZone.addEventListener('touchend', endJoy, { passive: false });
      joyZone.addEventListener('touchcancel', endJoy, { passive: false });
    }

    // Fallback tactile sur écran
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' && !e.target.closest('#mobile-controls') && !e.target.closest('.modal-overlay')) {
        this.isPointerDown = true;
        this.pointerStartX = e.clientX;
        this.pointerStartY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown && e.pointerType === 'touch' && !e.target.closest('#touch-joystick-zone')) {
        const diffX = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.22);
        const diffY = (this.pointerStartY - e.clientY) / (window.innerHeight * 0.22);
        this.inputAxisX = Math.max(-1, Math.min(1, diffX));
        this.inputAxisY = Math.max(-1, Math.min(1, diffY));
      }
    });

    const resetPointer = (e) => {
      if (!e || e.pointerType === 'touch') {
        this.isPointerDown = false;
        this.updateInputAxes();
      }
    };
    window.addEventListener('pointerup', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
  }

  updateInputAxes() {
    if (this.keyLeft && !this.keyRight) this.inputAxisX = -1;
    else if (this.keyRight && !this.keyLeft) this.inputAxisX = 1;
    else if (!this.keyLeft && !this.keyRight && !this.isPointerDown) this.inputAxisX = 0;

    if (this.keyUp && !this.keyDown) this.inputAxisY = 1;
    else if (this.keyDown && !this.keyUp) this.inputAxisY = -1;
    else if (!this.keyUp && !this.keyDown && !this.isPointerDown) this.inputAxisY = 0;

    if (this.keyFire && this.state === this.STATE_PLAYING && !this.isPaused) {
      this.firePlayerLaser();
    }
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || w <= 820;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.0));
    });
  }

  // Boucle de rendu 60 FPS
  animate() {
    requestAnimationFrame(this.animate);

    if (this.isPaused) {
      // En mode pause, maintien de l'affichage statique de la scène sans faire avancer le jeu
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = performance.now() * 0.001;

    // 1. Analyse audio en temps réel (bande 20-120 Hz)
    this.audio.update(dt);
    const bass = this.audio.bassEnergy;
    const currentBpm = this.audio.getCurrentTrack().bpm || 130;

    if (this.state === this.STATE_MENU) {
      // Animation cinématique d'attente dans le Menu Principal
      this.player.updateIdle(dt, currentBpm, bass);
      this.world.updateElements(dt, 16.0, bass, time);
      this.target.update(dt, 0, this.player.group.position, bass);

      // Caméra d'exposition orbitant doucement pour mettre en valeur Infi et le décor
      const camOrbitX = Math.sin(time * 0.35) * 4.2;
      const camOrbitY = 4.2 + Math.cos(time * 0.45) * 0.35;
      const camOrbitZ = 9.8 + Math.cos(time * 0.3) * 1.2;

      this.camera.position.set(camOrbitX, camOrbitY, camOrbitZ);
      this.cameraTarget.set(0, 2.2, -18);
      this.camera.lookAt(this.cameraTarget);

      this.renderer.render(this.scene, this.camera);
      return;
    }

    if (this.state === this.STATE_PLAYING) {
      // 2. Calcul de la vitesse de translation avec progression dynamique par cycle (de 44 m/s à 120 m/s)
      const cycleSpeeds = [44.0, 53.0, 63.0, 74.0, 85.0, 96.0, 108.0, 120.0];
      const cycleIdx = (this.world && this.world.currentCycleIndex !== undefined) ? this.world.currentCycleIndex : 0;
      const targetCycleSpeed = cycleSpeeds[cycleIdx] || 44.0;
      
      // Bonus de transition : poussée cinématique d'accélération lors du franchissement de cycle
      const transitionSurge = (this.world && this.world.isTransitioning) 
        ? Math.sin(this.world.transitionProgress * Math.PI) * 10.0 
        : 0.0;
      
      const saiyanBonus = this.player.isSayanfinityActive() ? 18.0 : 0.0;
      const internalProgress = Math.min(8.0, (this.currentCycleDistance || 0) / 280.0);
      
      this.baseSpeed = targetCycleSpeed + internalProgress + transitionSurge;
      this.currentSpeed = this.baseSpeed + this.player.boostExtraSpeed + saiyanBonus;

      // Effet cinématique d'étirement du champ de vision dynamique proportionnel à la vitesse
      const speedFOV = Math.max(0, (this.currentSpeed - 44.0) * 0.16);
      const saiyanFOV = this.player.isSayanfinityActive() ? 12.0 : (this.player.boostTimer > 0 ? 8.0 : 0.0);
      const targetFOV = Math.min(88.0, this.baseFOV + speedFOV + saiyanFOV);
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, 5 * dt);
      this.camera.updateProjectionMatrix();

      // 3. Mise à jour de la physique de vol d'Infi & gestion thermique du blaster
      const isCinematic = this.target && this.target.isClimaxCinematicActive;
      const inputX = isCinematic ? 0 : this.inputAxisX;
      const inputY = isCinematic ? 0 : this.inputAxisY;
      this.player.update(dt, inputX, inputY, currentBpm, bass, this.audio);

      // Si Infi s'est écrasé suite à une panne d'énergie
      if (this.player.isDead) {
        this.state = this.STATE_DYING;
        this.audio.playCrash();
      }

      // Collision des lasers Star Fox avec les obstacles (Gain de points + Combat text flottant)
      this.world.checkLaserCollisions(this.player.lasers, (obs, hitPos, isSaiyan) => {
        this.audio.playObstacleDestroyed();
        this.obstaclesDestroyed = (this.obstaclesDestroyed || 0) + 1;
        const pts = isSaiyan ? 300 : 150;
        this.obstacleScore = (this.obstacleScore || 0) + pts;
        this.distance += isSaiyan ? 30 : 15;
        this.ui.pulseReticleHit();
        this.ui.showFloatingScore(pts, isSaiyan, isSaiyan ? 'PURITY' : '');

        // Chance de faire dropper une Armure ou un Cœur sur l'obstacle détruit
        const dropRoll = Math.random();
        if (dropRoll < 0.22) {
          this.target.spawnDropAt(hitPos.x, Math.max(1.5, hitPos.y), hitPos.z, 'armor');
        } else if (dropRoll < 0.42) {
          this.target.spawnDropAt(hitPos.x, Math.max(1.5, hitPos.y), hitPos.z, 'heart');
        }
      });

      // 4. Défilement du monde et des obstacles synchronisés au beat musical absolu
      const playerPos = this.player.group.position;
      const beatInfo = this.audio.getBeatInfo();

      this.world.update(dt, this.currentSpeed, beatInfo, bass, (box, obs, obsIdx) => {
        // Ignorer les collisions pendant la cinématique narrative de fin
        if (this.target && this.target.isClimaxCinematicActive) {
          return false;
        }

        // Test de collision entre la sphère du joueur et la boîte d'obstacle
        if (box.intersectsSphere(this.player.boundingSphere)) {
          // Période de grâce d'invulnérabilité
          if (this.player.invulnerableTimer > 0) {
            return false;
          }

          // Cas 1 : Mode PURITY actif (Invulnérabilité 20s) -> broie l'obstacle instantanément !
          if (this.player.isSayanfinityActive()) {
            this.audio.playSaiyanSmash();
            this.obstaclesDestroyed = (this.obstaclesDestroyed || 0) + 1;
            const pts = 250;
            this.obstacleScore = (this.obstacleScore || 0) + pts;
            this.distance += 35; // Bonus destructeur
            this.ui.pulseReticleHit();
            this.ui.showFloatingScore(pts, true, 'SMASH PURITY !');
            return 'smash';
          }

          // Cas 2 : Bouclier d'Armure actif -> absorbe l'impact, protège et détruit l'obstacle !
          if (this.player.hasShield) {
            this.player.absorbHit(this.audio);
            this.obstaclesDestroyed = (this.obstaclesDestroyed || 0) + 1;
            const pts = 150;
            this.obstacleScore = (this.obstacleScore || 0) + pts;
            this.ui.pulseReticleHit();
            this.ui.showFloatingScore(pts, false, 'BOUCLIER !');
            return 'destroy';
          }

          // Cas 3 : Mort / Crash direct
          this.player.triggerCrash();
          this.audio.playCrash();
          this.state = this.STATE_DYING;
          return 'crash';
        }
        return false;
      });

      // 5. Mise à jour du trou noir, de Nity, des drops et attraction magnétique
      this.target.update(
        dt,
        this.currentSpeed,
        playerPos,
        bass,
        this.player.isSayanfinityActive(),
        this.audio
      );

      // Détection de collecte des drops (Cœurs vitaux, Armures 1-hit, Sayanfinity 20s)
      this.target.checkDropCollisions(playerPos, this.player.radius, (type, pos) => {
        if (type === 'sayanfinity') {
          // Rare drop : PURITY 20 secondes !
          this.player.activateSayanfinity(20.0, this.audio);
          this.player.rechargeHeart();
          this.ui.showClimaxAlert('⚡ MODE PURITY ACTIVÉ • INVULNÉRABILITÉ (20S)', true);
          setTimeout(() => {
            if (this.ui) this.ui.hideClimaxAlert();
          }, 3500);
        } else if (type === 'armor') {
          // Armure protectrice 1-hit
          this.player.equipShield(this.audio);
        } else {
          // Cœur vital d'énergie
          this.player.rechargeHeart();
          this.audio.playHeartCollect();
          this.heartsCount++;
        }
      });

      // 6. Gestion du Climax du Cycle 8 (Rattrapage de Nity & Feinte Temporelle)
      // EXCLUSIVEMENT lié à la fin de la piste musicale de Folie (la piste doit toucher à sa fin)
      if (this.audio.currentTrackIndex === 7 && !this.isClimaxFeinteActive) {
        this.cycle8Distance += this.currentSpeed * dt;
        const trackProgress = this.audio.getTrackProgress();
        const progress = trackProgress.progress;

        // Rapprochement progressif UNIQUEMENT dans la phase finale du morceau (derniers 14% de la piste)
        if (progress >= 0.86) {
          const climaxRatio = Math.min(1.0, (progress - 0.86) / 0.12);
          this.target.setClimaxDistance(climaxRatio);
          const percent = Math.min(99, Math.round(climaxRatio * 100));
          this.ui.showClimaxAlert(`// CONTACT AVEC NITY IMMINENT • FINAL DU CYCLE (${percent}%)`);
          this.player.boostExtraSpeed = Math.max(this.player.boostExtraSpeed, climaxRatio * 32.0);
          this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV + 16 * climaxRatio, 4 * dt);

          if (climaxRatio >= 0.98 || progress >= 0.98) {
            this.triggerClimaxFeinte();
          }
        } else {
          // Pendant tout le morceau, Nity reste inaccessible à l'horizon : il faut survivre
          this.target.setClimaxDistance(0);
          if (this.cycle8Distance > 80) {
            const timeRemaining = Math.max(1, Math.round(trackProgress.duration - trackProgress.currentTime));
            this.ui.showClimaxAlert(`// SURVIVEZ JUSQU'À LA FIN DU MORCEAU POUR ATTEINDRE NITY (${timeRemaining}S)`);
          }
        }
      }

      // 7. Mise à jour des statistiques & Progression fluide à travers les 8 Cycles
      this.distance += this.currentSpeed * dt;
      this.currentCycleDistance = (this.currentCycleDistance || 0) + this.currentSpeed * dt;
      this.cycleTimer = (this.cycleTimer || 0) + dt;

      if (this.currentSpeed > this.maxSpeed) {
        this.maxSpeed = this.currentSpeed;
      }

      // 7. Progression gouvernée par la fin du morceau musical & Portail de Transition
      const isNearTrackEnd = this.audio && this.audio.isNearEnd(9.0);

      // Apparition du Portail de Transition 3D à l'horizon à l'approche de la fin de la musique (Cycles 1 à 7)
      if (cycleIdx < 7 && isNearTrackEnd && !this.world.transitionPortal && !this.world.isTransitioning) {
        const nextIdx = (cycleIdx + 1) % 8;
        this.world.spawnTransitionPortal(nextIdx);
        const nextCycleData = CYCLES_DATA[nextIdx];
        this.ui.showCycleToast({
          name: "🌀 PORTAIL DE TRANSCENDANCE",
          subtitle: "Franchissez la porte vers le Cycle " + (nextIdx + 1) + " !",
          primary: (nextCycleData ? nextCycleData.primary : 0x00f0ff)
        });
      }

      // Franchissement du Portail Dimensionnel par le vaisseau
      if (this.world.transitionPortal) {
        const crossedCycle = this.world.checkPortalCrossing(playerPos.z);
        if (crossedCycle !== null) {
          if (this.audio) {
            this.audio.playPortalWarp();
            this.audio.nextTrack();
          }
          // Impulsion supersonique lors de la traversée de la porte
          this.player.boostExtraSpeed = 28.0;
          this.player.boostTimer = 1.4;
        }
      }

      // 8. Dynamique de vol cinématographique & Trajectoires spécifiques aux 8 Cycles
      const profile = (CYCLE_FLIGHT_PROFILES && CYCLE_FLIGHT_PROFILES[cycleIdx]) || {
        pitch: 0, camYOffset: 0, targetYOffset: 0, rollWobbleAmp: 0, waveAltitudeAmp: 0, fovMod: 0, turbulence: 0
      };
      const curTime = performance.now() * 0.001;

      let profileCamY = profile.camYOffset || 0;
      let profileTargetY = profile.targetYOffset || 0;
      let profileTargetX = 0;
      let profileRoll = 0;
      let profileFov = 0;

      // Ondulation d'altitude en vagues (ex: Cycle 4 Amour)
      if (profile.waveAltitudeAmp > 0) {
        const wave = Math.sin(curTime * (profile.waveAltitudeFreq || 1.5)) * profile.waveAltitudeAmp;
        profileCamY += wave * 0.7;
        profileTargetY += wave * 1.2;
      }
      // Roulis oscillant (ex: Cycle 3 Obsession hypnotique)
      if (profile.rollWobbleAmp > 0) {
        profileRoll += Math.sin(curTime * (profile.rollWobbleFreq || 2.0)) * profile.rollWobbleAmp;
      }
      // Turbulences erratiques (ex: Cycle 6 Chaos)
      if (profile.turbulence > 0) {
        profileTargetX += (Math.sin(curTime * 17.3) + Math.cos(curTime * 29.1)) * profile.turbulence * 3.0;
        profileCamY += (Math.sin(curTime * 21.4) + Math.cos(curTime * 33.7)) * profile.turbulence * 1.5;
        profileRoll += Math.sin(curTime * 24.5) * profile.turbulence * 0.45;
      }
      // Distorsion psychédélique du champ de vision (ex: Cycle 8 Folie)
      if (profile.fovMod !== 0) {
        profileFov = Math.sin(curTime * 2.4) * profile.fovMod;
      }

      // Transmission du profil dynamique au vaisseau joueur
      if (this.player.setFlightProfile) {
        this.player.setFlightProfile(profile, curTime);
      }

      // Suivi caméra 3e personne cinématographique (désactivé pendant la cinématique de fin)
      if (!this.target || !this.target.isClimaxCinematicActive) {
        const tCamX = playerPos.x * 0.36;
        const tCamY = Math.max(2.2, playerPos.y + 2.7 + profileCamY);
        const tCamZ = playerPos.z + 8.8;

        this.camera.position.x += (tCamX - this.camera.position.x) * 6.0 * dt;
        this.camera.position.y += (tCamY - this.camera.position.y) * 5.0 * dt;
        this.camera.position.z += (tCamZ - this.camera.position.z) * 5.0 * dt;

        // La caméra vise en avant avec l'inclinaison propre à l'élément (piqué, droit, montée)
        this.cameraTarget.set(
          playerPos.x * 0.22 + profileTargetX,
          Math.max(1.0, playerPos.y * 0.45 + 1.8 + profileTargetY),
          -52
        );
        this.camera.lookAt(this.cameraTarget);

        // Inclinaison en roulis de la caméra
        this.camera.rotation.z += profileRoll;

        // Champ de vision (FOV) dynamique
        const baseFov = 75;
        const speedFov = (this.currentSpeed > 80) ? (this.currentSpeed - 80) * 0.14 : 0;
        const targetFov = Math.max(55, Math.min(96, baseFov + speedFov + profileFov));
        if (Math.abs(this.camera.fov - targetFov) > 0.08) {
          this.camera.fov += (targetFov - this.camera.fov) * 4.0 * dt;
          this.camera.updateProjectionMatrix();
        }
      }

      // 9. Télémétrie HUD avec Armure, Purity, Score en Direct et Surchauffe Blaster
      const currentTotalScore = Math.floor(this.distance * 10 + this.heartsCount * 250 + (this.obstacleScore || 0));
      this.ui.updateHUD(
        this.player.energy,
        this.distance,
        this.currentSpeed,
        this.heartsCount,
        this.player.hasShield,
        this.player.armorCount,
        this.player.isSayanfinityActive(),
        this.player.saiyanTimer,
        currentTotalScore,
        this.obstaclesDestroyed || 0,
        this.player.blasterHeat || 0,
        this.player.isOverheated || false
      );

      // 10. Mise à jour de l'adversaire et des lasers rivaux (Multijoueur 1v1)
      if (this.multiplayer) {
        this.multiplayer.update(dt, this.distance);
      }
      if (this.rivalLasers && this.rivalLasers.length > 0) {
        for (let i = this.rivalLasers.length - 1; i >= 0; i--) {
          const rl = this.rivalLasers[i];
          rl.timer += dt;
          rl.mesh.position.z -= 180 * dt;
          if (rl.timer > 1.8) {
            this.scene.remove(rl.mesh);
            rl.mesh.geometry.dispose();
            rl.mesh.material.dispose();
            this.rivalLasers.splice(i, 1);
          }
        }
      }

    } else if (this.state === this.STATE_DYING) {
      // Dislocation d'Infi en particules
      this.player.update(dt, 0, 0, currentBpm, 0, this.audio);

      // Notification multijoueur immédiate en cas d'élimination
      if (this.isMultiplayerDuel && this.multiplayer && this.multiplayer.isDuelActive) {
        const cycleIdx = this.audio ? this.audio.currentTrackIndex : 0;
        this.multiplayer.sendDeath(this.distance, cycleIdx, 'crash');
        this.multiplayer.isDuelActive = false;
        if (this.ui) {
          this.ui.showDuelResult({
            isWinner: false,
            reason: 'Votre vaisseau a été détruit par un obstacle !',
            rivalDistance: this.multiplayer.opponentData.distance,
            rivalCycle: this.multiplayer.opponentData.cycleIndex
          });
        }
      }

      if (this.player.dyingTimer >= 1.4) {
        this.state = this.STATE_GAMEOVER;
        const reason = this.player.energy <= 0 ? 'energy' : 'collision';
        const totalScore = Math.floor(this.distance * 10 + this.heartsCount * 250 + (this.obstacleScore || 0));

        if (!this.isMultiplayerDuel) {
          this.ui.showGameOver(reason, this.distance, this.maxSpeed, this.heartsCount, this.obstaclesDestroyed || 0, totalScore);
        }

        // Enregistrement automatique au Classement Mondial officiel
        if (this.auth && this.auth.isAuthenticated() && this.auth.hasPseudo() && this.leaderboard) {
          const user = this.auth.getUser();
          const rankInfo = this.ui.computeRank(totalScore);

          this.leaderboard.submitScore({
            pseudo: user.pseudo,
            googleUid: user.googleUid,
            avatar: user.picture,
            score: totalScore,
            distance: this.distance,
            maxSpeed: this.maxSpeed,
            cycle: this.world.cycle.name,
            rank: rankInfo.rank
          }).then((res) => {
            if (this.ui) this.ui.updateGameOverWorldRank(res);
          }).catch((err) => {
            console.warn('[Leaderboard] Erreur d\'envoi cloud :', err);
          });
        }
      }
    }

    // 10. Rendu de la scène
    this.renderer.render(this.scene, this.camera);
  }

  // Séquence de Climax du Cycle 8 : Rattrapage de Nity puis Feinte Cosmique (Recommencement en boucle)
  triggerClimaxFeinte() {
    if (this.isClimaxFeinteActive) return;
    this.isClimaxFeinteActive = true;

    // Enregistrement au classement mondial pour l'accomplissement du cycle
    if (this.auth && this.auth.isAuthenticated() && this.auth.hasPseudo() && this.leaderboard) {
      const user = this.auth.getUser();
      const totalScore = Math.floor(this.distance * 10 + this.heartsCount * 250 + (this.obstacleScore || 0));
      const rankInfo = this.ui.computeRank(totalScore);
      this.leaderboard.submitScore({
        pseudo: user.pseudo,
        googleUid: user.googleUid,
        avatar: user.picture,
        score: totalScore,
        distance: this.distance,
        maxSpeed: this.maxSpeed,
        cycle: `Boucle ∞ ${this.loopCount} (Folie)`,
        rank: rankInfo.rank
      }).catch((e) => console.warn(e));
    }

    // 1. Alerte de contact dans le HUD
    this.ui.showClimaxAlert('// CONTACT ÉTABLI • EN HARMONIE AVEC NITY... ✨', true);

    // 2. Cinématique narrative en 2 phases (Réunion paisible puis Aspiration brutale par le Trou Noir)
    const onCinematicDone = () => {
      // 3. Flash cosmique aveuglant & célébration
      this.ui.triggerFlash();
      if (this.ui.triggerVictoryCelebration) this.ui.triggerVictoryCelebration();

      // 4. Effondrement spatial & Fanfare
      this.audio.playCosmicWarp();
      if (this.audio.playVictoryFanfare) this.audio.playVictoryFanfare();

      // 5. Affichage du Modal « TU CROYAIS ÉCHAPPER À INFINITY ? »
      const nextLoop = this.loopCount + 1;
      this.ui.showTrollModal(nextLoop, () => {
        this.continueAfterTroll();
      });
    };

    if (this.target && this.target.startClimaxCinematic) {
      this.target.startClimaxCinematic(this.player, this.camera, this.audio, onCinematicDone);
    } else {
      onCinematicDone();
    }
  }

  continueAfterTroll() {
    // 1. Flash de transition
    this.ui.triggerFlash();

    // 2. Incrémentation de la boucle temporelle
    this.loopCount++;
    this.ui.updateLoopCount(this.loopCount);

    // 3. Annonce de la feinte cosmique dans le HUD
    this.ui.showClimaxAlert(`// FEINTE COSMIQUE ! BOUCLE ∞ ${this.loopCount} ACTIVÉE • RETOUR CYCLE 1 (VITESSE +20%)`, true);

    // 4. Augmentation permanente de la vitesse (prestige & challenge)
    this.baseSpeed += 16.0;
    this.currentSpeed = this.baseSpeed;
    this.player.boostExtraSpeed = 0;

    // 5. Réinitialisation de Nity et reboot temporel au Cycle 1 (Chute)
    this.player.reset();
    this.player.group.position.set(0, 3.5, 0);
    this.target.reset();
    this.world.reset();
    this.cycle8Distance = 0;
    this.audio.playTrack(0);

    // 6. Masquer l'alerte après 4s et réarmer
    setTimeout(() => {
      this.ui.hideClimaxAlert();
      this.isClimaxFeinteActive = false;
    }, 4000);
  }
}

// Initialisation au chargement du DOM ou immédiatement si déjà chargé
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    new GameApp();
  });
} else {
  new GameApp();
}
