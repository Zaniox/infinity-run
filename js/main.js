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
    if (!this.auth || !this.auth.isAuthenticated()) {
      if (this.ui) this.ui.openGoogleDirectModal();
      return;
    }
    if (!this.auth.hasPseudo()) {
      if (this.ui) this.ui.openPseudoModal();
      return;
    }

    this.state = this.STATE_PLAYING;
    this.ui.hideStartMenu();
    if (!this.audio.isPlaying) this.audio.start();
    const track = this.audio.getCurrentTrack();
    this.onTrackChange(this.audio.currentTrackIndex, track);
  }

  restartGame() {
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
    this.ui.updateHUD(100, 0, this.currentSpeed, 0);
    this.state = this.STATE_PLAYING;
  }

  startMultiplayerGame(startCycleIndex = 0) {
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
      if (e.code === 'Space') {
        this.keyFire = true;
        if (this.state === this.STATE_PLAYING) {
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
      if (e.button === 0 && this.state === this.STATE_PLAYING) {
        this.firePlayerLaser();
      }
    });

    // Tactile mobile
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') {
        this.isPointerDown = true;
        this.pointerStartX = e.clientX;
        this.pointerStartY = e.clientY;
        if (this.state === this.STATE_PLAYING) {
          this.firePlayerLaser();
        }
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

    if (this.keyFire && this.state === this.STATE_PLAYING) {
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // Boucle de rendu 60 FPS
  animate() {
    requestAnimationFrame(this.animate);

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
      // 2. Calcul de la vitesse de translation avec boost temporaire et bonus Sayanfinity
      const saiyanBonus = this.player.isSayanfinityActive() ? 24.0 : 0.0;
      this.baseSpeed = 68.0 + (this.distance / 1200.0) * 15.0;
      this.currentSpeed = this.baseSpeed + this.player.boostExtraSpeed + saiyanBonus;

      // Effet cinématique d'étirement du champ de vision lors d'un boost ou Sayanfinity
      if (this.player.isSayanfinityActive()) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV + 14, 6 * dt);
      } else if (this.player.boostTimer > 0) {
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

      // Collision des lasers Star Fox avec les obstacles
      this.world.checkLaserCollisions(this.player.lasers, (obs, hitPos, isSaiyan) => {
        this.audio.playObstacleDestroyed();
        this.obstaclesDestroyed = (this.obstaclesDestroyed || 0) + 1;
        this.distance += isSaiyan ? 30 : 15;
        this.ui.pulseReticleHit();

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
        // Test de collision entre la sphère du joueur et la boîte d'obstacle
        if (box.intersectsSphere(this.player.boundingSphere)) {
          // Période de grâce d'invulnérabilité
          if (this.player.invulnerableTimer > 0) {
            return false;
          }

          // Cas 1 : Mode SAYANFINITY actif (Super Saiyan 20s) -> broie l'obstacle instantanément !
          if (this.player.isSayanfinityActive()) {
            this.audio.playSaiyanSmash();
            this.obstaclesDestroyed = (this.obstaclesDestroyed || 0) + 1;
            this.distance += 35; // Bonus destructeur
            this.ui.pulseReticleHit();
            return 'smash';
          }

          // Cas 2 : Bouclier d'Armure actif -> absorbe l'impact, protège et détruit l'obstacle !
          if (this.player.hasShield) {
            this.player.absorbHit(this.audio);
            this.ui.pulseReticleHit();
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

      // 5. Mise à jour du trou noir, de Nity et des drops
      this.target.update(dt, this.currentSpeed, playerPos, bass);

      // Détection de collecte des drops (Cœurs vitaux, Armures 1-hit, Sayanfinity 20s)
      this.target.checkDropCollisions(playerPos, this.player.radius, (type, pos) => {
        if (type === 'sayanfinity') {
          // Rare drop : SAYANFINITY 20 secondes !
          this.player.activateSayanfinity(20.0, this.audio);
          this.player.rechargeHeart();
          this.ui.showClimaxAlert('⚡ SAYANFINITY ACTIVÉ ! CASSEZ LES OBSTACLES (20S)', true);
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

      // 9. Télémétrie HUD avec Armure et Sayanfinity
      this.ui.updateHUD(
        this.player.energy,
        this.distance,
        this.currentSpeed,
        this.heartsCount,
        this.player.hasShield,
        this.player.armorCount,
        this.player.isSayanfinityActive(),
        this.player.saiyanTimer
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
      this.player.update(dt, 0, 0, currentBpm, 0);

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
        if (!this.isMultiplayerDuel) {
          this.ui.showGameOver(reason, this.distance, this.maxSpeed, this.heartsCount);
        }

        // Enregistrement automatique au Classement Mondial officiel
        if (this.auth && this.auth.isAuthenticated() && this.auth.hasPseudo() && this.leaderboard) {
          const user = this.auth.getUser();
          const totalScore = Math.floor(this.distance * 10 + this.heartsCount * 250);
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
      const totalScore = Math.floor(this.distance * 10 + this.heartsCount * 250);
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

    // 1. Flash blanc/cyan aveuglant
    this.ui.triggerFlash();

    // 2. SFX Riser spectral + Sub-Warp
    this.audio.playCosmicWarp();

    // 3. Affichage du Modal Troll officiel (Feinte Cosmique Infinie)
    const nextLoop = this.loopCount + 1;
    this.ui.showTrollModal(nextLoop, () => {
      this.continueAfterTroll();
    });
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
