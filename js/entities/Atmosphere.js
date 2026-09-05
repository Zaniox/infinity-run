import * as THREE from 'three';

export class Atmosphere {
  constructor(scene) {
    this.scene = scene;
    this.createStars();
    this.createAltitudeDust();
  }

  createStars() {
    // Étoiles lointaines dans le vide spatial
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = Math.random() * 200 + 10;
      positions[i * 3 + 2] = -Math.random() * 500 - 50;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xe9d5ff,
      size: 1.2,
      transparent: true,
      opacity: 0.75
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  createAltitudeDust() {
    // Poussières cyber néon en suspension pour percevoir l'altitude
    this.dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    this.dustPositions = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      this.resetDustParticle(i, true);
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(this.dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 2.0,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  resetDustParticle(i, initial = false) {
    this.dustPositions[i * 3] = (Math.random() - 0.5) * 70;
    this.dustPositions[i * 3 + 1] = Math.random() * 26 + 1.0; // Altitude 1m à 27m
    this.dustPositions[i * 3 + 2] = initial
      ? -Math.random() * 280
      : -280;
  }

  update(deltaTime, forwardSpeed) {
    // Déplacement des repères de poussière vers la caméra selon la vitesse de vol
    const pos = this.dustParticles.geometry.attributes.position.array;
    const deltaZ = forwardSpeed * deltaTime;

    for (let i = 0; i < this.dustCount; i++) {
      pos[i * 3 + 2] += deltaZ;

      // Réinitialiser au loin lorsqu'elle dépasse la caméra
      if (pos[i * 3 + 2] > 20) {
        this.resetDustParticle(i);
      }
    }

    this.dustParticles.geometry.attributes.position.needsUpdate = true;
  }
}
