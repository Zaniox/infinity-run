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

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const inputAxis = this.inputs.getAxis();

    // Mise à jour de la sphère et du défilement infini
    this.player.update(dt, inputAxis);
    this.grid.update(dt);

    // Suivi souple de la caméra en X
    const playerPos = this.player.getPosition();
    const targetCamX = playerPos.x * 0.35;
    this.engine.camera.position.x += (targetCamX - this.engine.camera.position.x) * 6.0 * dt;

    // Lumière ponctuelle accompagnant le joueur
    if (this.engine.playerLight) {
      this.engine.playerLight.position.x = playerPos.x;
    }

    // Rendu
    this.engine.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
