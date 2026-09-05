/**
 * // SOUNDRISE : INFINITY RUN - CIBLE, HORIZON & NITY
 * Nity en vol devant Infi (z = -58), aspiration cosmique vers le Trou Noir,
 * flux gravitationnels d'accrétion et sillage de cœurs à collecter.
 */
import * as THREE from 'three';

export class TargetManager {
  constructor(scene) {
    this.scene = scene;

    // 1. Horizon & Trou Noir lointain
    this.horizonGroup = new THREE.Group();
    this.horizonZ = -360;
    this.horizonY = 30;
    this.horizonGroup.position.set(0, this.horizonY, this.horizonZ);
    this.scene.add(this.horizonGroup);

    this.createBlackHole();

    // 2. Nity en vol devant le joueur (Infi à z = 0, Nity à z = -58)
    this.nityGroup = new THREE.Group();
    this.nityBaseZ = -58;
    this.nityBaseY = 6.8;
    this.nityGroup.position.set(0, this.nityBaseY, this.nityBaseZ);
    this.scene.add(this.nityGroup);

    this.createNityModel();

    // 3. Courant d'aspiration gravitationnelle (Particules reliant Nity au Trou Noir)
    this.createGravitationalSuctionStream();

    // 4. Sillage de cœurs semés par Nity
    this.hearts = [];
    this.heartSpawnTimer = 0;
    this.heartGeometry = this.buildHeartGeometry();
    this.heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 3.8,
      roughness: 0.12,
      metalness: 0.18
    });
  }

  // --- 1. TROU NOIR GÉANT À L'HORIZON (Singularité & Disque d'accrétion) ---
  createBlackHole() {
    this.blackHoleGroup = new THREE.Group();

    // Singularité : Sphère noire absolue
    const singularityGeo = new THREE.SphereGeometry(28, 48, 48);
    const singularityMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    this.blackHoleGroup.add(this.singularityMesh);

    // Anneau de photons (Horizon des événements blanc pur ultra-lumineux)
    const photonRingGeo = new THREE.RingGeometry(28.2, 33.5, 64);
    this.photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.photonRing = new THREE.Mesh(photonRingGeo, this.photonRingMat);
    this.blackHoleGroup.add(this.photonRing);

    // Disque d'accrétion principal incliné
    const accretionGeo = new THREE.RingGeometry(34, 88, 64);
    this.accretionMat = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.accretionDisk = new THREE.Mesh(accretionGeo, this.accretionMat);
    this.accretionDisk.rotation.x = Math.PI / 2.7;
    this.blackHoleGroup.add(this.accretionDisk);

    // Anneau de lentille gravitationnelle croisé
    const haloGeo = new THREE.RingGeometry(30, 72, 64);
    this.lensMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.lensRing = new THREE.Mesh(haloGeo, this.lensMat);
    this.lensRing.rotation.y = Math.PI / 3.4;
    this.blackHoleGroup.add(this.lensRing);

    this.horizonGroup.add(this.blackHoleGroup);
  }

  // --- 2. MODÈLE 3D DE NITY (« AMOR ») DEVANT LE JOUEUR ---
  createNityModel() {
    this.nityAvatar = new THREE.Group();
    this.nityGroup.add(this.nityAvatar);

    // A. Tête sphérique chrome/irisée avec reflets néon (Image 2)
    const headGeo = new THREE.SphereGeometry(1.35, 32, 32);
    this.nityHeadMat = new THREE.MeshStandardMaterial({
      color: 0x080414,
      metalness: 0.92,
      roughness: 0.12,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.85
    });
    this.nityHead = new THREE.Mesh(headGeo, this.nityHeadMat);
    this.nityHead.position.y = 2.4;
    this.nityHead.castShadow = true;
    this.nityAvatar.add(this.nityHead);

    // Visage éthéré : Arcs lumineux célestes sur la tête
    const eyeGeo = new THREE.TorusGeometry(0.55, 0.05, 12, 24, Math.PI * 0.9);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.4, 2.5, 1.15);
    leftEye.rotation.x = Math.PI * 0.15;
    leftEye.rotation.z = Math.PI;
    this.nityAvatar.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.4, 2.5, 1.15);
    rightEye.rotation.x = Math.PI * 0.15;
    rightEye.rotation.z = Math.PI;
    this.nityAvatar.add(rightEye);

    // B. Manteau conique élancé (silhouette géométrique d'Amor / Image 2)
    const mantleGeo = new THREE.ConeGeometry(1.65, 3.8, 32);
    this.nityMantleMat = new THREE.MeshStandardMaterial({
      color: 0x0a0518,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xbd00ff,
      emissiveIntensity: 1.2
    });
    this.nityMantle = new THREE.Mesh(mantleGeo, this.nityMantleMat);
    this.nityMantle.position.y = -0.2;
    this.nityMantle.castShadow = true;
    this.nityAvatar.add(this.nityMantle);

    // Ligne verticale lumineuse sur le manteau
    const spineGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 16);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, -0.2, 1.1);
    this.nityAvatar.add(spine);

    // C. Halo céleste en lévitation orbitale
    const haloGeo = new THREE.TorusGeometry(2.4, 0.06, 16, 48);
    this.nityRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.nityRing = new THREE.Mesh(haloGeo, this.nityRingMat);
    this.nityRing.rotation.x = Math.PI / 2.4;
    this.nityRing.position.y = 1.6;
    this.nityAvatar.add(this.nityRing);

    // D. Aura sphérique pulsante
    const auraGeo = new THREE.SphereGeometry(2.6, 24, 24);
    this.nityAuraMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.nityAura = new THREE.Mesh(auraGeo, this.nityAuraMat);
    this.nityAura.position.y = 1.6;
    this.nityAvatar.add(this.nityAura);

    // E. Cœur de Nity sur la poitrine
    const heartMesh = new THREE.Mesh(this.buildHeartGeometry(), new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 5.0,
      roughness: 0.1
    }));
    heartMesh.scale.set(0.45, 0.45, 0.45);
    heartMesh.position.set(0, 1.2, 0.95);
    this.nityHeartMesh = heartMesh;
    this.nityAvatar.add(heartMesh);
  }

  // --- 3. COURANT GRAVITATIONNEL D'ASPIRATION (NITY -> TROU NOIR) ---
  createGravitationalSuctionStream() {
    this.suctionParticleCount = 240;
    const geo = new THREE.BufferGeometry();
    this.suctionPositions = new Float32Array(this.suctionParticleCount * 3);
    this.suctionSeeds = [];

    for (let i = 0; i < this.suctionParticleCount; i++) {
      this.suctionSeeds.push({
        t: Math.random(), // Progression de 0 (Nity) à 1 (Trou Noir)
        angle: Math.random() * Math.PI * 2,
        spiralSpeed: 1.5 + Math.random() * 2.5,
        radiusBase: 2.0 + Math.random() * 6.0,
        speed: 0.18 + Math.random() * 0.28
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.suctionPositions, 3));

    this.suctionMat = new THREE.PointsMaterial({
      color: 0xd946ef,
      size: 2.6,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.suctionPoints = new THREE.Points(geo, this.suctionMat);
    this.scene.add(this.suctionPoints);
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

  // --- 4. SILLAGE DE CŒURS SEMÉ PAR NITY ---
  spawnHeartFromNity() {
    const group = new THREE.Group();

    const heartMesh = new THREE.Mesh(this.heartGeometry, this.heartMaterial);
    group.add(heartMesh);

    // Halo d'énergie autour du cœur
    const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    // Anneau d'énergie céleste en rotation
    const orbitGeo = new THREE.TorusGeometry(1.5, 0.04, 8, 24);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2.4;
    group.add(orbit);

    // Le cœur apparaît exactement derrière Nity dans son sillage
    const np = this.nityGroup.position;
    const spreadX = np.x + (Math.random() - 0.5) * 4.0;
    const spawnY = Math.max(2.0, np.y - 0.5 + (Math.random() - 0.5) * 2.0);
    const spawnZ = np.z + 4.0; // Juste derrière Nity

    group.position.set(spreadX, spawnY, spawnZ);

    const heartObj = {
      mesh: group,
      orbit: orbit,
      radius: 1.6,
      collected: false
    };

    this.scene.add(group);
    this.hearts.push(heartObj);
  }

  // Mise à jour continue : Animation d'aspiration, Trou Noir et Cœurs
  update(dt, speed, playerPos, bassEnergy) {
    const time = performance.now() * 0.001;

    // 1. Animation du Trou Noir lointain
    if (this.accretionDisk) {
      this.accretionDisk.rotation.z += (0.45 + bassEnergy * 0.75) * dt;
      this.lensRing.rotation.z -= (0.35 + bassEnergy * 0.5) * dt;

      const vortexScale = 1.0 + Math.pow(bassEnergy, 1.6) * 0.4;
      this.blackHoleGroup.scale.set(vortexScale, vortexScale, vortexScale);
      this.photonRingMat.opacity = 0.88 + bassEnergy * 0.12;
    }

    // Suivi subtil du regard vers l'horizon
    this.horizonGroup.position.x = playerPos.x * 0.12;

    // 2. Cinématique de Nity aspirée vers le Trou Noir (« se fait aspirer devant Infi »)
    if (this.nityGroup) {
      // Oscillation latérale et verticale (lutte contre la pesanteur du vortex)
      const swayX = Math.sin(time * 1.5) * 4.8 + playerPos.x * 0.35;
      const swayY = this.nityBaseY + Math.sin(time * 2.2) * 1.6;
      // Dérive d'aspiration longitudinale (tirée vers l'avant puis luttant)
      const pullZ = this.nityBaseZ + Math.sin(time * 1.1) * 3.8;

      this.nityGroup.position.x += (swayX - this.nityGroup.position.x) * 4.0 * dt;
      this.nityGroup.position.y += (swayY - this.nityGroup.position.y) * 4.0 * dt;
      this.nityGroup.position.z += (pullZ - this.nityGroup.position.z) * 4.0 * dt;

      // Inclinaisons dynamiques (Piqué d'aspiration et roulis dans le vent cosmique)
      const targetPitch = 0.28 + Math.sin(time * 2.5) * 0.12; // Inclinée vers l'avant (aspirée)
      const targetRoll = -Math.cos(time * 1.5) * 0.3; // Roulis
      this.nityAvatar.rotation.x += (targetPitch - this.nityAvatar.rotation.x) * 5.0 * dt;
      this.nityAvatar.rotation.z += (targetRoll - this.nityAvatar.rotation.z) * 5.0 * dt;

      // Rotation de son halo et pulsation de son aura sur les basses
      this.nityRing.rotation.z += 2.2 * dt;
      const auraScale = 1.0 + Math.pow(bassEnergy, 1.8) * 0.55;
      this.nityAura.scale.set(auraScale, auraScale, auraScale);
      this.nityAuraMat.opacity = 0.35 + bassEnergy * 0.45;
      this.nityHeadMat.emissiveIntensity = 0.8 + bassEnergy * 2.4;

      if (this.nityHeartMesh) {
        const hPulse = 0.45 * (1.0 + bassEnergy * 0.3);
        this.nityHeartMesh.scale.set(hPulse, hPulse, hPulse);
      }
    }

    // 3. Mise à jour du flux de particules d'aspiration (de Nity vers le Trou Noir)
    const nPos = this.nityGroup.position;
    const bhPos = this.horizonGroup.position;
    const posArr = this.suctionPoints.geometry.attributes.position.array;

    for (let i = 0; i < this.suctionParticleCount; i++) {
      const s = this.suctionSeeds[i];
      s.t += s.speed * dt;
      if (s.t > 1.0) s.t = 0;

      // Interpolation de Nity au Trou Noir
      const curZ = nPos.z + (bhPos.z - nPos.z) * s.t;
      const curY = nPos.y + (bhPos.y - nPos.y) * s.t;
      const curX = nPos.x + (bhPos.x - nPos.x) * s.t;

      // Effet vortex en spirale se resserrant vers le centre du trou noir
      const spiralRadius = s.radiusBase * (1.0 - s.t * 0.7);
      const angle = s.angle + time * s.spiralSpeed + s.t * Math.PI * 4;

      posArr[i * 3] = curX + Math.cos(angle) * spiralRadius;
      posArr[i * 3 + 1] = curY + Math.sin(angle) * spiralRadius;
      posArr[i * 3 + 2] = curZ;
    }
    this.suctionPoints.geometry.attributes.position.needsUpdate = true;
    this.suctionMat.opacity = 0.65 + bassEnergy * 0.35;

    // 4. Cadencement du sillage de cœurs semés par Nity
    this.heartSpawnTimer += dt;
    const heartInterval = Math.max(1.5, 2.8 - (speed / 120.0));
    if (this.heartSpawnTimer >= heartInterval) {
      this.heartSpawnTimer = 0;
      this.spawnHeartFromNity();
    }

    // 5. Défilement des cœurs vers Infi
    const deltaZ = speed * dt;
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.mesh.position.z += deltaZ;
      h.mesh.rotation.y += 2.8 * dt;
      h.orbit.rotation.z += 3.6 * dt;

      // Despawn si dépassé derrière Infi
      if (h.mesh.position.z > 14.0 || h.collected) {
        this.scene.remove(h.mesh);
        this.hearts.splice(i, 1);
      }
    }
  }

  // Vérification de collecte par Infi
  checkHeartCollisions(playerPos, playerRadius, onCollectCallback) {
    for (const h of this.hearts) {
      if (!h.collected) {
        const dist = h.mesh.position.distanceTo(playerPos);
        if (dist < (h.radius + playerRadius * 0.95)) {
          h.collected = true;
          if (onCollectCallback) {
            onCollectCallback(h.mesh.position);
          }
        }
      }
    }
  }

  // Adaptation de la palette selon le cycle
  setCycleColors(primaryHex, secondaryHex) {
    if (this.accretionMat) this.accretionMat.color.set(secondaryHex);
    if (this.lensMat) this.lensMat.color.set(primaryHex);
    if (this.nityAuraMat) this.nityAuraMat.color.set(primaryHex);
    if (this.nityHeadMat) this.nityHeadMat.emissive.set(primaryHex);
    if (this.nityMantleMat) this.nityMantleMat.emissive.set(secondaryHex);
    if (this.nityRingMat) this.nityRingMat.color.set(secondaryHex);
    if (this.suctionMat) this.suctionMat.color.set(primaryHex);
  }

  reset() {
    for (const h of this.hearts) {
      this.scene.remove(h.mesh);
    }
    this.hearts = [];
    this.heartSpawnTimer = 0;
    this.nityGroup.position.set(0, this.nityBaseY, this.nityBaseZ);
  }
}

