/**
 * // SOUNDRISE : INFINITY RUN - CIBLE & HORIZON
 * Nity (Amor), Vortex du Trou Noir Gravitationnel et Sillage de Cœurs
 */
import * as THREE from 'three';

export class TargetManager {
  constructor(scene) {
    this.scene = scene;

    // Groupe racine de l'horizon
    this.horizonGroup = new THREE.Group();
    this.scene.add(this.horizonGroup);

    // Positionnement à l'horizon lointain
    this.horizonZ = -460;
    this.horizonY = 28;
    this.horizonGroup.position.set(0, this.horizonY, this.horizonZ);

    // Entités
    this.createBlackHole();
    this.createNity();

    // Sillage de cœurs
    this.hearts = [];
    this.heartSpawnTimer = 0;
    this.heartGeometry = this.buildHeartGeometry();
    this.heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 3.5,
      roughness: 0.15,
      metalness: 0.2
    });
  }

  // --- 1. TROU NOIR GRAVITATIONNEL ---
  createBlackHole() {
    this.blackHoleGroup = new THREE.Group();

    // Singularité : Sphère noire absolue
    const singularityGeo = new THREE.SphereGeometry(24, 48, 48);
    const singularityMat = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    this.singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    this.blackHoleGroup.add(this.singularityMesh);

    // Anneau de déformation de l'horizon des événements
    const photonRingGeo = new THREE.RingGeometry(24.2, 28.5, 64);
    this.photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.photonRing = new THREE.Mesh(photonRingGeo, this.photonRingMat);
    this.blackHoleGroup.add(this.photonRing);

    // Disque d'accrétion tourbillonnant
    const accretionGeo = new THREE.RingGeometry(29, 72, 64);
    this.accretionMat = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.accretionDisk = new THREE.Mesh(accretionGeo, this.accretionMat);
    this.accretionDisk.rotation.x = Math.PI / 2.8;
    this.blackHoleGroup.add(this.accretionDisk);

    // Deuxième anneau d'accrétion croisé (effet lentille gravitationnelle)
    const haloGeo = new THREE.RingGeometry(26, 60, 64);
    this.lensMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.lensRing = new THREE.Mesh(haloGeo, this.lensMat);
    this.lensRing.rotation.y = Math.PI / 3.2;
    this.blackHoleGroup.add(this.lensRing);

    this.horizonGroup.add(this.blackHoleGroup);
  }

  // --- 2. SILHOUETTE ÉTHÉRÉE DE NITY (AMOR) ---
  createNity() {
    this.nityGroup = new THREE.Group();
    this.nityGroup.position.set(0, -6, 45); // Flotte juste devant le trou noir

    // Tête céleste lumineuse
    const headGeo = new THREE.SphereGeometry(5.5, 32, 32);
    this.nityHeadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.5,
      roughness: 0.1
    });
    this.nityHead = new THREE.Mesh(headGeo, this.nityHeadMat);
    this.nityHead.position.y = 8;
    this.nityGroup.add(this.nityHead);

    // Manteau d'énergie céleste (cône élancé)
    const mantleGeo = new THREE.ConeGeometry(7, 18, 32);
    this.nityMantleMat = new THREE.MeshStandardMaterial({
      color: 0x140428,
      emissive: 0xbd00ff,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });
    this.nityMantle = new THREE.Mesh(mantleGeo, this.nityMantleMat);
    this.nityMantle.position.y = -2;
    this.nityGroup.add(this.nityMantle);

    // Halo d'aura flottant
    const auraGeo = new THREE.SphereGeometry(9, 32, 32);
    this.nityAuraMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.nityAura = new THREE.Mesh(auraGeo, this.nityAuraMat);
    this.nityAura.position.y = 6;
    this.nityGroup.add(this.nityAura);

    // Halo circulaire céleste
    const ringGeo = new THREE.TorusGeometry(12, 0.4, 16, 48);
    this.nityRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.nityRing = new THREE.Mesh(ringGeo, this.nityRingMat);
    this.nityRing.rotation.x = Math.PI / 2.3;
    this.nityRing.position.y = 6;
    this.nityGroup.add(this.nityRing);

    this.horizonGroup.add(this.nityGroup);
  }

  // Géométrie d'un cœur 3D profilé
  buildHeartGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, 0.15, -0.22, 0.35, -0.4, 0.35);
    shape.bezierCurveTo(-0.7, 0.35, -0.7, 0, -0.7, 0);
    shape.bezierCurveTo(-0.7, -0.3, -0.35, -0.65, 0, -0.9);
    shape.bezierCurveTo(0.35, -0.65, 0.7, -0.3, 0.7, 0);
    shape.bezierCurveTo(0.7, 0, 0.7, 0.35, 0.4, 0.35);
    shape.bezierCurveTo(0.22, 0.35, 0, 0.15, 0, 0);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });
    geom.scale(1.2, 1.2, 1.2);
    geom.center();
    return geom;
  }

  // --- 3. SILLAGE DE CŒURS SEMÉ PAR NITY ---
  spawnHeart(playerX) {
    const group = new THREE.Group();

    const heartMesh = new THREE.Mesh(this.heartGeometry, this.heartMaterial);
    group.add(heartMesh);

    // Halo d'énergie autour du cœur
    const glowGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    // Anneau de lévitation
    const orbitGeo = new THREE.TorusGeometry(1.6, 0.04, 8, 24);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2.5;
    group.add(orbit);

    // Positionnement dans le sillage en avant du joueur
    // Alternance entre ras du sol et altitude pour inciter aux manœuvres 3D
    const alt = Math.random() < 0.45 ? 2.2 : (6.0 + Math.random() * 12.0);
    const spreadX = (Math.random() - 0.5) * 24.0 + playerX * 0.3;
    const spawnZ = -220.0;

    group.position.set(spreadX, alt, spawnZ);

    const heartObj = {
      mesh: group,
      orbit: orbit,
      radius: 1.6,
      collected: false
    };

    this.scene.add(group);
    this.hearts.push(heartObj);
  }

  // Mise à jour de la cible, du trou noir et des cœurs
  update(dt, speed, playerPos, bassEnergy) {
    const time = performance.now() * 0.001;

    // 1. Animation & Réactivité du Trou Noir
    if (this.accretionDisk) {
      this.accretionDisk.rotation.z += (0.4 + bassEnergy * 0.6) * dt;
      this.lensRing.rotation.z -= (0.3 + bassEnergy * 0.4) * dt;

      // Pulsation de l'échelle du vortex sur la bande 20-120 Hz
      const vortexScale = 1.0 + Math.pow(bassEnergy, 1.6) * 0.35;
      this.blackHoleGroup.scale.set(vortexScale, vortexScale, vortexScale);
      this.photonRingMat.opacity = 0.85 + bassEnergy * 0.15;
    }

    // 2. Animation & Réactivité de Nity
    if (this.nityGroup) {
      // Flottaison sinusoïdale mystique
      this.nityGroup.position.y = -6 + Math.sin(time * 1.6) * 2.2;
      this.nityGroup.position.x = Math.sin(time * 0.7) * 4.0;
      this.nityRing.rotation.z += 1.2 * dt;

      // Pulsation de l'aura de Nity sur les coups de basse
      const auraScale = 1.0 + Math.pow(bassEnergy, 1.8) * 0.45;
      this.nityAura.scale.set(auraScale, auraScale, auraScale);
      this.nityAuraMat.opacity = 0.45 + bassEnergy * 0.45;
      this.nityHeadMat.emissiveIntensity = 2.0 + bassEnergy * 3.0;
    }

    // Suivi doux en X de l'horizon pour accentuer la perspective
    this.horizonGroup.position.x = playerPos.x * 0.15;

    // 3. Cadencement du sillage de cœurs
    this.heartSpawnTimer += dt;
    const heartInterval = Math.max(1.8, 3.2 - (speed / 100.0));
    if (this.heartSpawnTimer >= heartInterval) {
      this.heartSpawnTimer = 0;
      this.spawnHeart(playerPos.x);
    }

    // 4. Défilement et rotation des cœurs du sillage
    const deltaZ = speed * dt;
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.mesh.position.z += deltaZ;
      h.mesh.rotation.y += 2.8 * dt;
      h.orbit.rotation.z += 3.6 * dt;

      // Despawn si dépassé
      if (h.mesh.position.z > 15.0 || h.collected) {
        this.scene.remove(h.mesh);
        this.hearts.splice(i, 1);
      }
    }
  }

  // Vérification des collisions entre Infi et les cœurs
  checkHeartCollisions(playerPos, playerRadius, onCollectCallback) {
    for (const h of this.hearts) {
      if (!h.collected) {
        const dist = h.mesh.position.distanceTo(playerPos);
        if (dist < (h.radius + playerRadius * 0.9)) {
          h.collected = true;
          if (onCollectCallback) {
            onCollectCallback(h.mesh.position);
          }
        }
      }
    }
  }

  // Adaptation de la palette de la cible selon le cycle
  setCycleColors(primaryHex, secondaryHex) {
    if (this.accretionMat) this.accretionMat.color.set(secondaryHex);
    if (this.lensMat) this.lensMat.color.set(primaryHex);
    if (this.nityAuraMat) this.nityAuraMat.color.set(primaryHex);
    if (this.nityHeadMat) this.nityHeadMat.emissive.set(primaryHex);
    if (this.nityMantleMat) this.nityMantleMat.emissive.set(secondaryHex);
    if (this.nityRingMat) this.nityRingMat.color.set(secondaryHex);
  }

  reset() {
    for (const h of this.hearts) {
      this.scene.remove(h.mesh);
    }
    this.hearts = [];
    this.heartSpawnTimer = 0;
  }
}
