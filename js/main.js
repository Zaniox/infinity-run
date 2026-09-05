import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { InputController } from './controls/InputController.js';
import { Player } from './entities/Player.js';
import { InfiniteGrid } from './entities/InfiniteGrid.js';
import { HorizonInfinity } from './entities/HorizonInfinity.js';
import { Atmosphere } from './entities/Atmosphere.js';
import { ObstacleManager } from './entities/ObstacleManager.js';
import { DislocationFX } from './entities/DislocationFX.js';

class Game {
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
    this.maxSpeedReached = 0;
    this.dyingTimer = 0;

    // Initialisation Three.js & Entités
    this.engine = new Engine(this.canvas);
    this.inputs = new InputController();
    this.grid = new InfiniteGrid(this.engine.scene);
    this.atmosphere = new Atmosphere(this.engine.scene);
    this.horizon = new HorizonInfinity(this.engine.scene);
    this.player = new Player(this.engine.scene);
    this.obstacleManager = new ObstacleManager(this.engine.scene);
    this.dislocationFX = new DislocationFX(this.engine.scene);

    // Éléments du DOM
    this.initDOMElements();
    this.initRestartEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initDOMElements() {
    this.energyBar = document.getElementById('heart-energy-fill');
    this.speedText = document.getElementById('hud-speed');
    this.altitudeText = document.getElementById('hud-altitude');
    this.distanceText = document.getElementById('hud-distance');

    // Panneau Game Over
    this.gameOverModal = document.getElementById('game-over-modal');
    this.deathReasonText = document.getElementById('death-reason');
    this.finalDistanceText = document.getElementById('final-distance');
    this.finalSpeedText = document.getElementById('final-speed');
    this.btnRestart = document.getElementById('btn-restart');

    // Flash de collecte
    this.pickupFlash = document.getElementById('pickup-flash');
  }

  initRestartEvents() {
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        this.resetGame();
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && this.state === this.STATE_GAMEOVER) {
        this.resetGame();
      }
    });
  }

  triggerGameOver(reason) {
    if (this.state !== this.STATE_PLAYING) return;

    this.state = this.STATE_DYING;
    this.dyingTimer = 0;

    // Masquer l'avatar et déclencher la dislocation en particules
    const playerPos = this.player.getPosition();
    this.player.isAlive = false;
    this.player.setVisible(false);
    this.dislocationFX.trigger(playerPos);

    // Raison du Game Over
    let reasonMessage = 'IMPACT CRITIQUE &bull; AVATAR DÉSINTÉGRÉ';
    if (reason === 'energy') {
      reasonMessage = 'SIGNAL INTERROMPU &bull; CŒUR ÉTEINT';
    }
    if (this.deathReasonText) {
      this.deathReasonText.innerHTML = reasonMessage;
    }
  }

  showGameOverMenu() {
    this.state = this.STATE_GAMEOVER;
    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
    }
    if (this.finalDistanceText) {
      this.finalDistanceText.textContent = `${Math.round(this.distance)} M`;
    }
    if (this.finalSpeedText) {
      this.finalSpeedText.textContent = `${Math.round(this.maxSpeedReached * 3.6)} KM/H`;
    }
  }

  resetGame() {
    if (this.gameOverModal) {
      this.gameOverModal.classList.add('hidden');
    }

    this.distance = 0;
    this.maxSpeedReached = 0;
    this.dyingTimer = 0;

    this.player.reset();
    this.obstacleManager.reset();
    this.dislocationFX.reset();

    this.state = this.STATE_PLAYING;
  }

  showPickupEffect() {
    if (this.pickupFlash) {
      this.pickupFlash.classList.add('active');
      setTimeout(() => {
        this.pickupFlash.classList.remove('active');
      }, 250);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.state === this.STATE_PLAYING) {
      // 1. Piloter le joueur
      const inputX = this.inputs.getAxisX();
      const inputY = this.inputs.getAxisY();
      this.player.update(dt, inputX, inputY);

      const forwardSpeed = this.player.getForwardSpeed();
      const playerPos = this.player.getPosition();
      const energy = this.player.getEnergy();

      // Stats
      this.distance += forwardSpeed * dt;
      if (forwardSpeed > this.maxSpeedReached) {
        this.maxSpeedReached = forwardSpeed;
      }

      // 2. Défilement du monde et obstacles
      this.grid.update(dt, forwardSpeed);
      this.atmosphere.update(dt, forwardSpeed);
      this.horizon.update(dt);
      this.obstacleManager.update(dt, forwardSpeed);

      // 3. Détection des collisions avec les obstacles
      const playerSphere = this.player.getBoundingSphere();
      const collision = this.obstacleManager.checkCollisions(playerSphere);
      if (collision.hit) {
        this.triggerGameOver('collision');
      }

      // 4. Détection de collecte d'orbes violettes
      if (this.obstacleManager.checkPickups(playerSphere)) {
        this.player.rechargeEnergy(100);
        this.showPickupEffect();
      }

      // 5. Vérification de l'énergie du cœur
      if (energy <= 0) {
        this.triggerGameOver('energy');
      }

      // 6. Suivi de caméra cinématique
      const targetCamX = playerPos.x * 0.35;
      const targetCamY = Math.max(3.8, playerPos.y + 3.2);
      const targetCamZ = playerPos.z + 9.2;

      this.engine.camera.position.x += (targetCamX - this.engine.camera.position.x) * 6.0 * dt;
      this.engine.camera.position.y += (targetCamY - this.engine.camera.position.y) * 5.0 * dt;
      this.engine.camera.position.z += (targetCamZ - this.engine.camera.position.z) * 5.0 * dt;

      this.engine.cameraTarget.set(playerPos.x * 0.2, Math.max(1.5, playerPos.y * 0.6), -18);
      this.engine.camera.lookAt(this.engine.cameraTarget);

      if (this.engine.groundGlow) {
        this.engine.groundGlow.position.x = playerPos.x;
      }

      // Mise à jour du HUD
      this.updateHUD(energy, forwardSpeed, playerPos.y, this.distance);

    } else if (this.state === this.STATE_DYING) {
      // Animation de dislocation en cours
      this.dislocationFX.update(dt);
      this.horizon.update(dt);

      this.dyingTimer += dt;
      if (this.dyingTimer >= 1.4) {
        this.showGameOverMenu();
      }

    } else if (this.state === this.STATE_GAMEOVER) {
      // Menu affiché, scène figée avec légère animation du point de fuite
      this.horizon.update(dt);
      this.dislocationFX.update(dt);
    }

    // Rendu
    this.engine.render();
  }

  updateHUD(energy, speed, altitude, distance) {
    if (this.energyBar) {
      this.energyBar.style.width = `${Math.max(0, Math.min(100, energy))}%`;
      if (energy < 25) {
        this.energyBar.classList.add('critical');
      } else {
        this.energyBar.classList.remove('critical');
      }
    }

    if (this.speedText) {
      this.speedText.textContent = `${Math.round(speed * 3.6)} KM/H`;
    }

    if (this.altitudeText) {
      this.altitudeText.textContent = `${Math.round(altitude * 10)} M`;
    }

    if (this.distanceText) {
      this.distanceText.textContent = `${Math.round(distance)} M`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
