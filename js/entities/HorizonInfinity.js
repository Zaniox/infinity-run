import * as THREE from 'three';

// Courbe mathématique de Lemniscate de Bernoulli pour le symbole infini "8" couché
class LemniscateCurve extends THREE.Curve {
  constructor(scale = 32) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const u = t * Math.PI * 2;
    const a = this.scale;
    const sinU = Math.sin(u);
    const cosU = Math.cos(u);
    const denom = 1 + sinU * sinU;

    const x = (a * Math.sqrt(2) * cosU) / denom;
    const y = (a * Math.sqrt(2) * sinU * cosU) / denom;
    const z = 0;

    return optionalTarget.set(x, y, z);
  }
}

export class HorizonInfinity {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.createInfinitySymbol();
    this.createHalo();

    // Positionnement lointain sur l'axe Z (point de fuite au-dessus de l'horizon)
    this.group.position.set(0, 16, -300);
    this.scene.add(this.group);
  }

  createInfinitySymbol() {
    const curve = new LemniscateCurve(36);

    // Tube 3D volumétrique principal
    const tubeGeo = new THREE.TubeGeometry(curve, 180, 1.8, 16, true);

    // Matériau émissif néon blanc-violet incandescent
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98
    });

    this.mesh = new THREE.Mesh(tubeGeo, this.material);
    this.group.add(this.mesh);

    // Enveloppe d'aura néon violette externe
    const glowGeo = new THREE.TubeGeometry(curve, 180, 3.8, 16, true);
    this.glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xc026d3,
      transparent: true,
      opacity: 0.45,
      side: THREE.BackSide
    });

    this.glowMesh = new THREE.Mesh(glowGeo, this.glowMaterial);
    this.group.add(this.glowMesh);
  }

  createHalo() {
    // Disque de halo diffus à l'arrière-plan du symbole
    const haloGeo = new THREE.RingGeometry(2, 60, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.haloMesh.position.z = -2;
    this.group.add(this.haloMesh);
  }

  update(deltaTime) {
    const time = performance.now() * 0.001;

    // Lévitation douce et lente ondulation
    this.group.position.y = 16 + Math.sin(time * 0.8) * 1.5;

    // Légère pulsation de l'aura
    this.glowMaterial.opacity = 0.35 + Math.sin(time * 2.0) * 0.15;
    this.mesh.rotation.z = Math.sin(time * 0.3) * 0.03;
  }
}
