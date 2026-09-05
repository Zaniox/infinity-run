import * as THREE from 'three';

/**
 * // SOUNDRISE : INFINITY RUN
 * Phase 1 — Moteur 3D et Scène Initiale (Infi & Nity)
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.clock = new THREE.Clock();

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initInputs();
    this.createInfiniteGrid();
    this.createPlayerInfi();
    this.createHorizonNity();
    this.initResize();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --- 1. SCÈNE & ESPACE NOIR PROFOND ---
  initScene() {
    this.scene = new THREE.Scene();
    // Espace noir profond
    this.scene.background = new THREE.Color(0x020006);
    // Brouillard volumétrique violet foncé estompant délicatement l'horizon
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
    // Positionnée légèrement au-dessus et derrière la position du joueur
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget = new THREE.Vector3(0, 1.8, -16);
    this.camera.lookAt(this.cameraTarget);
  }

  // --- 3. RENDERER WEBGL FLUIDE (60 FPS) ---
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

  // --- 4. ÉCLAIRAGES NÉON VIOLET / CYAN ---
  initLights() {
    // Ambiance violet sombre
    const ambient = new THREE.AmbientLight(0x280540, 1.8);
    this.scene.add(ambient);

    // Rim light violette arrière (halo enveloppant Infi)
    const backRim = new THREE.DirectionalLight(0xbd00ff, 4.2);
    backRim.position.set(0, 8, -10);
    this.scene.add(backRim);

    // Reflet cyan avant-droit (conforme à l'Image 1)
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    cyanLight.position.set(8, 6, 8);
    this.scene.add(cyanLight);

    // Key light magenta avant-gauche
    const magentaLight = new THREE.DirectionalLight(0xff2ea6, 3.0);
    magentaLight.position.set(-8, 12, 8);
    this.scene.add(magentaLight);
  }

  // --- 5. SOL INFINI FILAIRE (WIREFRAME) VIOLET / CYAN ---
  createInfiniteGrid() {
    this.gridGroup = new THREE.Group();
    this.gridSections = [];
    this.trackWidth = 84;
    this.sectionLength = 240;
    this.scrollSpeed = 70.0; // Vitesse de translation vers l'avant

    // Matériau filaire cyan néon (#00f0ff)
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.72
    });

    // Sous-couche noir profond pour bloquer le vide
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x030108,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    // Matériau rails latéraux violet néon (#bd00ff)
    const railMaterial = new THREE.LineBasicMaterial({
      color: 0xbd00ff,
      linewidth: 2
    });

    // 2 grandes sections en alternance pour une boucle infinie continue
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

      // Rails latéraux de guidage violet néon
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

  // --- 6. PLACEHOLDER INFI (IMAGE 1 LORE) ---
  createPlayerInfi() {
    this.playerGroup = new THREE.Group();
    this.avatarMesh = new THREE.Group();
    this.playerGroup.add(this.avatarMesh);

    // Tête sphérique métallique miroir noir/violacé
    const headRadius = 1.0;
    const headGeo = new THREE.SphereGeometry(headRadius, 64, 64);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x120224,
      metalness: 0.98,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      emissive: 0x240438,
      emissiveIntensity: 0.45,
      reflectivity: 1.0
    });
    this.headMesh = new THREE.Mesh(headGeo, headMat);
    this.avatarMesh.add(this.headMesh);

    // Halo néon violet enveloppant le pourtour de la tête (comme sur Image 1)
    const haloGeo = new THREE.SphereGeometry(headRadius * 1.07, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.avatarMesh.add(haloMesh);

    // Torse géométrique stylisé en pyramide inversée (Image 1)
    const torsoGeo = new THREE.ConeGeometry(0.85, 1.2, 4);
    const torsoMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e021a,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.8
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.rotation.x = Math.PI; // Pointe vers le bas
    torsoMesh.position.set(0, -1.05, 0);
    this.avatarMesh.add(torsoMesh);

    // Visage : symbole infini néon blanc/violet et sourcils expressifs
    this.createInfiVisor(headRadius);

    // Cœur vibrant sur le torse
    this.createInfiHeart();

    // Ombre de contact au sol
    const shadowGeo = new THREE.CircleGeometry(headRadius * 0.95, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.55;
    this.playerGroup.add(shadowMesh);

    this.playerGroup.position.set(0, 1.6, 0);
    this.scene.add(this.playerGroup);

    // Paramètres de déplacement
    this.playerX = 0;
    this.playerTargetX = 0;
    this.maxX = 14.5;
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

    // Géométrie courbe sphérique épousant parfaitement la tête
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
    heartGeo.scale(0.45, 0.45, 0.45);
    heartGeo.center();

    this.heartMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff2ea6,
      emissiveIntensity: 3.5,
      roughness: 0.1
    });

    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMat);
    this.heartMesh.position.set(0.18, -0.9, 0.42);
    this.avatarMesh.add(this.heartMesh);

    // Lumière ponctuelle du cœur
    this.heartLight = new THREE.PointLight(0xff2ea6, 3.2, 14);
    this.heartLight.position.set(0.18, -0.9, 0.55);
    this.avatarMesh.add(this.heartLight);
  }

  // --- 7. PLACEHOLDER NITY (IMAGE 2 LORE — HORIZON) ---
  createHorizonNity() {
    this.nityGroup = new THREE.Group();

    // 1. Cône d'énergie céleste (pointe vers le haut, Image 2)
    const coneRadius = 14;
    const coneHeight = 32;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32);
    const coneMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1538,
      emissive: 0x0055ff,
      emissiveIntensity: 0.8,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(0, coneHeight / 2, 0);
    this.nityGroup.add(coneMesh);

    // 2. Sphère céleste lumineuse en lévitation au-dessus du cône (Image 2)
    const sphereRadius = 13;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c0628,
      emissive: 0x5a189a,
      emissiveIntensity: 1.2,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0
    });
    this.nitySphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.nitySphere.position.set(0, coneHeight + sphereRadius + 4, 0);
    this.nityGroup.add(this.nitySphere);

    // 3. Auras lumineuses néon cyan et magenta (émettant une énergie continue)
    const auraGeo = new THREE.SphereGeometry(sphereRadius * 1.15, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const nityAura = new THREE.Mesh(auraGeo, auraMat);
    this.nitySphere.add(nityAura);

    // Balise lumineuse d'horizon projetant de l'énergie vers Infi
    const beaconLight = new THREE.PointLight(0x00f0ff, 4.0, 400);
    beaconLight.position.copy(this.nitySphere.position);
    this.nityGroup.add(beaconLight);

    // Positionnement lointain à l'horizon sur l'axe Z (remplace le soleil de Race the Sun)
    this.nityGroup.position.set(0, 4, -300);
    this.scene.add(this.nityGroup);
  }

  // --- 8. CONTRÔLES LATÉRAUX ---
  initInputs() {
    this.inputAxisX = 0;
    this.keyLeft = false;
    this.keyRight = false;
    this.isPointerDown = false;
    this.pointerStartX = 0;

    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = true;
      this.updateInputAxis();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) this.keyLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keyRight = false;
      this.updateInputAxis();
    });

    window.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        const diff = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.22);
        this.inputAxisX = Math.max(-1, Math.min(1, diff));
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        this.inputAxisX = Math.abs(normX) > 0.12 ? Math.sign(normX) * ((Math.abs(normX) - 0.12) / 0.88) : 0;
      }
    });

    const resetPointer = () => {
      this.isPointerDown = false;
      this.updateInputAxis();
    };
    window.addEventListener('pointerup', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
  }

  updateInputAxis() {
    if (this.keyLeft && !this.keyRight) this.inputAxisX = -1;
    else if (this.keyRight && !this.keyLeft) this.inputAxisX = 1;
    else if (!this.keyLeft && !this.keyRight && !this.isPointerDown) this.inputAxisX = 0;
  }

  // --- 9. GESTION DU REDIMENSIONNEMENT (RESIZE) ---
  initResize() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // --- 10. BOUCLE DE RENDU 60 FPS (REQUESTANIMATIONFRAME) ---
  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = performance.now() * 0.001;

    // 1. Déplacement fluide du joueur Infi (gauche / droite)
    if (this.inputAxisX !== 0) {
      this.playerGroup.position.x += this.inputAxisX * 22.0 * dt;
      this.playerGroup.position.x = Math.max(-this.maxX, Math.min(this.maxX, this.playerGroup.position.x));
    }

    // Roulis dynamique en virage
    const targetRoll = -this.inputAxisX * 0.35;
    this.avatarMesh.rotation.z += (targetRoll - this.avatarMesh.rotation.z) * 10.0 * dt;

    // Battement du cœur néon d'Infi
    const heartbeat = Math.pow(Math.sin(time * 3.5), 4);
    if (this.heartMat) {
      this.heartMat.emissiveIntensity = 2.5 + heartbeat * 2.5;
      this.heartLight.intensity = 2.0 + heartbeat * 3.0;
    }

    // 2. Défilement continu du sol filaire vers l'arrière (+Z)
    const deltaZ = this.scrollSpeed * dt;
    for (let i = 0; i < this.gridSections.length; i++) {
      const section = this.gridSections[i];
      section.position.z += deltaZ;
      if (section.position.z >= this.sectionLength) {
        section.position.z -= this.sectionLength * 2;
      }
    }

    // 3. Animation mystique de Nity à l'horizon (lévitation douce & lueur)
    if (this.nityGroup) {
      this.nityGroup.position.y = 4 + Math.sin(time * 1.2) * 1.5;
      this.nitySphere.rotation.y += 0.25 * dt;
    }

    // 4. Suivi de caméra 3e personne souple
    const targetCamX = this.playerGroup.position.x * 0.35;
    this.camera.position.x += (targetCamX - this.camera.position.x) * 6.0 * dt;
    this.cameraTarget.set(this.playerGroup.position.x * 0.2, 1.8, -16);
    this.camera.lookAt(this.cameraTarget);

    // 5. Rendu WebGL
    this.renderer.render(this.scene, this.camera);
  }
}

// Lancement au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
