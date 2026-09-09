/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
 * // SOUNDRISE : INFINITY RUN - JOUEUR (« INFI »)
 * Modèle 3D Métallique Sombre, Tête Sphérique avec Infini & Yeux en Arc,
 * Cœur Émissif Dynamique, Physique Glider Race the Sun et Particules de Dislocation.
 */
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import {
  getSoftGlowTexture,
  getShieldHexTexture,
  getQuantumShieldTexture,
  getGroundGlyphTexture,
  getSaiyanAuraTexture,
  getLaserBeamTexture,
  getSparkTexture,
  getPurityMoteTexture
} from './particles.js';

export class Player {
  constructor(scene) {
    this.scene = scene;

    // Groupe racine du joueur
    this.group = new THREE.Group();
    this.avatar = new THREE.Group();
    this.group.add(this.avatar);

    // Paramètres physiques & de vol (Feel Race the Sun)
    this.minAltitude = 1.25;
    this.maxAltitude = 11.5; // Plafond sécurisé anti-triche
    this.lateralSpeed = 24.0;
    this.verticalSpeed = 16.5;
    this.maxX = 16.5;

    // Jauge vitale d'énergie
    this.energy = 100.0;
    this.maxEnergy = 100.0;
    this.isDead = false;

    // Boost temporaire
    this.boostTimer = 0.0;
    this.boostExtraSpeed = 0.0;

    // Système d'Armure & Bouclier protecteur 1-hit
    this.hasShield = false;
    this.armorCount = 0;
    this.invulnerableTimer = 0.0;

    // Système SAYANFINITY (Super Saiyan 20s invulnérable)
    this.saiyanTimer = 0.0;

    // Bounding Sphere pour collision ultra-fluide
    this.radius = 1.0;
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), this.radius * 0.82);

    // Construction du modèle 3D
    this.createModel();
    this.loadFBXModel();
    this.createDislocationParticles();
    this.createShieldMesh();
    this.createSaiyanAura();
    this.createLaserPool();
    this.createFounderEffects();
    this.createFlightTrail();

    // Positionnement initial
    this.group.position.set(0, this.minAltitude, 0);
    this.scene.add(this.group);
  }

  createModel() {
    const headRadius = 1.0;

    // Conteneur orienté face à l'horizon (-Z)
    this.modelContainer = new THREE.Group();
    this.modelContainer.rotation.y = Math.PI;
    this.avatar.add(this.modelContainer);

    // 1. Matériau torse & membres : Métallique sombre doux (Race the Sun lore)
    this.darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x120d20,
      roughness: 0.45,
      metalness: 0.50
    });

    // Torse procédural initial (remplacé automatiquement par Infi.fbx dès chargement)
    this.proceduralTorso = new THREE.Group();
    this.modelContainer.add(this.proceduralTorso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.42, 24), this.darkMetalMat);
    neck.position.set(0, -0.92, 0);
    neck.castShadow = true;
    this.proceduralTorso.add(neck);

    const chest = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.4, 4), this.darkMetalMat);
    chest.rotation.x = Math.PI;
    chest.rotation.y = Math.PI / 4;
    chest.position.set(0, -1.35, 0);
    chest.castShadow = true;
    this.proceduralTorso.add(chest);

    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.28, 0.65), this.darkMetalMat);
    shoulders.position.set(0, -1.05, 0);
    shoulders.castShadow = true;
    this.proceduralTorso.add(shoulders);

    // 2. Tête sphérique brillante, légèrement translucide
    const headGeo = new THREE.SphereGeometry(headRadius, 64, 64);
    this.headMat = new THREE.MeshStandardMaterial({
      color: 0x180c2c,
      metalness: 0.55,
      roughness: 0.35,
      transparent: true,
      opacity: 0.95
    });
    this.headMesh = new THREE.Mesh(headGeo, this.headMat);
    this.headMesh.castShadow = true;
    this.modelContainer.add(this.headMesh);

    // Halo céleste discret autour de la tête
    const haloGeo = new THREE.SphereGeometry(headRadius * 1.06, 32, 32);
    this.haloMat = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.headHalo = new THREE.Mesh(haloGeo, this.haloMat);
    this.modelContainer.add(this.headHalo);

    // 3. Visière intérieure : Ruban Infini 3D et Yeux en Double Arc courbé
    this.createInfiVisor(headRadius);

    // 4. Cœur géométrique émissif blanc/rose sur la poitrine gauche
    this.createInfiHeart();
  }

  loadFBXModel() {
    const loader = new FBXLoader();
    loader.load(
      'models/Infi.fbx',
      (fbx) => {
        console.log('[Player] Corps officiel Infi.fbx chargé avec succès !');

        // Bounding box & normalisation
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const targetHeight = 2.8;
        const scale = targetHeight / (size.y || 274.5);
        fbx.scale.setScalar(scale);

        // Centrage précis dans le conteneur avatar
        fbx.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

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
              // Cœur émissif sur la poitrine (Heartbit)
              this.fbxHeartMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xff2ea6,
                emissiveIntensity: 4.5,
                roughness: 0.1,
                metalness: 0.1
              });
              child.material = this.fbxHeartMaterial;
            } else if (name.includes('infinity') || name.includes('visor')) {
              // Visière symbole Infini 3D sur le visage (INFINITY003)
              this.fbxVisorMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0x00f0ff,
                emissiveIntensity: 4.2,
                roughness: 0.08,
                metalness: 0.15
              });
              child.material = this.fbxVisorMaterial;
            } else if (name.includes('glow') || name.includes('neon') || name.includes('strip')) {
              // Bandes néon émissives cyan
              child.material = new THREE.MeshStandardMaterial({
                color: 0x00f0ff,
                emissive: 0x00f0ff,
                emissiveIntensity: 2.2,
                roughness: 0.1
              });
            } else if (name.includes('brow')) {
              // Sourcils célestes néon (OODAI_BROWS)
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 3.2,
                roughness: 0.1
              });
            } else if (name.includes('pyra') || name.includes('wolf')) {
              // Épaulettes / cape cyber-sombre
              child.material = new THREE.MeshStandardMaterial({
                color: 0x181228,
                metalness: 0.85,
                roughness: 0.25
              });
            } else {
              // Corps et tête cyber-métallique (NEW_BODY001 & NEW_OODAI_HEAD)
              child.material = new THREE.MeshStandardMaterial({
                color: 0x140e24,
                metalness: 0.55,
                roughness: 0.38
              });
            }
          }
        });

        this.fbxModel = fbx;
        this.modelContainer.add(fbx);

        // Aura PURITY épousant rigoureusement la silhouette du corps FBX (Silhouette Cloaking membre par membre)
        if (!this.purityAuraMeshes) this.purityAuraMeshes = [];
        const fbxMeshes = [];
        fbx.traverse((child) => {
          if (child.isMesh && child.geometry && !child.userData.isAura) {
            fbxMeshes.push(child);
          }
        });
        fbxMeshes.forEach((mesh) => {
          const auraMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.55,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const auraMesh = new THREE.Mesh(mesh.geometry, auraMat);
          auraMesh.scale.setScalar(1.045); // Épouse fidèlement la silhouette exacte de chaque membre
          auraMesh.visible = false;
          auraMesh.userData.isAura = true;
          mesh.add(auraMesh);
          this.purityAuraMeshes.push(auraMesh);
        });

        // Masquer ABSOLUMENT tous les éléments procéduraux pour ne laisser que le modèle FBX pur
        if (this.proceduralTorso) this.proceduralTorso.visible = false;
        if (this.headMesh) this.headMesh.visible = false;
        if (this.headHalo) this.headHalo.visible = false;
        if (this.visorMesh) this.visorMesh.visible = false;
        if (this.heartMesh) this.heartMesh.visible = false;
        if (this.facePlane) this.facePlane.visible = false;

        // Positionner la lumière du cœur sur la poitrine d'Infi
        if (this.heartLight) {
          this.heartLight.position.set(0.15, 0.38, 0.35);
        }
      },
      undefined,
      (err) => {
        console.info('[Player] Note : Fallback procédural Infi actif :', err);
      }
    );
  }

  createInfiVisor(headRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512, cy = 530;

    ctx.clearRect(0, 0, 1024, 1024);

    // 1. Sourcils expressifs en double arc courbé (Image 1)
    const drawEyebrow = (x, y, r) => {
      ctx.save();
      // Glow violet
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 20;
      ctx.strokeStyle = '#c026d3';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x, y, r, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();

      // Core blanc pur
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, r, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      ctx.restore();
    };

    drawEyebrow(cx - 150, cy - 155, 78);
    drawEyebrow(cx + 150, cy - 155, 78);

    // 2. Symbole Infini élégant (Lemniscate de Bernoulli / Ruban néon émissif)
    const a = 295; // Rayon horizontal des boucles
    const scaleY = 0.82;

    const createInfinityPath = () => {
      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const t = (i / 240) * Math.PI * 2;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = cx + (a * Math.cos(t)) / denom;
        const y = cy + (a * Math.sin(t) * Math.cos(t) * scaleY) / denom;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // Passe 1 : Grand Halo néon violet intense
    ctx.save();
    ctx.shadowColor = '#c026d3';
    ctx.shadowBlur = 40;
    ctx.lineWidth = 38;
    ctx.strokeStyle = '#9333ea';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    createInfinityPath();
    ctx.stroke();
    ctx.restore();

    // Passe 2 : Lueur intermédiaire magenta/cyan
    ctx.save();
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 26;
    ctx.strokeStyle = '#d946ef';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    createInfinityPath();
    ctx.stroke();
    ctx.restore();

    // Passe 3 : Cœur blanc pur éclatant (fin et net, boucles bien ouvertes)
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    createInfinityPath();
    ctx.stroke();
    ctx.restore();

    // Reflets spéculaires célestes (Image 1)
    // Reflet cyan à gauche
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx - 240, cy - 240, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Reflet rose à droite
    ctx.save();
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(cx + 250, cy - 210, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    const visorMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // Déformation sphérique équilibrée pour épouser la tête sans étirement
    const visorGeo = new THREE.PlaneGeometry(1.42, 1.42, 32, 32);
    const pos = visorGeo.attributes.position;
    const sphereR = headRadius * 1.018;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = Math.sqrt(Math.max(0.01, sphereR * sphereR - (vx * vx + vy * vy)));
      pos.setZ(i, vz);
    }
    pos.needsUpdate = true;
    visorGeo.computeVertexNormals();

    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.modelContainer.add(this.visorMesh);
  }

  createInfiHeart() {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.1, -0.15, 0.24, -0.28, 0.24);
    heartShape.bezierCurveTo(-0.48, 0.24, -0.48, 0, -0.48, 0);
    heartShape.bezierCurveTo(-0.48, -0.2, -0.24, -0.44, 0, -0.62);
    heartShape.bezierCurveTo(0.24, -0.44, 0.48, -0.2, 0.48, 0);
    heartShape.bezierCurveTo(0.48, 0, 0.48, 0.24, 0.28, 0.24);
    heartShape.bezierCurveTo(0.15, 0.24, 0, 0.1, 0, 0);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });
    heartGeo.scale(0.42, 0.42, 0.42);
    heartGeo.center();

    this.heartMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 4.2,
      roughness: 0.1
    });

    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMat);
    this.heartMesh.position.set(0.24, -1.18, 0.38);
    this.modelContainer.add(this.heartMesh);

    // Lumière ponctuelle émise par le cœur (focalisée sur le torse)
    this.heartLight = new THREE.PointLight(0xff2ea6, 1.0, 3.2);
    this.heartLight.position.set(0.24, -1.18, 0.52);
    this.modelContainer.add(this.heartLight);
  }

  // --- PARTICULES DE DISLOCATION LORS D'UN CRASH ---
  createDislocationParticles() {
    this.particleCount = 280;
    const geo = new THREE.BufferGeometry();
    this.disPos = new Float32Array(this.particleCount * 3);
    this.disVel = new Float32Array(this.particleCount * 3);
    this.disCol = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      this.disPos[i * 3 + 1] = -1000;
      const r = Math.random();
      if (r < 0.4) {
        this.disCol[i * 3] = 0.0; this.disCol[i * 3 + 1] = 0.94; this.disCol[i * 3 + 2] = 1.0;
      } else if (r < 0.7) {
        this.disCol[i * 3] = 1.0; this.disCol[i * 3 + 1] = 0.18; this.disCol[i * 3 + 2] = 0.65;
      } else {
        this.disCol[i * 3] = 0.74; this.disCol[i * 3 + 1] = 0.33; this.disCol[i * 3 + 2] = 0.98;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.disPos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.disCol, 3));

    this.disMat = new THREE.PointsMaterial({
      size: 1.5,
      map: getPurityMoteTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.disParticles = new THREE.Points(geo, this.disMat);
    this.scene.add(this.disParticles);
    this.isDislocating = false;
    this.dyingTimer = 0;
  }

  triggerCrash() {
    if (this.isDead) return;
    this.isDead = true;
    this.isDislocating = true;
    this.dyingTimer = 0;

    this.avatar.visible = false;
    this.heartLight.visible = false;
    if (this.founderTrailPoints) this.founderTrailPoints.visible = false;
    if (this.flightTrailPoints) this.flightTrailPoints.visible = false;
    this.disMat.opacity = 1.0;

    const p = this.group.position;
    const pos = this.disParticles.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3] = p.x + (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 2] = p.z + (Math.random() - 0.5) * 1.4;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const spd = 12 + Math.random() * 28;

      this.disVel[i * 3] = Math.sin(phi) * Math.cos(theta) * spd;
      this.disVel[i * 3 + 1] = Math.cos(phi) * spd + 4.0;
      this.disVel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * spd;
    }
    this.disParticles.geometry.attributes.position.needsUpdate = true;
  }

  // --- 1. SYSTÈME DE BOUCLIER D'ARMURE HAUTE TECHNOLOGIE (1-HIT PROTECTION) ---
  createShieldMesh() {
    this.shieldGroup = new THREE.Group();
    this.shieldGroup.visible = false;
    this.avatar.add(this.shieldGroup);

    // A. Coque cristalline icosaédrique externe ajustée (Nanomesh quantique sleek)
    const facetGeo = new THREE.IcosahedronGeometry(1.22, 2);
    this.shieldFacetMat = new THREE.MeshBasicMaterial({
      map: getQuantumShieldTexture(),
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.shieldFacetMesh = new THREE.Mesh(facetGeo, this.shieldFacetMat);
    this.shieldGroup.add(this.shieldFacetMesh);

    // B. Sphère énergétique hexagonale interne (Flux plasmique)
    const innerGeo = new THREE.SphereGeometry(1.10, 32, 32);
    this.shieldInnerMat = new THREE.MeshBasicMaterial({
      map: getShieldHexTexture(),
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.shieldInnerMesh = new THREE.Mesh(innerGeo, this.shieldInnerMat);
    this.shieldGroup.add(this.shieldInnerMesh);

    // C. Doubles anneaux gyroscopiques contrarotatifs avec émetteurs quantiques
    const ringGeo1 = new THREE.TorusGeometry(1.34, 0.028, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    this.shieldRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.shieldRing1.rotation.x = Math.PI / 3;
    this.shieldGroup.add(this.shieldRing1);

    // Satellites émetteurs sur l'anneau 1
    const satGeo = new THREE.OctahedronGeometry(0.08);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.shieldSatellites = [];
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / 4) * Math.PI * 2;
      sat.position.set(Math.cos(angle) * 1.34, Math.sin(angle) * 1.34, 0);
      this.shieldRing1.add(sat);
      this.shieldSatellites.push(sat);
    }

    const ringGeo2 = new THREE.TorusGeometry(1.44, 0.024, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.shieldRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.shieldRing2.rotation.y = Math.PI / 4;
    this.shieldRing2.rotation.z = -Math.PI / 6;
    this.shieldGroup.add(this.shieldRing2);

    // D. Arcs électriques plasmiques dans le bouclier
    this.plasmaArcCount = 12;
    const arcGeo = new THREE.BufferGeometry();
    this.plasmaArcPositions = new Float32Array(this.plasmaArcCount * 6);
    arcGeo.setAttribute('position', new THREE.BufferAttribute(this.plasmaArcPositions, 3));
    this.plasmaArcMat = new THREE.LineBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.plasmaArcs = new THREE.LineSegments(arcGeo, this.plasmaArcMat);
    this.shieldGroup.add(this.plasmaArcs);

    // E. Onde de choc d'absorption
    const shockGeo = new THREE.RingGeometry(0.4, 2.6, 32);
    this.shieldShockMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.shieldShockwave = new THREE.Mesh(shockGeo, this.shieldShockMat);
    this.shieldShockwave.rotation.x = -Math.PI / 2;
    this.shieldGroup.add(this.shieldShockwave);
    this.shockwaveTimer = 0;
  }

  equipShield(audioManager) {
    this.hasShield = true;
    this.armorCount = Math.min(3, this.armorCount + 1);
    if (this.shieldGroup) this.shieldGroup.visible = true;
    if (audioManager) audioManager.playShieldEquip();
  }

  absorbHit(audioManager) {
    if (this.hasShield) {
      this.armorCount--;
      this.shockwaveTimer = 0.55; // Déclenche l'onde de choc visuelle
      if (this.armorCount <= 0) {
        this.hasShield = false;
        if (this.shieldGroup) this.shieldGroup.visible = false;
      }
      this.invulnerableTimer = 1.6;
      if (audioManager) audioManager.playShieldBreak();
      return true;
    }
    return false;
  }

  // --- 2. SYSTÈME PURITY (Aura de Saiyan Bleu Clair Lisse Épousant le Corps) ---
  createSaiyanAura() {
    this.saiyanGroup = new THREE.Group();
    this.saiyanGroup.visible = false;
    this.avatar.add(this.saiyanGroup);

    if (!this.purityAuraMeshes) this.purityAuraMeshes = [];

    // 1. Coque anatomique de secours (activée uniquement si modèle procédural fallback)
    const auraCapsuleGeo = new THREE.CapsuleGeometry(0.55, 2.4, 16, 24);
    this.purityBodyMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.purityBodyMesh = new THREE.Mesh(auraCapsuleGeo, this.purityBodyMat);
    this.purityBodyMesh.position.set(0, 0.2, 0);
    this.purityBodyMesh.visible = false;
    this.saiyanGroup.add(this.purityBodyMesh);

    // Seconde coque externe douce
    const outerCapsuleGeo = new THREE.CapsuleGeometry(0.70, 2.5, 16, 24);
    this.purityOuterMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.purityOuterMesh = new THREE.Mesh(outerCapsuleGeo, this.purityOuterMat);
    this.purityOuterMesh.position.set(0, 0.2, 0);
    this.purityOuterMesh.visible = false;
    this.saiyanGroup.add(this.purityOuterMesh);

    // 2. Micro-étincelles célestes de Ki PURITY (Poussière cristalline étincelante montant le long du corps)
    this.kiParticleCount = 56;
    const kiGeo = new THREE.BufferGeometry();
    this.kiPos = new Float32Array(this.kiParticleCount * 3);
    this.kiSeeds = [];
    for (let i = 0; i < this.kiParticleCount; i++) {
      this.kiSeeds.push({
        baseX: (Math.random() - 0.5) * 0.85,
        baseZ: (Math.random() - 0.5) * 0.65,
        y: Math.random() * 2.8 - 1.4,
        speedY: 1.1 + Math.random() * 1.5,
        swaySpeed: 2.2 + Math.random() * 3.0,
        swayAmp: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      });
      this.kiPos[i * 3] = 0;
      this.kiPos[i * 3 + 1] = -100;
      this.kiPos[i * 3 + 2] = 0;
    }
    kiGeo.setAttribute('position', new THREE.BufferAttribute(this.kiPos, 3));

    this.kiMat = new THREE.PointsMaterial({
      size: 1.35,
      map: getPurityMoteTexture(),
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.kiPoints = new THREE.Points(kiGeo, this.kiMat);
    this.saiyanGroup.add(this.kiPoints);

    // 3. Lueur ponctuelle céleste bleu clair douce
    this.saiyanLight = new THREE.PointLight(0x38bdf8, 3.0, 9.0);
    this.saiyanLight.position.set(0, 0.3, 0);
    this.saiyanGroup.add(this.saiyanLight);
  }

  activateSayanfinity(duration = 20.0, audioManager) {
    this.saiyanTimer = duration;
    if (this.saiyanGroup) this.saiyanGroup.visible = true;
    if (this.purityBodyMesh) this.purityBodyMesh.visible = !this.fbxModel;
    if (this.purityOuterMesh) this.purityOuterMesh.visible = !this.fbxModel;
    if (this.purityAuraMeshes) {
      for (const m of this.purityAuraMeshes) {
        m.visible = true;
      }
    }
    if (audioManager) audioManager.playSuperSaiyan();
  }

  isSayanfinityActive() {
    return this.saiyanTimer > 0;
  }

  canSmashObstacles() {
    return this.saiyanTimer > 0;
  }

  activateBoost(duration = 3.5, speed = 28.0) {
    this.boostTimer = duration;
    this.boostExtraSpeed = speed;
  }

  // --- 3. SYSTÈME DE TIRS BLASTER LASER (STAR FOX DYNAMIQUE & SURCHAUFFE) ---
  createLaserPool() {
    this.lasers = [];
    this.laserCooldown = 0.0;
    this.laserSpeed = 290.0;

    // Système de gestion thermique (Anti-spam / Cadence tactique / Surchauffe rapide)
    this.blasterHeat = 0.0;             // De 0.0 (froid) à 1.0 (surchauffe max)
    this.isOverheated = false;          // Vrai quand verrouillé en surchauffe
    this.overheatCooldownTimer = 0.0;   // Décompte de pénalité
    this.heatPerShot = 0.38;            // +38% de chaleur par tir (2 tirs max, surchauffe immédiate au 3e)
    this.coolingRate = 0.22;            // Dissipation thermique lente (impose des tirs espacés)
    this.overheatLockoutDuration = 3.2; // 3.2s de verrouillage de sécurité strict lors de surchauffe

    this.laserGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.6, 8);
    this.laserGeo.rotateX(Math.PI / 2); // Aligné sur l'axe longitudinal (-Z vers l'avant)

    this.laserMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    this.laserMatSaiyan = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
  }

  // --- 4. EFFETS EXCLUSIFS FONDATEUR (OR IMPÉRIAL & RÉACTEURS PHOTONIQUES) ---
  createFounderEffects() {
    this.isFounderMode = false;
    this.founderTrailCount = 52;
    const geo = new THREE.BufferGeometry();
    this.founderTrailPos = new Float32Array(this.founderTrailCount * 3);
    this.founderTrailSeeds = [];

    for (let i = 0; i < this.founderTrailCount; i++) {
      this.founderTrailPos[i * 3 + 1] = -1000;
      this.founderTrailSeeds.push({
        side: i % 2 === 0 ? -0.75 : 0.75,
        offsetY: -0.2 + (Math.random() - 0.5) * 0.25,
        z: Math.random() * 8.0,
        speedZ: 24.0 + Math.random() * 32.0,
        life: Math.random()
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.founderTrailPos, 3));

    this.founderTrailMat = new THREE.PointsMaterial({
      size: 2.2,
      map: getSoftGlowTexture(),
      color: 0xfbbf24, // Or éclatant
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.founderTrailPoints = new THREE.Points(geo, this.founderTrailMat);
    this.founderTrailPoints.visible = false;
    this.scene.add(this.founderTrailPoints);
  }

  setFounder(isFounder) {
    this.isFounderMode = !!isFounder;
    if (this.founderTrailPoints) {
      this.founderTrailPoints.visible = this.isFounderMode && !this.isDead;
    }
  }

  updateFounderTrail(dt) {
    if (!this.isFounderMode || !this.founderTrailPoints || this.isDead) {
      if (this.founderTrailPoints) this.founderTrailPoints.visible = false;
      return;
    }
    this.founderTrailPoints.visible = true;
    const pos = this.founderTrailPoints.geometry.attributes.position.array;
    const p = this.group.position;

    for (let i = 0; i < this.founderTrailCount; i++) {
      const s = this.founderTrailSeeds[i];
      s.life += dt * 3.4;
      s.z += s.speedZ * dt;

      if (s.life >= 1.0 || s.z > 8.5) {
        s.life = 0;
        s.z = 0.2 + Math.random() * 0.4;
      }

      pos[i * 3] = p.x + s.side;
      pos[i * 3 + 1] = p.y + s.offsetY;
      pos[i * 3 + 2] = p.z + s.z;
    }
    this.founderTrailPoints.geometry.attributes.position.needsUpdate = true;
  }

  // --- 5. TRAÎNÉE RÉACTEURS ÉLÉGANTE (FLIGHT PHOTON MOTES) ---
  createFlightTrail() {
    this.flightTrailCount = 36;
    const geo = new THREE.BufferGeometry();
    this.flightTrailPos = new Float32Array(this.flightTrailCount * 3);
    this.flightTrailSeeds = [];

    for (let i = 0; i < this.flightTrailCount; i++) {
      this.flightTrailPos[i * 3 + 1] = -1000;
      this.flightTrailSeeds.push({
        side: i % 2 === 0 ? -0.55 : 0.55,
        offsetY: -0.22 + (Math.random() - 0.5) * 0.15,
        z: Math.random() * 5.0,
        speedZ: 18.0 + Math.random() * 24.0,
        life: Math.random()
      });
    }
    geo.setAttribute('position', new THREE.BufferAttribute(this.flightTrailPos, 3));

    this.flightTrailMat = new THREE.PointsMaterial({
      size: 1.25,
      map: getPurityMoteTexture(),
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.flightTrailPoints = new THREE.Points(geo, this.flightTrailMat);
    this.scene.add(this.flightTrailPoints);
  }

  updateFlightTrail(dt) {
    if (!this.flightTrailPoints || this.isDead) {
      if (this.flightTrailPoints) this.flightTrailPoints.visible = false;
      return;
    }
    this.flightTrailPoints.visible = true;

    // Teinte et intensité dynamiques : Purity (blanc céleste), Boost (cyan intense), Normal (bleu ciel doux)
    const isPurity = this.saiyanTimer > 0;
    const isBoost = this.boostTimer > 0;
    if (isPurity) {
      this.flightTrailMat.color.set(0xe0f2fe);
      this.flightTrailMat.size = 1.45;
      this.flightTrailMat.opacity = 0.85;
    } else if (isBoost) {
      this.flightTrailMat.color.set(0x00f0ff);
      this.flightTrailMat.size = 1.35;
      this.flightTrailMat.opacity = 0.78;
    } else {
      this.flightTrailMat.color.set(0x38bdf8);
      this.flightTrailMat.size = 1.15;
      this.flightTrailMat.opacity = 0.55;
    }

    const pos = this.flightTrailPoints.geometry.attributes.position.array;
    const p = this.group.position;
    const speedMult = isPurity ? 1.6 : (isBoost ? 1.4 : 1.0);

    for (let i = 0; i < this.flightTrailCount; i++) {
      const s = this.flightTrailSeeds[i];
      s.life += dt * 3.5;
      s.z += s.speedZ * speedMult * dt;

      if (s.life >= 1.0 || s.z > (isPurity || isBoost ? 7.5 : 5.0)) {
        s.life = 0;
        s.z = 0.1 + Math.random() * 0.3;
      }

      pos[i * 3] = p.x + s.side;
      pos[i * 3 + 1] = p.y + s.offsetY;
      pos[i * 3 + 2] = p.z + s.z;
    }
    this.flightTrailPoints.geometry.attributes.position.needsUpdate = true;
  }

  fireLaser(audioManager) {
    if (this.isDead || this.laserCooldown > 0 || this.isOverheated) return false;

    // Accumulation de chaleur
    this.blasterHeat = Math.min(1.0, this.blasterHeat + this.heatPerShot);

    // Déclenchement de la SURCHAUFFE immédiate si seuil atteint
    if (this.blasterHeat >= 0.999) {
      this.blasterHeat = 1.0;
      this.isOverheated = true;
      this.overheatCooldownTimer = this.overheatLockoutDuration;
      if (audioManager && audioManager.playBlasterOverheat) {
        audioManager.playBlasterOverheat();
      }
    }

    this.laserCooldown = 0.20; // Cadence tactique et mesurée

    const p = this.group.position;
    const isSaiyan = this.saiyanTimer > 0;
    const mat = isSaiyan ? this.laserMatSaiyan : this.laserMat;

    // Double tir laser orienté et convergent vers le réticule central
    const offsets = [-1.35, 1.35];
    for (const offX of offsets) {
      const mesh = new THREE.Mesh(this.laserGeo, mat);
      mesh.position.set(p.x + offX, p.y - 0.15, p.z - 1.8);
      // Légère convergence vers l'axe de mire du réticule
      mesh.rotation.y = offX > 0 ? 0.022 : -0.022;
      this.scene.add(mesh);

      const bbox = new THREE.Box3().setFromObject(mesh);
      this.lasers.push({
        mesh,
        bbox,
        vx: (offX > 0 ? -1 : 1) * 1.8,
        speed: isSaiyan ? 340.0 : this.laserSpeed,
        damage: isSaiyan ? 999 : 1,
        isSaiyan
      });
    }

    if (audioManager) {
      audioManager.playLaserShoot();
    }
    return true;
  }

  updateLasers(dt, audioManager = null) {
    if (this.laserCooldown > 0) {
      this.laserCooldown -= dt;
    }

    // Gestion de la dissipation thermique
    if (this.isOverheated) {
      this.overheatCooldownTimer -= dt;
      this.blasterHeat = Math.max(0.0, this.overheatCooldownTimer / this.overheatLockoutDuration);
      if (this.overheatCooldownTimer <= 0) {
        this.isOverheated = false;
        this.blasterHeat = 0.0;
        this.overheatCooldownTimer = 0.0;
        if (audioManager && audioManager.playBlasterReady) {
          audioManager.playBlasterReady();
        }
      }
    } else {
      // Refroidissement passif quand le joueur ne tire pas (accéléré en mode Purity)
      const coolMult = (this.saiyanTimer > 0) ? 1.6 : 1.0;
      if (this.blasterHeat > 0) {
        this.blasterHeat = Math.max(0.0, this.blasterHeat - this.coolingRate * coolMult * dt);
      }
    }

    const px = this.group.position.x;
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.mesh.position.z -= l.speed * dt;
      if (l.vx && Math.abs(l.mesh.position.x - px) > 0.2) {
        l.mesh.position.x += l.vx * dt;
      }
      l.bbox.setFromObject(l.mesh);

      // Despawn lointain
      if (l.mesh.position.z < -340) {
        this.scene.remove(l.mesh);
        this.lasers.splice(i, 1);
      }
    }
  }

  // Recharge vitale à la collecte d'un cœur (sans accélération pour préserver la maîtrise des trajectoires)
  rechargeHeart() {
    this.energy = Math.min(this.maxEnergy, this.energy + 32.0);
    this.boostTimer = 0.0;
    this.boostExtraSpeed = 0.0;
  }

  // Animation d'attente cinématique dans le Menu Principal
  updateIdle(dt, bpm, bassEnergy) {
    const time = performance.now() * 0.001;
    this.group.position.set(0, 2.5 + Math.sin(time * 1.5) * 0.18, 0);
    this.avatar.rotation.y = Math.sin(time * 0.8) * 0.12;
    this.avatar.rotation.z = Math.sin(time * 1.2) * 0.05;
    this.avatar.rotation.x = Math.sin(time * 0.9) * 0.03;

    // Pulsation douce du cœur sur le tempo
    const bps = (bpm || 130) / 60.0;
    const beatPhase = (time * bps * Math.PI * 2) % (Math.PI * 2);
    const heartbeat = Math.pow(Math.sin(beatPhase), 6) * 0.6 + bassEnergy * 0.25;
    this.heartLight.intensity = 3.0 + heartbeat * 2.5;
    this.heartMat.emissiveIntensity = 3.2 + heartbeat * 2.0;
    if (this.fbxHeartMaterial) {
      this.fbxHeartMaterial.emissiveIntensity = 3.5 + heartbeat * 2.0;
    }
  }

  // Configuration du profil dynamique de vol du cycle actif
  setFlightProfile(profile, time) {
    if (!profile) {
      this.cyclePitchOffset = 0;
      this.cycleRollOffset = 0;
      return;
    }
    this.cyclePitchOffset = profile.pitch || 0;
    let roll = 0;
    if (profile.rollWobbleAmp > 0) {
      roll += Math.sin(time * (profile.rollWobbleFreq || 2.0)) * profile.rollWobbleAmp;
    }
    if (profile.turbulence > 0) {
      roll += Math.sin(time * 24.5) * profile.turbulence * 0.35;
    }
    this.cycleRollOffset = roll;
  }

  // Mise à jour de la physique de vol, de l'énergie et des animations
  update(dt, inputAxisX, inputAxisY, bpm, bassEnergy, audioManager = null) {
    const time = performance.now() * 0.001;

    // 1. Animation de dislocation si mort
    if (this.isDead) {
      if (this.isDislocating) {
        this.dyingTimer += dt;
        const pos = this.disParticles.geometry.attributes.position.array;
        const drag = Math.pow(0.20, dt);

        for (let i = 0; i < this.particleCount; i++) {
          pos[i * 3] += this.disVel[i * 3] * dt;
          pos[i * 3 + 1] += this.disVel[i * 3 + 1] * dt;
          pos[i * 3 + 2] += this.disVel[i * 3 + 2] * dt;
          this.disVel[i * 3] *= drag;
          this.disVel[i * 3 + 2] *= drag;
          this.disVel[i * 3 + 1] -= 9.8 * dt; // Gravité modérée et naturelle
          if (pos[i * 3 + 1] < 0.15) {
            pos[i * 3 + 1] = 0.15;
            this.disVel[i * 3 + 1] = -this.disVel[i * 3 + 1] * 0.25;
          }
        }
        this.disParticles.geometry.attributes.position.needsUpdate = true;
        this.disMat.opacity = Math.max(0, 1.0 - Math.pow(this.dyingTimer / 1.5, 1.8));
      }
      return;
    }

    const p = this.group.position;

    // 2. Gestion du boost temporaire
    if (this.boostTimer > 0) {
      this.boostTimer -= dt;
      if (this.boostTimer <= 0) {
        this.boostExtraSpeed = 0;
      }
    }

    // 3. Décroissance équilibrée de l'énergie vitale (Progression fluide vers Cycle 8)
    const baseDrain = 1.4 * dt;
    this.energy = Math.max(0, this.energy - baseDrain);

    // 4. Axe X (Latéral) & Inclinaison réaliste (Bank/Roll) avec influence dynamique du cycle
    if (inputAxisX !== 0) {
      p.x += inputAxisX * this.lateralSpeed * dt;
      p.x = Math.max(-this.maxX, Math.min(this.maxX, p.x));
    }
    const targetRoll = -inputAxisX * 0.48 + (this.cycleRollOffset || 0);
    this.avatar.rotation.z += (targetRoll - this.avatar.rotation.z) * 10.0 * dt;

    // 5. Axe Y (Altitude) & Tangage (Pitch)
    const isClimbing = inputAxisY > 0.1;
    const isDiving = inputAxisY < -0.1;
    let vertVel = 0;

    if (isClimbing) {
      if (this.energy > 0) {
        // L'ascension coûte un léger surcroît d'énergie et perd de la portance en haute altitude
        const altFactor = 1.0 - (p.y / this.maxAltitude) * 0.35;
        vertVel = this.verticalSpeed * altFactor;
        const climbDrain = (3.2 + (p.y / this.maxAltitude) * 3.8) * dt;
        this.energy = Math.max(0, this.energy - climbDrain);
      } else {
        vertVel = -3.8; // Descente douce automatique si l'énergie est épuisée
      }
    } else if (isDiving) {
      // Piquer vers le sol stabilise la trajectoire et offre un gain de vitesse
      vertVel = -this.verticalSpeed * 1.25;
      if (p.y <= 2.8) {
        // Effet de sol / vol rasant : stabilise et recharge doucement l'énergie
        this.energy = Math.min(this.maxEnergy, this.energy + 16.0 * dt);
      }
    } else {
      if (this.energy <= 0 && p.y > this.minAltitude) {
        vertVel = -3.8;
      }
    }

    p.y += vertVel * dt;
    if (p.y > 9.2) {
      // Poussée descendante en haute altitude pour rester dans le canyon de jeu
      p.y -= (p.y - 9.2) * 3.5 * dt;
    }
    p.y = Math.max(this.minAltitude, Math.min(this.maxAltitude, p.y));

    // Tangage avec inclinaison dynamique du cycle (piqué abyssal, montée céleste/ambition)
    const targetPitch = inputAxisY * 0.42 + (this.cyclePitchOffset || 0);
    this.avatar.rotation.x += (targetPitch - this.avatar.rotation.x) * 8.0 * dt;

    // 6. Pulsation du cœur synchronisée au BPM et aux basses
    const bps = (bpm || 130) / 60.0;
    const energyRatio = Math.max(0.05, this.energy / this.maxEnergy);
    const beatPhase = (time * bps * Math.PI * 2) % (Math.PI * 2);
    const rawBeat = Math.pow(Math.sin(beatPhase), 6) + 0.3 * Math.pow(Math.sin(beatPhase * 2 + 0.4), 6);
    const heartbeat = Math.min(1.0, rawBeat) * (0.4 + 0.6 * energyRatio) + (bassEnergy * 0.25 * energyRatio);

    const lightInt = (0.45 + energyRatio * 0.75) * (0.7 + heartbeat * 0.4);
    this.heartLight.intensity = lightInt;
    this.heartMat.emissiveIntensity = (1.6 + energyRatio * 3.6) * (0.7 + heartbeat * 0.7);
    if (this.fbxHeartMaterial) {
      this.fbxHeartMaterial.emissiveIntensity = (2.2 + energyRatio * 4.0) * (0.7 + heartbeat * 0.7);
    }
    const hScale = 0.42 * (1.0 + heartbeat * 0.2 * energyRatio);
    this.heartMesh.scale.set(hScale, hScale, hScale);

    // 7. Bounding sphere update
    this.boundingSphere.center.copy(p);

    // 8. Mise à jour des tirs laser Star Fox
    this.updateLasers(dt, audioManager);

    // 9. Animation du Bouclier d'Armure Haute Technologie (1-Hit Protection)
    if (this.hasShield && this.shieldGroup) {
      this.shieldGroup.visible = true;

      // Rotations contrarotatives de la coque cristalline et de la sphère intérieure
      if (this.shieldFacetMesh) {
        this.shieldFacetMesh.rotation.y += 1.35 * dt;
        this.shieldFacetMesh.rotation.z += 0.75 * dt;
      }
      if (this.shieldInnerMesh) {
        this.shieldInnerMesh.rotation.y -= 1.15 * dt;
        this.shieldInnerMesh.rotation.x += 0.85 * dt;
      }

      // Anneaux gyroscopiques orbitaux
      if (this.shieldRing1) this.shieldRing1.rotation.z += 2.2 * dt;
      if (this.shieldRing2) {
        this.shieldRing2.rotation.z -= 1.9 * dt;
        this.shieldRing2.rotation.x += 0.6 * dt;
      }

      // Arcs plasmiques crépitant à la surface ajustée du bouclier
      if (this.plasmaArcs && Math.random() < 0.35) {
        const arcPos = this.plasmaArcs.geometry.attributes.position.array;
        for (let i = 0; i < this.plasmaArcCount; i++) {
          const u = Math.random() * Math.PI * 2;
          const v = Math.acos(2 * Math.random() - 1);
          const r1 = 1.12;
          const r2 = 1.20;
          arcPos[i * 6] = Math.sin(v) * Math.cos(u) * r1;
          arcPos[i * 6 + 1] = Math.cos(v) * r1;
          arcPos[i * 6 + 2] = Math.sin(v) * Math.sin(u) * r1;

          const u2 = u + (Math.random() - 0.5) * 0.6;
          const v2 = v + (Math.random() - 0.5) * 0.6;
          arcPos[i * 6 + 3] = Math.sin(v2) * Math.cos(u2) * r2;
          arcPos[i * 6 + 4] = Math.cos(v2) * r2;
          arcPos[i * 6 + 5] = Math.sin(v2) * Math.sin(u2) * r2;
        }
        this.plasmaArcs.geometry.attributes.position.needsUpdate = true;
      }

      // Onde de choc après absorption d'un impact
      if (this.shockwaveTimer > 0 && this.shieldShockwave) {
        this.shockwaveTimer -= dt;
        const progress = 1.0 - (this.shockwaveTimer / 0.55);
        const sc = 1.0 + progress * 2.2;
        this.shieldShockwave.scale.set(sc, sc, sc);
        this.shieldShockMat.opacity = Math.max(0, 1.0 - progress);
      } else if (this.shieldShockwave) {
        this.shieldShockMat.opacity = 0;
      }

      const shieldPulse = 1.0 + Math.sin(time * 6.5) * 0.03 + bassEnergy * 0.10;
      this.shieldGroup.scale.set(shieldPulse, shieldPulse, shieldPulse);
    } else if (this.shieldGroup) {
      this.shieldGroup.visible = false;
    }

    // 10. Période de grâce d'invulnérabilité (clignotement suite à bouclier brisé)
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
      this.avatar.visible = Math.floor(time * 24) % 2 === 0;
      if (this.invulnerableTimer <= 0) {
        this.avatar.visible = true;
      }
    }

    // 11. Animation de l'Aura PURITY (Épousant strictement chaque membre du corps)
    if (this.saiyanTimer > 0 && this.saiyanGroup) {
      this.saiyanTimer -= dt;
      this.saiyanGroup.visible = true;

      // Pulsation de l'aura silhouette exacte de chaque membre
      if (this.purityAuraMeshes && this.purityAuraMeshes.length > 0) {
        const bodyPulse = 1.0 + Math.sin(time * 5.0) * 0.018;
        for (const m of this.purityAuraMeshes) {
          m.visible = true;
          m.scale.set(1.045 * bodyPulse, 1.045 * bodyPulse, 1.045 * bodyPulse);
        }
        if (this.purityBodyMesh) this.purityBodyMesh.visible = false;
        if (this.purityOuterMesh) this.purityOuterMesh.visible = false;
      }

      // Particules montantes très proches du corps, ondulant organiquement (style Purity)
      if (this.kiPoints && this.kiSeeds) {
        const kPos = this.kiPoints.geometry.attributes.position.array;
        for (let i = 0; i < this.kiParticleCount; i++) {
          const s = this.kiSeeds[i];
          s.y += s.speedY * dt;
          if (s.y > 1.9) {
            s.y = -1.4;
            s.baseX = (Math.random() - 0.5) * 0.85;
            s.baseZ = (Math.random() - 0.5) * 0.65;
          }
          const swayX = Math.sin(time * s.swaySpeed + s.phase) * s.swayAmp;
          const swayZ = Math.cos(time * (s.swaySpeed * 0.8) + s.phase) * (s.swayAmp * 0.7);

          kPos[i * 3] = s.baseX + swayX;
          kPos[i * 3 + 1] = s.y;
          kPos[i * 3 + 2] = s.baseZ + swayZ;
        }
        this.kiPoints.geometry.attributes.position.needsUpdate = true;
      }

      // Métamorphose sur les matériaux (bleu/cyan pour PURITY)
      if (this.fbxHeartMaterial) {
        this.fbxHeartMaterial.emissive.set(0x00f0ff);
        this.fbxHeartMaterial.emissiveIntensity = 6.0;
      }
      if (this.fbxVisorMaterial) {
        this.fbxVisorMaterial.emissive.set(0x38bdf8);
        this.fbxVisorMaterial.emissiveIntensity = 5.0;
      }

      if (this.saiyanTimer <= 0) {
        this.saiyanTimer = 0;
        this.saiyanGroup.visible = false;
        if (this.purityAuraMeshes) {
          for (const m of this.purityAuraMeshes) {
            m.visible = false;
          }
        }
        if (this.fbxHeartMaterial) {
          this.fbxHeartMaterial.emissive.set(0xff2ea6);
          this.fbxHeartMaterial.emissiveIntensity = 4.5;
        }
        if (this.fbxVisorMaterial) {
          this.fbxVisorMaterial.emissive.set(0x00f0ff);
          this.fbxVisorMaterial.emissiveIntensity = 4.2;
        }
      }
    } else {
      if (this.saiyanGroup) this.saiyanGroup.visible = false;
      if (this.purityAuraMeshes) {
        for (const m of this.purityAuraMeshes) {
          m.visible = false;
        }
      }
    }

    // 12. Traînée réacteurs exclusive Fondateur & Traînée photonique de vol
    this.updateFounderTrail(dt);
    this.updateFlightTrail(dt);

    // 13. Échec si énergie à zéro au sol
    if (this.energy <= 0 && p.y <= this.minAltitude + 0.05) {
      this.triggerCrash();
    }
  }

  reset() {
    this.energy = 100.0;
    this.isDead = false;
    this.isDislocating = false;
    this.dyingTimer = 0;
    this.boostTimer = 0;
    this.boostExtraSpeed = 0;
    this.avatar.visible = true;
    this.heartLight.visible = true;
    this.avatar.rotation.set(0, 0, 0);
    if (this.modelContainer) this.modelContainer.rotation.y = Math.PI;
    this.group.position.set(0, 3.5, 0);
    this.boundingSphere.center.copy(this.group.position);
    this.disMat.opacity = 0;

    // Reset Armure & Bouclier
    this.hasShield = false;
    this.armorCount = 0;
    this.invulnerableTimer = 0;
    if (this.shieldGroup) this.shieldGroup.visible = false;

    // Reset Sayanfinity
    this.saiyanTimer = 0;
    if (this.saiyanGroup) this.saiyanGroup.visible = false;
    if (this.fbxHeartMaterial) this.fbxHeartMaterial.emissive.set(0xff2ea6);

    // Reset Lasers & Thermique Blaster
    if (this.lasers) {
      for (const l of this.lasers) {
        this.scene.remove(l.mesh);
      }
      this.lasers = [];
    }
    this.laserCooldown = 0;
    this.blasterHeat = 0.0;
    this.isOverheated = false;
    this.overheatCooldownTimer = 0.0;

    // Reset Effets Fondateur & Traînée de vol
    if (this.founderTrailPoints) {
      this.founderTrailPoints.visible = this.isFounderMode;
    }
    if (this.flightTrailPoints) {
      this.flightTrailPoints.visible = true;
    }
  }
}
