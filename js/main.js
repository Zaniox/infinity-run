import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { InputController } from './controls/InputController.js';
import { Player } from './entities/Player.js';
import { InfiniteGrid } from './entities/InfiniteGrid.js';
import { HorizonInfinity } from './entities/HorizonInfinity.js';
import { Atmosphere } from './entities/Atmosphere.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    // Initialisation du monde 3D
    this.engine = new Engine(this.canvas);
    this.inputs = new InputController();
    this.grid = new InfiniteGrid(this.engine.scene);
    this.atmosphere = new Atmosphere(this.engine.scene);
    this.horizon = new HorizonInfinity(this.engine.scene);
    this.player = new Player(this.engine.scene);

    // Éléments du HUD pour l'énergie et la vitesse
    this.energyBar = document.getElementById('heart-energy-fill');
    this.speedText = document.getElementById('hud-speed');
    this.altitudeText = document.getElementById('hud-altitude');

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Entrées de pilotage : X (gauche/droite), Y (vol monter/piquer)
    const inputX = this.inputs.getAxisX();
    const inputY = this.inputs.getAxisY();

    // Mise à jour de l'avatar et de sa physique de planeur
    this.player.update(dt, inputX, inputY);
    const forwardSpeed = this.player.getForwardSpeed();
    const playerPos = this.player.getPosition();
    const energy = this.player.getEnergy();

    // Défilement du monde à vitesse dynamique
    this.grid.update(dt, forwardSpeed);
    this.atmosphere.update(dt, forwardSpeed);
    this.horizon.update(dt);

    // Suivi de caméra cinématique 3e personne adaptatif en X et Y
    const targetCamX = playerPos.x * 0.35;
    const targetCamY = Math.max(3.8, playerPos.y + 3.2);
    const targetCamZ = playerPos.z + 9.2;

    this.engine.camera.position.x += (targetCamX - this.engine.camera.position.x) * 6.0 * dt;
    this.engine.camera.position.y += (targetCamY - this.engine.camera.position.y) * 5.0 * dt;
    this.engine.camera.position.z += (targetCamZ - this.engine.camera.position.z) * 5.0 * dt;

    // Orientation de la caméra légèrement en avance sur la trajectoire
    this.engine.cameraTarget.set(playerPos.x * 0.2, Math.max(1.5, playerPos.y * 0.6), -18);
    this.engine.camera.lookAt(this.engine.cameraTarget);

    // Mise à jour de la lumière rasante
    if (this.engine.groundGlow) {
      this.engine.groundGlow.position.x = playerPos.x;
    }

    // Mise à jour du HUD (Énergie, Vitesse, Altitude)
    this.updateHUD(energy, forwardSpeed, playerPos.y);

    // Rendu final
    this.engine.render();
  }

  updateHUD(energy, speed, altitude) {
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
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
