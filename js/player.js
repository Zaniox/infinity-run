/**
 * // SOUNDRISE : INFINITY RUN - JOUEUR (« INFI »)
 * Modèle 3D Métallique Sombre, Tête Sphérique avec Infini & Yeux en Arc,
 * Cœur Émissif Dynamique, Physique Glider Race the Sun et Particules de Dislocation.
 */
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { getSoftGlowTexture } from './particles.js';

export class Player {
  constructor(scene) {
    this.scene = scene;

    // Groupe racine du joueur
    this.group = new THREE.Group();
    this.avatar = new THREE.Group();
    this.group.add(this.avatar);

    // Paramètres physiques & de vol (Feel Race the Sun)
    this.minAltitude = 1.25;
    this.maxAltitude = 24.0;
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

    // Bounding Sphere pour collision ultra-fluide
    this.radius = 1.0;
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), this.radius * 0.82);

    // Construction du modèle 3D
    this.createModel();
    this.loadFBXModel();
    this.createDislocationParticles();

    // Positionnement initial
    this.group.position.set(0, this.minAltitude, 0);
    this.scene.add(this.group);
  }

  createModel() {
    const headRadius = 1.0;

    // 1. Matériau torse & membres : Métallique sombre doux (Race the Sun lore)
    this.darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0a0512,
      roughness: 0.2,
      metalness: 0.82,
      envMapIntensity: 1.0
    });

    // Torse procédural initial (remplacé automatiquement par Infi.fbx dès chargement)
    this.proceduralTorso = new THREE.Group();
    this.avatar.add(this.proceduralTorso);

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
      color: 0x140428,
      metalness: 0.88,
      roughness: 0.12,
      transparent: true,
      opacity: 0.92
    });
    this.headMesh = new THREE.Mesh(headGeo, this.headMat);
    this.headMesh.castShadow = true;
    this.avatar.add(this.headMesh);

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
    this.avatar.add(this.headHalo);

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

        // Application des matériaux officiels dédiés aux sous-maillages de l'FBX
        fbx.traverse((child) => {
          if (child.isMesh) {
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
                color: 0x120d20,
                metalness: 0.90,
                roughness: 0.20,
                envMapIntensity: 1.5
              });
            }
          }
        });

        this.fbxModel = fbx;
        this.avatar.add(fbx);

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
    this.avatar.add(this.visorMesh);
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
    this.avatar.add(this.heartMesh);

    // Lumière ponctuelle émise par le cœur
    this.heartLight = new THREE.PointLight(0xff2ea6, 4.0, 16);
    this.heartLight.position.set(0.24, -1.18, 0.52);
    this.avatar.add(this.heartLight);
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
      size: 2.2,
      map: getSoftGlowTexture(),
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

  // Recharge vitale et boost de vitesse à la collecte d'un cœur
  rechargeHeart() {
    this.energy = Math.min(this.maxEnergy, this.energy + 35.0);
    this.boostTimer = 2.5; // +40 KM/H pendant 2.5s
    this.boostExtraSpeed = 40.0;
  }

  // Mise à jour de la physique de vol, de l'énergie et des animations
  update(dt, inputAxisX, inputAxisY, bpm, bassEnergy) {
    const time = performance.now() * 0.001;

    // 1. Animation de dislocation si mort
    if (this.isDead) {
      if (this.isDislocating) {
        this.dyingTimer += dt;
        const pos = this.disParticles.geometry.attributes.position.array;
        const grav = -18.0;

        for (let i = 0; i < this.particleCount; i++) {
          pos[i * 3] += this.disVel[i * 3] * dt;
          pos[i * 3 + 1] += this.disVel[i * 3 + 1] * dt;
          pos[i * 3 + 2] += this.disVel[i * 3 + 2] * dt;
          this.disVel[i * 3 + 1] += grav * dt;
          if (pos[i * 3 + 1] < 0.2) {
            pos[i * 3 + 1] = 0.2;
            this.disVel[i * 3 + 1] = -this.disVel[i * 3 + 1] * 0.35;
          }
        }
        this.disParticles.geometry.attributes.position.needsUpdate = true;
        this.disMat.opacity = Math.max(0, 1.0 - Math.pow(this.dyingTimer / 1.5, 2));
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

    // 3. Décroissance permanente de l'énergie vitale
    const baseDrain = 5.5 * dt;
    this.energy = Math.max(0, this.energy - baseDrain);

    // 4. Axe X (Latéral) & Inclinaison réaliste (Bank/Roll)
    if (inputAxisX !== 0) {
      p.x += inputAxisX * this.lateralSpeed * dt;
      p.x = Math.max(-this.maxX, Math.min(this.maxX, p.x));
    }
    const targetRoll = -inputAxisX * 0.48;
    this.avatar.rotation.z += (targetRoll - this.avatar.rotation.z) * 10.0 * dt;

    // 5. Axe Y (Altitude) & Tangage (Pitch)
    const isClimbing = inputAxisY > 0.1;
    const isDiving = inputAxisY < -0.1;
    let vertVel = 0;

    if (isClimbing) {
      if (this.energy > 0) {
        // L'ascension coûte un surcroît d'énergie et perd de la portance en haute altitude
        const altFactor = 1.0 - (p.y / this.maxAltitude) * 0.45;
        vertVel = this.verticalSpeed * altFactor;
        const climbDrain = (16.0 + (p.y / this.maxAltitude) * 12.0) * dt;
        this.energy = Math.max(0, this.energy - climbDrain);
      } else {
        vertVel = -4.5; // Descente automatique si l'énergie est épuisée
      }
    } else if (isDiving) {
      // Piquer vers le sol stabilise la trajectoire et offre un gain de vitesse
      vertVel = -this.verticalSpeed * 1.35;
      if (p.y <= 2.5) {
        // Effet de sol / vol rasant : stabilise et recharge doucement
        this.energy = Math.min(this.maxEnergy, this.energy + 12.0 * dt);
      }
    } else {
      if (this.energy <= 0 && p.y > this.minAltitude) {
        vertVel = -4.5;
      }
    }

    p.y += vertVel * dt;
    p.y = Math.max(this.minAltitude, Math.min(this.maxAltitude, p.y));

    // Tangage
    const targetPitch = inputAxisY * 0.42;
    this.avatar.rotation.x += (targetPitch - this.avatar.rotation.x) * 8.0 * dt;

    // 6. Pulsation du cœur synchronisée au BPM et aux basses
    const bps = (bpm || 130) / 60.0;
    const energyRatio = Math.max(0.05, this.energy / this.maxEnergy);
    const beatPhase = (time * bps * Math.PI * 2) % (Math.PI * 2);
    const rawBeat = Math.pow(Math.sin(beatPhase), 6) + 0.3 * Math.pow(Math.sin(beatPhase * 2 + 0.4), 6);
    const heartbeat = Math.min(1.0, rawBeat) * (0.4 + 0.6 * energyRatio) + (bassEnergy * 0.25 * energyRatio);

    const lightInt = (1.2 + energyRatio * 4.0) * (0.6 + heartbeat * 0.8);
    this.heartLight.intensity = lightInt;
    this.heartMat.emissiveIntensity = (1.6 + energyRatio * 3.6) * (0.7 + heartbeat * 0.7);
    if (this.fbxHeartMaterial) {
      this.fbxHeartMaterial.emissiveIntensity = (2.2 + energyRatio * 4.0) * (0.7 + heartbeat * 0.7);
    }
    const hScale = 0.42 * (1.0 + heartbeat * 0.2 * energyRatio);
    this.heartMesh.scale.set(hScale, hScale, hScale);

    // 7. Bounding sphere update
    this.boundingSphere.center.copy(p);

    // 8. Échec si énergie à zéro au sol
    if (this.energy <= 0 && p.y <= this.minAltitude + 0.05) {
      this.triggerCrash();
    }
  }

  reset() {
    this.energy = 100.0;
    this.isDead = false;
    this.isDislocating = false;
    this.boostTimer = 0;
    this.boostExtraSpeed = 0;
    this.avatar.visible = true;
    this.heartLight.visible = true;
    this.avatar.rotation.set(0, 0, 0);
    this.group.position.set(0, this.minAltitude, 0);
    this.disMat.opacity = 0;
  }
}
