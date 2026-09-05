/**
 * // SOUNDRISE : INFINITY RUN - MOTEUR PRINCIPAL (ES6)
 * Orchestrateur Three.js 60 FPS, Entrées, Caméra 3e personne,
 * Boucle de vol et Synchronisation Audio-Réactive.
 */
import * as THREE from 'three';
import { AudioManager, TRACKS } from './audio.js';
import { TargetManager } from './target.js';
import { Player } from './player.js';
import { World, CYCLES_DATA } from './world.js';
import { UIManager } from './ui.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    // États de jeu
    this.STATE_PLAYING = 'PLAYING';
    this.STATE_DYING = 'DYING';
    this.STATE_GAMEOVER = 'GAMEOVER';
    this.state = this.STATE_PLAYING;

    // Statistiques de vol
    this.distance = 0;
    this.maxSpeed = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.heartsCount = 0;
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

    this.ui = new UIManager(
      () => this.startGame(),
      () => this.restartGame(),
      () => this.audio.toggleMute(),
      () => this.audio.prevTrack(),
      () => this.audio.nextTrack()
    );

    window.gameApp = this;

    // Initialisation du premier cycle
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);

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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ombres nettes et douces (Race the Sun style)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  startGame() {
    this.state = this.STATE_PLAYING;
    if (!this.audio.isPlaying) this.audio.start();
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);
  }

  restartGame() {
    this.distance = 0;
    this.heartsCount = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.loopCount = 1;
    this.cycle8Distance = 0;
    this.isClimaxFeinteActive = false;
    this.ui.updateLoopCount(this.loopCount);
    this.ui.hideClimaxAlert();

    this.player.reset();
    this.player.group.position.set(0, 3.5, 0);
    this.target.reset();
    this.world.reset();

    this.state = this.STATE_PLAYING;
  }

  // Callback lors d'un changement de cycle / piste
  onTrackChange(index, track) {
    this.world.setCycle(index);
    const cycle = this.world.cycle;
    this.target.setCycleColors(cycle.primary, cycle.secondary);
    this.target.setCycleIndex(index);
    this.ui.updateCycleBadge(cycle);
    this.ui.showCycleToast(cycle);
    this.cycle8Distance = 0;
    if (index !== 7) {
      this.ui.hideClimaxAlert();
    }
  }

  bindInputEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = true;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = true;
      this.updateInputAxes();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = false;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = false;
      this.updateInputAxes();
    });

    // Tactile mobile uniquement (aucun contrôle à la souris sur ordinateur)
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') {
        this.isPointerDown = true;
        this.pointerStartX = e.clientX;
        this.pointerStartY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown && e.pointerType === 'touch') {
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
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // Boucle de rendu 60 FPS
  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // 1. Analyse audio en temps réel (bande 20-120 Hz)
    this.audio.update(dt);
    const bass = this.audio.bassEnergy;
    const currentBpm = this.audio.getCurrentTrack().bpm || 130;

    if (this.state === this.STATE_PLAYING) {
      // 2. Calcul de la vitesse de translation avec boost temporaire
      this.baseSpeed = 68.0 + (this.distance / 1200.0) * 15.0;
      this.currentSpeed = this.baseSpeed + this.player.boostExtraSpeed;

      // Effet cinématique d'étirement du champ de vision lors d'un boost
      if (this.player.boostTimer > 0) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV + 12, 6 * dt);
      } else {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV, 4 * dt);
      }
      this.camera.updateProjectionMatrix();

      // 3. Mise à jour de la physique de vol d'Infi
      this.player.update(dt, this.inputAxisX, this.inputAxisY, currentBpm, bass);

      // Si Infi s'est écrasé suite à une panne d'énergie
      if (this.player.isDead) {
        this.state = this.STATE_DYING;
        this.audio.playCrash();
      }

      // 4. Défilement du monde et des obstacles (avec réactivité aux basses)
      const playerPos = this.player.group.position;

      this.world.update(dt, this.currentSpeed, currentBpm, bass, (box) => {
        // Test de collision entre la sphère du joueur et la boîte d'obstacle
        if (box.intersectsSphere(this.player.boundingSphere)) {
          this.player.triggerCrash();
          this.audio.playCrash();
          this.state = this.STATE_DYING;
          return true;
        }
        return false;
      });

      // 5. Mise à jour du trou noir, de Nity et des cœurs
      this.target.update(dt, this.currentSpeed, playerPos, bass);

      // Détection de collecte des cœurs du sillage de Nity
      this.target.checkHeartCollisions(playerPos, this.player.radius, () => {
        this.player.rechargeHeart();
        this.audio.playHeartCollect();
        this.heartsCount++;
      });

      // 6. Gestion du Climax du Cycle 8 (Rattrapage de Nity & Feinte Temporelle)
      if (this.audio.currentTrackIndex === 7 && !this.isClimaxFeinteActive) {
        this.cycle8Distance += this.currentSpeed * dt;
        const trackProgress = this.audio.getTrackProgress();

        // Rapprochement progressif vers Nity dès 480m ou 65% du morceau
        const distRatio = Math.min(1.0, Math.max(0, (this.cycle8Distance - 480) / 420));
        const audioRatio = Math.min(1.0, Math.max(0, (trackProgress.progress - 0.65) / 0.28));
        const climaxRatio = Math.max(distRatio, audioRatio);

        if (climaxRatio > 0.05) {
          this.target.setClimaxDistance(climaxRatio);
          const percent = Math.min(99, Math.round(climaxRatio * 100));
          this.ui.showClimaxAlert(`// RATTRAPAGE DE NITY EN COURS... (${percent}%)`);
          this.player.boostExtraSpeed = Math.max(this.player.boostExtraSpeed, climaxRatio * 28.0);
          this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV + 16 * climaxRatio, 4 * dt);
        }

        if (climaxRatio >= 0.98) {
          this.triggerClimaxFeinte();
        }
      }

      // 7. Mise à jour des statistiques
      this.distance += this.currentSpeed * dt;
      if (this.currentSpeed > this.maxSpeed) {
        this.maxSpeed = this.currentSpeed;
      }

      // 8. Suivi caméra 3e personne cinématographique (Infi au premier plan, Nity en ligne de mire à z = -58)
      const tCamX = playerPos.x * 0.36;
      const tCamY = Math.max(3.6, playerPos.y + 2.7);
      const tCamZ = playerPos.z + 8.8;

      this.camera.position.x += (tCamX - this.camera.position.x) * 6.0 * dt;
      this.camera.position.y += (tCamY - this.camera.position.y) * 5.0 * dt;
      this.camera.position.z += (tCamZ - this.camera.position.z) * 5.0 * dt;

      // La caméra vise en avant vers Nity (z = -58) et le Trou Noir
      this.cameraTarget.set(playerPos.x * 0.22, Math.max(2.4, playerPos.y * 0.45 + 1.8), -52);
      this.camera.lookAt(this.cameraTarget);

      // 9. Télémétrie HUD
      this.ui.updateHUD(this.player.energy, this.distance, this.currentSpeed, this.heartsCount);

    } else if (this.state === this.STATE_DYING) {
      // Dislocation d'Infi en particules
      this.player.update(dt, 0, 0, currentBpm, 0);

      if (this.player.dyingTimer >= 1.4) {
        this.state = this.STATE_GAMEOVER;
        const reason = this.player.energy <= 0 ? 'energy' : 'collision';
        this.ui.showGameOver(reason, this.distance, this.maxSpeed, this.heartsCount);
      }
    }

    // 10. Rendu de la scène
    this.renderer.render(this.scene, this.camera);
  }

  // Séquence de Climax du Cycle 8 : Rattrapage de Nity puis Feinte Cosmique (Recommencement en boucle)
  triggerClimaxFeinte() {
    if (this.isClimaxFeinteActive) return;
    this.isClimaxFeinteActive = true;

    // 1. Flash blanc/cyan aveuglant
    this.ui.triggerFlash();

    // 2. SFX Riser spectral + Sub-Warp
    this.audio.playCosmicWarp();

    // 3. Incrémentation de la boucle temporelle
    this.loopCount++;
    this.ui.updateLoopCount(this.loopCount);

    // 4. Annonce de la feinte cosmique dans le HUD
    this.ui.showClimaxAlert(`// FEINTE COSMIQUE ! BOUCLE ∞ ${this.loopCount} ACTIVÉE • RETOUR AU CYCLE 1`, true);

    // 5. Augmentation permanente de la vitesse (prestige & challenge)
    this.baseSpeed += 16.0;
    this.currentSpeed = this.baseSpeed;
    this.player.boostExtraSpeed = 0;

    // 6. Réinitialisation de Nity et reboot temporel au Cycle 1 (Chute)
    this.target.reset();
    this.cycle8Distance = 0;
    this.audio.playTrack(0);

    // 7. Masquer l'alerte après 3.8s et réarmer
    setTimeout(() => {
      this.ui.hideClimaxAlert();
      this.isClimaxFeinteActive = false;
    }, 3800);
  }
}

// Initialisation au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
