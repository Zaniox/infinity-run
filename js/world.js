/**
 * // SOUNDRISE : INFINITY RUN - MONDE & 8 CYCLES (STYLE RACE THE SUN)
 * Sol Solide Uni à Relief Doux (Aucune Grille Filaire), Ombres Directionnelles Nettes,
 * Volumes Géométriques Épurés et Transitions Atmosphériques Fluides.
 */
import * as THREE from 'three';
import {
  getSoftGlowTexture,
  getSparkTexture,
  getSmokeTexture,
  getStarTexture,
  getWaterDropletTexture,
  getElectricZapTexture,
  getLavaBubbleTexture,
  getCosmicDustTexture
} from './particles.js';

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
    troll: "PYLÔNES TESLA & ARCS DE FOUDRE : Décharges plasma haute-tension entre pylônes",
    sky: 0x141202,
    fog: 0x241d03,
    ground: 0x1a1602,
    monolith: 0x3a3006,
    primary: 0xeab308,
    secondary: 0xfef08a,
    lightIntensity: 2.2,
    style: "tesla"
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

/**
 * Générateur des textures de sol procédurales haute définition des 8 cycles
 */
function createCycleGroundTextures() {
  const textures = [];

  // 1. Cycle 1 Eau / Chute
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#020610');
    grad.addColorStop(1, '#051329');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.32)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const cy = i * 30 + (i % 2 === 0 ? 6 : -6);
      ctx.moveTo(0, cy);
      ctx.bezierCurveTo(128, cy - 18, 256, cy + 18, 384, cy - 14);
      ctx.bezierCurveTo(440, cy, 480, cy - 8, 512, cy);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      const cy = i * 38 + (i % 3 === 0 ? 8 : -8);
      ctx.moveTo(0, cy);
      ctx.bezierCurveTo(100, cy + 16, 280, cy - 16, 512, cy + 4);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 2. Cycle 2 Terre / Résilience
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#140f0a';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3.0;

    const tileSize = 64;
    for (let x = 0; x <= 512; x += tileSize) {
      for (let y = 0; y <= 512; y += tileSize) {
        ctx.fillStyle = ((x + y) % 128 === 0) ? '#1c150c' : '#171109';
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        ctx.beginPath();
        ctx.moveTo(x, y + 16);
        ctx.lineTo(x + tileSize, y + 48);
        ctx.stroke();
      }
    }

    ctx.fillStyle = 'rgba(74, 222, 128, 0.45)';
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc((i * 37) % 512, (i * 73) % 512, 2.5 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 3. Cycle 3 Feu / Obsession
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#100303';
    ctx.fillRect(0, 0, 512, 512);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f97316';

    const drawMagmaVein = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
    };

    drawMagmaVein([[0, 60], [120, 110], [240, 70], [380, 150], [512, 120]]);
    drawMagmaVein([[0, 240], [150, 210], [280, 270], [420, 230], [512, 280]]);
    drawMagmaVein([[0, 420], [130, 470], [290, 410], [390, 460], [512, 440]]);
    drawMagmaVein([[180, 0], [210, 180], [170, 340], [220, 512]]);
    drawMagmaVein([[360, 0], [330, 190], [380, 360], [340, 512]]);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fef08a';
    drawMagmaVein([[0, 60], [120, 110], [240, 70], [380, 150], [512, 120]]);
    drawMagmaVein([[0, 240], [150, 210], [280, 270], [420, 230], [512, 280]]);
    drawMagmaVein([[0, 420], [130, 470], [290, 410], [390, 460], [512, 440]]);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 4. Cycle 4 Électricité / Amour
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#121004';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;

    const step = 64;
    for (let x = 0; x < 512; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    for (let x = step; x < 512; x += step * 2) {
      for (let y = step; y < 512; y += step * 2) {
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 5. Cycle 5 Lumière / Bonheur
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
    ctx.lineWidth = 2.5;

    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      const startX = (i * 54) % 512;
      ctx.moveTo(startX, 0);
      ctx.bezierCurveTo(startX + 60, 180, startX - 80, 340, startX + 20, 512);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(147, 197, 253, 0.40)';
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const startY = (i * 68) % 512;
      ctx.moveTo(0, startY);
      ctx.bezierCurveTo(180, startY - 40, 360, startY + 60, 512, startY);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 6. Cycle 6 Ombre / Chaos
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 3.5;

    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const y = i * 44;
      ctx.moveTo(0, y);
      ctx.lineTo(140, y + 15);
      ctx.lineTo(260, y - 20);
      ctx.lineTo(410, y + 10);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 7. Cycle 7 Vent / Ambition
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#06172d';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.50)';
    ctx.lineWidth = 2.5;

    for (let i = 0; i < 28; i++) {
      const x = (i * 19) % 512;
      const y = (i * 13) % 320;
      const len = 120 + ((i * 17) % 180);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  // 8. Cycle 8 Cosmos / Folie
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090114';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
    ctx.lineWidth = 2.0;

    const gridStep = 48;
    for (let x = 0; x <= 512; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      ctx.arc((i * 47) % 512, (i * 91) % 512, 1.2 + (i % 3) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    textures.push(tex);
  }

  return textures;
}

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

    // Textures procédurales haute définition des 8 cycles
    this.cycleGroundTextures = createCycleGroundTextures();

    // Terrain solide uni à 3 sections coulissantes (aucun chargement visible)
    this.setupSolidTerrain();

    // Système des décors de bord de piste propres à chaque cycle
    this.setupSideProps();

    // Système des 8 Éléments Visuels Environnementaux
    this.setupElementSystems();

    // Gestionnaire d'obstacles procéduraux
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.timeSinceLastSpawn = 0;
    this.spawnDistance = -240; // Spawne au cœur de la brume 100% opaque
    this.despawnZ = 20;

    // Bassin d'ondulations d'eau pour le Cycle 1 (Chute / Eau)
    this.setupWaterRipplesPool();
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

  // Terrain solide avec textures procédurales haute définition des 8 cycles
  setupSolidTerrain() {
    this.trackWidth = 140;
    this.sectionLength = 180;
    this.terrainSections = [];

    // Matériau solide avec texture procédurale du Cycle 1
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.cycleGroundTextures[0],
      roughness: 0.40,
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

  // --- SYSTÈME DES DÉCORS LATÉRAUX (ROADSIDE PROPS) THÉMATIQUES PAR CYCLE ---
  setupSideProps() {
    this.sidePropsGroup = new THREE.Group();
    this.scene.add(this.sidePropsGroup);
    this.sideProps = [];
    this.createSidePropsForCycle(this.currentCycleIndex);
  }

  createSidePropsForCycle(cycleIndex) {
    while (this.sidePropsGroup.children.length > 0) {
      const child = this.sidePropsGroup.children[0];
      this.sidePropsGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
    }
    this.sideProps = [];

    const count = 8;
    const spacing = 35;
    const startZ = 20;

    for (let i = 0; i < count; i++) {
      const z = startZ - i * spacing;
      for (const side of [-1, 1]) {
        const x = side * (33 + ((i * 7) % 5));
        const propMesh = this.buildSidePropMesh(cycleIndex, side);
        propMesh.position.set(x, 0, z);
        this.sidePropsGroup.add(propMesh);
        this.sideProps.push({ mesh: propMesh, side });
      }
    }
  }

  buildSidePropMesh(cycleIndex, side) {
    const group = new THREE.Group();

    switch (cycleIndex) {
      case 0: { // Eau : Colonnes de verre abyssal et flèches marines
        const geo = new THREE.CylinderGeometry(0.7, 1.8, 16, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.35,
          metalness: 0.20,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.35
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 8;
        group.add(mesh);
        break;
      }
      case 1: { // Terre : Mégalithes & dolmens rocheux
        const geo = new THREE.BoxGeometry(3.5, 15, 3.5);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x221a12,
          roughness: 0.85,
          metalness: 0.06,
          emissive: 0x22c55e,
          emissiveIntensity: 0.22
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 7.5;
        mesh.rotation.y = (side > 0 ? 0.3 : -0.3);
        group.add(mesh);
        break;
      }
      case 2: { // Feu : Cheminées volcaniques coniques
        const geo = new THREE.ConeGeometry(2.4, 18, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x200505,
          roughness: 0.65,
          metalness: 0.15,
          emissive: 0xef4444,
          emissiveIntensity: 0.65
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 9;
        group.add(mesh);
        break;
      }
      case 3: { // Électricité : Pylônes relais haute tension
        const geo = new THREE.CylinderGeometry(0.6, 1.2, 20, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x2c2405,
          metalness: 0.35,
          roughness: 0.40,
          emissive: 0xeab308,
          emissiveIntensity: 0.70
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 10;
        group.add(mesh);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.18, 8, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        ring.position.y = 18;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        break;
      }
      case 4: { // Lumière : Obélisques de quartz céleste
        const geo = new THREE.OctahedronGeometry(2.2, 0);
        geo.scale(1.0, 3.8, 1.0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xedf2f7,
          roughness: 0.28,
          metalness: 0.18,
          emissive: 0x93c5fd,
          emissiveIntensity: 0.50
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 9;
        group.add(mesh);
        break;
      }
      case 5: { // Ombre : Monolithes silhouettes de ténèbres
        const geo = new THREE.BoxGeometry(2.6, 20, 2.6);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0c0c0e,
          roughness: 0.90,
          metalness: 0.05,
          emissive: 0x334155,
          emissiveIntensity: 0.25
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 10;
        group.add(mesh);
        break;
      }
      case 6: { // Vent : Ailerons profilés supersoniques
        const geo = new THREE.ConeGeometry(1.5, 22, 4);
        geo.scale(0.5, 1.0, 2.0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0a284c,
          roughness: 0.40,
          metalness: 0.20,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.50
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 11;
        group.add(mesh);
        break;
      }
      case 7: { // Cosmos : Portails quantiques & Singularités
        const geo = new THREE.TorusGeometry(3.2, 0.35, 12, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1f0d36,
          emissive: 0xc084fc,
          emissiveIntensity: 0.85,
          roughness: 0.30,
          metalness: 0.20
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 9;
        mesh.rotation.y = Math.PI / 2;
        group.add(mesh);
        break;
      }
    }
    return group;
  }

  updateSideProps(dt, speed, audioPulse) {
    const deltaZ = speed * dt;
    for (const prop of this.sideProps) {
      prop.mesh.position.z += deltaZ;
      if (prop.mesh.position.z > 25) {
        prop.mesh.position.z -= 280;
      }
      const s = 1.0 + audioPulse * 0.07;
      prop.mesh.scale.set(s, s, s);
    }
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

  // 1. Eau : Pluie torrentielle et traînées aquatiques aérodynamiques réalistes
  setupWaterRain() {
    this.waterRainGroup = new THREE.Group();
    const count = 900;
    this.rainGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 2 * 3);
    this.rainLinesData = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 85;
      const y = Math.random() * 32;
      const z = -Math.random() * 240 + 10;
      const len = 2.5 + Math.random() * 2.2;
      const fallSpeed = 55 + Math.random() * 30;

      pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x; pos[i * 6 + 4] = y - len; pos[i * 6 + 5] = z + 0.9;

      this.rainLinesData.push({ x, y, z, len, fallSpeed });
    }

    this.rainGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const rainMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.60,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.rainLines = new THREE.LineSegments(this.rainGeo, rainMat);
    this.waterRainGroup.add(this.rainLines);
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
      map: getSparkTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
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
      size: 1.8,
      map: getSparkTexture(),
      transparent: true,
      opacity: 0.90,
      depthWrite: false,
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
      size: 2.8,
      map: getSoftGlowTexture(),
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
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
      size: 5.5,
      map: getSmokeTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
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
      size: 2.6,
      map: getStarTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
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
      const pos = this.rainGeo.attributes.position.array;
      for (let i = 0; i < this.rainLinesData.length; i++) {
        const r = this.rainLinesData[i];
        r.y -= r.fallSpeed * dt;
        r.z += deltaZ;

        if (r.y <= 0.2 || r.z > 18) {
          r.y = 28 + Math.random() * 6;
          r.z = -Math.random() * 240 + 5;
          r.x = (Math.random() - 0.5) * 85;
        }

        pos[i * 6] = r.x;
        pos[i * 6 + 1] = r.y;
        pos[i * 6 + 2] = r.z;

        pos[i * 6 + 3] = r.x;
        pos[i * 6 + 4] = r.y - r.len;
        pos[i * 6 + 5] = r.z + 0.9;
      }
      this.rainGeo.attributes.position.needsUpdate = true;

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

    // Nettoyage immédiat des obstacles pour révéler instantanément le nouvel environnement
    this.reset();

    // Transition des couleurs d'atmosphère
    this.scene.background.set(this.cycle.sky);
    this.scene.fog.color.set(this.cycle.fog);

    this.sunLight.color.set(this.cycle.primary);
    this.hemiLight.color.set(this.cycle.secondary);
    this.hemiLight.groundColor.set(this.cycle.fog);
    this.sunLight.intensity = this.cycle.lightIntensity;

    if (this.cycleGroundTextures && this.cycleGroundTextures[this.currentCycleIndex]) {
      this.groundMaterial.map = this.cycleGroundTextures[this.currentCycleIndex];
      this.groundMaterial.color.set(0xffffff);
      this.groundMaterial.needsUpdate = true;
    }
    this.monolithMaterial.color.set(this.cycle.monolith);

    // Propriétés physiques et reflets selon l'élément (Eau, Terre, Feu, Électricité, Lumière, Ombre, Vent, Cosmos)
    switch (this.cycle.element) {
      case 'Eau': // Cycle 1 (Chute) : Noir / Eau
        this.groundMaterial.roughness = 0.40;
        this.groundMaterial.metalness = 0.08;
        this.monolithMaterial.roughness = 0.35;
        this.monolithMaterial.metalness = 0.20;
        break;
      case 'Terre': // Cycle 2 (Résilience) : Vert ou Marron / Terre
        this.groundMaterial.roughness = 0.85;
        this.groundMaterial.metalness = 0.04;
        this.monolithMaterial.roughness = 0.80;
        this.monolithMaterial.metalness = 0.08;
        break;
      case 'Feu': // Cycle 3 (Obsession) : Rouge / Feu
        this.groundMaterial.roughness = 0.65;
        this.groundMaterial.metalness = 0.06;
        this.monolithMaterial.roughness = 0.55;
        this.monolithMaterial.metalness = 0.15;
        break;
      case 'Électricité': // Cycle 4 (Amour) : Jaune / Électricité
        this.groundMaterial.roughness = 0.45;
        this.groundMaterial.metalness = 0.15;
        this.monolithMaterial.roughness = 0.38;
        this.monolithMaterial.metalness = 0.28;
        break;
      case 'Lumière': // Cycle 5 (Bonheur) : Blanc / Lumière
        this.groundMaterial.roughness = 0.30;
        this.groundMaterial.metalness = 0.10;
        this.monolithMaterial.roughness = 0.28;
        this.monolithMaterial.metalness = 0.18;
        break;
      case 'Ombre': // Cycle 6 (Chaos) : Gris / Ombre
        this.groundMaterial.roughness = 0.92;
        this.groundMaterial.metalness = 0.02;
        this.monolithMaterial.roughness = 0.90;
        this.monolithMaterial.metalness = 0.05;
        break;
      case 'Vent': // Cycle 7 (Ambition) : Bleu / Vent
        this.groundMaterial.roughness = 0.45;
        this.groundMaterial.metalness = 0.08;
        this.monolithMaterial.roughness = 0.38;
        this.monolithMaterial.metalness = 0.20;
        break;
      case 'Vide ou Cosmos': // Cycle 8 (Folie) : Violet / Vide ou Cosmos
        this.groundMaterial.roughness = 0.35;
        this.groundMaterial.metalness = 0.12;
        this.monolithMaterial.roughness = 0.30;
        this.monolithMaterial.metalness = 0.22;
        break;
    }

    // Basculer l'élément visuel actif correspondant
    this.updateActiveElement(this.currentCycleIndex);

    // Mettre à jour les décors de bord de piste propres au nouveau cycle
    if (this.createSidePropsForCycle) {
      this.createSidePropsForCycle(this.currentCycleIndex);
    }
  }

  // --- SYSTÈME D'ONDULATIONS D'EAU (CYCLE 1 - CHUTE / EAU) ---
  setupWaterRipplesPool() {
    this.ripples = [];
    this.rippleGeo = new THREE.RingGeometry(0.8, 1.4, 32);
    this.rippleGeo.rotateX(-Math.PI / 2);
    this.rippleMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }

  spawnWaterRipple(x, z) {
    const mesh = new THREE.Mesh(this.rippleGeo, this.rippleMat.clone());
    mesh.position.set(x, 0.08, z);
    mesh.scale.set(1, 1, 1);
    this.scene.add(mesh);
    this.ripples.push({ mesh, scale: 1.0, maxScale: 14.0, opacity: 0.85 });
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
    const obj = { mesh, bbox, type: 'falling', targetY: h / 2, fallSpeed: 42.0, hasSplashed: false };

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
    const obj = { mesh: group, subBoxes, type: 'sliding', baseX: 0, phase: Math.random() * Math.PI * 2, amplitude: 7.0, dir: Math.random() < 0.5 ? 1 : -1, speed: 6.5 };

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

  // Troll 4 (Amour) : Pylônes Tesla haute-tension avec arcs de foudre réels (Jaune / Électricité)
  spawnTeslaGate(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const pylonH = 18.0;
    const pylonR = 0.9;
    const gap = 15.0;

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.25,
      metalness: 0.92
    });

    const electrodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfacc15,
      emissiveIntensity: 3.8,
      roughness: 0.08,
      metalness: 0.6
    });

    // Pylône gauche
    const pylonGeo = new THREE.CylinderGeometry(pylonR * 0.7, pylonR, pylonH, 12);
    const leftPylon = new THREE.Mesh(pylonGeo, metalMat);
    leftPylon.position.set(-gap / 2, pylonH / 2, 0);
    leftPylon.castShadow = true;
    group.add(leftPylon);
    subBoxes.push({ mesh: leftPylon, box: new THREE.Box3() });

    const leftSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), electrodeMat);
    leftSphere.position.set(-gap / 2, pylonH, 0);
    group.add(leftSphere);

    // Pylône droit
    const rightPylon = new THREE.Mesh(pylonGeo, metalMat);
    rightPylon.position.set(gap / 2, pylonH / 2, 0);
    rightPylon.castShadow = true;
    group.add(rightPylon);
    subBoxes.push({ mesh: rightPylon, box: new THREE.Box3() });

    const rightSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), electrodeMat);
    rightSphere.position.set(gap / 2, pylonH, 0);
    group.add(rightSphere);

    // Anneaux de bobine Tesla
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
    const ringGeo = new THREE.TorusGeometry(1.3, 0.16, 8, 20);
    for (let h = 5; h <= 15; h += 3.5) {
      const ringL = new THREE.Mesh(ringGeo, ringMat);
      ringL.rotation.x = Math.PI / 2;
      ringL.position.set(-gap / 2, h, 0);
      group.add(ringL);

      const ringR = new THREE.Mesh(ringGeo, ringMat);
      ringR.rotation.x = Math.PI / 2;
      ringR.position.set(gap / 2, h, 0);
      group.add(ringR);
    }

    // Arc de foudre haute tension entre les électrodes
    const arcSegments = 16;
    const arcGeo = new THREE.BufferGeometry();
    const arcPos = new Float32Array(arcSegments * 2 * 3);
    arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPos, 3));

    const arcMat = new THREE.LineBasicMaterial({
      color: 0xfff066,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const arcLine = new THREE.LineSegments(arcGeo, arcMat);
    group.add(arcLine);

    // Boîte de collision centrale pour l'arc de plasma
    const hazardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(gap * 0.8, 3.4, 2.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hazardMesh.position.set(0, pylonH, 0);
    group.add(hazardMesh);
    subBoxes.push({ mesh: hazardMesh, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);

    const obj = {
      mesh: group,
      subBoxes,
      type: 'tesla',
      arcLine,
      arcPos,
      arcSegments,
      leftX: -gap / 2,
      rightX: gap / 2,
      arcY: pylonH,
      flickerTimer: 0
    };

    this.scene.add(group);
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

  // --- NOUVEAUX OBSTACLES ÉLÉMENTAIRES DÉDIÉS ---

  // Cycle 1 (Eau) : Aiguille hydrodynamique abyssale
  spawnWaterSpire(x) {
    const h = 32.0;
    const geo = new THREE.ConeGeometry(2.8, h, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x040e1c,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.88
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.spawnWaterRipple(x, this.spawnDistance);

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'standard' };
    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Cycle 2 (Terre) : Monolithe tellurique et blocs rocheux
  spawnEarthMonolith(x) {
    const group = new THREE.Group();
    const h = 26.0;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x24180d,
      roughness: 0.95,
      metalness: 0.08,
      flatShading: true
    });

    const geo = new THREE.CylinderGeometry(2.4, 3.8, h, 6);
    const pillar = new THREE.Mesh(geo, mat);
    pillar.position.y = h / 2;
    pillar.castShadow = true;
    group.add(pillar);

    // Bloc rocheux suspendu
    const rockGeo = new THREE.DodecahedronGeometry(2.2, 0);
    const rock = new THREE.Mesh(rockGeo, mat);
    rock.position.set((Math.random() - 0.5) * 4, h + 2.5, (Math.random() - 0.5) * 2);
    rock.rotation.set(Math.random(), Math.random(), 0);
    group.add(rock);

    group.position.set(x, 0, this.spawnDistance);
    const subBoxes = [
      { mesh: pillar, box: new THREE.Box3() },
      { mesh: rock, box: new THREE.Box3() }
    ];
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 3 (Feu) : Spire volcanique incandescente
  spawnVolcanoSpire(x) {
    const h = 30.0;
    const geo = new THREE.ConeGeometry(3.2, h, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x3d0606,
      emissive: 0xef4444,
      emissiveIntensity: 1.35,
      roughness: 0.35,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'standard' };
    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Cycle 4 (Électricité) : Prisme de plasma haute-tension
  spawnPlasmaPrism(x) {
    const h = 14.0;
    const geo = new THREE.CylinderGeometry(2.2, 2.2, h, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfff066,
      emissive: 0xeab308,
      emissiveIntensity: 2.2,
      roughness: 0.12,
      metalness: 0.75
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 8.5, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'spiral', rotSpeed: 1.8 };
    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Cycle 5 (Lumière) : Obélisque cristallin céleste
  spawnPrismObelisk(x) {
    const h = 32.0;
    const geo = new THREE.CylinderGeometry(1.6, 2.8, h, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x93c5fd,
      emissiveIntensity: 1.5,
      roughness: 0.12,
      metalness: 0.65
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.rotation.y = Math.PI / 4;
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'standard' };
    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Cycle 6 (Ombre) : Éperons d'ombre bruts
  spawnVoidSpikes(x) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x151518,
      roughness: 0.98,
      metalness: 0.02
    });
    const subBoxes = [];

    for (let s = 0; s < 3; s++) {
      const h = 18.0 + s * 4.0;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.0, h, 4), mat);
      cone.position.set((s - 1) * 2.5, h / 2, (Math.random() - 0.5) * 2);
      cone.rotation.z = (s - 1) * 0.15;
      cone.castShadow = true;
      group.add(cone);
      subBoxes.push({ mesh: cone, box: new THREE.Box3() });
    }

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'quake', shakePhase: Math.random() * 6 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 7 (Vent) : Anneau de vortex supersonique
  spawnWindVortex(x) {
    const geo = new THREE.TorusGeometry(4.8, 1.0, 8, 20);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.25,
      roughness: 0.2,
      metalness: 0.75
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 7.5, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'spiral', rotSpeed: 2.2 };
    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Cycle 8 (Cosmos) : Faille gravitationnelle stellaire
  spawnCosmicRift(x) {
    const group = new THREE.Group();
    const h = 26.0;
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x1e0338,
      emissive: 0xa855f7,
      emissiveIntensity: 1.1,
      roughness: 0.15,
      metalness: 0.85
    });

    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(2.2, h, 2.2), pillarMat);
    pLeft.position.set(-4.5, h / 2, 0);
    group.add(pLeft);

    const pRight = new THREE.Mesh(new THREE.BoxGeometry(2.2, h, 2.2), pillarMat);
    pRight.position.set(4.5, h / 2, 0);
    group.add(pRight);

    // Singularity center core
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.8, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xc084fc,
        emissiveIntensity: 3.5,
        roughness: 0.05
      })
    );
    core.position.set(0, h * 0.55, 0);
    group.add(core);

    group.position.set(x, 0, this.spawnDistance);
    const subBoxes = [
      { mesh: pLeft, box: new THREE.Box3() },
      { mesh: pRight, box: new THREE.Box3() },
      { mesh: core, box: new THREE.Box3() }
    ];
    const obj = { mesh: group, subBoxes, type: 'glitch', glitchTimer: 0 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Mise à jour fluide du monde avec synchronisation audio absolue (BPM, temps, mesure, kick)
  update(dt, speed, bpmOrAudioInfo, bassEnergy = 0, onCollisionCheck) {
    const deltaZ = speed * dt;
    const time = performance.now() * 0.001;

    // 1. Défilement continu du sol sans couture
    for (const sec of this.terrainSections) {
      sec.position.z += deltaZ;
      if (sec.position.z >= this.sectionLength * 1.5) {
        sec.position.z -= this.sectionLength * 3;
      }
    }

    // 2. Extraction des informations de rythme musical (BPM, kick, temps, mesure)
    let bpm = 130;
    let bass = typeof bassEnergy === 'number' ? bassEnergy : 0;
    let isNewBeat = false;
    let beatInBar = 0;
    let beatFraction = 0;
    let totalBeats = 0;

    if (typeof bpmOrAudioInfo === 'object' && bpmOrAudioInfo !== null) {
      bpm = bpmOrAudioInfo.bpm || 130;
      bass = Math.max(bass, bpmOrAudioInfo.bassEnergy || 0);
      isNewBeat = bpmOrAudioInfo.isNewBeat || false;
      beatInBar = bpmOrAudioInfo.beatInBar || 0;
      beatFraction = bpmOrAudioInfo.beatFraction || 0;
      totalBeats = bpmOrAudioInfo.totalBeats || 0;
    } else if (typeof bpmOrAudioInfo === 'number') {
      bpm = bpmOrAudioInfo;
      const bps = bpm / 60.0;
      totalBeats = time * bps;
      const curB = Math.floor(totalBeats);
      beatFraction = totalBeats - curB;
      beatInBar = ((curB % 4) + 4) % 4;
      if (this._lastBeat !== curB) {
        this._lastBeat = curB;
        isNewBeat = true;
      }
    }

    const bps = bpm / 60.0;
    const beatPhase = (totalBeats * Math.PI * 2) % (Math.PI * 2);
    const beatKick = Math.pow(Math.sin(beatPhase * 0.5), 6);
    const audioPulse = Math.max(bass, beatKick * 0.72);

    const audioLightBoost = 1.0 + audioPulse * 0.45;
    this.sunLight.intensity = this.cycle.lightIntensity * audioLightBoost;
    this.hemiLight.intensity = 0.55 * (1.0 + audioPulse * 0.4);
    this.sunLight.target.position.z = -deltaZ;

    // 3. Animation de l'élément environnemental actif et des décors latéraux
    this.updateElements(dt, speed, audioPulse, time);
    if (this.updateSideProps) {
      this.updateSideProps(dt, speed, audioPulse);
    }

    // 4. Cadencement des obstacles STRICTEMENT calé sur le rythme musical
    // - En temps normal : au temps 1 de chaque mesure (beatInBar === 0)
    // - En intensité accrue (basses puissantes ou vitesse élevée) : tous les 2 temps (beatInBar === 0 ou 2)
    this.timeSinceLastSpawn = (this.timeSinceLastSpawn || 0) + dt;
    const isIntense = speed > 85.0 || bass > 0.52;
    const isSpawnBeat = isIntense ? (isNewBeat && (beatInBar === 0 || beatInBar === 2)) : (isNewBeat && beatInBar === 0);

    // Maintien d'un espacement minimal sécurisé de 1.1s pour garantir la lisibilité et l'esquive
    if (isSpawnBeat && this.timeSinceLastSpawn >= 1.1) {
      this.timeSinceLastSpawn = 0;

      const lanes = [-15, -9, 0, 9, 15];
      const lx = lanes[Math.floor(Math.random() * lanes.length)];

      switch (this.cycle.style) {
        case 'falling': // Cycle 1 : Chute (Noir / Eau)
          if (Math.random() < 0.5) this.spawnFallingPillar(lx);
          else this.spawnWaterSpire(lx);
          break;

        case 'sliding': // Cycle 2 : Résilience (Vert & Marron / Terre)
          if (Math.random() < 0.48) this.spawnSlidingGate((Math.random() - 0.5) * 12);
          else this.spawnEarthMonolith(lx);
          break;

        case 'spiral': // Cycle 3 : Obsession (Rouge / Feu)
          if (Math.random() < 0.5) this.spawnSpiralArch((Math.random() - 0.5) * 8);
          else this.spawnVolcanoSpire(lx);
          break;

        case 'tesla':
        case 'decoy': // Cycle 4 : Amour (Jaune / Électricité)
          if (Math.random() < 0.55) this.spawnTeslaGate(lx);
          else this.spawnPlasmaPrism(lx);
          break;

        case 'solar': // Cycle 5 : Bonheur (Blanc / Lumière)
          if (Math.random() < 0.45) this.spawnSolarBeam();
          else this.spawnPrismObelisk(lx);
          break;

        case 'quake': // Cycle 6 : Chaos (Gris / Ombre)
          if (Math.random() < 0.55) this.spawnQuakePillars(lx);
          else this.spawnVoidSpikes(lx);
          break;

        case 'needles': // Cycle 7 : Ambition (Bleu / Vent)
          if (Math.random() < 0.55) this.spawnCrystalNeedle(lx);
          else this.spawnWindVortex(lx);
          break;

        case 'glitch': // Cycle 8 : Folie (Violet / Vide ou Cosmos)
          if (Math.random() < 0.5) this.spawnGlitchMonolith(lx);
          else this.spawnCosmicRift(lx);
          break;

        default:
          this.spawnWaterSpire(lx);
          break;
      }
    }

    // 5. Déplacement, émersion progressive et comportement rythmique des obstacles
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

      // Logique spécifique des trolls et obstacles calée sur le beat
      if (obs.type === 'falling') {
        if (obs.mesh.position.y > obs.targetY) {
          obs.mesh.position.y = Math.max(obs.targetY, obs.mesh.position.y - obs.fallSpeed * dt);
          if (obs.mesh.position.y <= obs.targetY && !obs.hasSplashed) {
            obs.hasSplashed = true;
            this.spawnWaterRipple(obs.mesh.position.x, obs.mesh.position.z);
          }
        }
      } else if (obs.type === 'tesla') {
        obs.flickerTimer += dt;
        if (obs.flickerTimer > 0.035 || isNewBeat) {
          obs.flickerTimer = 0;
          const segs = obs.arcSegments;
          const p = obs.arcPos;
          let curX = obs.leftX;
          let curY = obs.arcY;
          let curZ = 0;
          const stepX = (obs.rightX - obs.leftX) / segs;

          for (let s = 0; s < segs; s++) {
            p[s * 6] = curX;
            p[s * 6 + 1] = curY;
            p[s * 6 + 2] = curZ;

            const nextX = (s === segs - 1) ? obs.rightX : (curX + stepX);
            const nextY = (s === segs - 1) ? obs.arcY : (obs.arcY + (Math.random() - 0.5) * 2.4);
            const nextZ = (s === segs - 1) ? 0 : ((Math.random() - 0.5) * 2.2);

            p[s * 6 + 3] = nextX;
            p[s * 6 + 4] = nextY;
            p[s * 6 + 5] = nextZ;

            curX = nextX;
            curY = nextY;
            curZ = nextZ;
          }
          obs.arcLine.geometry.attributes.position.needsUpdate = true;
          obs.arcLine.material.opacity = 0.85 + (isNewBeat ? 0.15 : Math.random() * 0.15);
        }
      } else if (obs.type === 'sliding') {
        // Balancement rythmique fluide sur le tempo
        const slidePhase = Math.sin(totalBeats * Math.PI + (obs.phase || 0));
        obs.mesh.position.x = (obs.baseX || 0) + slidePhase * 8.5;
      } else if (obs.type === 'spiral') {
        const beatBoost = 1.0 + audioPulse * 1.4;
        obs.mesh.rotation.z += obs.rotSpeed * beatBoost * dt;
      } else if (obs.type === 'quake') {
        obs.mesh.rotation.z = Math.sin(time * 16.0 + obs.shakePhase) * (0.05 + audioPulse * 0.16);
      } else if (obs.type === 'needle' && obs.mesh.position.y < obs.targetY) {
        obs.mesh.position.y = Math.min(obs.targetY, obs.mesh.position.y + obs.riseSpeed * dt);
      } else if (obs.type === 'glitch') {
        if (isNewBeat && Math.random() < 0.45) {
          obs.mesh.position.x += (Math.random() - 0.5) * 3.0;
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

    // 5. Défilement et expansion des ondulations d'eau (Cycle 1 - Chute / Eau)
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.mesh.position.z += deltaZ;
      rip.scale += 14.0 * dt;
      rip.mesh.scale.set(rip.scale, rip.scale, rip.scale);
      rip.opacity = Math.max(0, 0.85 * (1.0 - rip.scale / rip.maxScale));
      rip.mesh.material.opacity = rip.opacity;
      if (rip.scale >= rip.maxScale || rip.mesh.position.z > this.despawnZ) {
        this.scene.remove(rip.mesh);
        rip.mesh.material.dispose();
        this.ripples.splice(i, 1);
      }
    }
  }

  reset() {
    for (const obs of this.obstacles) {
      this.scene.remove(obs.mesh);
    }
    this.obstacles = [];
    this.obstacleTimer = 0;

    for (const rip of this.ripples) {
      this.scene.remove(rip.mesh);
      rip.mesh.material.dispose();
    }
    this.ripples = [];
  }
}
