import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/**
 * // SOUNDRISE : INFINITY RUN
 * Architecture Complète : Moteur 3D, Post-Processing Bloom, Audio Tone.js,
 * 8 Cycles d'OodaïSound, Obstacles Procéduraux, Fragments d'Infini et Physique Glider.
 */

// Données des 8 Cycles de l'œuvre "Soundrise : Infinity"
const CYCLES = [
  { id: 1, name: "ÉVEIL", bpm: 128, primary: 0x00f0ff, secondary: 0xbd00ff, fog: 0x050114, desc: "Cyan & Violet • 128 BPM" },
  { id: 2, name: "CHUTE", bpm: 134, primary: 0xa855f7, secondary: 0xec4899, fog: 0x0c0116, desc: "Violet & Pourpre • 134 BPM" },
  { id: 3, name: "CHAOS", bpm: 142, primary: 0xff003c, secondary: 0xff7700, fog: 0x160204, desc: "Rouge & Braise • 142 BPM" },
  { id: 4, name: "AMBITION", bpm: 130, primary: 0xffb703, secondary: 0xfb8500, fog: 0x160b02, desc: "Or & Ambre • 130 BPM" },
  { id: 5, name: "RENAISSANCE", bpm: 136, primary: 0x00ff88, secondary: 0x00b4d8, fog: 0x01160a, desc: "Émeraude & Turquoise • 136 BPM" },
  { id: 6, name: "ZÉNITH", bpm: 140, primary: 0x38bdf8, secondary: 0x6366f1, fog: 0x030a1c, desc: "Bleu Givre & Indigo • 140 BPM" },
  { id: 7, name: "NÉANT", bpm: 125, primary: 0xc084fc, secondary: 0xe2e8f0, fog: 0x020108, desc: "Violet Sombre & Argent • 125 BPM" },
  { id: 8, name: "INFINI", bpm: 146, primary: 0xffffff, secondary: 0xfef08a, fog: 0x0e0a20, desc: "Blanc Céleste & Or Divin • 146 BPM" }
];

class SoundriseGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    // États de jeu
    this.STATE_PLAYING = 'PLAYING';
    this.STATE_DYING = 'DYING';
    this.STATE_GAMEOVER = 'GAMEOVER';
    this.state = this.STATE_PLAYING;

    // Progression des 8 Cycles
    this.currentCycleIndex = 0;
    this.currentCycle = CYCLES[0];

    // Stats de vol
    this.distance = 0;
    this.maxSpeed = 0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.boostTimer = 0;

    // Éléments du DOM
    this.initDOMElements();

    // Moteur 3D Three.js & Post-Processing
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initPostProcessing();
    this.initLights();
    this.initInputs();

    // Entités du monde
    this.createInfiniteGrid();
    this.createInfiPlayer();
    this.createNityBeacon();
    this.initObstacles();
    this.initDislocationFX();

    // Moteur Audio Tone.js & Chargeur des 8 Cycles
    this.initAudioEngine();

    // Événements d'interface
    this.initUIEvents();
    this.initResize();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --- 1. DOM HUD & MODALS ---
  initDOMElements() {
    this.energyBar = document.getElementById('heart-energy-fill');
    this.speedText = document.getElementById('hud-speed');
    this.altitudeText = document.getElementById('hud-altitude');
    this.distanceText = document.getElementById('hud-distance');
    this.cycleNameText = document.getElementById('hud-cycle-name');
    this.neonAccentTitle = document.getElementById('neon-accent-title');

    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioLabel = document.getElementById('audio-label');

    this.audioModeBadge = document.getElementById('audio-mode-badge');
    this.audioTrackTitle = document.getElementById('audio-track-title');
    this.freqBarBass = document.getElementById('freq-bar-bass');
    this.freqBarMid = document.getElementById('freq-bar-mid');
    this.freqBarTreble = document.getElementById('freq-bar-treble');

    this.cycleToast = document.getElementById('cycle-toast');
    this.cycleToastName = document.getElementById('cycle-toast-name');
    this.cycleToastDesc = document.getElementById('cycle-toast-desc');

    this.btnPrevCycle = document.getElementById('btn-prev-cycle');
    this.btnNextCycle = document.getElementById('btn-next-cycle');

    this.speedBoostFX = document.getElementById('speed-boost-fx');

    this.gameOverModal = document.getElementById('game-over-modal');
    this.deathReasonText = document.getElementById('death-reason');
    this.finalDistanceText = document.getElementById('final-distance');
    this.finalSpeedText = document.getElementById('final-speed');
    this.btnRestart = document.getElementById('btn-restart');
    this.modalGlitchBar = document.getElementById('modal-glitch-bar');
  }

  // --- 2. SCÈNE & CAMÉRA ---
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentCycle.fog);
    this.scene.fog = new THREE.FogExp2(this.currentCycle.fog, 0.0052);
  }

  initCamera() {
    this.baseFOV = 62;
    this.camera = new THREE.PerspectiveCamera(
      this.baseFOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget = new THREE.Vector3(0, 2.0, -16);
    this.camera.lookAt(this.cameraTarget);
  }

  // --- 3. RENDERER & POST-PROCESSING UNREALBLOOMPASS ---
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

  initPostProcessing() {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(size, 1.6, 0.65, 0.32);
    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);
  }

  // --- 4. ÉCLAIRAGES DYNAMIQUES DU CYCLE ---
  initLights() {
    this.ambientLight = new THREE.AmbientLight(this.currentCycle.secondary, 1.6);
    this.scene.add(this.ambientLight);

    this.backRimLight = new THREE.DirectionalLight(this.currentCycle.secondary, 4.2);
    this.backRimLight.position.set(0, 8, -10);
    this.scene.add(this.backRimLight);

    this.keyLight = new THREE.DirectionalLight(this.currentCycle.primary, 3.4);
    this.keyLight.position.set(8, 6, 8);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xff007f, 2.8);
    this.fillLight.position.set(-8, 12, 8);
    this.scene.add(this.fillLight);
  }

  // --- 5. SOL INFINI FILAIRE CYBER-BAROQUE ---
  createInfiniteGrid() {
    this.gridGroup = new THREE.Group();
    this.gridSections = [];
    this.trackWidth = 84;
    this.sectionLength = 240;

    this.gridWireMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.72
    });

    this.gridBaseMat = new THREE.MeshBasicMaterial({
      color: 0x020006,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    this.gridRailMat = new THREE.LineBasicMaterial({
      color: this.currentCycle.secondary,
      linewidth: 2
    });

    for (let i = 0; i < 2; i++) {
      const section = new THREE.Group();
      const geom = new THREE.PlaneGeometry(this.trackWidth, this.sectionLength, 42, 120);

      const baseMesh = new THREE.Mesh(geom, this.gridBaseMat);
      baseMesh.rotation.x = -Math.PI / 2;
      section.add(baseMesh);

      const wireMesh = new THREE.Mesh(geom, this.gridWireMat);
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
        const rail = new THREE.Line(lineGeo, this.gridRailMat);
        section.add(rail);
      });

      section.position.z = -i * this.sectionLength;
      this.gridSections.push(section);
      this.gridGroup.add(section);
    }

    this.scene.add(this.gridGroup);
  }

  // --- 6. AVATAR INFI (IMAGE 1 LORE) ---
  createInfiPlayer() {
    this.playerGroup = new THREE.Group();
    this.avatarMesh = new THREE.Group();
    this.playerGroup.add(this.avatarMesh);

    const headRadius = 1.0;
    const headGeo = new THREE.SphereGeometry(headRadius, 64, 64);
    this.headMat = new THREE.MeshPhysicalMaterial({
      color: 0x120224,
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      emissive: 0x240438,
      emissiveIntensity: 0.45,
      reflectivity: 1.0
    });
    this.headMesh = new THREE.Mesh(headGeo, this.headMat);
    this.avatarMesh.add(this.headMesh);

    // Halo néon externe autour de la tête
    const haloGeo = new THREE.SphereGeometry(headRadius * 1.07, 48, 48);
    this.playerHaloMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.secondary,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.playerHalo = new THREE.Mesh(haloGeo, this.playerHaloMat);
    this.avatarMesh.add(this.playerHalo);

    // Torse humanoïde minimaliste
    const torsoMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d0218,
      metalness: 0.96,
      roughness: 0.1,
      clearcoat: 1.0
    });
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.4, 32), torsoMat);
    neck.position.set(0, -0.95, 0);
    this.avatarMesh.add(neck);

    const chest = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.3, 4), torsoMat);
    chest.rotation.x = Math.PI;
    chest.rotation.y = Math.PI / 4;
    chest.position.set(0, -1.35, 0);
    this.avatarMesh.add(chest);

    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 0.6), torsoMat);
    shoulders.position.set(0, -1.08, 0);
    this.avatarMesh.add(shoulders);

    // Visage infini 3D courbe épousant la tête (aucun découpage)
    this.createInfiVisor(headRadius);

    // Cœur géométrique blanc/rose sur la poitrine gauche
    this.createInfiHeart();

    // Ombre de contact au sol
    const shadowGeo = new THREE.CircleGeometry(headRadius * 0.95, 32);
    this.shadowMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.primary,
      transparent: true,
      opacity: 0.35
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -0.55;
    this.playerGroup.add(this.shadowMesh);

    this.minAltitude = 1.3;
    this.maxAltitude = 22.0;
    this.playerGroup.position.set(0, this.minAltitude, 0);
    this.scene.add(this.playerGroup);

    // Physique de vol
    this.energy = 100.0;
    this.maxEnergy = 100.0;
    this.lateralSpeed = 22.0;
    this.verticalSpeed = 16.0;
    this.maxX = 15.0;
    this.playerRadius = headRadius;

    // Bounding sphere
    this.playerBoundingSphere = new THREE.Sphere(new THREE.Vector3(), headRadius * 0.82);
  }

  createInfiVisor(headRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512, cy = 560, rx = 230, ry = 150, strokeW = 68;

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

    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 42);
    ctx.lineTo(cx + 48, cy - 42);
    ctx.stroke();

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
    this.avatarMesh.add(this.heartMesh);

    this.heartLight = new THREE.PointLight(0xff2ea6, 4.0, 16);
    this.heartLight.position.set(0.24, -1.18, 0.52);
    this.avatarMesh.add(this.heartLight);
  }

  // --- 7. CIBLE NITY À L'HORIZON (IMAGE 2 LORE) ---
  createNityBeacon() {
    this.nityGroup = new THREE.Group();

    const coneRadius = 14;
    const coneHeight = 36;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32);
    this.nityConeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c163b,
      emissive: this.currentCycle.secondary,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });
    const coneMesh = new THREE.Mesh(coneGeo, this.nityConeMat);
    coneMesh.position.set(0, coneHeight / 2, 0);
    this.nityGroup.add(coneMesh);

    const sphereRadius = 14;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    this.nitySphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x120835,
      emissive: this.currentCycle.primary,
      emissiveIntensity: 1.8,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0
    });
    this.nitySphere = new THREE.Mesh(sphereGeo, this.nitySphereMat);
    this.nitySphere.position.set(0, coneHeight + sphereRadius + 5, 0);
    this.nityGroup.add(this.nitySphere);

    // Halo céleste néon rayonnant
    const haloGeo = new THREE.SphereGeometry(sphereRadius * 1.25, 32, 32);
    this.nityHaloMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.primary,
      transparent: true,
      opacity: 0.48,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.nityHalo = new THREE.Mesh(haloGeo, this.nityHaloMat);
    this.nitySphere.add(this.nityHalo);

    // Anneau d'énergie orbital
    const ringGeo = new THREE.TorusGeometry(sphereRadius * 1.5, 0.6, 16, 64);
    this.nityRingMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.secondary,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.nityRing = new THREE.Mesh(ringGeo, this.nityRingMat);
    this.nityRing.rotation.x = Math.PI / 2.8;
    this.nitySphere.add(this.nityRing);

    this.nityBeaconLight = new THREE.PointLight(this.currentCycle.primary, 5.5, 500);
    this.nityBeaconLight.position.copy(this.nitySphere.position);
    this.nityGroup.add(this.nityBeaconLight);

    this.nityGroup.position.set(0, 8, -320);
    this.scene.add(this.nityGroup);
  }

  // --- 8. OBSTACLES PROCÉDURAUX & FRAGMENTS D'INFINI ---
  initObstacles() {
    this.obstacles = [];
    this.crystals = [];
    this.spawnDistance = -280;
    this.despawnZ = 16;
    this.obstacleTimer = 0;
    this.crystalTimer = 0;

    // Matériaux partagés
    this.monolithMat = new THREE.MeshStandardMaterial({
      color: 0x0a0316,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x1f063b
    });
    this.monolithWireMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    this.portalWireMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    this.barrierLaserMat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    // Cristal (Fragment d'Infini)
    this.crystalCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.crystalGlowMat = new THREE.MeshBasicMaterial({
      color: this.currentCycle.primary,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
  }

  spawnMonolith(x) {
    const group = new THREE.Group();
    const width = 3.4;
    const height = 18 + Math.random() * 12;
    const geo = new THREE.BoxGeometry(width, height, width);

    const base = new THREE.Mesh(geo, this.monolithMat);
    const wire = new THREE.Mesh(geo, this.monolithWireMat);
    group.add(base);
    group.add(wire);

    group.position.set(x, height / 2, this.spawnDistance);

    const bbox = new THREE.Box3().setFromObject(group);
    const obj = { type: 'monolith', mesh: group, bbox: bbox };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  spawnBrokenPortal(x, y) {
    const group = new THREE.Group();
    const pillarWidth = 1.8;
    const archWidth = 13.0;
    const archHeight = 15.0;

    // Pilier gauche
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth, archHeight, pillarWidth), this.portalWireMat);
    leftPillar.position.set(-archWidth / 2, archHeight / 2, 0);
    group.add(leftPillar);

    // Pilier droit (fragmenté)
    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth, archHeight * 0.7, pillarWidth), this.portalWireMat);
    rightPillar.position.set(archWidth / 2, (archHeight * 0.7) / 2, 0);
    group.add(rightPillar);

    // Fragment flottant brisé
    const brokenChunk = new THREE.Mesh(new THREE.BoxGeometry(pillarWidth * 1.2, 3.5, pillarWidth * 1.2), this.portalWireMat);
    brokenChunk.position.set(archWidth / 2 + 1.2, archHeight * 0.85, (Math.random() - 0.5) * 3);
    brokenChunk.rotation.z = 0.35;
    group.add(brokenChunk);

    // Linteau supérieur brisé
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(archWidth * 0.65, pillarWidth, pillarWidth), this.portalWireMat);
    topBar.position.set(-2, archHeight, 0);
    group.add(topBar);

    group.position.set(x, y, this.spawnDistance);

    const obj = {
      type: 'portal',
      mesh: group,
      subBoxes: [
        { mesh: leftPillar, box: new THREE.Box3() },
        { mesh: rightPillar, box: new THREE.Box3() },
        { mesh: brokenChunk, box: new THREE.Box3() },
        { mesh: topBar, box: new THREE.Box3() }
      ]
    };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  spawnLaserBarrier(y) {
    const group = new THREE.Group();
    const width = 28.0;
    const height = 4.5;
    const geo = new THREE.PlaneGeometry(width, height);

    const mesh = new THREE.Mesh(geo, this.barrierLaserMat);
    group.add(mesh);

    // Cadre filaire
    const frameGeo = new THREE.BoxGeometry(width, height, 0.4);
    const frameWire = new THREE.Mesh(frameGeo, this.monolithWireMat);
    group.add(frameWire);

    group.position.set((Math.random() - 0.5) * 6, y, this.spawnDistance);

    const bbox = new THREE.Box3().setFromObject(group);
    const obj = { type: 'barrier', mesh: group, bbox: bbox };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  spawnCrystal(x, y) {
    const group = new THREE.Group();

    // Fragment d'Infini : Octaèdre taillé en diamant néon
    const geo = new THREE.OctahedronGeometry(0.7, 0);
    const core = new THREE.Mesh(geo, this.crystalCoreMat);
    group.add(core);

    const aura = new THREE.Mesh(new THREE.OctahedronGeometry(1.05, 0), this.crystalGlowMat);
    group.add(aura);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.05, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = Math.PI / 2.5;
    group.add(ring);

    group.position.set(x, y, this.spawnDistance);

    const obj = {
      mesh: group,
      ring: ring,
      radius: 1.2,
      collected: false
    };

    this.scene.add(group);
    this.crystals.push(obj);
  }

  // --- 9. DISLOCATION EN PARTICULES (CRASH VISUEL) ---
  initDislocationFX() {
    this.particleCount = 320;
    const geo = new THREE.BufferGeometry();
    this.disPos = new Float32Array(this.particleCount * 3);
    this.disVel = new Float32Array(this.particleCount * 3);
    this.disCol = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      this.disPos[i * 3 + 1] = -100;
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
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.disParticles = new THREE.Points(geo, this.disMat);
    this.scene.add(this.disParticles);
    this.isDislocating = false;
  }

  triggerCrash(reason) {
    if (this.state !== this.STATE_PLAYING) return;

    this.state = this.STATE_DYING;
    this.dyingTimer = 0;
    this.isDislocating = true;
    this.avatarMesh.visible = false;
    this.shadowMesh.visible = false;
    this.heartLight.visible = false;

    // Dislocation en 320 particules néon
    const p = this.playerGroup.position;
    this.disMat.opacity = 1.0;
    const pos = this.disParticles.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3] = p.x + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = p.z + (Math.random() - 0.5) * 1.5;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const spd = 12 + Math.random() * 30;

      this.disVel[i * 3] = Math.sin(phi) * Math.cos(theta) * spd;
      this.disVel[i * 3 + 1] = Math.cos(phi) * spd + 5.0;
      this.disVel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * spd;
    }
    this.disParticles.geometry.attributes.position.needsUpdate = true;

    // Son de crash
    if (this.isAudioActive && window.Tone) {
      this.playCrashSound();
    }

    if (this.deathReasonText) {
      this.deathReasonText.innerHTML = reason === 'energy'
        ? 'SIGNAL ÉTEINT &bull; CŒUR ÉPUISÉ'
        : 'IMPACT CRITIQUE &bull; AVATAR DÉSINTÉGRÉ';
    }
  }

  // --- 10. MOTEUR AUDIO TONE.JS (ANALYSERNODE & 8 CYCLES) ---
  initAudioEngine() {
    this.isAudioActive = false;
    this.audioMode = 'synth'; // 'mp3' | 'synth'
    this.bassEnergy = 0;
    this.midEnergy = 0;
    this.trebleEnergy = 0;
    this.mediaSourceNode = null;
    this.toastTimeout = null;

    // Analyseur FFT Tone.js (64 bandes)
    if (window.Tone) {
      this.fftAnalyser = new Tone.Analyser('fft', 64);
    }

    // Lecteur Audio HTML5 pour les 8 morceaux locaux de l'album /audio/
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    // Événement ended : Enchaînement automatique vers le cycle suivant !
    this.audioElement.addEventListener('ended', () => {
      console.log(`[Audio] Morceau Cycle ${this.currentCycle.id} terminé. Transition automatique vers le cycle suivant.`);
      this.nextCycle();
    });

    // Événement error : Bascule automatique et transparente vers la synthèse Tone.js si MP3 absent
    this.audioElement.addEventListener('error', (err) => {
      if (this.isAudioActive && this.audioMode !== 'synth') {
        console.info(`[Audio] Piste locale audio/cycle${this.currentCycle.id}.mp3 non trouvée. Bascule sur le synthétiseur procédural.`);
        this.fallbackToSynth();
      }
    });

    this.audioElement.addEventListener('play', () => {
      this.setAudioModeBadge('mp3');
    });
  }

  setupMediaSourceNode() {
    if (this.mediaSourceNode || !window.Tone) return;
    try {
      const rawContext = Tone.getContext().rawContext;
      this.mediaSourceNode = rawContext.createMediaElementSource(this.audioElement);
      if (this.fftAnalyser && this.fftAnalyser.input) {
        this.mediaSourceNode.connect(this.fftAnalyser.input);
      }
      this.mediaSourceNode.connect(rawContext.destination);
    } catch (err) {
      console.warn('[Audio] Routage MediaElementSource indisponible dans ce contexte (mode direct actif):', err);
      this.mediaSourceNode = null;
    }
  }

  setupToneSynth() {
    if (!window.Tone) return;

    // Synthétiseur de Kick rythmique puissant
    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.35, sustain: 0.01, release: 0.4 }
    }).connect(this.fftAnalyser).toDestination();

    // Synthétiseur de basse Cyber-Baroque
    this.bassSynth = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: { Q: 3, type: 'lowpass', rolloff: -24 },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.5 },
      filterEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.2, baseFrequency: 80, octaves: 4 }
    }).connect(this.fftAnalyser).toDestination();

    // Boucle rythmique Tone.Loop calée sur le tempo (BPM)
    Tone.Transport.bpm.value = this.currentCycle.bpm;

    const bassNotes = ['C2', 'Eb2', 'F2', 'G2', 'Bb1'];
    let step = 0;

    this.rhythmLoop = new Tone.Loop((time) => {
      // Coup de basse (Kick) sur chaque temps (4n)
      this.kickSynth.triggerAttackRelease('C1', '8n', time, 0.95);

      // Ligne de basse syncopée
      if (step % 2 === 0) {
        const note = bassNotes[Math.floor(Math.random() * bassNotes.length)];
        this.bassSynth.triggerAttackRelease(note, '16n', time, 0.75);
      }
      step++;
    }, '4n');

    this.rhythmLoop.start(0);
    Tone.Transport.start();
  }

  playCycleAudio(cycleId) {
    if (!this.isAudioActive) return;

    const trackPath = `audio/cycle${cycleId}.mp3`;
    if (this.audioTrackTitle) {
      this.audioTrackTitle.textContent = `Piste : cycle${cycleId}.mp3`;
    }

    this.audioElement.pause();
    this.audioElement.src = trackPath;
    this.audioElement.currentTime = 0;

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Lecture locale réussie !
        this.setAudioModeBadge('mp3');
        if (this.rhythmLoop) this.rhythmLoop.stop();
        this.setupMediaSourceNode();
      }).catch((err) => {
        // Fichier absent (404) ou bloqué -> bascule automatique sur le synthé procédural
        this.fallbackToSynth();
      });
    }
  }

  fallbackToSynth() {
    this.audioElement.pause();
    this.setAudioModeBadge('synth');
    if (!this.kickSynth) {
      this.setupToneSynth();
    } else {
      if (window.Tone && Tone.Transport) {
        Tone.Transport.bpm.value = this.currentCycle.bpm;
        if (this.rhythmLoop) this.rhythmLoop.start(0);
        if (Tone.Transport.state !== 'started') Tone.Transport.start();
      }
    }
  }

  setAudioModeBadge(mode) {
    this.audioMode = mode;
    if (this.audioModeBadge) {
      if (mode === 'mp3') {
        this.audioModeBadge.textContent = '🎵 PISTE MP3';
        this.audioModeBadge.className = 'badge-source local-mp3';
      } else {
        this.audioModeBadge.textContent = '⚡ SYNTHÉ TONE.JS';
        this.audioModeBadge.className = 'badge-source';
      }
    }
  }

  playCollectSound() {
    if (!this.isAudioActive || !window.Tone) return;
    const synth = new Tone.PolySynth(Tone.Synth, {
      envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.2 }
    }).toDestination();
    synth.triggerAttackRelease(['C5', 'G5', 'C6'], '16n');
  }

  playCrashSound() {
    if (!window.Tone) return;
    const noise = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.6, sustain: 0 }
    }).toDestination();
    noise.triggerAttackRelease('8n');
  }

  toggleAudio() {
    if (!window.Tone) return;

    if (!this.isAudioActive) {
      Tone.start().then(() => {
        this.isAudioActive = true;
        this.btnAudioToggle.classList.add('active');
        this.audioIcon.textContent = '🔊';
        this.audioLabel.textContent = 'SON ACTIVÉ';

        // Lancement de la piste du cycle actuel (ou fallback synthé si non trouvée)
        this.playCycleAudio(this.currentCycle.id);
      });
    } else {
      this.isAudioActive = false;
      this.audioElement.pause();
      if (Tone.Transport) Tone.Transport.stop();
      if (this.rhythmLoop) this.rhythmLoop.stop();
      this.btnAudioToggle.classList.remove('active');
      this.audioIcon.textContent = '🔇';
      this.audioLabel.textContent = 'ACTIVER LE SON';
    }
  }

  nextCycle() {
    this.setCycle((this.currentCycleIndex + 1) % CYCLES.length);
  }

  prevCycle() {
    this.setCycle((this.currentCycleIndex - 1 + CYCLES.length) % CYCLES.length);
  }

  // --- 11. PROGRESSION D'ALBUM : CHANGEMENT DES 8 CYCLES ---
  setCycle(index) {
    this.currentCycleIndex = (index + CYCLES.length) % CYCLES.length;
    this.currentCycle = CYCLES[this.currentCycleIndex];

    // Mise à jour de l'UI
    if (this.cycleNameText) {
      this.cycleNameText.textContent = `CYCLE ${this.currentCycle.id} • ${this.currentCycle.name}`;
      this.cycleNameText.style.color = `#${this.currentCycle.primary.toString(16).padStart(6, '0')}`;
    }
    if (this.neonAccentTitle) {
      this.neonAccentTitle.style.color = `#${this.currentCycle.primary.toString(16).padStart(6, '0')}`;
    }

    // Mise à jour du BPM audio Tone.js
    if (window.Tone && Tone.Transport) {
      Tone.Transport.bpm.rampTo(this.currentCycle.bpm, 0.8);
    }

    // Jouer le morceau audio du nouveau cycle
    if (this.isAudioActive) {
      this.playCycleAudio(this.currentCycle.id);
    }

    // Afficher la bannière de transition du nouveau cycle
    this.showCycleToast(this.currentCycle);

    // Mise à jour des couleurs de la scène (transition fluide)
    this.scene.background.set(this.currentCycle.fog);
    this.scene.fog.color.set(this.currentCycle.fog);

    this.ambientLight.color.set(this.currentCycle.secondary);
    this.keyLight.color.set(this.currentCycle.primary);
    this.backRimLight.color.set(this.currentCycle.secondary);

    this.gridWireMat.color.set(this.currentCycle.primary);
    this.gridRailMat.color.set(this.currentCycle.secondary);

    this.playerHaloMat.color.set(this.currentCycle.secondary);
    this.shadowMat.color.set(this.currentCycle.primary);

    this.nitySphereMat.emissive.set(this.currentCycle.primary);
    this.nityHaloMat.color.set(this.currentCycle.primary);
    this.nityConeMat.emissive.set(this.currentCycle.secondary);
    this.nityRingMat.color.set(this.currentCycle.secondary);
    this.nityBeaconLight.color.set(this.currentCycle.primary);

    this.monolithWireMat.color.set(this.currentCycle.primary);
    this.portalWireMat.color.set(this.currentCycle.secondary);
    this.crystalGlowMat.color.set(this.currentCycle.primary);
  }

  showCycleToast(cycle) {
    if (!this.cycleToast) return;
    if (this.cycleToastName) {
      this.cycleToastName.textContent = `CYCLE ${cycle.id} • ${cycle.name}`;
      this.cycleToastName.style.color = `#${cycle.primary.toString(16).padStart(6, '0')}`;
    }
    if (this.cycleToastDesc) {
      this.cycleToastDesc.textContent = cycle.desc;
    }

    const hex = `#${cycle.primary.toString(16).padStart(6, '0')}`;
    this.cycleToast.style.borderColor = hex;
    this.cycleToast.style.boxShadow = `0 0 35px ${hex}, 0 0 60px rgba(0, 0, 0, 0.8)`;
    this.cycleToast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      if (this.cycleToast) this.cycleToast.classList.add('hidden');
    }, 3200);
  }

  // --- 12. CONTRÔLES 3D & ENTRÉES ---
  initInputs() {
    this.inputAxisX = 0;
    this.inputAxisY = 0;
    this.keyLeft = false; this.keyRight = false;
    this.keyUp = false; this.keyDown = false;
    this.isPointerDown = false;
    this.pointerStartX = 0; this.pointerStartY = 0;

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
        const diffX = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.2);
        const diffY = (this.pointerStartY - e.clientY) / (window.innerHeight * 0.2);
        this.inputAxisX = Math.max(-1, Math.min(1, diffX));
        this.inputAxisY = Math.max(-1, Math.min(1, diffY));
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -((e.clientY / window.innerHeight) * 2 - 1);
        this.inputAxisX = Math.abs(normX) > 0.1 ? Math.sign(normX) * ((Math.abs(normX) - 0.1) / 0.9) : 0;
        this.inputAxisY = Math.abs(normY) > 0.12 ? Math.sign(normY) * ((Math.abs(normY) - 0.12) / 0.88) : 0;
      }
    });

    const resetP = () => {
      this.isPointerDown = false;
      this.updateInputAxes();
    };
    window.addEventListener('pointerup', resetP);
    window.addEventListener('pointercancel', resetP);
  }

  updateInputAxes() {
    if (this.keyLeft && !this.keyRight) this.inputAxisX = -1;
    else if (this.keyRight && !this.keyLeft) this.inputAxisX = 1;
    else if (!this.keyLeft && !this.keyRight && !this.isPointerDown) this.inputAxisX = 0;

    if (this.keyUp && !this.keyDown) this.inputAxisY = 1;
    else if (this.keyDown && !this.keyUp) this.inputAxisY = -1;
    else if (!this.keyUp && !this.keyDown && !this.isPointerDown) this.inputAxisY = 0;
  }

  initUIEvents() {
    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => this.toggleAudio());
    }
    if (this.btnPrevCycle) {
      this.btnPrevCycle.addEventListener('click', () => this.setCycle(this.currentCycleIndex - 1));
    }
    if (this.btnNextCycle) {
      this.btnNextCycle.addEventListener('click', () => this.setCycle(this.currentCycleIndex + 1));
    }
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => this.resetGame());
    }

    window.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && this.state === this.STATE_GAMEOVER) {
        this.resetGame();
      }
    });
  }

  resetGame() {
    this.gameOverModal.classList.add('hidden');
    this.distance = 0;
    this.energy = 100.0;
    this.baseSpeed = 68.0;
    this.currentSpeed = 68.0;
    this.boostTimer = 0;

    this.playerGroup.position.set(0, this.minAltitude, 0);
    this.avatarMesh.rotation.set(0, 0, 0);
    this.avatarMesh.visible = true;
    this.shadowMesh.visible = true;
    this.heartLight.visible = true;
    this.disMat.opacity = 0;

    // Vider les obstacles et cristaux existants
    for (const obs of this.obstacles) this.scene.remove(obs.mesh);
    this.obstacles = [];
    for (const c of this.crystals) this.scene.remove(c.mesh);
    this.crystals = [];

    this.state = this.STATE_PLAYING;
  }

  triggerSpeedBoost() {
    this.energy = 100.0;
    this.boostTimer = 2.5; // Boost pendant 2.5 secondes
    this.playCollectSound();

    if (this.speedBoostFX) {
      this.speedBoostFX.classList.add('active');
      setTimeout(() => this.speedBoostFX.classList.remove('active'), 350);
    }
  }

  initResize() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.composer.setSize(w, h);
      this.bloomPass.setSize(w, h);
    });
  }

  // --- 13. BOUCLE DE RENDU ET LOGIQUE DE JEU ---
  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = performance.now() * 0.001;

    // --- A. ANALYSE AUDIO RÉACTIVE TONE.JS (BASSES, MÉDIUMS, AIGUS) ---
    let bassLevel = 0, midLevel = 0, trebleLevel = 0;
    if (this.isAudioActive && this.fftAnalyser) {
      const values = this.fftAnalyser.getValue();
      // Basses fréquences (Kick / Sub) : bins 0 à 2 (~ 0 à 700 Hz)
      let sumBass = 0;
      for (let i = 0; i <= 2; i++) {
        sumBass += Math.max(0, (values[i] + 85) / 75);
      }
      bassLevel = Math.min(1.0, sumBass / 3);

      // Médiums (Voix, Leads synthétiseurs) : bins 3 à 8 (~ 700 à 2800 Hz)
      let sumMid = 0;
      for (let i = 3; i <= 8; i++) {
        sumMid += Math.max(0, (values[i] + 90) / 75);
      }
      midLevel = Math.min(1.0, sumMid / 6);

      // Aigus (Hi-hats, percussions fines, harmoniques) : bins 9 à 24
      let sumTreble = 0;
      for (let i = 9; i <= 24; i++) {
        sumTreble += Math.max(0, (values[i] + 95) / 75);
      }
      trebleLevel = Math.min(1.0, sumTreble / 16);
    }

    // Lissage dynamique organique par lerp
    this.bassEnergy += (bassLevel - this.bassEnergy) * 16.0 * dt;
    this.midEnergy += (midLevel - this.midEnergy) * 14.0 * dt;
    this.trebleEnergy += (trebleLevel - this.trebleEnergy) * 14.0 * dt;

    // Mise à jour du VU-Mètre HUD
    if (this.freqBarBass) this.freqBarBass.style.height = `${Math.max(5, this.bassEnergy * 100)}%`;
    if (this.freqBarMid) this.freqBarMid.style.height = `${Math.max(5, this.midEnergy * 100)}%`;
    if (this.freqBarTreble) this.freqBarTreble.style.height = `${Math.max(5, this.trebleEnergy * 100)}%`;

    if (this.state === this.STATE_PLAYING) {
      // --- B. VITESSE CROISSANTE & SPEED BOOST ---
      this.baseSpeed = 68.0 + (this.distance / 1200.0) * 15.0;

      if (this.boostTimer > 0) {
        this.boostTimer -= dt;
        this.currentSpeed = this.baseSpeed + 45.0; // Boost de +45 KM/H vers Nity
        // Élargissement cinématique de la vision
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV + 12, 6 * dt);
      } else {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFOV, 4 * dt);
      }
      this.camera.updateProjectionMatrix();

      // --- C. MANIABILITÉ DU GLIDER & VOL D'INFI ---
      const p = this.playerGroup.position;

      // Déplacement et roulis latéral
      if (this.inputAxisX !== 0) {
        p.x += this.inputAxisX * this.lateralSpeed * dt;
        p.x = Math.max(-this.maxX, Math.min(this.maxX, p.x));
      }
      const targetRoll = -this.inputAxisX * 0.45;
      this.avatarMesh.rotation.z += (targetRoll - this.avatarMesh.rotation.z) * 10.0 * dt;

      // Altitude et tangage vertical
      const isClimbing = this.inputAxisY > 0.1;
      const isDiving = this.inputAxisY < -0.1;
      let vertVel = 0;

      if (isClimbing) {
        if (this.energy > 0) {
          const eFactor = this.energy / this.maxEnergy;
          const altPen = (p.y / this.maxAltitude) * 6.0;
          vertVel = Math.max(3.0, (this.verticalSpeed - altPen) * eFactor);
          const cons = 20.0 + (p.y / this.maxAltitude) * 15.0;
          this.energy = Math.max(0, this.energy - cons * dt);
        } else {
          vertVel = -4.5;
        }
      } else if (isDiving) {
        vertVel = -this.verticalSpeed * 1.35;
        this.energy = Math.min(this.maxEnergy, this.energy + 24.0 * dt);
        if (this.boostTimer <= 0) {
          this.currentSpeed = Math.min(115.0, this.currentSpeed + 45.0 * dt);
        }
      } else {
        if (this.boostTimer <= 0) {
          this.currentSpeed += (this.baseSpeed - this.currentSpeed) * 3.0 * dt;
        }
        if (this.energy <= 0 && p.y > this.minAltitude) {
          vertVel = -5.0;
        }
      }

      // Effet de sol : vol rasant recharge le cœur
      if (p.y <= 2.2) {
        this.energy = Math.min(this.maxEnergy, this.energy + 28.0 * dt);
      }

      p.y += vertVel * dt;
      p.y = Math.max(this.minAltitude, Math.min(this.maxAltitude, p.y));

      const targetPitch = this.inputAxisY * 0.42;
      this.avatarMesh.rotation.x += (targetPitch - this.avatarMesh.rotation.x) * 8.0 * dt;

      // --- D. PULSATION DU CŒUR CALÉE SUR LE BPM DU CYCLE EN COURS ---
      const bps = this.currentCycle.bpm / 60.0; // Battements par seconde
      const energyRatio = Math.max(0.05, this.energy / this.maxEnergy);
      const beatPhase = (time * bps * Math.PI * 2) % (Math.PI * 2);

      // Onde cardiaque binaire (systole/diastole) renforcée par les impacts de basse
      const rawHeartbeat = Math.pow(Math.sin(beatPhase), 6) + 0.3 * Math.pow(Math.sin(beatPhase * 2 + 0.4), 6);
      const heartbeat = Math.min(1.0, rawHeartbeat) * (0.4 + 0.6 * energyRatio) + (this.bassEnergy * 0.25 * energyRatio);

      const lightInt = (1.2 + energyRatio * 4.0) * (0.6 + heartbeat * 0.8);
      this.heartLight.intensity = lightInt;
      this.heartMat.emissiveIntensity = (1.6 + energyRatio * 3.6) * (0.7 + heartbeat * 0.7);
      const hScale = 0.42 * (1.0 + heartbeat * 0.2 * energyRatio);
      this.heartMesh.scale.set(hScale, hScale, hScale);

      // Ombre portée au sol
      const alt = p.y - this.minAltitude;
      this.shadowMat.opacity = Math.max(0.04, 0.35 - (alt / this.maxAltitude) * 0.3);
      this.shadowMesh.scale.set(1.0 + (alt / this.maxAltitude) * 1.6, 1.0 + (alt / this.maxAltitude) * 1.6, 1.0);

      this.playerBoundingSphere.center.copy(p);

      // --- E. DÉFILEMENT DE LA GRILLE & RÉACTIVITÉ SUR KICK ---
      const deltaZ = this.currentSpeed * dt;
      for (let i = 0; i < this.gridSections.length; i++) {
        const sec = this.gridSections[i];
        sec.position.z += deltaZ;
        if (sec.position.z >= this.sectionLength) sec.position.z -= this.sectionLength * 2;
      }

      // La grille et le Bloom pulsent sur les coups de basse
      this.gridWireMat.opacity = 0.65 + this.bassEnergy * 0.35;
      if (this.bloomPass) {
        this.bloomPass.strength = 1.5 + this.bassEnergy * 0.65;
      }

      // --- F. SPAWN D'OBSTACLES SYNCHRONISÉ AU RYTHME MUSICAL (BPM) ---
      const beatInterval = 60.0 / this.currentCycle.bpm;
      const measureBeats = this.currentSpeed > 90.0 ? 3.0 : 4.0;
      this.obstacleTimer += dt;
      if (this.obstacleTimer >= beatInterval * measureBeats) {
        this.obstacleTimer = 0;
        const lanes = [-12, -6, 0, 6, 12];
        const lx = lanes[Math.floor(Math.random() * lanes.length)];
        const r = Math.random();
        if (r < 0.4) {
          this.spawnMonolith(lx);
        } else if (r < 0.75) {
          this.spawnBrokenPortal((Math.random() - 0.5) * 8, 0);
        } else {
          this.spawnLaserBarrier(6 + Math.random() * 10);
        }
      }

      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.mesh.position.z += deltaZ;

        if (obs.subBoxes) {
          for (const sub of obs.subBoxes) sub.box.setFromObject(sub.mesh);
        } else {
          obs.bbox.setFromObject(obs.mesh);
        }

        // Test de collision
        if (Math.abs(obs.mesh.position.z - p.z) < 7.0) {
          let hit = false;
          if (obs.subBoxes) {
            for (const sub of obs.subBoxes) {
              if (sub.box.intersectsSphere(this.playerBoundingSphere)) hit = true;
            }
          } else if (obs.bbox.intersectsSphere(this.playerBoundingSphere)) {
            hit = true;
          }
          if (hit) {
            this.triggerCrash('collision');
          }
        }

        if (obs.mesh.position.z > this.despawnZ) {
          this.scene.remove(obs.mesh);
          this.obstacles.splice(i, 1);
        }
      }

      // --- G. SPAWN & COLLECTE DES CRISTAUX (FRAGMENTS D'INFINI) ---
      this.crystalTimer += dt;
      if (this.crystalTimer >= beatInterval * 8.0) {
        this.crystalTimer = 0;
        const cx = (Math.random() - 0.5) * 24;
        const cy = Math.random() < 0.5 ? 2.2 : (7 + Math.random() * 11);
        this.spawnCrystal(cx, cy);
      }

      for (let i = this.crystals.length - 1; i >= 0; i--) {
        const cr = this.crystals[i];
        cr.mesh.position.z += deltaZ;
        cr.mesh.rotation.y += 2.5 * dt;
        cr.ring.rotation.z += 3.5 * dt;

        if (!cr.collected && cr.mesh.position.distanceTo(p) < (cr.radius + this.playerRadius * 0.85)) {
          cr.collected = true;
          this.triggerSpeedBoost();
        }

        if (cr.mesh.position.z > this.despawnZ || cr.collected) {
          this.scene.remove(cr.mesh);
          this.crystals.splice(i, 1);
        }
      }

      // Alerte énergie à zéro
      if (this.energy <= 0 && p.y <= this.minAltitude + 0.1) {
        this.triggerCrash('energy');
      }

      // Stats
      this.distance += this.currentSpeed * dt;
      if (this.currentSpeed > this.maxSpeed) this.maxSpeed = this.currentSpeed;

      // Suivi caméra 3e personne
      const tCamX = p.x * 0.35;
      const tCamY = Math.max(4.0, p.y + 3.2);
      const tCamZ = p.z + 9.5;
      this.camera.position.x += (tCamX - this.camera.position.x) * 6.0 * dt;
      this.camera.position.y += (tCamY - this.camera.position.y) * 5.0 * dt;
      this.camera.position.z += (tCamZ - this.camera.position.z) * 5.0 * dt;
      this.cameraTarget.set(p.x * 0.2, Math.max(1.8, p.y * 0.6), -16);
      this.camera.lookAt(this.cameraTarget);

      this.updateHUD();

    } else if (this.state === this.STATE_DYING) {
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
          this.disVel[i * 3 + 1] = -this.disVel[i * 3 + 1] * 0.4;
        }
      }
      this.disParticles.geometry.attributes.position.needsUpdate = true;
      this.disMat.opacity = Math.max(0, 1.0 - Math.pow(this.dyingTimer / 1.5, 2));

      if (this.dyingTimer >= 1.4) {
        this.state = this.STATE_GAMEOVER;
        this.gameOverModal.classList.remove('hidden');
        if (this.finalDistanceText) this.finalDistanceText.textContent = `${Math.round(this.distance)} M`;
        if (this.finalSpeedText) this.finalSpeedText.textContent = `${Math.round(this.maxSpeed * 3.6)} KM/H`;
      }
    }

    // --- H. ANIMATION DE NITY & RÉACTIVITÉ SUR KICK ---
    if (this.nityGroup) {
      this.nityGroup.position.y = 8 + Math.sin(time * 1.1) * 1.8;
      this.nitySphere.rotation.y += 0.3 * dt;
      this.nityRing.rotation.z += 0.6 * dt;

      // L'aura de Nity pulse en direct sur le Kick de basse !
      const kickScale = 1.0 + Math.pow(this.bassEnergy, 1.6) * 0.48;
      this.nityHalo.scale.set(kickScale, kickScale, kickScale);
      this.nityHaloMat.opacity = 0.4 + this.bassEnergy * 0.55;
      this.nityBeaconLight.intensity = 8.0 + this.bassEnergy * 18.0;
      this.nitySphereMat.emissiveIntensity = 2.0 + this.bassEnergy * 3.0;
    }

    // --- I. RENDU POST-PROCESSING BLOOM ---
    this.composer.render();
  }

  updateHUD() {
    if (this.energyBar) {
      this.energyBar.style.width = `${Math.max(0, Math.min(100, this.energy))}%`;
      if (this.energy < 25) this.energyBar.classList.add('critical');
      else this.energyBar.classList.remove('critical');
    }
    if (this.speedText) {
      this.speedText.textContent = `${Math.round(this.currentSpeed * 3.6)} KM/H`;
    }
    if (this.altitudeText) {
      this.altitudeText.textContent = `${Math.round(this.playerGroup.position.y * 10)} M`;
    }
    if (this.distanceText) {
      this.distanceText.textContent = `${Math.round(this.distance)} M`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SoundriseGame();
});
