import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.radius = 1.0;
    this.lateralSpeed = 22.0; // Vitesse de déplacement gauche/droite
    this.maxX = 14.0;          // Limite latérale de la piste

    this.group = new THREE.Group();
    this.createMesh();
    this.createFloorShadow();

    this.group.position.set(0, this.radius, 0);
    this.scene.add(this.group);
  }

  createMesh() {
    // Géométrie de la sphère
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    // Matériau Cyber-Baroque : violet profond métallique, très réfléchissant avec vernis brillant
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x24053b,
      metalness: 0.92,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x5a0b82,
      emissiveIntensity: 0.45
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.group.add(this.mesh);

    // Anneau néon fin au centre (rappel Cyber-Baroque)
    const ringGeo = new THREE.TorusGeometry(this.radius * 1.02, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.9
    });
    this.neonRing = new THREE.Mesh(ringGeo, ringMat);
    this.neonRing.rotation.x = Math.PI / 2;
    this.group.add(this.neonRing);
  }

  createFloorShadow() {
    // Ombre de contact / lueur au sol sous la sphère
    const shadowGeo = new THREE.CircleGeometry(this.radius * 1.1, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.35
    });
    this.floorGlow = new THREE.Mesh(shadowGeo, shadowMat);
    this.floorGlow.rotation.x = -Math.PI / 2;
    this.floorGlow.position.y = -this.radius + 0.02;
    this.group.add(this.floorGlow);
  }

  update(deltaTime, inputAxis) {
    // Déplacement latéral uniquement (gauche / droite)
    if (inputAxis !== 0) {
      this.group.position.x += inputAxis * this.lateralSpeed * deltaTime;
      // Clamping aux limites de la piste
      this.group.position.x = Math.max(-this.maxX, Math.min(this.maxX, this.group.position.x));
    }

    // Roulis dynamique lors des virages (inclinaison)
    const targetRoll = -inputAxis * 0.35;
    this.group.rotation.z += (targetRoll - this.group.rotation.z) * 12.0 * deltaTime;

    // Rotation continue simulant le roulement de la sphère vers l'avant
    const rollSpeed = 14.0;
    this.mesh.rotation.x -= rollSpeed * deltaTime;

    // Légère pulsation de l'anneau néon
    const time = performance.now() * 0.003;
    this.neonRing.material.opacity = 0.75 + Math.sin(time) * 0.2;
  }

  getPosition() {
    return this.group.position;
  }
}
