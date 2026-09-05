import * as THREE from 'three';

export class DislocationFX {
  constructor(scene) {
    this.scene = scene;
    this.particleCount = 280;
    this.isActive = false;
    this.duration = 1.8;
    this.elapsed = 0;

    this.createParticles();
  }

  createParticles() {
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * 3);

    // Initialisation
    for (let i = 0; i < this.particleCount; i++) {
      this.positions[i * 3] = 0;
      this.positions[i * 3 + 1] = -100;
      this.positions[i * 3 + 2] = 0;

      // Alternance de magenta intense (#ff2ea6), violet (#9333ea) et cyan néon (#00f0ff)
      const r = Math.random();
      if (r < 0.45) {
        this.colors[i * 3] = 1.0;     // R
        this.colors[i * 3 + 1] = 0.18; // G
        this.colors[i * 3 + 2] = 0.65; // B
      } else if (r < 0.75) {
        this.colors[i * 3] = 0.58;
        this.colors[i * 3 + 1] = 0.2;
        this.colors[i * 3 + 2] = 0.92;
      } else {
        this.colors[i * 3] = 0.0;
        this.colors[i * 3 + 1] = 0.94;
        this.colors[i * 3 + 2] = 1.0;
      }
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleSystem);
  }

  trigger(originPos) {
    this.isActive = true;
    this.elapsed = 0;
    this.material.opacity = 1.0;

    const pos = this.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      // Départ depuis la position d'impact de l'avatar
      pos[i * 3] = originPos.x + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = originPos.y + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = originPos.z + (Math.random() - 0.5) * 1.5;

      // Vélocité d'explosion radiale 3D
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 12 + Math.random() * 26;

      this.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i * 3 + 1] = (Math.cos(phi) * speed) + 4.0; // Légère poussée vers le haut
      this.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  update(deltaTime) {
    if (!this.isActive) return;

    this.elapsed += deltaTime;
    const progress = this.elapsed / this.duration;

    if (progress >= 1.0) {
      this.isActive = false;
      this.material.opacity = 0;
      return;
    }

    // Fondu progressif
    this.material.opacity = Math.max(0, 1.0 - Math.pow(progress, 2));

    const pos = this.geometry.attributes.position.array;
    const gravity = -18.0;

    for (let i = 0; i < this.particleCount; i++) {
      // Application de la vélocité et gravité
      pos[i * 3] += this.velocities[i * 3] * deltaTime;
      pos[i * 3 + 1] += this.velocities[i * 3 + 1] * deltaTime;
      pos[i * 3 + 2] += this.velocities[i * 3 + 2] * deltaTime;

      this.velocities[i * 3 + 1] += gravity * deltaTime;

      // Rebond au sol (y = 0)
      if (pos[i * 3 + 1] < 0.2) {
        pos[i * 3 + 1] = 0.2;
        this.velocities[i * 3 + 1] = -this.velocities[i * 3 + 1] * 0.4;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  reset() {
    this.isActive = false;
    this.material.opacity = 0;
    this.elapsed = 0;
  }
}
