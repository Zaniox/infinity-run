/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
 * // SOUNDRISE : INFINITY RUN - CIBLE, HORIZON & NITY
 * Nity en vol devant Infi (z = -58), aspiration cosmique vers le Trou Noir,
 * flux gravitationnels d'accrétion et sillage de cœurs à collecter.
 */
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { getSoftGlowTexture } from './particles.js';

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
    this.loadNityFBX();

    // 3. Courant d'aspiration gravitationnelle (Particules reliant Nity au Trou Noir)
    this.createGravitationalSuctionStream();

    // Mirages de Nity (Cycle 8 Folie)
    this.createNityMirages();

    // 4. Sillage de cœurs et drops semés par Nity (Cœurs, Armures, Sayanfinity)
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

    // Matériau Capsule d'Armure (Bouclier cyan)
    this.armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 3.5,
      roughness: 0.15,
      metalness: 0.8
    });

    // Matériau Sayanfinity (Or divin Super Saiyan)
    this.sayanfinityMaterial = new THREE.MeshStandardMaterial({
      color: 0xffea00,
      emissive: 0xf59e0b,
      emissiveIntensity: 4.5,
      roughness: 0.1,
      metalness: 0.9
    });

    // 5. Paramètres du Champ Magnétique d'attraction subtile des objets (équilibré)
    this.baseMagnetRadius = 4.8;
    this.saiyanMagnetRadius = 7.5;
    this.lastMagnetSfxTime = 0;

    // Arcs de flux magnétique (désactivés au profit d'une attraction visuelle propre sans traits raides)
    const maxFluxArcs = 8;
    const fluxGeo = new THREE.BufferGeometry();
    this.fluxPositions = new Float32Array(maxFluxArcs * 2 * 3);
    fluxGeo.setAttribute('position', new THREE.BufferAttribute(this.fluxPositions, 3));
    this.fluxLinesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      visible: false
    });
    this.fluxLines = new THREE.LineSegments(fluxGeo, this.fluxLinesMat);
    this.fluxLines.visible = false;
    this.scene.add(this.fluxLines);

    // 6. Animation cinématique de feinte / fuite de Nity (Fin de Cycle 8)
    this.isEscapingAnimationActive = false;
    this.escapeAnimTimer = 0;
    this.onEscapeCompleteCallback = null;
    this.climaxRatio = 0;
    this.createNityEscapeEffects();
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

    // Conteneur orienté vers le trou noir à l'horizon (-Z)
    this.nityModelContainer = new THREE.Group();
    this.nityModelContainer.rotation.y = Math.PI;
    this.nityAvatar.add(this.nityModelContainer);

    // Silhouette procédurale initiale (masquée dès chargement de Nity.fbx)
    this.proceduralNity = new THREE.Group();
    this.nityModelContainer.add(this.proceduralNity);

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
    this.proceduralNity.add(this.nityHead);

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
    this.proceduralNity.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.4, 2.5, 1.15);
    rightEye.rotation.x = Math.PI * 0.15;
    rightEye.rotation.z = Math.PI;
    this.proceduralNity.add(rightEye);

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
    this.proceduralNity.add(this.nityMantle);

    // Ligne verticale lumineuse sur le manteau
    const spineGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 16);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, -0.2, 1.1);
    this.proceduralNity.add(spine);

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
    this.nityModelContainer.add(this.nityRing);

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
    this.nityModelContainer.add(heartMesh);
  }

  loadNityFBX() {
    const loader = new FBXLoader();
    loader.load(
      'models/Nity.fbx',
      (fbx) => {
        console.log('[Target] Corps officiel Nity.fbx chargé avec succès !');

        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetHeight = 4.4;
        const scale = targetHeight / (maxDim || 1);
        fbx.scale.setScalar(scale);

        fbx.position.set(-center.x * scale, -center.y * scale + 1.2, -center.z * scale);

        this.nityFbxMaterials = [];

        fbx.traverse((child) => {
          if (child.isLight) {
            child.visible = false;
            child.intensity = 0;
          } else if (child.isCamera) {
            child.visible = false;
          } else if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const name = (child.name || '').toLowerCase();
            if (name.includes('heart')) {
              // Cœur de Nity émissif rose/magenta
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xff2ea6,
                emissiveIntensity: 3.5,
                roughness: 0.1
              });
            } else if (name.includes('eye') || name.includes('brow')) {
              // Yeux et sourcils célestes
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 2.2,
                roughness: 0.1
              });
            } else {
              // Corps féminin silhouette réactif aux couleurs du cycle
              const mat = new THREE.MeshStandardMaterial({
                color: 0x080416,
                metalness: 0.92,
                roughness: 0.14,
                emissive: 0x00f0ff,
                emissiveIntensity: 0.75
              });
              child.material = mat;
              this.nityFbxMaterials.push(mat);
            }
          }
        });

        this.fbxModel = fbx;
        this.nityModelContainer.add(fbx);

        if (this.proceduralNity) {
          this.proceduralNity.visible = false;
        }
        if (this.nityHeartMesh) {
          this.nityHeartMesh.visible = false;
        }
      },
      undefined,
      (err) => {
        console.info('[Target] Note : Fallback procédural Nity actif :', err);
      }
    );
  }

  // --- MIRAGES DE NITY (Troll du Cycle 8 Folie) ---
  createNityMirages() {
    this.mirageGroup = new THREE.Group();
    this.mirageGroup.visible = false;

    // Clone gauche
    this.mirageLeft = new THREE.Group();
    this.mirageLeft.position.set(-14, this.nityBaseY, this.nityBaseZ - 6);
    this.mirageGroup.add(this.mirageLeft);

    // Clone droit
    this.mirageRight = new THREE.Group();
    this.mirageRight.position.set(14, this.nityBaseY, this.nityBaseZ - 6);
    this.mirageGroup.add(this.mirageRight);

    // Représentations fantomatiques semi-transparentes
    const mirageMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    [this.mirageLeft, this.mirageRight].forEach((m) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), mirageMat);
      h.position.y = 2.4;
      const b = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.6, 16), mirageMat);
      b.position.y = -0.2;
      m.add(h);
      m.add(b);
    });

    this.scene.add(this.mirageGroup);
  }

  // --- EFFETS CINÉMATIQUES DE FEINTE ET FUITE DE NITY (FIN CYCLE 8) ---
  createNityEscapeEffects() {
    // 1. Onde de choc céleste expansive
    const ringGeo = new THREE.RingGeometry(0.8, 1.8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.escapeShockwave = new THREE.Mesh(ringGeo, ringMat);
    this.escapeShockwave.visible = false;
    this.scene.add(this.escapeShockwave);

    // 2. Nuage d'étoiles cosmiques scintillantes (Stardust Burst)
    this.stardustCount = 150;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.stardustCount * 3);
    const colors = new Float32Array(this.stardustCount * 3);
    this.stardustVelocities = [];

    const palette = [
      new THREE.Color(0x00f0ff), // cyan néon
      new THREE.Color(0xff2ea6), // rose fuchsia céleste
      new THREE.Color(0xfacc15), // or stellaire
      new THREE.Color(0xffffff)  // éclat blanc pur
    ];

    for (let i = 0; i < this.stardustCount; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      this.stardustVelocities.push({ vx: 0, vy: 0, vz: 0 });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      map: getSoftGlowTexture(),
      depthWrite: false
    });

    this.stardustPoints = new THREE.Points(pGeo, pMat);
    this.stardustPoints.visible = false;
    this.scene.add(this.stardustPoints);
  }

  // Déclenchement de l'animation de fuite lors du contact
  triggerNityEscapeAnimation(onComplete) {
    this.isEscapingAnimationActive = true;
    this.escapeAnimTimer = 0;
    this.onEscapeCompleteCallback = onComplete;

    // Contact physique direct avec Infi
    this.nityGroup.position.set(0, this.nityBaseY, -10.5);

    // Initialiser l'onde de choc circulaire
    if (this.escapeShockwave) {
      this.escapeShockwave.position.set(0, this.nityBaseY + 1.6, -10.5);
      this.escapeShockwave.scale.set(1, 1, 1);
      this.escapeShockwave.material.opacity = 0.95;
      this.escapeShockwave.material.color.setHex(0x00f0ff);
      this.escapeShockwave.visible = true;
    }

    // Initialiser l'explosion de poussière d'étoiles
    if (this.stardustPoints) {
      const pos = this.stardustPoints.geometry.attributes.position.array;
      const cy = this.nityBaseY + 1.6;
      for (let i = 0; i < this.stardustCount; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 1] = cy + (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 2] = -10.5 + (Math.random() - 0.5) * 0.5;

        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = 7.0 + Math.random() * 22.0;
        this.stardustVelocities[i] = {
          vx: Math.cos(phi) * Math.cos(theta) * speed,
          vy: Math.sin(phi) * speed + 2.5,
          vz: Math.cos(phi) * Math.sin(theta) * speed - 10.0
        };
      }
      this.stardustPoints.geometry.attributes.position.needsUpdate = true;
      this.stardustPoints.material.opacity = 1.0;
      this.stardustPoints.visible = true;
    }
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
      map: getSoftGlowTexture(),
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
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

  // --- 4. SILLAGE DE CŒURS, ARMURES ET SAYANFINITY PAR NITY ---
  spawnHeartFromNity() {
    const group = new THREE.Group();

    const heartMesh = new THREE.Mesh(this.heartGeometry, this.heartMaterial);
    group.add(heartMesh);

    // Halo d'énergie rose autour du cœur
    const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Mesh(glowGeo, glowMat));

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

    const np = this.nityGroup.position;
    const spreadX = np.x + (Math.random() - 0.5) * 4.0;
    const spawnY = Math.max(2.0, np.y - 0.5 + (Math.random() - 0.5) * 2.0);
    const spawnZ = np.z + 4.0;

    group.position.set(spreadX, spawnY, spawnZ);

    const heartObj = {
      mesh: group,
      orbit: orbit,
      radius: 1.6,
      collected: false,
      type: 'heart'
    };

    this.scene.add(group);
    this.hearts.push(heartObj);
    return heartObj;
  }

  // Drop Capsule d'Armure (Bouclier de protection 1-hit)
  spawnArmorFromNity() {
    const group = new THREE.Group();

    // Cristal hexagonal protecteur cyan
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMesh = new THREE.Mesh(coreGeo, this.armorMaterial);
    group.add(coreMesh);

    // Halo d'énergie cyan
    const glowGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Mesh(glowGeo, glowMat));

    // Double anneau orbital protecteur
    const ringGeo = new THREE.TorusGeometry(1.4, 0.06, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    const np = this.nityGroup.position;
    const spreadX = np.x + (Math.random() - 0.5) * 4.0;
    const spawnY = Math.max(2.0, np.y - 0.5 + (Math.random() - 0.5) * 2.0);
    const spawnZ = np.z + 4.0;

    group.position.set(spreadX, spawnY, spawnZ);

    const armorObj = {
      mesh: group,
      orbit: ring1,
      orbit2: ring2,
      radius: 1.7,
      collected: false,
      type: 'armor'
    };

    this.scene.add(group);
    this.hearts.push(armorObj);
    return armorObj;
  }

  // Drop Sayanfinity (Rare : Mode Super Saiyan 20s)
  spawnSayanfinityFromNity() {
    const group = new THREE.Group();

    // Sphère d'or incandescent
    const coreGeo = new THREE.SphereGeometry(0.95, 24, 24);
    const coreMesh = new THREE.Mesh(coreGeo, this.sayanfinityMaterial);
    group.add(coreMesh);

    // Flamme de Ki dorée
    const kiGeo = new THREE.SphereGeometry(1.45, 16, 16);
    const kiMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Mesh(kiGeo, kiMat));

    // Couronne de flammes / rayons d'énergie
    const crown = new THREE.Group();
    const spikeGeo = new THREE.ConeGeometry(0.25, 1.6, 6);
    const spikeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    for (let r = 0; r < 5; r++) {
      const sp = new THREE.Mesh(spikeGeo, spikeMat);
      const angle = (r / 5) * Math.PI * 2;
      sp.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
      sp.rotation.z = angle - Math.PI / 2;
      crown.add(sp);
    }
    group.add(crown);

    // Anneau de foudre de Saiyan
    const ringGeo = new THREE.TorusGeometry(1.65, 0.07, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    group.add(ring);

    const np = this.nityGroup.position;
    const spreadX = np.x + (Math.random() - 0.5) * 4.0;
    const spawnY = Math.max(2.0, np.y - 0.5 + (Math.random() - 0.5) * 2.0);
    const spawnZ = np.z + 4.0;

    group.position.set(spreadX, spawnY, spawnZ);

    const sayanObj = {
      mesh: group,
      orbit: ring,
      orbit2: crown,
      radius: 1.85,
      collected: false,
      type: 'sayanfinity'
    };

    this.scene.add(group);
    this.hearts.push(sayanObj);
    return sayanObj;
  }

  // Spawner un drop spécifique à un point donné (ex: après destruction d'un obstacle par tir blaster)
  spawnDropAt(x, y, z, type = 'armor') {
    let drop;
    if (type === 'sayanfinity') {
      drop = this.spawnSayanfinityFromNity();
    } else if (type === 'armor') {
      drop = this.spawnArmorFromNity();
    } else {
      drop = this.spawnHeartFromNity();
    }
    if (drop && drop.mesh) {
      drop.mesh.position.set(x, y, z);
    }
    return drop;
  }

  // Mise à jour continue : Animation d'aspiration, Trou Noir, Drops et Attraction Magnétique
  update(dt, speed, playerPos, bassEnergy, isSaiyan = false, audioManager = null) {
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

    // 2. Cinématique de Nity aspirée vers le Trou Noir ou Animation de Fuite / Feinte
    if (this.nityGroup) {
      if (this.isEscapingAnimationActive) {
        this.escapeAnimTimer += dt;
        const totalDuration = 1.15;

        // Phase 1 : Pirouette facétieuse face à Infi/caméra + saut d'esquive
        if (this.escapeAnimTimer < 0.42) {
          const p = this.escapeAnimTimer / 0.42;
          this.nityModelContainer.rotation.y += dt * 20.0;
          this.nityGroup.position.y = this.nityBaseY + Math.sin(p * Math.PI) * 1.8;
          this.nityRing.rotation.z += 16.0 * dt;
          this.nityAvatar.rotation.x = 0;
          this.nityAvatar.rotation.z = 0;
        } else {
          // Phase 2 : Rétraction comique en "POOF !" vers la faille spatio-temporelle
          const p2 = Math.min(1.0, (this.escapeAnimTimer - 0.42) / (totalDuration - 0.42));
          const shrinkScale = Math.max(0, 1.0 - Math.pow(p2, 1.8));
          this.nityAvatar.scale.set(shrinkScale, shrinkScale, shrinkScale);
          this.nityModelContainer.rotation.y += dt * 28.0;
          this.nityRing.rotation.z += 24.0 * dt;
          this.nityGroup.position.z -= dt * 32.0; // aspiration accélérée vers le trou noir
        }

        // Évolution de l'onde de choc céleste
        if (this.escapeShockwave && this.escapeShockwave.visible) {
          this.escapeShockwave.scale.addScalar(34.0 * dt);
          this.escapeShockwave.material.opacity = Math.max(0, 0.95 * (1.0 - this.escapeAnimTimer / totalDuration));
        }

        // Évolution de la poussière d'étoiles (Stardust Burst)
        if (this.stardustPoints && this.stardustPoints.visible) {
          const pos = this.stardustPoints.geometry.attributes.position.array;
          for (let i = 0; i < this.stardustCount; i++) {
            const v = this.stardustVelocities[i];
            pos[i * 3] += v.vx * dt;
            pos[i * 3 + 1] += v.vy * dt;
            pos[i * 3 + 2] += v.vz * dt;
            v.vx *= 0.93;
            v.vy *= 0.93;
            v.vz *= 0.93;
          }
          this.stardustPoints.geometry.attributes.position.needsUpdate = true;
          this.stardustPoints.material.opacity = Math.max(0, 1.0 - this.escapeAnimTimer / totalDuration);
        }

        // Fin de la séquence cinématique de fuite
        if (this.escapeAnimTimer >= totalDuration) {
          this.isEscapingAnimationActive = false;
          if (this.escapeShockwave) this.escapeShockwave.visible = false;
          if (this.stardustPoints) this.stardustPoints.visible = false;
          if (this.onEscapeCompleteCallback) {
            const cb = this.onEscapeCompleteCallback;
            this.onEscapeCompleteCallback = null;
            cb();
          }
        }
      } else {
        // Mode normal de vol
        const swayX = Math.sin(time * 1.5) * 4.8 + playerPos.x * 0.35;
        const swayY = this.nityBaseY + Math.sin(time * 2.2) * 1.6;
        const targetBaseZ = (this.climaxRatio > 0)
          ? (-58 + this.climaxRatio * 47.0)
          : this.nityBaseZ;
        const pullZ = targetBaseZ + Math.sin(time * 1.1) * (1.0 - (this.climaxRatio || 0)) * 3.8;

        this.nityGroup.position.x += (swayX - this.nityGroup.position.x) * 4.0 * dt;
        this.nityGroup.position.y += (swayY - this.nityGroup.position.y) * 4.0 * dt;
        this.nityGroup.position.z += (pullZ - this.nityGroup.position.z) * 4.0 * dt;

        // Inclinaisons dynamiques (Piqué d'aspiration et roulis dans le vent cosmique)
        const targetPitch = 0.28 + Math.sin(time * 2.5) * 0.12; // Inclinée vers l'avant (aspirée)
        const targetRoll = -Math.cos(time * 1.5) * 0.3; // Roulis
        this.nityAvatar.rotation.x += (targetPitch - this.nityAvatar.rotation.x) * 5.0 * dt;
        this.nityAvatar.rotation.z += (targetRoll - this.nityAvatar.rotation.z) * 5.0 * dt;

        // Rotation de son halo céleste et pulsation sur les basses
        this.nityRing.rotation.z += 2.2 * dt;
        const ringPulse = 1.0 + Math.pow(bassEnergy, 1.8) * 0.18;
        this.nityRing.scale.set(ringPulse, ringPulse, 1.0);
        this.nityRingMat.opacity = 0.75 + bassEnergy * 0.25;
        this.nityHeadMat.emissiveIntensity = 0.8 + bassEnergy * 2.4;

        if (this.nityHeartMesh) {
          const hPulse = 0.45 * (1.0 + bassEnergy * 0.3);
          this.nityHeartMesh.scale.set(hPulse, hPulse, hPulse);
        }
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

    // 4. Cadencement du sillage semé par Nity (Cœurs, Armures et Sayanfinity)
    // Ne spawner QUE pendant le vol actif (speed > 10.0), jamais dans le menu principal
    if (speed > 10.0) {
      this.heartSpawnTimer += dt;
      const heartInterval = Math.max(1.4, 2.6 - (speed / 120.0));
      if (this.heartSpawnTimer >= heartInterval) {
        this.heartSpawnTimer = 0;

        const r = Math.random();
        if (r < 0.07) {
          // Drop Sayanfinity rare (~7%)
          this.spawnSayanfinityFromNity();
        } else if (r < 0.28) {
          // Drop Armure régulier (~21%)
          this.spawnArmorFromNity();
        } else {
          // Cœurs vitaux indispensables (~72%)
          this.spawnHeartFromNity();
        }
      }
    } else {
      this.heartSpawnTimer = 0;
    }

    // 5. Défilement des drops vers Infi + ATTRACTION MAGNÉTIQUE FLUIDE
    const deltaZ = speed * dt;
    const magnetRadius = isSaiyan ? this.saiyanMagnetRadius : this.baseMagnetRadius;
    let activeFluxCount = 0;
    const nowSec = performance.now() * 0.001;

    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];

      // Translation longitudinale de base vers l'arrière
      h.mesh.position.z += deltaZ;
      h.mesh.rotation.y += 2.8 * dt;
      if (h.orbit) h.orbit.rotation.z += 3.6 * dt;
      if (h.orbit2) {
        h.orbit2.rotation.y += 4.2 * dt;
        h.orbit2.rotation.z += 2.8 * dt;
      }

      // Attraction Magnétique continue vers Infi
      if (playerPos && !h.collected) {
        const dx = playerPos.x - h.mesh.position.x;
        const dy = playerPos.y - h.mesh.position.y;
        const dz = playerPos.z - h.mesh.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Si l'objet est dans le champ d'influence magnétique (proche d'Infi, subtil)
        if (dist < magnetRadius && h.mesh.position.z <= (playerPos.z + 4.0)) {
          const pullRatio = Math.max(0.0, 1.0 - (dist / magnetRadius));
          const pullRate = 3.2 + Math.pow(pullRatio, 1.2) * (isSaiyan ? 5.8 : 3.8);

          // Guidage doux et naturel vers Infi
          h.mesh.position.x += dx * Math.min(0.65, pullRate * dt);
          h.mesh.position.y += dy * Math.min(0.65, pullRate * dt);
          h.mesh.position.z += dz * Math.min(0.5, (pullRate * 0.4) * dt);

          // Légère rotation fluide et pulsation douce
          h.mesh.rotation.y += 4.5 * dt;
          if (h.orbit) h.orbit.rotation.z += 5.0 * dt;
          if (h.orbit2) h.orbit2.rotation.y += 5.0 * dt;

          const pulse = 1.0 + Math.sin(time * 12.0) * 0.08 + pullRatio * 0.15;
          h.mesh.scale.set(pulse, pulse, pulse);

          // Effet sonore d'accroche magnétique discret (throttlé)
          if (!h.wasMagnetized) {
            h.wasMagnetized = true;
            if (audioManager && (nowSec - this.lastMagnetSfxTime > 0.6)) {
              this.lastMagnetSfxTime = nowSec;
              audioManager.playMagneticPull();
            }
          }
        } else if (h.wasMagnetized) {
          h.mesh.scale.set(1.0, 1.0, 1.0);
          h.wasMagnetized = false;
        }
      }

      // Despawn si dépassé derrière Infi
      if (h.mesh.position.z > 14.0 || h.collected) {
        this.scene.remove(h.mesh);
        this.hearts.splice(i, 1);
      }
    }

    // Mise à jour visuelle des arcs de flux magnétique
    if (this.fluxLines) {
      if (activeFluxCount > 0) {
        for (let k = activeFluxCount * 6; k < this.fluxPositions.length; k++) {
          this.fluxPositions[k] = 0;
        }
        this.fluxLines.geometry.attributes.position.needsUpdate = true;
        this.fluxLines.geometry.setDrawRange(0, activeFluxCount * 2);
        this.fluxLines.visible = true;
        if (isSaiyan) {
          this.fluxLinesMat.color.setHex(0xfacc15);
        } else {
          this.fluxLinesMat.color.setHex(0x38bdf8);
        }
      } else {
        this.fluxLines.visible = false;
      }
    }
  }

  // Vérification de collecte par Infi de tous types de drops (Cœur, Armure, Sayanfinity)
  checkDropCollisions(playerPos, playerRadius, onCollectCallback) {
    for (const h of this.hearts) {
      if (!h.collected) {
        const dist = h.mesh.position.distanceTo(playerPos);
        if (dist < (h.radius + playerRadius * 0.95)) {
          h.collected = true;
          if (onCollectCallback) {
            onCollectCallback(h.type || 'heart', h.mesh.position);
          }
        }
      }
    }
  }

  // Rétrocompatibilité
  checkHeartCollisions(playerPos, playerRadius, onCollectCallback) {
    this.checkDropCollisions(playerPos, playerRadius, (type, pos) => {
      if (onCollectCallback) onCollectCallback(pos, type);
    });
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

    if (this.nityFbxMaterials) {
      for (const mat of this.nityFbxMaterials) {
        mat.emissive.set(primaryHex);
      }
    }
  }

  setCycleIndex(cycleIndex) {
    this.currentCycle = cycleIndex;
    // Mirages actifs uniquement pendant le Cycle 8 (Folie / Distorsion)
    if (this.mirageGroup) {
      this.mirageGroup.visible = (cycleIndex === 7);
    }
  }

  // Animation de Nity lors du rattrapage (Climax du Cycle 8)
  setClimaxDistance(distRatio) {
    this.climaxRatio = Math.max(0, Math.min(1.0, distRatio));
    if (!this.isEscapingAnimationActive) {
      // distRatio va de 0 (normal à z=-58) à 1.0 (contact direct à z=-10.5)
      const targetZ = -58 + this.climaxRatio * 47.5;
      this.nityGroup.position.z = THREE.MathUtils.lerp(this.nityGroup.position.z, targetZ, 0.12);
    }
  }

  reset() {
    for (const h of this.hearts) {
      this.scene.remove(h.mesh);
    }
    this.hearts = [];
    this.heartSpawnTimer = 0;
    if (this.fluxLines) this.fluxLines.visible = false;
    this.climaxRatio = 0;
    this.isEscapingAnimationActive = false;
    this.escapeAnimTimer = 0;
    this.onEscapeCompleteCallback = null;
    if (this.escapeShockwave) this.escapeShockwave.visible = false;
    if (this.stardustPoints) this.stardustPoints.visible = false;
    this.nityGroup.position.set(0, this.nityBaseY, this.nityBaseZ);
    if (this.nityAvatar) {
      this.nityAvatar.scale.set(1, 1, 1);
      this.nityAvatar.rotation.set(0, 0, 0);
    }
    if (this.nityModelContainer) this.nityModelContainer.rotation.y = Math.PI;
    if (this.mirageGroup) this.mirageGroup.visible = false;
  }
}

