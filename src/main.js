import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { InputController } from './controls/InputController.js';
import { Player } from './entities/Player.js';
import { InfiniteGrid } from './entities/InfiniteGrid.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    this.engine = new Engine(this.canvas);
    this.inputs = new InputController();
    this.grid = new InfiniteGrid(this.engine.scene);
    this.player = new Player(this.engine.scene);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Delta time pour un mouvement fluide indépendant du framerate
    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Récupération de l'axe de contrôle latéral (-1 à 1)
    const inputAxis = this.inputs.getAxis();

    // Mise à jour de la sphère et du défilement infini de la grille
    this.player.update(dt, inputAxis);
    this.grid.update(dt);

    // Suivi de caméra cinématique souple (légère translation en X)
    const playerPos = this.player.getPosition();
    const targetCamX = playerPos.x * 0.35;
    this.engine.camera.position.x += (targetCamX - this.engine.camera.position.x) * 6.0 * dt;

    // Lumière ponctuelle suivant la sphère
    if (this.engine.groundLight) {
      this.engine.groundLight.position.x = playerPos.x;
    }

    // Rendu de la scène
    this.engine.render();
  }
}

// Initialisation au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
