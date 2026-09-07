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
    troll: "TROMBES D'EAU ABYSSALES : Cascades et geysers d'eau tourbillonnants en piqué",
    sky: 0x020a16,
    fog: 0x04162a,
    ground: 0x031c33,
    monolith: 0x072844,
    primary: 0x00f0ff,
    secondary: 0x38bdf8,
    lightIntensity: 1.5,
    style: "falling"
  },
  {
    id: 2,
    name: "Résilience",
    subtitle: "Terre & Roches • Falaises Telluriques",
    element: "Terre",
    colorName: "Marron & Ocre",
    troll: "PISTONS TELLURIQUES : Mégalithes de terre et roche qui s'écrasent sur le beat",
    sky: 0x161009,
    fog: 0x22180e,
    ground: 0x3a2414,
    monolith: 0x3b2615,
    primary: 0xb45309,
    secondary: 0x78350f,
    lightIntensity: 1.5,
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
    subtitle: "Or Doux & Albâtre • Rayonnement Céleste",
    element: "Lumière",
    colorName: "Or & Albâtre",
    troll: "HARPE DE LASERS CÉLESTES : Trame de cordes lumineuses dorées à esquiver",
    sky: 0x0f172a,
    fog: 0x1e293b,
    ground: 0x242e3d,
    monolith: 0x3b4c68,
    primary: 0xfef08a,
    secondary: 0xe0e7ff,
    lightIntensity: 1.35,
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

  // Helper de dessin sans couture : réplique automatiquement sur les 4 quadrants pour supprimer tout raccord
  function drawSeamlessCircle(ctx, cx, cy, r, fillStyle, strokeStyle = null, lineWidth = 0) {
    const offsets = [
      [0, 0], [512, 0], [-512, 0], [0, 512], [0, -512],
      [512, 512], [-512, 512], [512, -512], [-512, -512]
    ];
    for (const [ox, oy] of offsets) {
      const x = cx + ox;
      const y = cy + oy;
      if (x + r < 0 || x - r > 512 || y + r < 0 || y - r > 512) continue;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }
  }

  function drawSeamlessCurve(ctx, pts, strokeStyle, lineWidth) {
    const offsets = [
      [0, 0], [512, 0], [-512, 0], [0, 512], [0, -512]
    ];
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [ox, oy] of offsets) {
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const x = pts[i][0] + ox;
        const y = pts[i][1] + oy;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // 1. Cycle 1 : Eau / Chute (Noir & Bleu Océan Profond, Caustiques Vivantes & Écume Fluide)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fond océan abyssal en dégradé continu
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#000e1f');
    grad.addColorStop(0.5, '#001c38');
    grad.addColorStop(1, '#000e1f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Courants d'eau sous-marins sinusoidaux
    ctx.globalCompositeOperation = 'screen';
    for (let w = 0; w < 6; w++) {
      const pts = [];
      const baseY = (w / 6) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + w) * 28;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(0, 180, 255, 0.18)', 36);
    }

    // Réseau de caustiques aquatiques fluides sans raccords
    for (let i = 0; i < 45; i++) {
      const cx = (i * 73) % 512;
      const cy = (i * 127) % 512;
      const r = 25 + ((i * 19) % 45);
      const rGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      rGrad.addColorStop(0, 'rgba(0, 240, 255, 0.28)');
      rGrad.addColorStop(0.65, 'rgba(0, 160, 255, 0.12)');
      rGrad.addColorStop(1, 'rgba(0, 100, 200, 0)');
      drawSeamlessCircle(ctx, cx, cy, r, rGrad, 'rgba(120, 230, 255, 0.25)', 1.5);
    }

    // Écume et micro-bulles bioluminescentes
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 180; i++) {
      const bx = (i * 157) % 512;
      const by = (i * 211) % 512;
      const br = 0.8 + ((i * 13) % 2.4);
      drawSeamlessCircle(ctx, bx, by, br, 'rgba(210, 250, 255, 0.55)');
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 2. Cycle 2 : Terre / Résilience (Sol Tellurique, Strates Rocheuses Sédimentaires & Glaise)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base terre glaise riche et sombre
    ctx.fillStyle = '#2a160c';
    ctx.fillRect(0, 0, 512, 512);

    // Mottes et nuances de loam naturelles sans couture
    for (let i = 0; i < 55; i++) {
      const cx = (i * 97) % 512;
      const cy = (i * 163) % 512;
      const r = 35 + ((i * 23) % 60);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, i % 2 === 0 ? '#432615' : '#1d0f07');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, cx, cy, r, g);
    }

    // Strates sédimentaires horizontales telluriques continues
    for (let s = 0; s < 8; s++) {
      const pts = [];
      const baseY = (s / 8) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + s * 1.5) * 14;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, s % 2 === 0 ? '#54331d' : '#180c05', 8);
    }

    // Failles et craquelures telluriques nettes
    for (let f = 0; f < 12; f++) {
      const pts = [];
      let curX = (f * 137) % 512;
      let curY = (f * 179) % 512;
      pts.push([curX, curY]);
      for (let step = 0; step < 5; step++) {
        curX += (((step + f) * 29) % 60) - 30;
        curY += (((step + f) * 41) % 55) - 20;
        pts.push([curX, curY]);
      }
      drawSeamlessCurve(ctx, pts, '#120803', 2.8);
    }

    // Touches végétales de lichen sur les failles
    for (let m = 0; m < 35; m++) {
      const mx = (m * 149) % 512;
      const my = (m * 223) % 512;
      const mr = 6 + (m % 14);
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
      mg.addColorStop(0, 'rgba(65, 82, 38, 0.45)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, mx, my, mr, mg);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 3. Cycle 3 : Obsession / Lave & Feu (Magma Incandescent Vivant & Dalles de Basalte Noir)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Basalte volcanique refroidi
    ctx.fillStyle = '#0f0505';
    ctx.fillRect(0, 0, 512, 512);

    // Dalles de roche volcanique fracturée
    for (let r = 0; r < 40; r++) {
      const cx = (r * 113) % 512;
      const cy = (r * 173) % 512;
      const rad = 30 + ((r * 17) % 50);
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      bg.addColorStop(0, '#1c0a0a');
      bg.addColorStop(0.8, '#120505');
      bg.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, cx, cy, rad, bg);
    }

    // Fleuves de magma en fusion sinueux continus
    ctx.globalCompositeOperation = 'screen';
    for (let l = 0; l < 5; l++) {
      const pts = [];
      const baseY = (l / 5) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + l * 2) * 35;
        pts.push([x, y]);
      }
      // Halo magmatique large
      drawSeamlessCurve(ctx, pts, 'rgba(255, 60, 0, 0.35)', 42);
      // Cœur de lave rougeoyante
      drawSeamlessCurve(ctx, pts, 'rgba(255, 120, 0, 0.65)', 20);
      // Fissure blanche/dorée incandescente au centre
      drawSeamlessCurve(ctx, pts, 'rgba(255, 235, 120, 0.90)', 6);
    }

    // Braises et étincelles chaudes
    ctx.globalCompositeOperation = 'source-over';
    for (let e = 0; e < 90; e++) {
      const ex = (e * 181) % 512;
      const ey = (e * 239) % 512;
      const er = 1.5 + (e % 3.5);
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2);
      eg.addColorStop(0, '#fff275');
      eg.addColorStop(0.5, '#ff4500');
      eg.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, ex, ey, er * 2, eg);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 4. Cycle 4 : Amour / Électricité (Circuits Cyber Haute Tension & Plasma Doré)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, 512, 512);

    // Grille de pistes d'énergie cybernétiques
    ctx.globalCompositeOperation = 'screen';
    for (let p = 0; p < 8; p++) {
      const y = (p / 8) * 512;
      drawSeamlessCurve(ctx, [[0, y], [512, y]], 'rgba(250, 204, 21, 0.25)', 3);
    }
    for (let p = 0; p < 8; p++) {
      const x = (p / 8) * 512;
      drawSeamlessCurve(ctx, [[x, 0], [x, 512]], 'rgba(250, 204, 21, 0.25)', 3);
    }

    // Nœuds de plasma étincelants aux croisements
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          const cx = (i / 8) * 512;
          const cy = (j / 8) * 512;
          const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
          ng.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          ng.addColorStop(0.4, 'rgba(250, 204, 21, 0.6)');
          ng.addColorStop(1, 'rgba(0,0,0,0)');
          drawSeamlessCircle(ctx, cx, cy, 14, ng);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 5. Cycle 5 : Bonheur / Lumière (Marbre Albâtre Doux & Veines d'Or Céleste)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Marbre clair sans éblouissement
    const mGrad = ctx.createLinearGradient(0, 0, 512, 512);
    mGrad.addColorStop(0, '#f1f5f9');
    mGrad.addColorStop(0.5, '#e2e8f0');
    mGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = mGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Veinage d'or champagne délicat
    for (let v = 0; v < 6; v++) {
      const pts = [];
      const baseY = (v / 6) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + v) * 22;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(234, 179, 8, 0.28)', 6);
      drawSeamlessCurve(ctx, pts, 'rgba(254, 240, 138, 0.55)', 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 6. Cycle 6 : Chaos / Ombre (Obsidienne Liquide & Cendres Nébuleuses)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, 512, 512);

    // Panaches de cendre sombre et brume
    ctx.globalCompositeOperation = 'screen';
    for (let a = 0; a < 25; a++) {
      const cx = (a * 109) % 512;
      const cy = (a * 167) % 512;
      const r = 40 + (a % 50);
      const ag = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      ag.addColorStop(0, 'rgba(71, 85, 105, 0.35)');
      ag.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, cx, cy, r, ag);
    }

    // Fractures d'obsidienne tranchante
    ctx.globalCompositeOperation = 'source-over';
    for (let f = 0; f < 10; f++) {
      const pts = [];
      let curX = (f * 131) % 512;
      let curY = (f * 197) % 512;
      pts.push([curX, curY]);
      for (let s = 0; s < 4; s++) {
        curX += (((s + f) * 31) % 70) - 35;
        curY += (((s + f) * 47) % 65) - 30;
        pts.push([curX, curY]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(148, 163, 184, 0.45)', 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 7. Cycle 7 : Ambition / Vent (Océan de Nuages Vaporeux & Courants Aériens)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ciel azur stratosphérique
    const vGrad = ctx.createLinearGradient(0, 0, 0, 512);
    vGrad.addColorStop(0, '#0284c7');
    vGrad.addColorStop(0.5, '#38bdf8');
    vGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Traînées aérodynamiques supersoniques
    ctx.globalCompositeOperation = 'screen';
    for (let w = 0; w < 10; w++) {
      const y = (w / 10) * 512;
      const pts = [
        [0, y],
        [256, y + Math.sin(w) * 16],
        [512, y]
      ];
      drawSeamlessCurve(ctx, pts, 'rgba(255, 255, 255, 0.35)', 8);
    }

    // Bancs de stratus vaporeux
    for (let c = 0; c < 20; c++) {
      const cx = (c * 127) % 512;
      const cy = (c * 179) % 512;
      const r = 45 + (c % 55);
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cg.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      cg.addColorStop(1, 'rgba(255, 255, 255, 0)');
      drawSeamlessCircle(ctx, cx, cy, r, cg);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    textures.push(tex);
  }

  // 8. Cycle 8 : Folie / Cosmos (Nébuleuse Interstellaire & Poussière Cosmique)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Vide cosmique profond
    ctx.fillStyle = '#060012';
    ctx.fillRect(0, 0, 512, 512);

    // Nuages de nébuleuse pourpre et violette
    ctx.globalCompositeOperation = 'screen';
    for (let n = 0; n < 28; n++) {
      const cx = (n * 101) % 512;
      const cy = (n * 173) % 512;
      const r = 50 + (n % 70);
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      ng.addColorStop(0, n % 2 === 0 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(236, 72, 153, 0.35)');
      ng.addColorStop(1, 'rgba(0,0,0,0)');
      drawSeamlessCircle(ctx, cx, cy, r, ng);
    }

    // Poussière d'étoiles scintillantes
    ctx.globalCompositeOperation = 'source-over';
    for (let s = 0; s < 160; s++) {
      const sx = (s * 137) % 512;
      const sy = (s * 227) % 512;
      const sr = 0.8 + (s % 2.2);
      drawSeamlessCircle(ctx, sx, sy, sr, s % 3 === 0 ? '#fef08a' : '#ffffff');
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
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

    // Système de particules d'explosion des obstacles détruits
    this.activeExplosions = [];

    // Système de Transition Fluide (Glisse sans rupture de Cycle 1 à 8)
    this.isTransitioning = false;
    this.transitionProgress = 0.0;
    this.transitionDuration = 2.8;

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
      geo.userData = { basePositions: new Float32Array(pos.array) };

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

  // Animation physique 3D des vagues et déformations du terrain selon l'élément
  updateTerrainMesh(time) {
    const isWater = (this.currentCycleIndex === 0);
    const isTransitioningWater = this.isTransitioning && (this.targetCycleIndex === 0 || this.currentCycleIndex === 0);

    if (isWater || isTransitioningWater) {
      let waveWeight = 1.0;
      if (this.isTransitioning) {
        waveWeight = (this.targetCycleIndex === 0) ? this.transitionProgress : (1.0 - this.transitionProgress);
      }

      for (const mesh of this.terrainSections) {
        const geo = mesh.geometry;
        const pos = geo.attributes.position;
        const base = geo.userData.basePositions;
        if (!base) continue;

        for (let j = 0; j < pos.count; j++) {
          const x = base[j * 3];
          const y = base[j * 3 + 1];
          const bz = base[j * 3 + 2];
          const worldZ = mesh.position.z + y;

          // Vagues de houle océanique ondulantes
          const wave1 = Math.sin(x * 0.14 + time * 3.2) * Math.cos(worldZ * 0.10 + time * 2.4) * 1.5;
          const wave2 = Math.sin((x + worldZ) * 0.08 + time * 1.8) * 0.8;
          pos.setZ(j, bz + (wave1 + wave2) * waveWeight);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      }
      this.wasWater = true;
    } else if (this.wasWater) {
      // Rétablir le terrain solide sans vagues
      for (const mesh of this.terrainSections) {
        const geo = mesh.geometry;
        const pos = geo.attributes.position;
        const base = geo.userData.basePositions;
        if (base) {
          pos.array.set(base);
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
      }
      this.wasWater = false;
    }
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
      case 0: { // Eau : Trombe d'eau monumentale, geyser abyssal et anneaux d'écume marine
        const geo = new THREE.CylinderGeometry(1.2, 3.4, 26, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x03223f,
          roughness: 0.08,
          metalness: 0.88,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.80,
          transparent: true,
          opacity: 0.88
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 13;
        group.add(mesh);

        // Orbe d'eau lumineuse au sommet
        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(2.0, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 })
        );
        orb.position.y = 26.5;
        group.add(orb);

        // Anneaux d'écume marine
        for (let r = 0; r < 2; r++) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(3.0 + r * 1.4, 0.16, 8, 24),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 })
          );
          ring.position.y = 10 + r * 10;
          ring.rotation.x = Math.PI / 2.2;
          group.add(ring);
        }
        break;
      }
      case 1: { // Terre : Dolmen tellurique colossal en strates rocheuses et terreuses (sans vert uniforme)
        const geo = new THREE.BoxGeometry(4.4, 18, 4.4);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x3a2414,
          roughness: 0.92,
          metalness: 0.06,
          emissive: 0x78350f,
          emissiveIntensity: 0.22,
          flatShading: true
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 9;
        mesh.rotation.y = (side > 0 ? 0.35 : -0.35);
        group.add(mesh);

        // Linteau supérieur tellurique (terre cuite et ocre)
        const lintelMat = new THREE.MeshStandardMaterial({
          color: 0x4e331e,
          roughness: 0.95,
          metalness: 0.04,
          flatShading: true
        });
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.4, 5.0), lintelMat);
        lintel.position.y = 19;
        group.add(lintel);

        // Bloc de roche sédimentaire fracturé suspendu au centre
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.8, 0),
          new THREE.MeshStandardMaterial({ color: 0x24170e, roughness: 0.88, flatShading: true })
        );
        rock.position.set(0, 12, 0);
        group.add(rock);
        break;
      }
      case 2: { // Feu : Cheminée volcanique basaltique avec cratère de lave en fusion
        const geo = new THREE.ConeGeometry(3.2, 22, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x220404,
          roughness: 0.65,
          metalness: 0.35,
          emissive: 0xef4444,
          emissiveIntensity: 0.85
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 11;
        group.add(mesh);

        // Cône de magma incandescent au sommet
        const magma = new THREE.Mesh(
          new THREE.ConeGeometry(1.8, 4.0, 12),
          new THREE.MeshBasicMaterial({ color: 0xf97316 })
        );
        magma.position.y = 22;
        group.add(magma);

        // Anneau de braises
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(3.6, 0.2, 8, 20),
          new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 })
        );
        ring.position.y = 16;
        ring.rotation.x = Math.PI / 2.2;
        group.add(ring);
        break;
      }
      case 3: { // Électricité : Relais Tesla haute tension avec bobines et électrode plasma
        const geo = new THREE.CylinderGeometry(0.7, 1.4, 24, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x201a02,
          metalness: 0.85,
          roughness: 0.25,
          emissive: 0xeab308,
          emissiveIntensity: 0.85
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 12;
        group.add(mesh);

        // Électrode plasma sphérique
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(2.0, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        sphere.position.y = 24.5;
        group.add(sphere);

        // 3 Anneaux de bobinage Tesla
        for (let h = 8; h <= 20; h += 5) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.2, 0.18, 8, 16),
            new THREE.MeshBasicMaterial({ color: 0xfacc15 })
          );
          ring.position.y = h;
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        }
        break;
      }
      case 4: { // Lumière / Bonheur : Obélisque d'albâtre céleste bordé de filigranes dorés (Anti-éblouissement)
        const geo = new THREE.OctahedronGeometry(2.2, 0);
        geo.scale(1.0, 4.0, 1.0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.22,
          metalness: 0.65,
          emissive: 0x475569,
          emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 12;
        group.add(mesh);

        // Filigranes géométriques dorés (lignes propres, aucune agression visuelle)
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xfde047,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const wire = new THREE.Mesh(geo.clone(), wireMat);
        wire.position.y = 12;
        wire.scale.setScalar(1.035);
        group.add(wire);

        // Couronne fine en or doux
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(3.0, 0.08, 12, 32),
          new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.75 })
        );
        halo.position.y = 18;
        halo.rotation.x = Math.PI / 3;
        group.add(halo);
        break;
      }
      case 5: { // Ombre : Monolithe fractal de ténèbres avec cristaux d'obsidienne
        const geo = new THREE.BoxGeometry(3.0, 24, 3.0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x08080a,
          roughness: 0.95,
          metalness: 0.05,
          emissive: 0x475569,
          emissiveIntensity: 0.40
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 12;
        group.add(mesh);

        // Éperons d'ombre latéraux inclinés
        for (let s = -1; s <= 1; s += 2) {
          const claw = new THREE.Mesh(new THREE.ConeGeometry(0.8, 8, 4), mat);
          claw.position.set(s * 2.2, 14, 0);
          claw.rotation.z = s * 0.4;
          group.add(claw);
        }
        break;
      }
      case 6: { // Vent : Aileron profilé supersonique avec voiles de bourrasque
        const geo = new THREE.ConeGeometry(1.8, 26, 4);
        geo.scale(0.5, 1.0, 2.2);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x061e38,
          roughness: 0.25,
          metalness: 0.75,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.75
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 13;
        group.add(mesh);

        // Anneau vortex de vent
        const windRing = new THREE.Mesh(
          new THREE.TorusGeometry(3.0, 0.15, 8, 20),
          new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 })
        );
        windRing.position.y = 16;
        windRing.rotation.y = Math.PI / 2.5;
        group.add(windRing);
        break;
      }
      case 7: { // Cosmos : Portail quantique & gyroscope gravitationnel
        const ringGeo = new THREE.TorusGeometry(3.8, 0.35, 12, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1a0630,
          emissive: 0xc084fc,
          emissiveIntensity: 1.1,
          roughness: 0.20,
          metalness: 0.85
        });
        const ring1 = new THREE.Mesh(ringGeo, mat);
        ring1.position.y = 12;
        ring1.rotation.y = Math.PI / 2;
        group.add(ring1);

        const ring2 = new THREE.Mesh(ringGeo, mat);
        ring2.position.y = 12;
        ring2.rotation.x = Math.PI / 3;
        group.add(ring2);

        // Singularité centrale
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(1.4, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xa855f7 })
        );
        core.position.y = 12;
        group.add(core);
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
      const s = 1.0 + audioPulse * 0.08;
      prop.mesh.scale.set(s, s, s);

      // Animation dynamique des anneaux orbitaux et orbes des monuments
      if (prop.mesh.children && prop.mesh.children.length > 1) {
        for (let c = 1; c < prop.mesh.children.length; c++) {
          const child = prop.mesh.children[c];
          if (child.geometry) {
            const type = child.geometry.type || '';
            if (type.includes('Torus')) {
              child.rotation.z += (prop.side > 0 ? 1.5 : -1.5) * dt;
            } else if (type.includes('Octahedron') || type.includes('Sphere')) {
              child.rotation.y += 1.6 * dt;
              child.position.y += Math.sin(performance.now() * 0.003 + prop.mesh.position.z * 0.05) * 0.02;
            }
          }
        }
      }
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

  getRoughnessForElement(element) {
    switch (element) {
      case 'Eau': return 0.12;
      case 'Terre': return 0.95;
      case 'Feu': return 0.55;
      case 'Électricité': return 0.35;
      case 'Lumière': return 0.22;
      case 'Ombre': return 0.94;
      case 'Vent': return 0.38;
      case 'Vide ou Cosmos': return 0.28;
      default: return 0.50;
    }
  }

  getMetalnessForElement(element) {
    switch (element) {
      case 'Eau': return 0.25;
      case 'Terre': return 0.02;
      case 'Feu': return 0.15;
      case 'Électricité': return 0.30;
      case 'Lumière': return 0.15;
      case 'Ombre': return 0.02;
      case 'Vent': return 0.10;
      case 'Vide ou Cosmos': return 0.20;
      default: return 0.05;
    }
  }

  applyCycleImmediate(cycle) {
    this.scene.background.set(cycle.sky);
    this.scene.fog.color.set(cycle.fog);

    // Éclairage directionnel naturel (lumière du jour chaude préservant les teintes de terre/eau réelles)
    const naturalSun = new THREE.Color(0xfffdf6).lerp(new THREE.Color(cycle.primary), 0.16);
    this.sunLight.color.copy(naturalSun);
    this.hemiLight.color.set(cycle.secondary);
    this.hemiLight.groundColor.set(cycle.fog);
    this.sunLight.intensity = cycle.lightIntensity;

    if (this.cycleGroundTextures && this.cycleGroundTextures[this.currentCycleIndex]) {
      this.groundMaterial.map = this.cycleGroundTextures[this.currentCycleIndex];
      this.groundMaterial.color.set(0xffffff);
      this.groundMaterial.needsUpdate = true;
    }
    this.monolithMaterial.color.set(cycle.monolith);

    this.groundMaterial.roughness = this.getRoughnessForElement(cycle.element);
    this.groundMaterial.metalness = this.getMetalnessForElement(cycle.element);

    this.updateActiveElement(this.currentCycleIndex);
  }

  // Transition fluide vers un cycle donné (Glide sans coupure, obstacles préservés)
  setCycle(index, immediate = false) {
    const prevCycle = this.cycle;
    this.currentCycleIndex = (index + CYCLES_DATA.length) % CYCLES_DATA.length;
    this.cycle = CYCLES_DATA[this.currentCycleIndex];

    if (immediate || !prevCycle) {
      this.reset();
      this.applyCycleImmediate(this.cycle);
      this.createSidePropsForCycle(this.currentCycleIndex);
      return;
    }

    // TRANSITION FLUIDE SANS COUPURE (GLIDE)
    // 1. On NE vide PAS les obstacles existants : ils continuent leur course vers Infi
    // 2. Les nouveaux obstacles générés à l'horizon adopteront automatiquement le nouveau cycle
    // 3. Interpolation progressive (Lerp) des ciels, brouillards, textures et lumières
    this.isTransitioning = true;
    this.transitionProgress = 0.0;
    this.transitionDuration = 2.8;

    this.prevSkyColor = new THREE.Color(prevCycle.sky);
    this.nextSkyColor = new THREE.Color(this.cycle.sky);
    this.prevFogColor = new THREE.Color(prevCycle.fog);
    this.nextFogColor = new THREE.Color(this.cycle.fog);
    this.prevSunColor = new THREE.Color(prevCycle.primary);
    this.nextSunColor = new THREE.Color(this.cycle.primary);
    this.prevHemiColor = new THREE.Color(prevCycle.secondary);
    this.nextHemiColor = new THREE.Color(this.cycle.secondary);
    this.prevLightIntensity = prevCycle.lightIntensity;
    this.nextLightIntensity = this.cycle.lightIntensity;

    this.targetRoughness = this.getRoughnessForElement(this.cycle.element);
    this.targetMetalness = this.getMetalnessForElement(this.cycle.element);
    this.prevRoughness = this.groundMaterial.roughness;
    this.prevMetalness = this.groundMaterial.metalness;

    // Mise à jour des décors de bord de piste avec le nouveau thème
    this.createSidePropsForCycle(this.currentCycleIndex);
    this.updateActiveElement(this.currentCycleIndex);
  }

  // --- SYSTÈME DE COMBAT STAR FOX & DESTRUCTION D'OBSTACLES ---
  checkLaserCollisions(lasers, onHitCallback) {
    if (!lasers || lasers.length === 0 || this.obstacles.length === 0) return;

    for (let lIdx = lasers.length - 1; lIdx >= 0; lIdx--) {
      const laser = lasers[lIdx];
      let laserHit = false;

      for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
        const obs = this.obstacles[oIdx];

        let collided = false;
        if (obs.subBoxes) {
          for (const sub of obs.subBoxes) {
            if (sub.box.intersectsBox(laser.bbox)) {
              collided = true;
              break;
            }
          }
        } else if (obs.bbox && obs.bbox.intersectsBox(laser.bbox)) {
          collided = true;
        }

        if (collided) {
          laserHit = true;
          const hitPos = obs.mesh.position.clone();

          // Destruction de l'obstacle
          this.destroyObstacle(oIdx, laser.isSaiyan);

          // Callback pour le score (+100 PTS / +250 PTS), SFX et drops
          if (onHitCallback) {
            onHitCallback(obs, hitPos, laser.isSaiyan);
          }
          break; // Le laser s'éteint après l'impact
        }
      }

      if (laserHit) {
        this.scene.remove(laser.mesh);
        lasers.splice(lIdx, 1);
      }
    }
  }

  // Pulvérisation d'un obstacle avec éclatement de particules de son élément
  destroyObstacle(obstacleIndex, isSaiyan = false) {
    if (obstacleIndex < 0 || obstacleIndex >= this.obstacles.length) return;
    const obs = this.obstacles[obstacleIndex];
    const pos = obs.mesh.position.clone();

    // Effet d'explosion avec particules de l'élément du cycle
    this.createObstacleExplosion(pos, this.cycle.element, isSaiyan);

    this.scene.remove(obs.mesh);
    this.obstacles.splice(obstacleIndex, 1);
  }

  createObstacleExplosion(pos, element, isSaiyan = false) {
    const pCount = isSaiyan ? 56 : 34;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const velocities = [];

    let pColor = 0x00f0ff;
    if (isSaiyan) {
      pColor = 0xffea00;
    } else {
      switch (element) {
        case 'Eau': pColor = 0x00f0ff; break;
        case 'Terre': pColor = 0x22c55e; break;
        case 'Feu': pColor = 0xef4444; break;
        case 'Électricité': pColor = 0xfacc15; break;
        case 'Lumière': pColor = 0xffffff; break;
        case 'Ombre': pColor = 0x94a3b8; break;
        case 'Vent': pColor = 0x38bdf8; break;
        case 'Vide ou Cosmos': pColor = 0xc084fc; break;
      }
    }

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = pos.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = pos.y + (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 2;

      const spd = (isSaiyan ? 24 : 15) + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.cos(phi) * spd + 3.0,
        Math.sin(phi) * Math.sin(theta) * spd
      );
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: isSaiyan ? 3.2 : 2.4,
      color: pColor,
      map: getSoftGlowTexture(),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);

    this.activeExplosions.push({
      pts,
      velocities,
      timer: 0.0,
      maxAge: 0.65
    });
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

  // Troll 1 (Chute) : Trombe d'eau abyssale tombant du ciel en piqué (Vrai élément Eau)
  spawnFallingPillar(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const h = 32.0, rTop = 2.2, rBot = 4.0;

    // Matériau hydrodynamique azur translucide et réflectif
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x062846,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.85,
      roughness: 0.08,
      metalness: 0.9,
      transparent: true,
      opacity: 0.86
    });

    const colGeo = new THREE.CylinderGeometry(rTop, rBot, h, 16);
    const column = new THREE.Mesh(colGeo, waterMat);
    column.position.y = h / 2;
    column.castShadow = true;
    group.add(column);
    subBoxes.push({ mesh: column, box: new THREE.Box3() });

    // Anneaux d'écume blanche marine tourbillonnants
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.75
    });
    for (let f = 0; f < 3; f++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + f * 0.4, 0.18, 8, 20), foamMat);
      ring.position.y = 5.0 + f * 9.0;
      ring.rotation.x = Math.PI / 2.3;
      group.add(ring);
    }

    // Crête supérieure d'écume
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(rTop * 1.3, 3.5, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
    );
    crown.position.y = h + 1.2;
    group.add(crown);

    group.position.set(x, 48.0, this.spawnDistance); // Tombe depuis le ciel

    const bbox = new THREE.Box3().setFromObject(group);
    const obj = { mesh: group, subBoxes, bbox, type: 'falling', targetY: 0, fallSpeed: 44.0, hasSplashed: false };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Troll 2 (Résilience) : Porte tellurique à mégalithes coulissants (Terre & Roches)
  spawnSlidingGate(gapX) {
    const group = new THREE.Group();
    const h = 24.0, thickness = 5.0;
    const subBoxes = [];

    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x3e2817,
      roughness: 0.92,
      metalness: 0.05
    });

    const mossMat = new THREE.MeshStandardMaterial({
      color: 0x2e632b,
      roughness: 0.85,
      metalness: 0.02
    });

    // Couloir de vol élargi à 17m pour permettre une esquive fluide et maîtrisée
    const halfGap = 8.5;
    const leftW = Math.max(16, gapX + 28);
    const leftGeo = new THREE.BoxGeometry(leftW, h, thickness);
    const leftMesh = new THREE.Mesh(leftGeo, earthMat);
    leftMesh.position.set(-leftW / 2 + gapX - halfGap, h / 2, 0);
    leftMesh.castShadow = true;
    group.add(leftMesh);
    subBoxes.push({ mesh: leftMesh, box: new THREE.Box3() });

    // Rebord de roche et mousse sur le dessus du linteau gauche
    const leftCap = new THREE.Mesh(new THREE.BoxGeometry(leftW, 1.8, thickness * 1.15), mossMat);
    leftCap.position.set(-leftW / 2 + gapX - halfGap, h + 0.9, 0);
    group.add(leftCap);

    const rightW = Math.max(16, 28 - gapX);
    const rightGeo = new THREE.BoxGeometry(rightW, h, thickness);
    const rightMesh = new THREE.Mesh(rightGeo, earthMat);
    rightMesh.position.set(rightW / 2 + gapX + halfGap, h / 2, 0);
    rightMesh.castShadow = true;
    group.add(rightMesh);
    subBoxes.push({ mesh: rightMesh, box: new THREE.Box3() });

    // Rebord de roche et mousse sur le dessus du linteau droit
    const rightCap = new THREE.Mesh(new THREE.BoxGeometry(rightW, 1.8, thickness * 1.15), mossMat);
    rightCap.position.set(rightW / 2 + gapX + halfGap, h + 0.9, 0);
    group.add(rightCap);

    group.position.set(0, 0, this.spawnDistance);
    // Vitesse d'oscillation et amplitude modérées pour éviter les écrasements frustrants
    const obj = { mesh: group, subBoxes, type: 'sliding', baseX: 0, phase: Math.random() * Math.PI * 2, amplitude: 3.5, dir: Math.random() < 0.5 ? 1 : -1, speed: 2.4 };

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

  // Troll 5 (Bonheur) : Harpe de lasers célestes dorés (Rempli de lignes fines et pures, anti-éblouissement)
  spawnSolarBeam() {
    const group = new THREE.Group();
    const subBoxes = [];
    const spanW = 34.0;
    const height = 18.0;

    // Pylônes émetteurs latéraux en albâtre et or doux
    const pylonGeo = new THREE.CylinderGeometry(0.55, 0.95, height, 12);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.35
    });

    const leftPylon = new THREE.Mesh(pylonGeo, pylonMat);
    leftPylon.position.set(-spanW / 2, height / 2, 0);
    leftPylon.castShadow = true;
    group.add(leftPylon);
    subBoxes.push({ mesh: leftPylon, box: new THREE.Box3() });

    const rightPylon = new THREE.Mesh(pylonGeo, pylonMat);
    rightPylon.position.set(spanW / 2, height / 2, 0);
    rightPylon.castShadow = true;
    group.add(rightPylon);
    subBoxes.push({ mesh: rightPylon, box: new THREE.Box3() });

    // Couloir de passage sûr de 11 mètres (gauche, centre ou droite)
    const gapSlots = [-8.5, 0.0, 8.5];
    const safeX = gapSlots[Math.floor(Math.random() * gapSlots.length)];
    const halfSafe = 5.5;

    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.88
    });

    // 4 cordes horizontales de laser dorées réparties en hauteur
    const levels = [3.5, 7.0, 10.5, 14.0];
    levels.forEach((y) => {
      // Segment gauche
      const leftW = Math.max(0.1, (safeX - halfSafe) - (-spanW / 2));
      if (leftW > 1.2) {
        const segL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, leftW, 8), laserMat);
        segL.rotation.z = Math.PI / 2;
        segL.position.set(-spanW / 2 + leftW / 2, y, 0);
        group.add(segL);
        subBoxes.push({ mesh: segL, box: new THREE.Box3() });
      }

      // Segment droit
      const rightW = Math.max(0.1, (spanW / 2) - (safeX + halfSafe));
      if (rightW > 1.2) {
        const segR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, rightW, 8), laserMat);
        segR.rotation.z = Math.PI / 2;
        segR.position.set(spanW / 2 - rightW / 2, y, 0);
        group.add(segR);
        subBoxes.push({ mesh: segR, box: new THREE.Box3() });
      }
    });

    // Balises lumineuses douces guidant le joueur vers le couloir de vol sécurisé
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const bL = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), beaconMat);
    bL.position.set(safeX - halfSafe, 8.5, 0);
    group.add(bL);

    const bR = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), beaconMat);
    bR.position.set(safeX + halfSafe, 8.5, 0);
    group.add(bR);

    group.position.set(0, 0, this.spawnDistance);

    const obj = { mesh: group, subBoxes, type: 'solar', pulseTimer: 0 };
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

  // Cycle 1 (Eau) : Geyser marin en spirale jaillissant de l'abysse (Vrai élément Eau)
  spawnWaterSpire(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const h = 32.0;

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x042442,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.90,
      roughness: 0.06,
      metalness: 0.92,
      transparent: true,
      opacity: 0.88
    });

    const geo = new THREE.ConeGeometry(3.0, h, 12);
    const spire = new THREE.Mesh(geo, waterMat);
    spire.position.y = h / 2;
    spire.castShadow = true;
    group.add(spire);
    subBoxes.push({ mesh: spire, box: new THREE.Box3() });

    // Anneaux d'écume marine
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.22, 8, 24), ringMat);
    r1.position.y = 0.5;
    r1.rotation.x = Math.PI / 2;
    group.add(r1);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.16, 8, 20), ringMat);
    r2.position.y = 16.0;
    r2.rotation.x = Math.PI / 2.2;
    group.add(r2);

    // Orbe d'eau lumineuse au sommet
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 })
    );
    orb.position.y = h;
    group.add(orb);

    group.position.set(x, 0, this.spawnDistance);
    this.spawnWaterRipple(x, this.spawnDistance);

    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 2 (Terre) : Spire tellurique en strates rocheuses naturelles (sans vert uniforme)
  spawnEarthMonolith(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const h = 26.0;

    // Matériaux roche tellurique et glaise sédimentaire
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x332014,
      roughness: 0.92,
      metalness: 0.06,
      flatShading: true
    });

    const clayMat = new THREE.MeshStandardMaterial({
      color: 0x54361e,
      roughness: 0.96,
      metalness: 0.04,
      flatShading: true
    });

    const slateMat = new THREE.MeshStandardMaterial({
      color: 0x24170e,
      roughness: 0.88,
      metalness: 0.12,
      flatShading: true
    });

    // 3 segments étagés de strates géologiques
    const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 4.2, 9.0, 7), rockMat);
    seg1.position.y = 4.5;
    seg1.castShadow = true;
    group.add(seg1);
    subBoxes.push({ mesh: seg1, box: new THREE.Box3() });

    const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 9.0, 6), clayMat);
    seg2.position.y = 13.5;
    seg2.rotation.y = 0.5;
    seg2.castShadow = true;
    group.add(seg2);
    subBoxes.push({ mesh: seg2, box: new THREE.Box3() });

    const seg3 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.6, 8.0, 5), slateMat);
    seg3.position.y = 22.0;
    seg3.rotation.y = -0.3;
    seg3.castShadow = true;
    group.add(seg3);
    subBoxes.push({ mesh: seg3, box: new THREE.Box3() });

    // Bloc tellurique rocheux au sommet
    const capRock = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 0), clayMat);
    capRock.position.set((Math.random() - 0.5) * 1.5, h + 1.2, (Math.random() - 0.5) * 1.5);
    capRock.rotation.set(Math.random(), Math.random(), 0);
    group.add(capRock);
    subBoxes.push({ mesh: capRock, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
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

  // Cycle 5 (Lumière) : Obélisque de quartz céleste bordé de filigranes dorés (Anti-éblouissement)
  spawnPrismObelisk(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const h = 32.0;

    const quartzMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.18,
      emissive: 0x475569,
      emissiveIntensity: 0.3
    });

    const obeliskGeo = new THREE.CylinderGeometry(1.4, 2.6, h, 4);
    const obelisk = new THREE.Mesh(obeliskGeo, quartzMat);
    obelisk.position.y = h / 2;
    obelisk.rotation.y = Math.PI / 4;
    obelisk.castShadow = true;
    group.add(obelisk);
    subBoxes.push({ mesh: obelisk, box: new THREE.Box3() });

    // Filigranes filaires dorés
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const wire = new THREE.Mesh(obeliskGeo.clone(), wireMat);
    wire.position.y = h / 2;
    wire.rotation.y = Math.PI / 4;
    wire.scale.setScalar(1.03);
    group.add(wire);

    // Prisme pyramidal au sommet
    const apex = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.85 })
    );
    apex.position.y = h + 1.2;
    group.add(apex);

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
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

    // 0. Transition fluide et cinématographique de cycle (Glide sans rupture)
    if (this.isTransitioning) {
      this.transitionProgress += dt / this.transitionDuration;
      const t = Math.min(1.0, this.transitionProgress);
      const smoothT = t * t * (3 - 2 * t);

      this.scene.background.lerpColors(this.prevSkyColor, this.nextSkyColor, smoothT);
      this.scene.fog.color.lerpColors(this.prevFogColor, this.nextFogColor, smoothT);

      // Voile atmosphérique doux qui estompe subtilement l'horizon pendant le passage (pic à mi-course)
      const fogVeil = Math.sin(t * Math.PI) * 18.0;
      this.scene.fog.near = Math.max(34, 55 - fogVeil);

      this.sunLight.color.lerpColors(this.prevSunColor, this.nextSunColor, smoothT);
      this.hemiLight.color.lerpColors(this.prevHemiColor, this.nextHemiColor, smoothT);
      this.hemiLight.groundColor.lerpColors(this.prevFogColor, this.nextFogColor, smoothT);
      this.sunLight.intensity = THREE.MathUtils.lerp(this.prevLightIntensity, this.nextLightIntensity, smoothT);
      this.groundMaterial.roughness = THREE.MathUtils.lerp(this.prevRoughness, this.targetRoughness, smoothT);
      this.groundMaterial.metalness = THREE.MathUtils.lerp(this.prevMetalness, this.targetMetalness, smoothT);

      // Basculer la texture de sol en douceur à mi-course
      if (t >= 0.5 && this.cycleGroundTextures && this.cycleGroundTextures[this.currentCycleIndex]) {
        if (this.groundMaterial.map !== this.cycleGroundTextures[this.currentCycleIndex]) {
          this.groundMaterial.map = this.cycleGroundTextures[this.currentCycleIndex];
          this.groundMaterial.needsUpdate = true;
        }
      }

      if (t >= 1.0) {
        this.isTransitioning = false;
        this.scene.fog.near = 55;
        this.applyCycleImmediate(this.cycle);
      }
    }

    // Animation 3D physique des vagues d'eau et du relief
    this.updateTerrainMesh(time);

    // Défilement continu et fluide des textures (UV Flow vivant)
    if (this.groundMaterial && this.groundMaterial.map) {
      this.groundMaterial.map.offset.y -= speed * dt * 0.0018;
      if (this.currentCycleIndex === 0) {
        this.groundMaterial.map.offset.x = Math.sin(time * 0.7) * 0.015;
      }
    }

    // Effet de lave magmatique incandescente pour le Cycle 3 (Obsession)
    if (this.currentCycleIndex === 2) {
      const lavaPulse = 0.40 + Math.sin(time * 3.5) * 0.18 + (typeof bassEnergy === 'number' ? bassEnergy * 0.35 : 0);
      this.groundMaterial.emissive = new THREE.Color(0xff2200);
      this.groundMaterial.emissiveIntensity = lavaPulse;
    } else if (this.groundMaterial.emissiveIntensity > 0) {
      this.groundMaterial.emissiveIntensity = 0;
    }

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

    // 4. Cadencement progressif des obstacles : espacement resserré au fil des cycles
    // Cycle 1 : 2.15s (vol fluide et accessible) -> Cycle 8 : 0.82s (réflexes supersoniques intenses)
    this.timeSinceLastSpawn = (this.timeSinceLastSpawn || 0) + dt;
    const cycleIdx = this.currentCycleIndex || 0;
    const minSpawnDelay = Math.max(0.78, 2.15 - cycleIdx * 0.19);
    const isIntense = (cycleIdx >= 3) && (speed > 60.0 || bass > 0.50);
    const isSpawnBeat = isIntense ? (isNewBeat && (beatInBar === 0 || beatInBar === 2)) : (isNewBeat && beatInBar === 0);

    // Maintien d'un espacement minimal progressif selon le cycle
    if (isSpawnBeat && this.timeSinceLastSpawn >= minSpawnDelay) {
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
        let hitResult = null;
        if (obs.subBoxes) {
          for (const sub of obs.subBoxes) {
            const res = onCollisionCheck(sub.box, obs, i);
            if (res) { hitResult = res; break; }
          }
        } else {
          hitResult = onCollisionCheck(obs.bbox, obs, i);
        }

        if (hitResult === 'destroy' || hitResult === 'smash') {
          this.destroyObstacle(i, hitResult === 'smash');
          continue;
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

    // 6. Animation des particules d'explosion des obstacles détruits (Star Fox & Saiyan)
    if (this.activeExplosions) {
      for (let i = this.activeExplosions.length - 1; i >= 0; i--) {
        const exp = this.activeExplosions[i];
        exp.timer += dt;
        const pos = exp.pts.geometry.attributes.position.array;
        const vel = exp.velocities;
        for (let p = 0; p < vel.length / 3; p++) {
          pos[p * 3] += vel[p * 3] * dt;
          pos[p * 3 + 1] += vel[p * 3 + 1] * dt;
          pos[p * 3 + 2] += vel[p * 3 + 2] * dt;
          vel[p * 3 + 1] -= 24.0 * dt; // Pesanteur
        }
        exp.pts.geometry.attributes.position.needsUpdate = true;
        exp.pts.material.opacity = Math.max(0, 0.95 * (1.0 - exp.timer / exp.maxAge));

        if (exp.timer >= exp.maxAge) {
          this.scene.remove(exp.pts);
          exp.pts.geometry.dispose();
          exp.pts.material.dispose();
          this.activeExplosions.splice(i, 1);
        }
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

    if (this.activeExplosions) {
      for (const exp of this.activeExplosions) {
        this.scene.remove(exp.pts);
        exp.pts.geometry.dispose();
        exp.pts.material.dispose();
      }
      this.activeExplosions = [];
    }
  }
}
