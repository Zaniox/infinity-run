import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.radius = 1.0;

    // Limites de vol
    this.maxX = 16.0;
    this.minY = 1.0;  // Altitude minimale (ras du sol)
    this.maxY = 22.0; // Altitude maximale

    // Vitesses et dynamiques de planeur
    this.lateralSpeed = 22.0;
    this.verticalSpeed = 16.0;
    this.baseForwardSpeed = 65.0;
    this.forwardSpeed = 65.0;
    this.maxDiveSpeed = 115.0;
    this.gravityAscentDrag = 7.5;

    // Énergie du Cœur
    this.energy = 100.0;
    this.maxEnergy = 100.0;
    this.isClimbing = false;
    this.isDiving = false;
    this.isAlive = true;

    // Bounding Sphere pour les collisions
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), this.radius * 0.82);

    // Groupes 3D
    this.group = new THREE.Group();
    this.avatarMeshGroup = new THREE.Group();
    this.group.add(this.avatarMeshGroup);

    this.createMetallicBody();
    this.createNeonHalo();
    this.createVisorMask();
    this.createNeonHeart();
    this.createFloorShadow();

    this.group.position.set(0, this.minY, 0);
    this.scene.add(this.group);
  }

  createMetallicBody() {
    const bodyGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    // Matériau PBR miroir sombre violet/obsidienne avec vernis brillant
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x120224,           // Noir violacé profond
      metalness: 0.98,           // Effet miroir chrome complet
      roughness: 0.1,            // Surface ultra lisse
      clearcoat: 1.0,            // Vernis réfléchissant
      clearcoatRoughness: 0.04,
      emissive: 0x240438,        // Douce teinte violacée interne
      emissiveIntensity: 0.45,
      reflectivity: 1.0
    });

    this.bodyMesh = new THREE.Mesh(bodyGeo, this.bodyMaterial);
    this.avatarMeshGroup.add(this.bodyMesh);
  }

  createNeonHalo() {
    // Aura néon violette externe enveloppant le haut du corps (comme sur l'image de référence)
    const haloGeo = new THREE.SphereGeometry(this.radius * 1.07, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.avatarMeshGroup.add(this.haloMesh);
  }

  createVisorMask() {
    // Texture haute résolution pour le visage d'OodaïSound
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1024, 1024);

    // Dessin du logo Infini ruban croisé haute fidélité (comme sur image 1)
    const drawInfinityRibbon = () => {
      const cx = 512;
      const cy = 560;
      const rx = 230; // Demi-largeur
      const ry = 150; // Demi-hauteur
      const strokeW = 68;

      // 1. Aura lumineuse violette et magenta
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 45;
      ctx.lineWidth = strokeW + 16;
      ctx.strokeStyle = '#c026d3';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Tracé boucle gauche
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx - 120, cy - ry, cx - rx, cy - ry, cx - rx, cy);
      ctx.bezierCurveTo(cx - rx, cy + ry, cx - 120, cy + ry, cx, cy);
      ctx.stroke();

      // Tracé boucle droite
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx + 120, cy + ry, cx + rx, cy + ry, cx + rx, cy);
      ctx.bezierCurveTo(cx + rx, cy - ry, cx + 120, cy - ry, cx, cy);
      ctx.stroke();

      // 2. Cœur blanc incandescent principal avec croisement en 3D
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 25;
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = '#ffffff';

      // Boucle gauche (passe dessous au centre)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx - 120, cy - ry, cx - rx, cy - ry, cx - rx, cy);
      ctx.bezierCurveTo(cx - rx, cy + ry, cx - 120, cy + ry, cx, cy);
      ctx.stroke();

      // Boucle droite (passe dessus au centre pour l'effet de ruban)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx + 120, cy + ry, cx + rx, cy + ry, cx + rx, cy);
      ctx.bezierCurveTo(cx + rx, cy - ry, cx + 120, cy - ry, cx, cy);
      ctx.stroke();

      // Recouvrement du croisement central (le ruban droit passe nettement par-dessus)
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 45);
      ctx.lineTo(cx + 50, cy - 45);
      ctx.lineWidth = strokeW;
      ctx.stroke();

      // 3. Les sourcils néon au-dessus de chaque boucle (identiques à l'image 1)
      ctx.shadowColor = '#e879f9';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 26;
      ctx.strokeStyle = '#ffffff';

      // Sourcil gauche
      ctx.beginPath();
      ctx.arc(cx - 130, cy - 170, 75, Math.PI * 1.18, Math.PI * 1.82, false);
      ctx.stroke();

      // Sourcil droit
      ctx.beginPath();
      ctx.arc(cx + 130, cy - 170, 75, Math.PI * 1.18, Math.PI * 1.82, false);
      ctx.stroke();
    };

    drawInfinityRibbon();

    const eyeTexture = new THREE.CanvasTexture(canvas);
    eyeTexture.generateMipmaps = true;

    // Matériau néon émissif pour le visage
    const visorMat = new THREE.MeshBasicMaterial({
      map: eyeTexture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false, // Empêche le découpage par le tampon de profondeur
      blending: THREE.NormalBlending
    });

    // Géométrie courbe sphérique épousant parfaitement la surface de la sphère
    // Évite tout enfoncement ou occlusion par la courbure
    const visorWidth = 1.5;
    const visorHeight = 1.1;
    const visorGeo = new THREE.PlaneGeometry(visorWidth, visorHeight, 32, 32);

    const posAttr = visorGeo.attributes.position;
    const sphereR = this.radius * 1.025; // Flotte à 0.025 au-dessus de la sphère

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const sphereY = vy + 0.16; // Décalage vertical du visage
      const distSq = vx * vx + sphereY * sphereY;
      // Z projeté sur la sphère pour être 100% courbe et visible
      const vz = Math.sqrt(Math.max(0.01, sphereR * sphereR - distSq));
      posAttr.setZ(i, vz);
    }
    posAttr.needsUpdate = true;
    visorGeo.computeVertexNormals();

    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.avatarMeshGroup.add(visorMesh);
  }

  createNeonHeart() {
    // Cœur géométrique 3D
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo(x, y + 0.12, x - 0.16, y + 0.28, x - 0.32, y + 0.28);
    heartShape.bezierCurveTo(x - 0.56, y + 0.28, x - 0.56, y, x - 0.56, y);
    heartShape.bezierCurveTo(x - 0.56, y - 0.24, x - 0.28, y - 0.52, x, y - 0.72);
    heartShape.bezierCurveTo(x + 0.28, y - 0.52, x + 0.56, y - 0.24, x + 0.56, y);
    heartShape.bezierCurveTo(x + 0.56, y, x + 0.56, y + 0.28, x + 0.32, y + 0.28);
    heartShape.bezierCurveTo(x + 0.16, y + 0.28, x, y + 0.12, x, y);

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.scale(0.5, 0.5, 0.5);
    heartGeo.center();

    // Matériau blanc éclatant avec émission magenta (fidèle à l'image 1)
    this.heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 3.5,
      roughness: 0.1,
      metalness: 0.2
    });

    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMaterial);
    // Emplacement du cœur sur le torse gauche de la sphère
    this.heartMesh.position.set(0.18, -0.34, 0.96);
    this.avatarMeshGroup.add(this.heartMesh);

    // PointLight vive émise par le cœur
    this.heartLight = new THREE.PointLight(0xff2ea6, 3.8, 18);
    this.heartLight.position.set(0.18, -0.34, 1.08);
    this.avatarMeshGroup.add(this.heartLight);
  }

  createFloorShadow() {
    const shadowGeo = new THREE.CircleGeometry(this.radius * 0.9, 32);
    this.shadowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -this.radius + 0.02;
    this.group.add(this.shadowMesh);
  }

  update(deltaTime, inputX, inputY) {
    if (!this.isAlive) return;

    const pos = this.group.position;

    // --- 1. DÉPLACEMENT LATÉRAL (X) ---
    if (inputX !== 0) {
      pos.x += inputX * this.lateralSpeed * deltaTime;
      pos.x = Math.max(-this.maxX, Math.min(this.maxX, pos.x));
    }

    // --- 2. PHYSIQUE DE VOL (Y) ---
    this.isClimbing = inputY > 0.1;
    this.isDiving = inputY < -0.1;

    let verticalVelocity = 0;

    if (this.isClimbing) {
      const altitudePenalty = (pos.y / this.maxY) * this.gravityAscentDrag;
      const effectiveClimbSpeed = Math.max(4.0, this.verticalSpeed - altitudePenalty);
      verticalVelocity = effectiveClimbSpeed;

      const consumptionRate = 18.0 + (pos.y / this.maxY) * 16.0;
      this.energy = Math.max(0, this.energy - consumptionRate * deltaTime);

      if (this.energy <= 0) {
        verticalVelocity *= 0.2;
      }
    } else if (this.isDiving) {
      verticalVelocity = -this.verticalSpeed * 1.35;
      this.energy = Math.min(this.maxEnergy, this.energy + 22.0 * deltaTime);
    } else {
      if (pos.y > 6.0 && this.energy < 40) {
        verticalVelocity = -3.5;
      }
    }

    pos.y += verticalVelocity * deltaTime;
    pos.y = Math.max(this.minY, Math.min(this.maxY, pos.y));

    // Effet de sol (< 3m)
    if (pos.y <= 3.0) {
      this.energy = Math.min(this.maxEnergy, this.energy + 28.0 * deltaTime);
    }

    // --- 3. DYNAMIQUE DE VITESSE VERS L'AVANT ---
    if (this.isDiving) {
      this.forwardSpeed += 55.0 * deltaTime;
      this.forwardSpeed = Math.min(this.maxDiveSpeed, this.forwardSpeed);
    } else if (this.isClimbing) {
      this.forwardSpeed -= 35.0 * deltaTime;
      this.forwardSpeed = Math.max(this.baseForwardSpeed * 0.75, this.forwardSpeed);
    } else {
      this.forwardSpeed += (this.baseForwardSpeed - this.forwardSpeed) * 3.0 * deltaTime;
    }

    // --- 4. ATTITUDE DE VOL (PITCH, ROLL, YAW) ---
    const targetPitch = inputY * 0.45;
    this.avatarMeshGroup.rotation.x += (targetPitch - this.avatarMeshGroup.rotation.x) * 8.0 * deltaTime;

    const targetRoll = -inputX * 0.45;
    this.avatarMeshGroup.rotation.z += (targetRoll - this.avatarMeshGroup.rotation.z) * 10.0 * deltaTime;

    const targetYaw = -inputX * 0.15;
    this.avatarMeshGroup.rotation.y += (targetYaw - this.avatarMeshGroup.rotation.y) * 6.0 * deltaTime;

    // --- 5. PULSATION DU CŒUR NÉON & AURA ---
    const energyFactor = Math.max(0.1, this.energy / this.maxEnergy);
    const pulseFrequency = 1.0 + energyFactor * 3.2;
    const time = performance.now() * 0.001;
    const heartbeat = Math.pow(Math.sin(time * Math.PI * pulseFrequency), 4);

    const lightIntensity = (1.0 + energyFactor * 3.8) * (0.7 + heartbeat * 0.6);
    this.heartLight.intensity = lightIntensity;
    this.heartMaterial.emissiveIntensity = (1.5 + energyFactor * 3.2) * (0.8 + heartbeat * 0.5);

    const scale = 0.5 * (1.0 + heartbeat * 0.12 * energyFactor);
    this.heartMesh.scale.set(scale, scale, scale);

    // Pulsation discrète du halo néon
    if (this.haloMesh) {
      this.haloMesh.material.opacity = (0.28 + Math.sin(time * 2.0) * 0.1) * energyFactor;
    }

    // --- 6. OMBRE AU SOL ---
    const altitude = pos.y - this.minY;
    const shadowOpacity = Math.max(0.04, 0.35 - (altitude / this.maxY) * 0.32);
    this.shadowMat.opacity = shadowOpacity;
    const shadowScale = 1.0 + (altitude / this.maxY) * 1.5;
    this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);

    // --- 7. Bounding Sphere ---
    this.boundingSphere.center.copy(this.group.position);
  }

  rechargeEnergy(amount = 100) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
    this.heartLight.intensity = 8.0;
    this.heartMaterial.emissiveIntensity = 8.0;
  }

  getBoundingSphere() {
    return this.boundingSphere;
  }

  setVisible(visible) {
    this.avatarMeshGroup.visible = visible;
    this.shadowMesh.visible = visible;
    this.heartLight.visible = visible;
  }

  reset() {
    this.isAlive = true;
    this.energy = this.maxEnergy;
    this.forwardSpeed = this.baseForwardSpeed;
    this.group.position.set(0, this.minY, 0);
    this.avatarMeshGroup.rotation.set(0, 0, 0);
    this.setVisible(true);
  }

  getPosition() {
    return this.group.position;
  }

  getForwardSpeed() {
    return this.forwardSpeed;
  }

  getEnergy() {
    return this.energy;
  }
}
