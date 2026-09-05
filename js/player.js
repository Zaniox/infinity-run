/**
 * // SOUNDRISE : INFINITY RUN - JOUEUR (« INFI »)
 * Modèle 3D Métallique Sombre, Tête Sphérique avec Infini & Yeux en Arc,
 * Cœur Émissif Dynamique, Physique Glider Race the Sun et Particules de Dislocation.
 */
import * as THREE from 'three';

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

    // Torse conique inversé minimaliste & cou
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.42, 24), this.darkMetalMat);
    neck.position.set(0, -0.92, 0);
    neck.castShadow = true;
    this.avatar.add(neck);

    const chest = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.4, 4), this.darkMetalMat);
    chest.rotation.x = Math.PI;
    chest.rotation.y = Math.PI / 4;
    chest.position.set(0, -1.35, 0);
    chest.castShadow = true;
    this.avatar.add(chest);

    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.28, 0.65), this.darkMetalMat);
    shoulders.position.set(0, -1.05, 0);
    shoulders.castShadow = true;
    this.avatar.add(shoulders);

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

  createInfiVisor(headRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512, cy = 560, rx = 230, ry = 150, strokeW = 68;

    // Glow externe violet
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 45;
    ctx.lineWidth = strokeW + 16;
    ctx.strokeStyle = '#c026d3';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(cx - 120, cy - ry, cx - rx, cy - ry, cx - rx, cy);
    ctx.bezierCurveTo(cx - rx, cy + ry, cx - 120, cy + ry, cx, cy);
    ctx.bezierCurveTo(cx + 120, cy - ry, cx + rx, cy - ry, cx + rx, cy);
    ctx.bezierCurveTo(cx + rx, cy + ry, cx + 120, cy + ry, cx, cy);
    ctx.stroke();

    // Cœur interne blanc pur
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25;
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = '#ffffff';

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(cx - 120, cy - ry, cx - rx, cy - ry, cx - rx, cy);
    ctx.bezierCurveTo(cx - rx, cy + ry, cx - 120, cy + ry, cx, cy);
    ctx.bezierCurveTo(cx + 120, cy - ry, cx + rx, cy - ry, cx + rx, cy);
    ctx.bezierCurveTo(cx + rx, cy + ry, cx + 120, cy + ry, cx, cy);
    ctx.stroke();

    // Croix centrale
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 42);
    ctx.lineTo(cx + 48, cy - 42);
    ctx.stroke();

    // Les deux arcs courbés au-dessus (yeux expressifs)
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 28;
    ctx.strokeStyle = '#ffffff';

    ctx.beginPath();
    ctx.arc(cx - 130, cy - 170, 75, Math.PI * 1.18, Math.PI * 1.82, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 130, cy - 170, 75, Math.PI * 1.18, Math.PI * 1.82, false);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    const visorMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });

    // Déformation sphérique des sommets pour épouser parfaitement la courbure de la tête
    const visorGeo = new THREE.PlaneGeometry(1.52, 1.12, 32, 32);
    const pos = visorGeo.attributes.position;
    const sphereR = headRadius * 1.025;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const sy = vy + 0.16;
      const vz = Math.sqrt(Math.max(0.01, sphereR * sphereR - (vx * vx + sy * sy)));
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
      vertexColors: true,
      transparent: true,
      opacity: 0,
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
