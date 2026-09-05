/**
 * // SOUNDRISE : INFINITY RUN - MONDE & 8 CYCLES (STYLE RACE THE SUN)
 * Sol Solide Uni à Relief Doux (Aucune Grille Filaire), Ombres Directionnelles Nettes,
 * Volumes Géométriques Épurés et Transitions Atmosphériques Fluides.
 */
import * as THREE from 'three';

export const CYCLES_DATA = [
  {
    id: 1,
    name: "Chute",
    subtitle: "Noir • Eau (Abysse Aquatique)",
    element: "Eau",
    colorName: "Noir",
    troll: "TROMBES D'EAU ABYSSALES : Piliers noirs tombant du ciel en piqué",
    sky: 0x020306,
    fog: 0x040812,
    ground: 0x02050b,
    monolith: 0x080e18,
    primary: 0x00f0ff,
    secondary: 0x0284c7,
    lightIntensity: 1.6,
    style: "falling"
  },
  {
    id: 2,
    name: "Résilience",
    subtitle: "Vert & Marron • Terre (Plaques Tectoniques)",
    element: "Terre",
    colorName: "Vert & Marron",
    troll: "PISTONS TELLURIQUES : Portes de terre et roche qui s'écrasent sur le beat",
    sky: 0x080c05,
    fog: 0x121a0a,
    ground: 0x1c150c,
    monolith: 0x162812,
    primary: 0x22c55e,
    secondary: 0xb45309,
    lightIntensity: 1.7,
    style: "sliding"
  },
  {
    id: 3,
    name: "Obsession",
    subtitle: "Rouge • Feu (Brasier Magmatique)",
    element: "Feu",
    colorName: "Rouge",
    troll: "ARCHES DE FEU EN VRILLE : Anneaux de lave en fusion tournant en spirale infernale",
    sky: 0x180303,
    fog: 0x2a0404,
    ground: 0x200303,
    monolith: 0x3d0606,
    primary: 0xef4444,
    secondary: 0xf97316,
    lightIntensity: 2.0,
    style: "spiral"
  },
  {
    id: 4,
    name: "Amour",
    subtitle: "Jaune • Électricité (Plasma & Foudre)",
    element: "Électricité",
    colorName: "Jaune",
    troll: "LEURRES ÉLECTRIQUES : Prismes chargés à haute tension générant des arcs de foudre",
    sky: 0x141202,
    fog: 0x241d03,
    ground: 0x1a1602,
    monolith: 0x3a3006,
    primary: 0xeab308,
    secondary: 0xfef08a,
    lightIntensity: 2.2,
    style: "decoy"
  },
  {
    id: 5,
    name: "Bonheur",
    subtitle: "Blanc • Lumière (Rayonnement Céleste)",
    element: "Lumière",
    colorName: "Blanc",
    troll: "LAME DE LUMIÈRE RASANTE : Nappe de lasers blancs éclatants rasant le sol",
    sky: 0x1e2532,
    fog: 0x334155,
    ground: 0x242e3d,
    monolith: 0x64748b,
    primary: 0xffffff,
    secondary: 0x93c5fd,
    lightIntensity: 2.4,
    style: "solar"
  },
  {
    id: 6,
    name: "Chaos",
    subtitle: "Gris • Ombre (Nébuleuse Obscure & Cendres)",
    element: "Ombre",
    colorName: "Gris",
    troll: "SÉISME D'OMBRES : Piliers silhouettes gris cendre tremblant violemment sur les basses",
    sky: 0x0a0a0a,
    fog: 0x141414,
    ground: 0x111111,
    monolith: 0x262626,
    primary: 0x94a3b8,
    secondary: 0x475569,
    lightIntensity: 1.5,
    style: "quake"
  },
  {
    id: 7,
    name: "Ambition",
    subtitle: "Bleu • Vent (Courants Supersoniques & Ciel)",
    element: "Vent",
    colorName: "Bleu",
    troll: "AIGUILLES DU VENT ASCENDANT : Pics cristallins profilés jaillissant sous les bourrasques",
    sky: 0x031024,
    fog: 0x071e3d,
    ground: 0x082548,
    monolith: 0x0e3b6d,
    primary: 0x38bdf8,
    secondary: 0x0284c7,
    lightIntensity: 1.9,
    style: "needles"
  },
  {
    id: 8,
    name: "Folie",
    subtitle: "Violet • Vide / Cosmos (Distorsion & Feinte)",
    element: "Vide ou Cosmos",
    colorName: "Violet",
    troll: "LA FEINTE COSMIQUE : Distorsion du vide, mirages spatiaux et boucle temporelle",
    sky: 0x0b0118,
    fog: 0x17022e,
    ground: 0x140228,
    monolith: 0x2a044e,
    primary: 0xc084fc,
    secondary: 0xa855f7,
    lightIntensity: 1.9,
    style: "glitch"
  }
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.currentCycleIndex = 0;
    this.cycle = CYCLES_DATA[0];

    // Brume calibrée pour masquer 100% des apparitions d'obstacles à l'horizon (z = -240)
    this.scene.background = new THREE.Color(this.cycle.sky);
    this.scene.fog = new THREE.Fog(this.cycle.fog, 55, 240);

    // Éclairage directionnel & ombres nettes
    this.setupLighting();

    // Terrain solide uni à 3 sections coulissantes (aucun chargement visible)
    this.setupSolidTerrain();

    // Système des 8 Éléments Visuels Environnementaux
    this.setupElementSystems();

    // Gestionnaire d'obstacles procéduraux
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.spawnDistance = -240; // Spawne au cœur de la brume 100% opaque
    this.despawnZ = 20;
  }

  // Configuration de l'éclairage cinématographique avec PCFSoftShadowMap
  setupLighting() {
    // Lumière hémisphérique douce pour les zones d'ombre
    this.hemiLight = new THREE.HemisphereLight(this.cycle.secondary, this.cycle.fog, 0.55);
    this.scene.add(this.hemiLight);

    // Lumière directionnelle principale (Soleil venant du dessus / côté-arrière)
    // Projette de longues ombres dramatiques vers l'avant (Race the Sun)
    this.sunLight = new THREE.DirectionalLight(0xffffff, this.cycle.lightIntensity);
    this.sunLight.position.set(40, 65, 30);
    this.sunLight.castShadow = true;

    // Résolution nette des ombres portées
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1.0;
    this.sunLight.shadow.camera.far = 420;

    const d = 60;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;

    this.scene.add(this.sunLight);
    this.sunLight.target.position.set(0, 0, -60);
    this.scene.add(this.sunLight.target);
  }

  // Terrain solide uni avec léger relief doux (aucun néon filaire)
  setupSolidTerrain() {
    this.trackWidth = 140;
    this.sectionLength = 180;
    this.terrainSections = [];

    // Matériau solide mat avec texture d'ombres propre (sans brillance aveuglante)
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: this.cycle.ground,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: false
    });

    // 3 grandes sections coulissantes pour couvrir de +90 à -450 sans couture
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.PlaneGeometry(this.trackWidth, this.sectionLength, 32, 48);
      const pos = geo.attributes.position;

      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        const y = pos.getY(j);
        const distFromCenter = Math.abs(x);
        if (distFromCenter > 26) {
          const elev = Math.pow((distFromCenter - 26) / 36, 2) * 8.5;
          const noise = Math.sin(x * 0.12) * Math.cos(y * 0.08) * 1.4;
          pos.setZ(j, elev + noise);
        }
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, this.groundMaterial);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = -i * this.sectionLength + this.sectionLength * 0.5;
      mesh.receiveShadow = true;

      this.scene.add(mesh);
      this.terrainSections.push(mesh);
    }

    // Matériau commun des monolithes géométriques
    this.monolithMaterial = new THREE.MeshStandardMaterial({
      color: this.cycle.monolith,
      roughness: 0.65,
      metalness: 0.25,
      flatShading: true
    });
  }

  // --- SYSTÈME DES 8 ÉLÉMENTS VISUELS ENVIRONNEMENTAUX ---
  setupElementSystems() {
    this.elementGroup = new THREE.Group();
    this.scene.add(this.elementGroup);

    // 1. Eau (Cycle 1 - Chute / Noir)
    this.setupWaterRain();

    // 2. Terre (Cycle 2 - Résilience / Vert & Marron)
    this.setupEarthDebris();

    // 3. Feu (Cycle 3 - Obsession / Rouge)
    this.setupFireEmbers();

    // 4. Électricité (Cycle 4 - Amour / Jaune)
    this.setupElectricStorm();

    // 5. Lumière (Cycle 5 - Bonheur / Blanc)
    this.setupLightShafts();

    // 6. Ombre (Cycle 6 - Chaos / Gris)
    this.setupShadowSmoke();

    // 7. Vent (Cycle 7 - Ambition / Bleu)
    this.setupWindStreaks();

    // 8. Vide ou Cosmos (Cycle 8 - Folie / Violet)
    this.setupCosmicVoid();

    this.updateActiveElement(this.currentCycleIndex);
  }

  // 1. Eau : Pluie torrentielle et traînées aquatiques
  setupWaterRain() {
    this.waterRainGroup = new THREE.Group();
    const count = 750;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    this.rainSpeeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 32;
      pos[i * 3 + 2] = -Math.random() * 240 + 10;
      this.rainSpeeds[i] = 50 + Math.random() * 35;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.5,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.rainPoints = new THREE.Points(geo, mat);
    this.waterRainGroup.add(this.rainPoints);
    this.elementGroup.add(this.waterRainGroup);
  }

  // 2. Terre : Roches telluriques & débris rocheux en lévitation
  setupEarthDebris() {
    this.earthDebrisGroup = new THREE.Group();
    this.earthRocks = [];
    const rockGeo = new THREE.DodecahedronGeometry(1.0, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3d2714,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });
    const mossMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a18,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });

    for (let i = 0; i < 28; i++) {
      const isMoss = Math.random() < 0.45;
      const mesh = new THREE.Mesh(rockGeo, isMoss ? mossMat : rockMat);
      const s = 1.0 + Math.random() * 2.8;
      mesh.scale.set(s, s * (0.7 + Math.random() * 0.6), s);
      mesh.position.set(
        (Math.random() - 0.5) * 75,
        2.5 + Math.random() * 18,
        -Math.random() * 240 + 10
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.earthDebrisGroup.add(mesh);
      this.earthRocks.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 1.5,
        rotSpeedY: (Math.random() - 0.5) * 1.5
      });
    }
    this.elementGroup.add(this.earthDebrisGroup);
  }

  // 3. Feu : Braises ardentes & étincelles de magma ascendantes
  setupFireEmbers() {
    this.fireEmbersGroup = new THREE.Group();
    const count = 650;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    this.emberSpeedsY = new Float32Array(count);
    this.emberPhases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 75;
      pos[i * 3 + 1] = Math.random() * 25;
      pos[i * 3 + 2] = -Math.random() * 240 + 10;
      this.emberSpeedsY[i] = 4.0 + Math.random() * 8.0;
      this.emberPhases[i] = Math.random() * Math.PI * 2;

      const r = Math.random();
      if (r < 0.4) {
        cols[i * 3] = 1.0; cols[i * 3 + 1] = 0.15; cols[i * 3 + 2] = 0.05; // Rouge
      } else if (r < 0.8) {
        cols[i * 3] = 1.0; cols[i * 3 + 1] = 0.5; cols[i * 3 + 2] = 0.08; // Orange
      } else {
        cols[i * 3] = 1.0; cols[i * 3 + 1] = 0.9; cols[i * 3 + 2] = 0.2; // Jaune
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });
    this.emberPoints = new THREE.Points(geo, mat);
    this.fireEmbersGroup.add(this.emberPoints);
    this.elementGroup.add(this.fireEmbersGroup);
  }

  // 4. Électricité : Arcs de foudre plasma & étincelles haute-tension
  setupElectricStorm() {
    this.electricGroup = new THREE.Group();
    const maxSegments = 48;
    this.lightningGeo = new THREE.BufferGeometry();
    this.lightningPos = new Float32Array(maxSegments * 2 * 3);
    this.lightningGeo.setAttribute('position', new THREE.BufferAttribute(this.lightningPos, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.lightningLines = new THREE.LineSegments(this.lightningGeo, lineMat);
    this.electricGroup.add(this.lightningLines);
    this.lightningTimer = 0;

    // Étincelles plasma
    const sparkCount = 400;
    const sparkGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 70;
      sPos[i * 3 + 1] = Math.random() * 26;
      sPos[i * 3 + 2] = -Math.random() * 240 + 10;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 2.0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    this.electricGroup.add(this.sparkPoints);

    this.elementGroup.add(this.electricGroup);
  }

  // 5. Lumière : Rayons sacrés (God-Rays) & photons célestes
  setupLightShafts() {
    this.lightShaftsGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(1.5, 6.5, 55, 16, 1, true);
    this.shaftMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 12; i++) {
      const shaft = new THREE.Mesh(shaftGeo, this.shaftMat);
      shaft.position.set(
        (Math.random() - 0.5) * 80,
        18,
        -Math.random() * 220
      );
      shaft.rotation.z = (Math.random() - 0.5) * 0.25;
      shaft.rotation.x = Math.PI * 0.1;
      this.lightShaftsGroup.add(shaft);
    }

    const photonCount = 450;
    const photonGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(photonCount * 3);
    for (let i = 0; i < photonCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 75;
      pPos[i * 3 + 1] = Math.random() * 26;
      pPos[i * 3 + 2] = -Math.random() * 240 + 10;
    }
    photonGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const photonMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.5,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });
    this.photonPoints = new THREE.Points(photonGeo, photonMat);
    this.lightShaftsGroup.add(this.photonPoints);

    this.elementGroup.add(this.lightShaftsGroup);
  }

  // 6. Ombre : Volutes de fumée d'ombre & cendres
  setupShadowSmoke() {
    this.shadowSmokeGroup = new THREE.Group();
    const count = 550;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 75;
      pos[i * 3 + 1] = 0.5 + Math.random() * 24;
      pos[i * 3 + 2] = -Math.random() * 240 + 10;
      const shade = 0.08 + Math.random() * 0.18;
      cols[i * 3] = shade; cols[i * 3 + 1] = shade; cols[i * 3 + 2] = shade * 1.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });
    this.smokePoints = new THREE.Points(geo, mat);
    this.shadowSmokeGroup.add(this.smokePoints);
    this.elementGroup.add(this.shadowSmokeGroup);
  }

  // 7. Vent : Bourrasques & traînées de vent supersoniques
  setupWindStreaks() {
    this.windStreaksGroup = new THREE.Group();
    const count = 75;
    this.windGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 2 * 3);
    this.windLinesData = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 65;
      const y = 1.0 + Math.random() * 22;
      const z = -Math.random() * 240 + 10;
      const len = 15 + Math.random() * 32;

      pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x; pos[i * 6 + 4] = y; pos[i * 6 + 5] = z - len;

      this.windLinesData.push({ x, y, z, len, speedMult: 1.8 + Math.random() * 1.0 });
    }

    this.windGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.windLines = new THREE.LineSegments(this.windGeo, mat);
    this.windStreaksGroup.add(this.windLines);
    this.elementGroup.add(this.windStreaksGroup);
  }

  // 8. Vide ou Cosmos : Voûte stellaire & nébuleuse cosmique
  setupCosmicVoid() {
    this.cosmicVoidGroup = new THREE.Group();
    const starCount = 850;
    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(starCount * 3);
    const sCols = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 90 + Math.random() * 200;

      sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = Math.max(0.5, r * Math.cos(phi));
      sPos[i * 3 + 2] = -Math.abs(r * Math.sin(phi) * Math.sin(theta)) - 10;

      const rnd = Math.random();
      if (rnd < 0.45) {
        sCols[i * 3] = 0.75; sCols[i * 3 + 1] = 0.35; sCols[i * 3 + 2] = 1.0;
      } else if (rnd < 0.75) {
        sCols[i * 3] = 0.3; sCols[i * 3 + 1] = 0.7; sCols[i * 3 + 2] = 1.0;
      } else {
        sCols[i * 3] = 1.0; sCols[i * 3 + 1] = 1.0; sCols[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sCols, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.cosmicVoidGroup.add(this.starPoints);

    const nebGeo = new THREE.SphereGeometry(280, 32, 16);
    this.nebMat = new THREE.MeshBasicMaterial({
      color: 0x581c87,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });
    this.nebDome = new THREE.Mesh(nebGeo, this.nebMat);
    this.cosmicVoidGroup.add(this.nebDome);

    this.elementGroup.add(this.cosmicVoidGroup);
  }

  // Active uniquement l'élément visuel du cycle courant
  updateActiveElement(cycleIndex) {
    if (!this.waterRainGroup) return;
    this.waterRainGroup.visible = (cycleIndex === 0);
    this.earthDebrisGroup.visible = (cycleIndex === 1);
    this.fireEmbersGroup.visible = (cycleIndex === 2);
    this.electricGroup.visible = (cycleIndex === 3);
    this.lightShaftsGroup.visible = (cycleIndex === 4);
    this.shadowSmokeGroup.visible = (cycleIndex === 5);
    this.windStreaksGroup.visible = (cycleIndex === 6);
    this.cosmicVoidGroup.visible = (cycleIndex === 7);
  }

  generateLightningArc() {
    if (!this.lightningPos) return;
    const startX = (Math.random() - 0.5) * 35;
    const startY = 22 + Math.random() * 8;
    const startZ = -40 - Math.random() * 120;

    let curX = startX;
    let curY = startY;
    let curZ = startZ;

    const segments = 24;
    for (let i = 0; i < segments; i++) {
      const nextX = curX + (Math.random() - 0.5) * 5.0;
      const nextY = curY - (startY / segments) + (Math.random() - 0.5) * 2.0;
      const nextZ = curZ + (Math.random() - 0.5) * 4.0;

      this.lightningPos[i * 6] = curX;
      this.lightningPos[i * 6 + 1] = curY;
      this.lightningPos[i * 6 + 2] = curZ;

      this.lightningPos[i * 6 + 3] = nextX;
      this.lightningPos[i * 6 + 4] = Math.max(0, nextY);
      this.lightningPos[i * 6 + 5] = nextZ;

      curX = nextX;
      curY = nextY;
      curZ = nextZ;
    }
    this.lightningGeo.attributes.position.needsUpdate = true;
  }

  updateElements(dt, speed, bassEnergy, time) {
    const deltaZ = speed * dt;

    if (this.waterRainGroup.visible) {
      const pos = this.rainPoints.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= this.rainSpeeds[i] * dt;
        pos[i * 3 + 2] += deltaZ;
        if (pos[i * 3 + 1] <= 0 || pos[i * 3 + 2] > 15) {
          pos[i * 3 + 1] = 28 + Math.random() * 6;
          pos[i * 3 + 2] = -Math.random() * 240 + 5;
        }
      }
      this.rainPoints.geometry.attributes.position.needsUpdate = true;

    } else if (this.earthDebrisGroup.visible) {
      for (const r of this.earthRocks) {
        r.mesh.position.z += deltaZ;
        r.mesh.rotation.x += r.rotSpeedX * dt;
        r.mesh.rotation.y += r.rotSpeedY * dt;
        if (r.mesh.position.z > 20) {
          r.mesh.position.z = -240;
          r.mesh.position.x = (Math.random() - 0.5) * 75;
        }
      }

    } else if (this.fireEmbersGroup.visible) {
      const pos = this.emberPoints.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += this.emberSpeedsY[i] * dt;
        pos[i * 3] += Math.sin(time * 3 + this.emberPhases[i]) * 4.0 * dt;
        pos[i * 3 + 2] += deltaZ;
        if (pos[i * 3 + 1] > 26 || pos[i * 3 + 2] > 18) {
          pos[i * 3 + 1] = 0.2;
          pos[i * 3 + 2] = -Math.random() * 240 + 5;
        }
      }
      this.emberPoints.geometry.attributes.position.needsUpdate = true;

    } else if (this.electricGroup.visible) {
      this.lightningTimer += dt;
      if (this.lightningTimer > 0.16 + Math.random() * 0.3 || bassEnergy > 0.65) {
        this.generateLightningArc();
        this.lightningTimer = 0;
      }
      const sPos = this.sparkPoints.geometry.attributes.position.array;
      const sCount = sPos.length / 3;
      for (let i = 0; i < sCount; i++) {
        sPos[i * 3 + 2] += deltaZ;
        if (sPos[i * 3 + 2] > 20) sPos[i * 3 + 2] = -240;
      }
      this.sparkPoints.geometry.attributes.position.needsUpdate = true;

    } else if (this.lightShaftsGroup.visible) {
      this.shaftMat.opacity = 0.12 + bassEnergy * 0.16 + Math.sin(time * 2.0) * 0.03;
      const pPos = this.photonPoints.geometry.attributes.position.array;
      const pCount = pPos.length / 3;
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3 + 1] += 2.0 * dt;
        pPos[i * 3 + 2] += deltaZ;
        if (pPos[i * 3 + 1] > 28 || pPos[i * 3 + 2] > 20) {
          pPos[i * 3 + 1] = 0.5;
          pPos[i * 3 + 2] = -240;
        }
      }
      this.photonPoints.geometry.attributes.position.needsUpdate = true;

    } else if (this.shadowSmokeGroup.visible) {
      const pos = this.smokePoints.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += Math.sin(time * 1.5 + i) * 2.5 * dt;
        pos[i * 3 + 2] += deltaZ * 0.8;
        if (pos[i * 3 + 2] > 20) pos[i * 3 + 2] = -240;
      }
      this.smokePoints.geometry.attributes.position.needsUpdate = true;

    } else if (this.windStreaksGroup.visible) {
      const pos = this.windGeo.attributes.position.array;
      for (let i = 0; i < this.windLinesData.length; i++) {
        const w = this.windLinesData[i];
        w.z += deltaZ * w.speedMult;
        if (w.z > 25) {
          w.z = -240;
          w.x = (Math.random() - 0.5) * 65;
          w.y = 1 + Math.random() * 22;
        }
        pos[i * 6] = w.x; pos[i * 6 + 1] = w.y; pos[i * 6 + 2] = w.z;
        pos[i * 6 + 3] = w.x; pos[i * 6 + 4] = w.y; pos[i * 6 + 5] = w.z - w.len;
      }
      this.windGeo.attributes.position.needsUpdate = true;

    } else if (this.cosmicVoidGroup.visible) {
      this.starPoints.rotation.z += 0.03 * dt;
      this.nebMat.opacity = 0.32 + bassEnergy * 0.22;
    }
  }

  // Transition fluide vers un cycle donné
  setCycle(index) {
    this.currentCycleIndex = (index + CYCLES_DATA.length) % CYCLES_DATA.length;
    this.cycle = CYCLES_DATA[this.currentCycleIndex];

    // Transition des couleurs d'atmosphère
    this.scene.background.set(this.cycle.sky);
    this.scene.fog.color.set(this.cycle.fog);

    this.hemiLight.color.set(this.cycle.secondary);
    this.hemiLight.groundColor.set(this.cycle.fog);
    this.sunLight.intensity = this.cycle.lightIntensity;

    this.groundMaterial.color.set(this.cycle.ground);
    this.monolithMaterial.color.set(this.cycle.monolith);

    // Propriétés physiques et reflets selon l'élément (Eau, Terre, Feu, Électricité, Lumière, Ombre, Vent, Cosmos)
    switch (this.cycle.element) {
      case 'Eau': // Cycle 1 (Chute) : Noir / Eau
        this.groundMaterial.roughness = 0.12;
        this.groundMaterial.metalness = 0.85;
        this.monolithMaterial.roughness = 0.2;
        this.monolithMaterial.metalness = 0.8;
        break;
      case 'Terre': // Cycle 2 (Résilience) : Vert ou Marron / Terre
        this.groundMaterial.roughness = 0.88;
        this.groundMaterial.metalness = 0.08;
        this.monolithMaterial.roughness = 0.75;
        this.monolithMaterial.metalness = 0.15;
        break;
      case 'Feu': // Cycle 3 (Obsession) : Rouge / Feu
        this.groundMaterial.roughness = 0.62;
        this.groundMaterial.metalness = 0.35;
        this.monolithMaterial.roughness = 0.45;
        this.monolithMaterial.metalness = 0.3;
        break;
      case 'Électricité': // Cycle 4 (Amour) : Jaune / Électricité
        this.groundMaterial.roughness = 0.38;
        this.groundMaterial.metalness = 0.6;
        this.monolithMaterial.roughness = 0.25;
        this.monolithMaterial.metalness = 0.75;
        break;
      case 'Lumière': // Cycle 5 (Bonheur) : Blanc / Lumière
        this.groundMaterial.roughness = 0.2;
        this.groundMaterial.metalness = 0.45;
        this.monolithMaterial.roughness = 0.18;
        this.monolithMaterial.metalness = 0.5;
        break;
      case 'Ombre': // Cycle 6 (Chaos) : Gris / Ombre
        this.groundMaterial.roughness = 0.96;
        this.groundMaterial.metalness = 0.04;
        this.monolithMaterial.roughness = 0.9;
        this.monolithMaterial.metalness = 0.05;
        break;
      case 'Vent': // Cycle 7 (Ambition) : Bleu / Vent
        this.groundMaterial.roughness = 0.3;
        this.groundMaterial.metalness = 0.65;
        this.monolithMaterial.roughness = 0.25;
        this.monolithMaterial.metalness = 0.7;
        break;
      case 'Vide ou Cosmos': // Cycle 8 (Folie) : Violet / Vide ou Cosmos
        this.groundMaterial.roughness = 0.15;
        this.groundMaterial.metalness = 0.88;
        this.monolithMaterial.roughness = 0.2;
        this.monolithMaterial.metalness = 0.85;
        break;
    }

    // Basculer l'élément visuel actif correspondant
    this.updateActiveElement(this.currentCycleIndex);
  }

  // --- LES 8 TROLLS ET OBSTACLES PAR CYCLE ---

  // 1. Monolithe classique
  spawnMonolith(x, scaleY = 1.0) {
    const w = 4.0 + Math.random() * 3.5;
    const h = (22.0 + Math.random() * 26.0) * scaleY;
    const d = 5.0 + Math.random() * 4.0;

    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'standard' };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 1 (Chute) : Monolithe tombant du ciel en piqué gravitationnel (Noir / Eau abyssale)
  spawnFallingPillar(x) {
    const w = 5.0, h = 28.0, d = 5.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x060c18,
      emissive: 0x001a2c,
      emissiveIntensity: 0.6,
      roughness: 0.12,
      metalness: 0.85
    });
    const mesh = new THREE.Mesh(geo, waterMat);
    mesh.position.set(x, 48.0, this.spawnDistance); // Tombe depuis le ciel
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'falling', targetY: h / 2, fallSpeed: 42.0 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 2 (Résilience) : Porte blindée à pistons coulissants (Vert & Marron / Terre)
  spawnSlidingGate(gapX) {
    const group = new THREE.Group();
    const h = 24.0, thickness = 5.0;
    const subBoxes = [];

    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1c2b18,
      roughness: 0.85,
      metalness: 0.12
    });

    const leftW = Math.max(12, gapX + 28);
    const leftGeo = new THREE.BoxGeometry(leftW, h, thickness);
    const leftMesh = new THREE.Mesh(leftGeo, earthMat);
    leftMesh.position.set(-leftW / 2 + gapX - 4.5, h / 2, 0);
    leftMesh.castShadow = true;
    group.add(leftMesh);
    subBoxes.push({ mesh: leftMesh, box: new THREE.Box3() });

    const rightW = Math.max(12, 28 - gapX);
    const rightGeo = new THREE.BoxGeometry(rightW, h, thickness);
    const rightMesh = new THREE.Mesh(rightGeo, earthMat);
    rightMesh.position.set(rightW / 2 + gapX + 4.5, h / 2, 0);
    rightMesh.castShadow = true;
    group.add(rightMesh);
    subBoxes.push({ mesh: rightMesh, box: new THREE.Box3() });

    group.position.set(0, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'sliding', dir: Math.random() < 0.5 ? 1 : -1, speed: 6.5 };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Troll 3 (Obsession) : Arche de magma tourbillonnante en rotation sur l'axe Z (Rouge / Feu)
  spawnSpiralArch(gapX) {
    const group = new THREE.Group();
    const size = 26.0;

    const fireMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdd1a00,
      emissiveIntensity: 0.95,
      roughness: 0.4,
      metalness: 0.25
    });

    const topGeo = new THREE.BoxGeometry(size, 4.0, 4.0);
    const top = new THREE.Mesh(topGeo, fireMat);
    top.position.y = 12;
    group.add(top);

    const botGeo = new THREE.BoxGeometry(size, 4.0, 4.0);
    const bot = new THREE.Mesh(botGeo, fireMat);
    bot.position.y = -12;
    group.add(bot);

    const subBoxes = [
      { mesh: top, box: new THREE.Box3() },
      { mesh: bot, box: new THREE.Box3() }
    ];

    group.position.set(gapX, 10, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spiral', rotSpeed: (Math.random() < 0.5 ? 1 : -1) * 1.6 };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Troll 4 (Amour) : Prisme foudroyant haute-tension (Jaune / Électricité)
  spawnDecoyArch(x) {
    const geo = new THREE.OctahedronGeometry(6.5, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.85
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 5.5, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'decoy' };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 5 (Bonheur) : Nappe de rayons solaires blancs rasant le sol (Blanc / Lumière)
  spawnSolarBeam() {
    const group = new THREE.Group();
    const w = 110.0, h = 1.2, d = 4.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92
    });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.set(0, 5.8, 0);
    group.add(beam);

    const subBoxes = [{ mesh: beam, box: new THREE.Box3() }];
    group.position.set(0, 0, this.spawnDistance);

    const obj = { mesh: group, subBoxes, type: 'solar' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Troll 6 (Chaos) : Piliers sismiques vacillants d'ombre (Gris / Ombre)
  spawnQuakePillars(x) {
    const w = 5.0, h = 26.0, d = 5.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const shadowMat = new THREE.MeshStandardMaterial({
      color: 0x242830,
      roughness: 0.95,
      metalness: 0.05
    });
    const mesh = new THREE.Mesh(geo, shadowMat);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'quake', shakePhase: Math.random() * Math.PI * 2 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 7 (Ambition) : Aiguilles cristallines aérodynamiques jaillissant du sol (Bleu / Vent)
  spawnCrystalNeedle(x) {
    const r = 3.5, h = 38.0;
    const geo = new THREE.ConeGeometry(r, h, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.1,
      roughness: 0.12,
      metalness: 0.8
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, -10.0, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'needle', targetY: h / 2, riseSpeed: 38.0 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 8 (Folie) : Monolithe glitché de distorsion cosmique (Violet / Vide ou Cosmos)
  spawnGlitchMonolith(x) {
    const w = 4.5, h = 24.0, d = 4.5;
    const geo = new THREE.BoxGeometry(w, h, d);
    const cosmosMat = new THREE.MeshStandardMaterial({
      color: 0x2c064e,
      emissive: 0xa855f7,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.82
    });
    const mesh = new THREE.Mesh(geo, cosmosMat);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'glitch', glitchTimer: 0 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Mise à jour fluide du monde avec synchronisation audio (BPM & Bass)
  update(dt, speed, bpm, bassEnergy = 0, onCollisionCheck) {
    const deltaZ = speed * dt;
    const time = performance.now() * 0.001;

    // 1. Défilement continu du sol sans couture
    for (const sec of this.terrainSections) {
      sec.position.z += deltaZ;
      if (sec.position.z >= this.sectionLength * 1.5) {
        sec.position.z -= this.sectionLength * 3;
      }
    }

    // 2. Synchronisation de la lumière avec la basse (Kick)
    const audioLightBoost = 1.0 + bassEnergy * 0.35;
    this.sunLight.intensity = this.cycle.lightIntensity * audioLightBoost;
    this.hemiLight.intensity = 0.55 * (1.0 + bassEnergy * 0.4);
    this.sunLight.target.position.z = -deltaZ;

    // 3. Animation de l'élément environnemental actif
    this.updateElements(dt, speed, bassEnergy, time);

    // 4. Cadencement des obstacles sur le BPM et les Trolls
    const beatInterval = 60.0 / (bpm || 130);
    const measureBeats = speed > 95.0 ? 2.8 : 3.6;
    this.obstacleTimer += dt;

    if (this.obstacleTimer >= beatInterval * measureBeats) {
      this.obstacleTimer = 0;

      const lanes = [-15, -9, 0, 9, 15];
      const lx = lanes[Math.floor(Math.random() * lanes.length)];

      switch (this.cycle.style) {
        case 'falling': // Cycle 1 : Chute
          if (Math.random() < 0.5) this.spawnFallingPillar(lx);
          else this.spawnMonolith(lx);
          break;

        case 'sliding': // Cycle 2 : Résilience
          if (Math.random() < 0.45) this.spawnSlidingGate((Math.random() - 0.5) * 12);
          else this.spawnMonolith(lx);
          break;

        case 'spiral': // Cycle 3 : Obsession
          if (Math.random() < 0.5) this.spawnSpiralArch((Math.random() - 0.5) * 8);
          else this.spawnMonolith(lx);
          break;

        case 'decoy': // Cycle 4 : Amour
          if (Math.random() < 0.4) this.spawnDecoyArch(lx);
          else this.spawnMonolith(lx);
          break;

        case 'solar': // Cycle 5 : Bonheur
          if (Math.random() < 0.4) this.spawnSolarBeam();
          else this.spawnMonolith(lx);
          break;

        case 'quake': // Cycle 6 : Chaos
          if (Math.random() < 0.6) this.spawnQuakePillars(lx);
          else this.spawnMonolith(lx);
          break;

        case 'needles': // Cycle 7 : Ambition
          if (Math.random() < 0.55) this.spawnCrystalNeedle(lx);
          else this.spawnMonolith(lx);
          break;

        case 'glitch': // Cycle 8 : Folie
          this.spawnGlitchMonolith(lx);
          break;

        default:
          this.spawnMonolith(lx);
          break;
      }
    }

    // 4. Déplacement, émersion progressive et comportement des trolls
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += deltaZ;

      // Émersion sans pop-in (grossissement fluide à l'horizon)
      const distFromSpawn = obs.mesh.position.z - this.spawnDistance;
      if (distFromSpawn < 40.0) {
        const prog = Math.min(1.0, Math.max(0.01, distFromSpawn / 40.0));
        obs.mesh.scale.set(prog, prog, prog);
      } else {
        obs.mesh.scale.set(1, 1, 1);
      }

      // Logique spécifique des trolls
      if (obs.type === 'falling' && obs.mesh.position.y > obs.targetY) {
        obs.mesh.position.y = Math.max(obs.targetY, obs.mesh.position.y - obs.fallSpeed * dt);
      } else if (obs.type === 'sliding') {
        obs.mesh.position.x += obs.dir * obs.speed * dt;
        if (Math.abs(obs.mesh.position.x) > 10.0) obs.dir *= -1;
      } else if (obs.type === 'spiral') {
        obs.mesh.rotation.z += obs.rotSpeed * dt;
      } else if (obs.type === 'quake') {
        obs.mesh.rotation.z = Math.sin(time * 12.0 + obs.shakePhase) * (0.05 + bassEnergy * 0.12);
      } else if (obs.type === 'needle' && obs.mesh.position.y < obs.targetY) {
        obs.mesh.position.y = Math.min(obs.targetY, obs.mesh.position.y + obs.riseSpeed * dt);
      } else if (obs.type === 'glitch') {
        if (Math.random() < 0.08) {
          obs.mesh.position.x += (Math.random() - 0.5) * 1.5;
        }
      }

      // Boîtes de collision
      if (obs.subBoxes) {
        for (const sub of obs.subBoxes) {
          sub.box.setFromObject(sub.mesh);
        }
      } else {
        obs.bbox.setFromObject(obs.mesh);
      }

      // Test de collision avec le joueur
      if (onCollisionCheck && Math.abs(obs.mesh.position.z) < 8.0) {
        let hit = false;
        if (obs.subBoxes) {
          for (const sub of obs.subBoxes) {
            if (onCollisionCheck(sub.box)) hit = true;
          }
        } else if (onCollisionCheck(obs.bbox)) {
          hit = true;
        }
      }

      // Despawn derrière Infi
      if (obs.mesh.position.z > this.despawnZ) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }
  }

  reset() {
    for (const obs of this.obstacles) {
      this.scene.remove(obs.mesh);
    }
    this.obstacles = [];
    this.obstacleTimer = 0;
  }
}
