import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.radius = 1.0;

    // Limites de vol
    this.maxX = 16.0;
    this.minY = 1.0;  // Altitude minimale (ras du sol)
    this.maxY = 22.0; // Altitude maximale

    // Vitesses et dynamiques de planeur (Glider physics)
    this.lateralSpeed = 22.0;
    this.verticalSpeed = 16.0;
    this.baseForwardSpeed = 65.0;
    this.forwardSpeed = 65.0;
    this.maxDiveSpeed = 115.0;
    this.gravityAscentDrag = 7.5;

    // Système d'énergie du Cœur
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
    this.createVisorMask();
    this.createNeonHeart();
    this.createFloorShadow();

    this.group.position.set(0, this.minY, 0);
    this.scene.add(this.group);
  }

  createMetallicBody() {
    const bodyGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1d032f,
      metalness: 0.96,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      emissive: 0x30054c,
      emissiveIntensity: 0.35,
      reflectivity: 1.0
    });

    this.bodyMesh = new THREE.Mesh(bodyGeo, this.bodyMaterial);
    this.avatarMeshGroup.add(this.bodyMesh);
  }

  createVisorMask() {
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 512;
    eyeCanvas.height = 256;
    const ctx = eyeCanvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 256);
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 18;
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';

    // Infini
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const a = 120;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = 256 + (a * Math.sqrt(2) * Math.cos(t)) / denom;
      const y = 145 + (a * Math.sqrt(2) * Math.sin(t) * Math.cos(t)) / denom;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Sourcils néon
    ctx.beginPath();
    ctx.arc(190, 85, 45, Math.PI * 1.15, Math.PI * 1.85, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(322, 85, 45, Math.PI * 1.15, Math.PI * 1.85, false);
    ctx.stroke();

    const eyeTexture = new THREE.CanvasTexture(eyeCanvas);
    const eyeMat = new THREE.MeshBasicMaterial({
      map: eyeTexture,
      transparent: true,
      opacity: 0.95
    });

    const visorGeo = new THREE.PlaneGeometry(1.3, 0.65);
    const visorMesh = new THREE.Mesh(visorGeo, eyeMat);
    visorMesh.position.set(0, 0.18, 0.96);
    this.avatarMeshGroup.add(visorMesh);
  }

  createNeonHeart() {
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

    this.heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 3.2,
      roughness: 0.1,
      metalness: 0.2
    });

    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMaterial);
    this.heartMesh.position.set(0.18, -0.32, 0.94);
    this.avatarMeshGroup.add(this.heartMesh);

    this.heartLight = new THREE.PointLight(0xff2ea6, 3.5, 18);
    this.heartLight.position.set(0.18, -0.32, 1.05);
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

    // --- 2. PHYSIQUE DE VOL ET GLIDER (Y) ---
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

    // --- 5. PULSATION DU CŒUR NÉON ---
    const energyFactor = Math.max(0.1, this.energy / this.maxEnergy);
    const pulseFrequency = 1.0 + energyFactor * 3.2;
    const time = performance.now() * 0.001;
    const heartbeat = Math.pow(Math.sin(time * Math.PI * pulseFrequency), 4);

    const lightIntensity = (1.0 + energyFactor * 3.5) * (0.7 + heartbeat * 0.6);
    this.heartLight.intensity = lightIntensity;
    this.heartMaterial.emissiveIntensity = (1.5 + energyFactor * 3.0) * (0.8 + heartbeat * 0.5);

    const scale = 0.5 * (1.0 + heartbeat * 0.12 * energyFactor);
    this.heartMesh.scale.set(scale, scale, scale);

    // --- 6. OMBRE AU SOL ---
    const altitude = pos.y - this.minY;
    const shadowOpacity = Math.max(0.04, 0.35 - (altitude / this.maxY) * 0.32);
    this.shadowMat.opacity = shadowOpacity;
    const shadowScale = 1.0 + (altitude / this.maxY) * 1.5;
    this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);

    // --- 7. MISE À JOUR DE LA SPHÈRE DE COLLISION ---
    this.boundingSphere.center.copy(this.group.position);
  }

  rechargeEnergy(amount = 100) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
    // Flash de surtension du cœur
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
