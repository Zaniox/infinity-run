import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.radius = 1.0;
    this.lateralSpeed = 22.0; // Vitesse de déplacement latéral
    this.maxX = 15.0;          // Limites latérales gauche / droite

    this.group = new THREE.Group();
    this.createMesh();

    // Position initiale au centre de la scène
    this.group.position.set(0, this.radius, 0);
    this.scene.add(this.group);
  }

  createMesh() {
    // Géométrie : sphère simple
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);

    // Matériau simple réactif à la lumière
    this.material = new THREE.MeshStandardMaterial({
      color: 0x9933ff,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x330066,
      emissiveIntensity: 0.2
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.group.add(this.mesh);

    // Lueur d'appui au sol sous la sphère
    const shadowGeo = new THREE.CircleGeometry(this.radius * 0.9, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.3
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -this.radius + 0.02;
    this.group.add(shadow);
  }

  update(deltaTime, inputAxis) {
    // Déplacement latéral uniquement (gauche / droite)
    if (inputAxis !== 0) {
      this.group.position.x += inputAxis * this.lateralSpeed * deltaTime;
      this.group.position.x = Math.max(-this.maxX, Math.min(this.maxX, this.group.position.x));
    }

    // Inclinaison fluide lors des virages
    const targetRoll = -inputAxis * 0.25;
    this.group.rotation.z += (targetRoll - this.group.rotation.z) * 10.0 * deltaTime;

    // Rotation simulant le roulement au sol
    this.mesh.rotation.x -= 12.0 * deltaTime;
  }

  getPosition() {
    return this.group.position;
  }
}
