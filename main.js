import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/**
 * // SOUNDRISE : INFINITY RUN
 * Phase 2 & 3 : Infi & Nity Visuels Haute Fidélité, Bloom Post-Processing & Physique de Vol Glider
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    // DOM HUD
    this.energyBar = document.getElementById('heart-energy-fill');
    this.speedText = document.getElementById('hud-speed');
    this.altitudeText = document.getElementById('hud-altitude');

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initPostProcessing();
    this.initLights();
    this.initInputs();
    this.createInfiniteGrid();
    this.createPlayerInfi();
    this.createHorizonNity();
    this.initResize();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --- 1. SCÈNE & FOND NOIR SPATIAL ---
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020006);
    this.scene.fog = new THREE.FogExp2(0x04010a, 0.005);
  }

  // --- 2. CAMÉRA TROISIÈME PERSONNE ---
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget = new THREE.Vector3(0, 2.0, -16);
    this.camera.lookAt(this.cameraTarget);
  }

  // --- 3. RENDERER WEBGL ---
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
  }

  // --- 4. POST-PROCESSING BLOOM (UNREALBLOOMPASS) ---
  initPostProcessing() {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(this.scene, this.camera);

    // UnrealBloomPass : calibré pour faire resplendir les yeux, le cœur et Nity
    this.bloomPass = new UnrealBloomPass(
      size,
      1.55,  // force du bloom (strength)
      0.65,  // rayon de diffusion (radius)
      0.35   // seuil d'activation (threshold)
    );

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);
  }

  // --- 5. ÉCLAIRAGES NÉON & REFLETS CYBER ---
  initLights() {
    const ambient = new THREE.AmbientLight(0x280540, 1.6);
    this.scene.add(ambient);

    // Rim light violette arrière (halo d'Infi)
    const backRim = new THREE.DirectionalLight(0xbd00ff, 4.0);
    backRim.position.set(0, 8, -10);
    this.scene.add(backRim);

    // Reflet cyan avant-droit (Image 1)
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    cyanLight.position.set(8, 6, 8);
    this.scene.add(cyanLight);

    // Key light magenta avant-gauche
    const magentaLight = new THREE.DirectionalLight(0xff2ea6, 3.2);
    magentaLight.position.set(-8, 12, 8);
    this.scene.add(magentaLight);
  }

  // --- 6. SOL INFINI FILAIRE CYAN & VIOLET ---
  createInfiniteGrid() {
    this.gridGroup = new THREE.Group();
    this.gridSections = [];
    this.trackWidth = 84;
    this.sectionLength = 240;
    this.baseForwardSpeed = 68.0;
    this.currentForwardSpeed = 68.0;

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.72
    });

    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x030108,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    const railMaterial = new THREE.LineBasicMaterial({
      color: 0xbd00ff,
      linewidth: 2
    });

    for (let i = 0; i < 2; i++) {
      const section = new THREE.Group();
      const geom = new THREE.PlaneGeometry(this.trackWidth, this.sectionLength, 42, 120);

      const baseMesh = new THREE.Mesh(geom, baseMaterial);
      baseMesh.rotation.x = -Math.PI / 2;
      section.add(baseMesh);

      const wireMesh = new THREE.Mesh(geom, wireMaterial);
      wireMesh.rotation.x = -Math.PI / 2;
      wireMesh.position.y = 0.01;
      section.add(wireMesh);

      [-16, 16].forEach(x => {
        const halfL = this.sectionLength / 2;
        const points = [
          new THREE.Vector3(x, 0.02, -halfL),
          new THREE.Vector3(x, 0.02, halfL)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const rail = new THREE.Line(lineGeo, railMaterial);
        section.add(rail);
      });

      section.position.z = -i * this.sectionLength;
      this.gridSections.push(section);
      this.gridGroup.add(section);
    }

    this.scene.add(this.gridGroup);
  }

  // --- 7. MODÉLISATION D'INFI (IMAGE 1 LORE) ---
  createPlayerInfi() {
    this.playerGroup = new THREE.Group();
    this.avatarMesh = new THREE.Group();
    this.playerGroup.add(this.avatarMesh);

    // A. Tête : sphère en verre/chrome aux reflets irisés violets
    const headRadius = 1.0;
    const headGeo = new THREE.SphereGeometry(headRadius, 64, 64);
    this.headMat = new THREE.MeshPhysicalMaterial({
      color: 0x140226,
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      emissive: 0x2c0544,
      emissiveIntensity: 0.45,
      reflectivity: 1.0
    });
    this.headMesh = new THREE.Mesh(headGeo, this.headMat);
    this.avatarMesh.add(this.headMesh);

    // Halo néon violet externe
    const haloGeo = new THREE.SphereGeometry(headRadius * 1.07, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.avatarMesh.add(this.haloMesh);

    // B. Torse humanoïde minimaliste sombre et hautement réfléchissant
    this.createHumanoidTorso();

    // C. Visage : symbole infini ruban 3D émissif blanc/violet + sourcils
    this.createInfiVisor(headRadius);

    // D. Cœur géométrique émissif blanc/rose sur la poitrine gauche
    this.createInfiHeart();

    // E. Ombre de contact au sol dynamique
    const shadowGeo = new THREE.CircleGeometry(headRadius * 0.95, 32);
    this.shadowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -0.55;
    this.playerGroup.add(this.shadowMesh);

    // Position initiale au sol
    this.minAltitude = 1.3;
    this.maxAltitude = 22.0;
    this.playerGroup.position.set(0, this.minAltitude, 0);
    this.scene.add(this.playerGroup);

    // Variables de dynamique de vol
    this.energy = 100.0;
    this.maxEnergy = 100.0;
    this.lateralSpeed = 22.0;
    this.verticalSpeed = 16.0;
    this.maxX = 15.0;
  }

  createHumanoidTorso() {
    const torsoGroup = new THREE.Group();

    // Cou cylindrique fin reliant la tête
    const neckGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.4, 32);
    const torsoMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d0218,
      metalness: 0.96,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const neck = new THREE.Mesh(neckGeo, torsoMat);
    neck.position.set(0, -0.95, 0);
    torsoGroup.add(neck);

    // Buste humanoïde stylisé (forme triangulaire profilée avec épaules biseautées, Image 1)
    const chestGeo = new THREE.ConeGeometry(0.9, 1.3, 4);
    const chest = new THREE.Mesh(chestGeo, torsoMat);
    chest.rotation.x = Math.PI; // Pointe vers le bas
    chest.rotation.y = Math.PI / 4; // Orientation des facettes
    chest.position.set(0, -1.35, 0);
    torsoGroup.add(chest);

    // Épaules profilées géométriques
    const shoulderGeo = new THREE.BoxGeometry(1.6, 0.28, 0.6);
    const shoulders = new THREE.Mesh(shoulderGeo, torsoMat);
    shoulders.position.set(0, -1.08, 0);
    torsoGroup.add(shoulders);

    this.avatarMesh.add(torsoGroup);
  }

  createInfiVisor(headRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const cx = 512, cy = 560, rx = 230, ry = 150, strokeW = 68;

    // 1. Halo violet/magenta
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

    // 2. Cœur blanc néon avec croisement 3D
    ctx.shadowColor = '#a855f7';
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

    // Recouvrement net du croisement (ruban droit par-dessus)
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 42);
    ctx.lineTo(cx + 48, cy - 42);
    ctx.stroke();

    // 3. Sourcils expressifs
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 26;
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

    const visorGeo = new THREE.PlaneGeometry(1.5, 1.1, 32, 32);
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

    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.avatarMesh.add(visorMesh);
  }

  createInfiHeart() {
    // Cœur géométrique 3D blanc/rose sur la poitrine gauche
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

    // Matériau émissif blanc/rose intense (faisant réagir l'UnrealBloomPass)
    this.heartMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 4.2,
      roughness: 0.1
    });

    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMat);
    // Positionné sur la poitrine gauche d'Infi (Image 1)
    this.heartMesh.position.set(0.24, -1.18, 0.38);
    this.avatarMesh.add(this.heartMesh);

    // Lumière ponctuelle vive émise par le cœur
    this.heartLight = new THREE.PointLight(0xff2ea6, 4.0, 16);
    this.heartLight.position.set(0.24, -1.18, 0.52);
    this.avatarMesh.add(this.heartLight);
  }

  // --- 8. CRÉATION DE NITY (L'HORIZON LORE IMAGE 2) ---
  createHorizonNity() {
    this.nityGroup = new THREE.Group();

    // A. Cône d'énergie vertical élancé (Image 2)
    const coneRadius = 14;
    const coneHeight = 36;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32);
    const coneMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c163b,
      emissive: 0x0066ff,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(0, coneHeight / 2, 0);
    this.nityGroup.add(coneMesh);

    // B. Sphère céleste lumineuse en lévitation au sommet
    const sphereRadius = 14;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x120835,
      emissive: 0x7928ca,
      emissiveIntensity: 1.8,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0
    });
    this.nitySphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.nitySphere.position.set(0, coneHeight + sphereRadius + 5, 0);
    this.nityGroup.add(this.nitySphere);

    // C. Halos néon pulsants enveloppants (Bloom rayonnant)
    const haloGeo = new THREE.SphereGeometry(sphereRadius * 1.2, 32, 32);
    this.nityHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const nityHalo = new THREE.Mesh(haloGeo, this.nityHaloMat);
    this.nitySphere.add(nityHalo);

    // Anneau d'énergie orbital
    const ringGeo = new THREE.TorusGeometry(sphereRadius * 1.5, 0.6, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.nityRing = new THREE.Mesh(ringGeo, ringMat);
    this.nityRing.rotation.x = Math.PI / 2.8;
    this.nitySphere.add(this.nityRing);

    // Balise lumineuse céleste
    const beaconLight = new THREE.PointLight(0x00f0ff, 5.0, 500);
    beaconLight.position.copy(this.nitySphere.position);
    this.nityGroup.add(beaconLight);

    // Positionnement lointain à l'horizon (z = -320)
    this.nityGroup.position.set(0, 8, -320);
    this.scene.add(this.nityGroup);
  }

  // --- 9. CONTRÔLES 3D (ZQSD / FLÈCHES / SOURIS / TOUCH) ---
  initInputs() {
    this.inputAxisX = 0; // -1 (gauche) à +1 (droite)
    this.inputAxisY = 0; // -1 (piqué) à +1 (cabré/montée)

    this.keyLeft = false;
    this.keyRight = false;
    this.keyUp = false;
    this.keyDown = false;

    this.isPointerDown = false;
    this.pointerStartX = 0;
    this.pointerStartY = 0;

    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = true;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = true;
      this.updateInputAxes();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = false;
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) this.keyUp = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keyDown = false;
      this.updateInputAxes();
    });

    window.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        // Drag 2D
        const diffX = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.2);
        const diffY = (this.pointerStartY - e.clientY) / (window.innerHeight * 0.2); // Vers le haut = positif
        this.inputAxisX = Math.max(-1, Math.min(1, diffX));
        this.inputAxisY = Math.max(-1, Math.min(1, diffY));
      } else {
        // Suivi curseur libre
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -((e.clientY / window.innerHeight) * 2 - 1);
        this.inputAxisX = Math.abs(normX) > 0.1 ? Math.sign(normX) * ((Math.abs(normX) - 0.1) / 0.9) : 0;
        this.inputAxisY = Math.abs(normY) > 0.12 ? Math.sign(normY) * ((Math.abs(normY) - 0.12) / 0.88) : 0;
      }
    });

    const resetPointer = () => {
      this.isPointerDown = false;
      this.updateInputAxes();
    };
    window.addEventListener('pointerup', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
  }

  updateInputAxes() {
    // Latéral (X)
    if (this.keyLeft && !this.keyRight) this.inputAxisX = -1;
    else if (this.keyRight && !this.keyLeft) this.inputAxisX = 1;
    else if (!this.keyLeft && !this.keyRight && !this.isPointerDown) this.inputAxisX = 0;

    // Vertical (Y - Vol)
    if (this.keyUp && !this.keyDown) this.inputAxisY = 1;
    else if (this.keyDown && !this.keyUp) this.inputAxisY = -1;
    else if (!this.keyUp && !this.keyDown && !this.isPointerDown) this.inputAxisY = 0;
  }

  // --- 10. GESTION DU REDIMENSIONNEMENT ---
  initResize() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.composer.setSize(width, height);
      this.bloomPass.setSize(width, height);
    });
  }

  // --- 11. BOUCLE PRINCIPALE & PHYSIQUE DE GLIDER ---
  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = performance.now() * 0.001;

    // --- A. DÉPLACEMENT LATÉRAL & ROULIS (ROLL) ---
    if (this.inputAxisX !== 0) {
      this.playerGroup.position.x += this.inputAxisX * this.lateralSpeed * dt;
      this.playerGroup.position.x = Math.max(-this.maxX, Math.min(this.maxX, this.playerGroup.position.x));
    }

    // Inclinaison latérale (roll)
    const targetRoll = -this.inputAxisX * 0.45;
    this.avatarMesh.rotation.z += (targetRoll - this.avatarMesh.rotation.z) * 10.0 * dt;

    // --- B. PHYSIQUE DE VOL (GLIDER) & ÉNERGIE DU CŒUR ---
    const pos = this.playerGroup.position;
    const isClimbing = this.inputAxisY > 0.1;
    const isDiving = this.inputAxisY < -0.1;

    let verticalVelocity = 0;

    if (isClimbing) {
      // Montée : Infi consomme l'énergie de son cœur
      if (this.energy > 0) {
        // Perte progressive de la vitesse d'ascension si l'énergie faiblit ou avec l'altitude
        const energyFactor = this.energy / this.maxEnergy;
        const altitudePenalty = (pos.y / this.maxAltitude) * 6.0;
        const effectiveClimbSpeed = Math.max(3.0, (this.verticalSpeed - altitudePenalty) * energyFactor);

        verticalVelocity = effectiveClimbSpeed;
        const consumption = 20.0 + (pos.y / this.maxAltitude) * 15.0;
        this.energy = Math.max(0, this.energy - consumption * dt);
      } else {
        // Énergie épuisée : impossible de monter, descente automatique
        verticalVelocity = -4.5;
      }
    } else if (isDiving) {
      // Piqué : Infi accélère vers le bas et recharge son énergie
      verticalVelocity = -this.verticalSpeed * 1.35;
      this.energy = Math.min(this.maxEnergy, this.energy + 24.0 * dt);
      // Accélération vers l'avant en piqué
      this.currentForwardSpeed = Math.min(115.0, this.currentForwardSpeed + 50.0 * dt);
    } else {
      // Vol stationnaire / neutre : retour vers la vitesse nominale
      this.currentForwardSpeed += (this.baseForwardSpeed - this.currentForwardSpeed) * 3.0 * dt;

      // Si l'énergie est à 0 et qu'on est en altitude, descente automatique vers le sol
      if (this.energy <= 0 && pos.y > this.minAltitude) {
        verticalVelocity = -5.0;
      }
    }

    // Vol au ras du sol (< 2.2m) : recharge douce continue (effet de sol)
    if (pos.y <= 2.2) {
      this.energy = Math.min(this.maxEnergy, this.energy + 28.0 * dt);
    }

    // Application du déplacement vertical
    pos.y += verticalVelocity * dt;
    pos.y = Math.max(this.minAltitude, Math.min(this.maxAltitude, pos.y));

    // Tangage (Pitch) : piqué vers le bas ou cabré vers le haut
    const targetPitch = this.inputAxisY * 0.42;
    this.avatarMesh.rotation.x += (targetPitch - this.avatarMesh.rotation.x) * 8.0 * dt;

    // --- C. PULSATION DU CŒUR LIÉE À L'ÉNERGIE D'INFI ---
    const energyRatio = Math.max(0.05, this.energy / this.maxEnergy);
    // Fréquence rapide à 100%, lente quand l'énergie faiblit
    const pulseFrequency = 1.0 + energyRatio * 3.5;
    const heartbeat = Math.pow(Math.sin(time * Math.PI * pulseFrequency), 4);

    // Intensité lumineuse et émissive dynamique
    const lightIntensity = (1.0 + energyRatio * 4.2) * (0.6 + heartbeat * 0.7);
    this.heartLight.intensity = lightIntensity;
    this.heartMat.emissiveIntensity = (1.5 + energyRatio * 3.5) * (0.7 + heartbeat * 0.6);

    const heartScale = 0.42 * (1.0 + heartbeat * 0.15 * energyRatio);
    this.heartMesh.scale.set(heartScale, heartScale, heartScale);

    // Ombre dynamique selon l'altitude
    const altitude = pos.y - this.minAltitude;
    this.shadowMat.opacity = Math.max(0.04, 0.35 - (altitude / this.maxAltitude) * 0.3);
    const shadowScale = 1.0 + (altitude / this.maxAltitude) * 1.6;
    this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);

    // --- D. DÉFILEMENT DE LA GRILLE FILAIRE ---
    const deltaZ = this.currentForwardSpeed * dt;
    for (let i = 0; i < this.gridSections.length; i++) {
      const section = this.gridSections[i];
      section.position.z += deltaZ;
      if (section.position.z >= this.sectionLength) {
        section.position.z -= this.sectionLength * 2;
      }
    }

    // --- E. ANIMATION DE NITY (OSCILLATION ET PULSATION DU HALO) ---
    if (this.nityGroup) {
      this.nityGroup.position.y = 8 + Math.sin(time * 1.1) * 1.8;
      this.nitySphere.rotation.y += 0.3 * dt;
      this.nityRing.rotation.z += 0.6 * dt;
      this.nityHaloMat.opacity = 0.35 + Math.sin(time * 2.5) * 0.15;
    }

    // --- F. SUIVI DE CAMÉRA CINÉMATIQUE 3E PERSONNE EN X ET Y ---
    const targetCamX = pos.x * 0.35;
    const targetCamY = Math.max(4.0, pos.y + 3.2);
    const targetCamZ = pos.z + 9.5;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 6.0 * dt;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 5.0 * dt;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 5.0 * dt;

    this.cameraTarget.set(pos.x * 0.2, Math.max(1.8, pos.y * 0.6), -16);
    this.camera.lookAt(this.cameraTarget);

    // --- G. MISE À JOUR DU HUD ---
    this.updateHUD(this.energy, this.currentForwardSpeed, pos.y);

    // --- H. RENDU AVEC POST-PROCESSING BLOOM ---
    this.composer.render();
  }

  updateHUD(energy, speed, altitude) {
    if (this.energyBar) {
      this.energyBar.style.width = `${Math.max(0, Math.min(100, energy))}%`;
      if (energy < 25) {
        this.energyBar.classList.add('critical');
      } else {
        this.energyBar.classList.remove('critical');
      }
    }

    if (this.speedText) {
      this.speedText.textContent = `${Math.round(speed * 3.6)} KM/H`;
    }

    if (this.altitudeText) {
      this.altitudeText.textContent = `${Math.round(altitude * 10)} M`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
