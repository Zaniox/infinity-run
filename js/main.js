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
    this.STATE_START = 'START';
    this.STATE_PLAYING = 'PLAYING';
    this.STATE_DYING = 'DYING';
    this.STATE_GAMEOVER = 'GAMEOVER';
    this.state = this.STATE_START;

    // Statistiques de vol
    this.distance = 0;
    this.maxSpeed = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.heartsCount = 0;

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
    this.renderer.toneMappingExposure = 1.25;
  }

  // Démarrage sur le clic "Commencer la traversée"
  startGame() {
    this.state = this.STATE_PLAYING;
    this.audio.start();
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);
  }

  restartGame() {
    this.distance = 0;
    this.heartsCount = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;

    this.player.reset();
    this.target.reset();
    this.world.reset();

    this.state = this.STATE_PLAYING;
  }

  // Callback lors d'un changement de cycle / piste
  onTrackChange(index, track) {
    this.world.setCycle(index);
    const cycle = this.world.cycle;
    this.target.setCycleColors(cycle.primary, cycle.secondary);
    this.ui.updateCycleBadge(cycle);
    this.ui.showCycleToast(cycle);
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

    // Souris & Tactile mobile
    window.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        const diffX = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.22);
        const diffY = (this.pointerStartY - e.clientY) / (window.innerHeight * 0.22);
        this.inputAxisX = Math.max(-1, Math.min(1, diffX));
        this.inputAxisY = Math.max(-1, Math.min(1, diffY));
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -((e.clientY / window.innerHeight) * 2 - 1);
        this.inputAxisX = Math.abs(normX) > 0.1 ? Math.sign(normX) * ((Math.abs(normX) - 0.1) / 0.9) : 0;
        this.inputAxisY = Math.abs(normY) > 0.12 ? Math.sign(normY) * ((Math.abs(normY) - 0.12) / 0.88) : 0;
      }
    });

    const resetPointer = () => {
      this.isPointerDown = false;
      this.updateInputAxes();
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

      // 4. Défilement du monde et des obstacles
      const playerPos = this.player.group.position;

      this.world.update(dt, this.currentSpeed, currentBpm, (box) => {
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

      // 6. Mise à jour des statistiques
      this.distance += this.currentSpeed * dt;
      if (this.currentSpeed > this.maxSpeed) {
        this.maxSpeed = this.currentSpeed;
      }

      // 7. Suivi caméra 3e personne cinématographique
      const tCamX = playerPos.x * 0.35;
      const tCamY = Math.max(3.8, playerPos.y + 3.2);
      const tCamZ = playerPos.z + 9.5;

      this.camera.position.x += (tCamX - this.camera.position.x) * 6.0 * dt;
      this.camera.position.y += (tCamY - this.camera.position.y) * 5.0 * dt;
      this.camera.position.z += (tCamZ - this.camera.position.z) * 5.0 * dt;

      this.cameraTarget.set(playerPos.x * 0.2, Math.max(1.8, playerPos.y * 0.6), -18);
      this.camera.lookAt(this.cameraTarget);

      // 8. Télémétrie HUD
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

    // 9. Rendu de la scène
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialisation au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
