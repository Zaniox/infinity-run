/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
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
  getCosmicDustTexture,
  getPurityMoteTexture
} from './particles.js';

export const CYCLES_DATA = [
  {
    id: 1,
    name: "Chute",
    subtitle: "Cyan & Abysse • Eau (Océan Céleste & Cascades)",
    element: "Eau",
    colorName: "Cyan Océan",
    troll: "TROMBES D'EAU ABYSSALES : Cascades et geysers d'eau tourbillonnants en piqué",
    sky: 0x042442,
    fog: 0x07446b,
    ground: 0x023059,
    monolith: 0x073b61,
    primary: 0x00f0ff,
    secondary: 0x38bdf8,
    lightIntensity: 1.85,
    style: "falling"
  },
  {
    id: 2,
    name: "Résilience",
    subtitle: "Ocre & Terracotta • Falaises Telluriques & Grès",
    element: "Terre",
    colorName: "Ocre & Grès",
    troll: "PISTONS TELLURIQUES : Mégalithes de terre et roche qui s'écrasent sur le beat",
    sky: 0x2d170b,
    fog: 0x4a2a16,
    ground: 0x4e2912,
    monolith: 0x5c3217,
    primary: 0xf59e0b,
    secondary: 0x10b981,
    lightIntensity: 1.75,
    style: "sliding"
  },
  {
    id: 3,
    name: "Obsession",
    subtitle: "Crimson & Magma • Brasier Volcanique",
    element: "Feu",
    colorName: "Rouge Magma",
    troll: "ARCHES DE FEU EN VRILLE : Anneaux de lave en fusion tournant en spirale infernale",
    sky: 0x300505,
    fog: 0x520a0a,
    ground: 0x2b0404,
    monolith: 0x4a0808,
    primary: 0xff3b00,
    secondary: 0xfbbf24,
    lightIntensity: 2.1,
    style: "spiral"
  },
  {
    id: 4,
    name: "Amour",
    subtitle: "Indigo & Foudre • Orage Plasma Haute-Tension",
    element: "Électricité",
    colorName: "Jaune Foudre",
    troll: "PYLÔNES TESLA & ARCS DE FOUDRE : Décharges plasma haute-tension entre pylônes",
    sky: 0x0e0c24,
    fog: 0x191540,
    ground: 0x161233,
    monolith: 0x241e54,
    primary: 0xfacc15,
    secondary: 0x00f0ff,
    lightIntensity: 2.2,
    style: "tesla"
  },
  {
    id: 5,
    name: "Bonheur",
    subtitle: "Or Céleste & Albâtre • Rayonnement Solaire Pur",
    element: "Lumière",
    colorName: "Or & Albâtre",
    troll: "HARPE DE LASERS CÉLESTES : Trame de cordes lumineuses dorées à esquiver",
    sky: 0x1e1b38,
    fog: 0x3a335e,
    ground: 0x352f52,
    monolith: 0x52487a,
    primary: 0xfef08a,
    secondary: 0xffffff,
    lightIntensity: 2.0,
    style: "solar"
  },
  {
    id: 6,
    name: "Chaos",
    subtitle: "Obsidienne & Cendres • Néant d'Améthyste",
    element: "Ombre",
    colorName: "Violet Noir & Cendres",
    troll: "SÉISME D'OMBRES : Piliers silhouettes gris cendre tremblant violemment sur les basses",
    sky: 0x110d1c,
    fog: 0x201733,
    ground: 0x171224,
    monolith: 0x261d3b,
    primary: 0xa855f7,
    secondary: 0x64748b,
    lightIntensity: 1.7,
    style: "quake"
  },
  {
    id: 7,
    name: "Ambition",
    subtitle: "Azur Céleste • Voie Aérienne Supersonique",
    element: "Vent",
    colorName: "Bleu Azur",
    troll: "AIGUILLES DU VENT ASCENDANT : Pics cristallins profilés jaillissant sous les bourrasques",
    sky: 0x093359,
    fog: 0x13548a,
    ground: 0x0d4370,
    monolith: 0x165c99,
    primary: 0x38bdf8,
    secondary: 0xe0f2fe,
    lightIntensity: 2.1,
    style: "needles"
  },
  {
    id: 8,
    name: "Folie",
    subtitle: "Nébuleuse Astrale • Trou Noir & Distorsion Spatiale",
    element: "Vide ou Cosmos",
    colorName: "Magenta Stellaire",
    troll: "LA FEINTE COSMIQUE : Distorsion du vide, mirages spatiaux et boucle temporelle",
    sky: 0x16032c,
    fog: 0x2b0654,
    ground: 0x1e043b,
    monolith: 0x3d0a75,
    primary: 0xd946ef,
    secondary: 0x818cf8,
    lightIntensity: 2.2,
    style: "glitch"
  }
];


export const CYCLE_FLIGHT_PROFILES = [
  // 0: Chute (Noir / Eau) - "au début la map ça va vers le bas" : Piqué abyssal vers les profondeurs (-8.6°)
  {
    pitch: -0.18, // Piqué abyssal profond vers le bas
    camYOffset: 2.2,
    targetYOffset: -6.5,
    rollWobbleAmp: 0.02,
    rollWobbleFreq: 1.0,
    waveAltitudeAmp: 0.0,
    fovMod: 0,
    turbulence: 0.0
  },
  // 1: Résilience (Marron & Terre) - "résilience on reste droit" : Trajectoire droite, ancrée, horizontale
  {
    pitch: 0.0, // Tout droit
    camYOffset: 0.0,
    targetYOffset: 0.0,
    rollWobbleAmp: 0.0,
    rollWobbleFreq: 0.0,
    waveAltitudeAmp: 0.0,
    fovMod: 0,
    turbulence: 0.0
  },
  // 2: Obsession (Rouge / Feu) - "obsession on est hypnotisé obsession" : Roulis oscillant hypnotique & pulsation
  {
    pitch: -0.02,
    camYOffset: -0.2,
    targetYOffset: 0.0,
    rollWobbleAmp: 0.12, // Roulis hypnotique
    rollWobbleFreq: 2.2,
    waveAltitudeAmp: 0.4,
    waveAltitudeFreq: 2.2,
    fovMod: 2.5,
    turbulence: 0.03
  },
  // 3: Amour (Jaune / Électricité) - "amour très vague" : Vol en vagues amples sinusoidales
  {
    pitch: 0.04,
    camYOffset: 0.3,
    targetYOffset: 0.6,
    rollWobbleAmp: 0.10,
    rollWobbleFreq: 1.5,
    waveAltitudeAmp: 1.35, // Fortes vagues d'altitude
    waveAltitudeFreq: 1.5,
    fovMod: 0,
    turbulence: 0.02
  },
  // 4: Bonheur (Or & Albâtre / Lumière) - "bonheur ça monte" : Ascension céleste continue vers la clarté (+8.0°)
  {
    pitch: 0.14, // Montée continue
    camYOffset: -1.2,
    targetYOffset: 4.5,
    rollWobbleAmp: 0.02,
    rollWobbleFreq: 1.0,
    waveAltitudeAmp: 0.25,
    waveAltitudeFreq: 1.0,
    fovMod: 0,
    turbulence: 0.0
  },
  // 5: Chaos (Gris / Ombre) - "chaos ça va dans tous les sens" : Turbulences erratiques intenses
  {
    pitch: 0.0,
    camYOffset: 0.0,
    targetYOffset: 0.0,
    rollWobbleAmp: 0.08,
    rollWobbleFreq: 2.2,
    waveAltitudeAmp: 0.35,
    waveAltitudeFreq: 2.0,
    fovMod: 1.5,
    turbulence: 0.08 // Turbulences cinématiques lissées (anti-mal de tête)
  },
  // 6: Ambition (Bleu / Vent) - "ambition ça monte vers le haut" : Ascension supersonique prononcée (+14.3°)
  {
    pitch: 0.25, // Montée abrupte vers le ciel
    camYOffset: -2.2,
    targetYOffset: 7.8,
    rollWobbleAmp: 0.03,
    rollWobbleFreq: 1.0,
    waveAltitudeAmp: 0.3,
    waveAltitudeFreq: 1.0,
    fovMod: -2.0,
    turbulence: 0.05
  },
  // 7: Folie (Violet / Cosmos) - "folie ça se distord on devient fou" : Distorsion de réalité & pulsation de FOV
  {
    pitch: -0.05,
    camYOffset: 0.4,
    targetYOffset: -1.0,
    rollWobbleAmp: 0.10,
    rollWobbleFreq: 2.0,
    waveAltitudeAmp: 0.45,
    waveAltitudeFreq: 1.8,
    fovMod: 3.5, // Pulsation de FOV subtile et confortable
    turbulence: 0.05 // Tremblements apaisés
  }
];


/**
 * Portail Dimensionnel 3D de Transition de Cycle
 * Apparaît à l'horizon à la fin de chaque piste musicale
 */
export class PortalGate {
  constructor(targetCycleIndex, targetColorPrimary, targetColorSecondary) {
    this.targetCycleIndex = targetCycleIndex;
    this.group = new THREE.Group();
    this.active = true;

    // 1. Grand anneau extérieur monumental (Torus)
    const torusGeo = new THREE.TorusGeometry(14, 1.2, 24, 48);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: new THREE.Color(targetColorPrimary),
      emissiveIntensity: 0.95,
      roughness: 0.25,
      metalness: 0.85
    });
    this.outerRing = new THREE.Mesh(torusGeo, torusMat);
    this.group.add(this.outerRing);

    // 2. Anneau intérieur rotatif à contre-courant
    const innerTorusGeo = new THREE.TorusGeometry(11.5, 0.45, 16, 36);
    const innerMat = new THREE.MeshBasicMaterial({
      color: targetColorSecondary,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    this.innerRing = new THREE.Mesh(innerTorusGeo, innerMat);
    this.group.add(this.innerRing);

    // 3. Horizon des événements (Disque tourbillonnant de distorsion)
    const vortexGeo = new THREE.CircleGeometry(11.0, 36);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: targetColorPrimary,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.vortex = new THREE.Mesh(vortexGeo, vortexMat);
    this.group.add(this.vortex);

    // 4. Rayon balise céleste vertical montant vers les cieux
    const beamGeo = new THREE.CylinderGeometry(1.5, 4.0, 140, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: targetColorPrimary,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.beam = new THREE.Mesh(beamGeo, beamMat);
    this.beam.position.y = 65;
    this.group.add(this.beam);

    // 5. Particules d'aspiration dimensionnelle
    this.pCount = 55;
    const pGeo = new THREE.BufferGeometry();
    this.pPos = new Float32Array(this.pCount * 3);
    this.pSeeds = [];
    for (let i = 0; i < this.pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 12;
      this.pSeeds.push({
        angle,
        radius: r,
        baseRadius: r,
        speed: 1.5 + Math.random() * 2.5,
        z: (Math.random() - 0.5) * 18
      });
      this.pPos[i * 3] = Math.cos(angle) * r;
      this.pPos[i * 3 + 1] = Math.sin(angle) * r;
      this.pPos[i * 3 + 2] = this.pSeeds[i].z;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3));
    this.pMat = new THREE.PointsMaterial({
      size: 1.8,
      map: getSoftGlowTexture(),
      color: targetColorPrimary,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.particles = new THREE.Points(pGeo, this.pMat);
    this.group.add(this.particles);

    // 6. Source de lumière du portail
    this.light = new THREE.PointLight(targetColorPrimary, 4.0, 60);
    this.light.position.set(0, 0, 0);
    this.group.add(this.light);

    // Élévation initiale à l'horizon
    this.group.position.set(0, 12, -230);
  }

  update(dt, deltaZ, time) {
    this.group.position.z += deltaZ;

    // Rotations hypnotiques des anneaux
    this.outerRing.rotation.z += 0.6 * dt;
    this.innerRing.rotation.z -= 1.1 * dt;
    this.vortex.rotation.z += 1.4 * dt;
    this.beam.rotation.y += 0.8 * dt;

    // Pulsation lumineuse
    const pulse = 1.0 + Math.sin(time * 5.0) * 0.25;
    this.vortex.scale.set(pulse, pulse, 1.0);
    this.light.intensity = 3.5 * pulse;

    // Mouvement des particules d'aspiration vers le centre
    for (let i = 0; i < this.pCount; i++) {
      const s = this.pSeeds[i];
      s.radius -= s.speed * 4.0 * dt;
      s.angle += s.speed * dt;
      s.z += (0 - s.z) * 2.0 * dt;

      if (s.radius < 1.0) {
        s.radius = s.baseRadius;
        s.z = (Math.random() - 0.5) * 16;
      }
      this.pPos[i * 3] = Math.cos(s.angle) * s.radius;
      this.pPos[i * 3 + 1] = Math.sin(s.angle) * s.radius;
      this.pPos[i * 3 + 2] = s.z;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  dispose(scene) {
    scene.remove(this.group);
    this.outerRing.geometry.dispose();
    this.outerRing.material.dispose();
    this.innerRing.geometry.dispose();
    this.innerRing.material.dispose();
    this.vortex.geometry.dispose();
    this.vortex.material.dispose();
    this.beam.geometry.dispose();
    this.beam.material.dispose();
    this.particles.geometry.dispose();
    this.particles.material.dispose();
  }
}


/**
 * Générateur des textures de sol procédurales haute définition des 8 cycles
 * Riches, fluides, sans couture et parfaitement adaptées aux éléments
 */
function createCycleGroundTextures() {
  const textures = [];

  // Helper de dessin vectoriel périodique sans couture (tiling 512x512)
  function drawSeamlessCurve(ctx, pts, strokeStyle, lineWidth) {
    const offsets = [
      [0, 0], [512, 0], [-512, 0], [0, 512], [0, -512],
      [512, 512], [-512, 512], [512, -512], [-512, -512]
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

  // 1. Cycle 1 : Eau / Chute (Vraie Eau Liquide : Caustiques Océaniques Entremêlées, Réfraction & Écume)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;

    // Simulation de caustiques et interférences d'ondes liquides continues (100% sans couture)
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;

        const w1 = Math.sin(nx * 3 + Math.cos(ny * 4));
        const w2 = Math.cos(ny * 3 + Math.sin(nx * 4));
        const w3 = Math.sin((nx + ny) * 5) * 0.45;
        const w4 = Math.cos((nx * 2 - ny * 3) * 1.5) * 0.35;
        let caustic = Math.pow(Math.max(0, (w1 + w2 + w3 + w4) * 0.38 + 0.35), 3.2);
        caustic = Math.min(1.0, caustic * 1.9);

        const idx = (y * 512 + x) * 4;
        // Océan abyssal saphir à turquoise cristallin lumineux
        d[idx] = Math.floor(2 + caustic * 110);
        d[idx + 1] = Math.floor(32 + caustic * 205);
        d[idx + 2] = Math.floor(75 + caustic * 180);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Écume et micro-rides de surface douces
    ctx.globalCompositeOperation = 'screen';
    for (let c = 0; c < 6; c++) {
      const pts = [];
      const baseY = (c / 6) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + c * 1.4) * 22;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(180, 240, 255, 0.22)', 18);
      drawSeamlessCurve(ctx, pts, 'rgba(235, 255, 255, 0.45)', 2.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 2. Cycle 2 : Terre / Résilience (Strates Géologiques, Terre Battue & Failles Tectoniques Continues)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;

    // Strates sédimentaires harmoniques et bruit rocheux
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;
        const strata = Math.sin(ny * 6 + Math.sin(nx * 2) * 1.6) * 0.5 + 0.5;
        const grain = (Math.sin(nx * 32 + ny * 24) * 0.5 + 0.5) * 0.22;
        const val = strata * 0.65 + grain + 0.25;

        const idx = (y * 512 + x) * 4;
        d[idx] = Math.floor(48 * val + 18);
        d[idx + 1] = Math.floor(30 * val + 10);
        d[idx + 2] = Math.floor(16 * val + 5);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Réseau de failles telluriques et craquelures rocheuses
    for (let f = 0; f < 12; f++) {
      const pts = [];
      let curX = (f * 137) % 512;
      let curY = (f * 191) % 512;
      pts.push([curX, curY]);
      for (let step = 0; step < 6; step++) {
        curX += (((step + f) * 37) % 72) - 36;
        curY += (((step + f) * 47) % 68) - 24;
        pts.push([curX, curY]);
      }
      drawSeamlessCurve(ctx, pts, '#100805', 4.0);
      drawSeamlessCurve(ctx, pts.map(p => [p[0] + 1.2, p[1] - 1.2]), '#6a3e21', 1.4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 3. Cycle 3 : Feu / Obsession (Basalte Noir Volcanique & Veines de Magma Incandescentes)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;

    // Fissures magmatiques continues à haute température
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;

        const m1 = Math.abs(Math.sin(nx * 2.5 + Math.cos(ny * 3.5)));
        const m2 = Math.abs(Math.cos(ny * 2.5 + Math.sin(nx * 3.5)));
        const heat = Math.pow(Math.max(0, 1.0 - (m1 + m2) * 0.58), 2.8);

        const idx = (y * 512 + x) * 4;
        if (heat > 0.04) {
          // Lave en fusion : cœur jaune-blanc incandescent, bordure orange-rouge flamboyante
          d[idx] = Math.min(255, Math.floor(190 + heat * 65));
          d[idx + 1] = Math.min(255, Math.floor(35 + heat * 220));
          d[idx + 2] = Math.min(255, Math.floor(heat * heat * 170));
        } else {
          // Croûte de basalte refroidie avec granulosité
          const noise = (Math.sin(nx * 28 + ny * 24) * 0.5 + 0.5) * 12;
          d[idx] = Math.floor(16 + noise);
          d[idx + 1] = Math.floor(5 + noise * 0.25);
          d[idx + 2] = Math.floor(5 + noise * 0.25);
        }
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Fleuves de lave majeurs et braises
    ctx.globalCompositeOperation = 'screen';
    for (let l = 0; l < 4; l++) {
      const pts = [];
      const baseY = (l / 4) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + l * 2.2) * 32;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(255, 60, 0, 0.42)', 44);
      drawSeamlessCurve(ctx, pts, 'rgba(255, 140, 0, 0.85)', 18);
      drawSeamlessCurve(ctx, pts, 'rgba(255, 245, 160, 0.95)', 6);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 4. Cycle 4 : Électricité / Amour (Circuits Imprimés PCB Cyberpunk & Traces Haute Tension)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Châssis métallique sombre
    ctx.fillStyle = '#060712';
    ctx.fillRect(0, 0, 512, 512);

    // Grille de substrat tech subtile
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x <= 512; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
    }
    for (let y = 0; y <= 512; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }

    // Bus de pistes de circuits imprimés orthogonaux
    ctx.globalCompositeOperation = 'screen';
    for (let p = 0; p < 8; p++) {
      const y = (p / 8) * 512;
      drawSeamlessCurve(ctx, [[0, y], [512, y]], 'rgba(250, 204, 21, 0.45)', 3.5);
      drawSeamlessCurve(ctx, [[0, y], [512, y]], 'rgba(254, 240, 138, 0.85)', 1.2);
    }
    for (let p = 0; p < 8; p++) {
      const x = (p / 8) * 512;
      drawSeamlessCurve(ctx, [[x, 0], [x, 512]], 'rgba(250, 204, 21, 0.45)', 3.5);
      drawSeamlessCurve(ctx, [[x, 0], [x, 512]], 'rgba(254, 240, 138, 0.85)', 1.2);
    }

    // Pistes diagonales à 45°
    for (let d = 0; d < 4; d++) {
      const off = (d / 4) * 512;
      drawSeamlessCurve(ctx, [[off, 0], [off + 256, 256]], 'rgba(0, 240, 255, 0.40)', 2.0);
      drawSeamlessCurve(ctx, [[off, 256], [off + 256, 512]], 'rgba(0, 240, 255, 0.40)', 2.0);
    }

    // Puces IC microprocesseurs intégrées
    ctx.globalCompositeOperation = 'source-over';
    const chips = [[96, 96], [352, 96], [96, 352], [352, 352]];
    for (const [cx, cy] of chips) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 28, cy - 28, 56, 56);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 28, cy - 28, 56, 56);

      // Pins de connexion
      ctx.fillStyle = '#fde047';
      for (let k = -20; k <= 20; k += 10) {
        ctx.fillRect(cx + k - 2, cy - 34, 4, 6);
        ctx.fillRect(cx + k - 2, cy + 28, 4, 6);
        ctx.fillRect(cx - 34, cy + k - 2, 6, 4);
        ctx.fillRect(cx + 28, cy + k - 2, 6, 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 5. Cycle 5 : Lumière / Bonheur (Marbre Carrara Blanc & Veines d'Or Céleste - Doux & Anti-Éblouissement)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;

    // Base marbre albâtre soyeux avec veines douces
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;
        const v1 = Math.sin(nx * 3 + Math.sin(ny * 2) * 2.2);
        const v2 = Math.cos(ny * 3 + Math.cos(nx * 2) * 1.8);
        const vein = Math.abs(v1 + v2) * 0.5;
        const base = 230 + Math.floor(Math.sin(nx + ny) * 12);

        const idx = (y * 512 + x) * 4;
        d[idx] = Math.min(255, Math.floor(base - vein * 28));
        d[idx + 1] = Math.min(255, Math.floor(base - vein * 24));
        d[idx + 2] = Math.min(255, Math.floor(base - vein * 16));
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Veines d'or champagne céleste délicates
    for (let v = 0; v < 5; v++) {
      const pts = [];
      const baseY = (v / 5) * 512;
      for (let x = 0; x <= 512; x += 16) {
        const y = baseY + Math.sin((x / 512) * Math.PI * 4 + v * 1.6) * 26;
        pts.push([x, y]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(217, 160, 25, 0.45)', 4.0);
      drawSeamlessCurve(ctx, pts, 'rgba(254, 240, 138, 0.85)', 1.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 6. Cycle 6 : Ombre / Chaos (Obsidienne Tranchante, Miroir Sombre & Fractures Géométriques)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base obsidienne sombre
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, 512, 512);

    // Facettes géométriques cristallines
    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;
        const f1 = Math.sin(nx * 4 + ny * 3);
        const f2 = Math.cos(nx * 3 - ny * 4);
        const facet = (f1 * f2 > 0 ? 1 : 0) * 18;

        const idx = (y * 512 + x) * 4;
        d[idx] = 12 + facet;
        d[idx + 1] = 14 + facet;
        d[idx + 2] = 20 + facet;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Fractures acérées tranchantes d'obsidienne
    for (let f = 0; f < 10; f++) {
      const pts = [];
      let curX = (f * 139) % 512;
      let curY = (f * 197) % 512;
      pts.push([curX, curY]);
      for (let s = 0; s < 5; s++) {
        curX += (((s + f) * 31) % 76) - 38;
        curY += (((s + f) * 47) % 68) - 34;
        pts.push([curX, curY]);
      }
      drawSeamlessCurve(ctx, pts, 'rgba(148, 163, 184, 0.45)', 2.5);
      drawSeamlessCurve(ctx, pts, 'rgba(241, 245, 249, 0.75)', 0.8);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 7. Cycle 7 : Vent / Ambition (Courants Supersoniques & Ciel Stratosphérique Épuré)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dégradé azur stratosphérique fluide
    const vGrad = ctx.createLinearGradient(0, 0, 0, 512);
    vGrad.addColorStop(0, '#0284c7');
    vGrad.addColorStop(0.5, '#38bdf8');
    vGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Traînées d'air supersoniques continues et aérodynamiques
    ctx.globalCompositeOperation = 'screen';
    for (let w = 0; w < 10; w++) {
      const y = (w / 10) * 512;
      const pts = [
        [0, y],
        [256, y + Math.sin(w * 1.5) * 16],
        [512, y]
      ];
      drawSeamlessCurve(ctx, pts, 'rgba(255, 255, 255, 0.35)', 8);
      drawSeamlessCurve(ctx, pts, 'rgba(255, 255, 255, 0.75)', 2.0);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
    textures.push(tex);
  }

  // 8. Cycle 8 : Folie / Cosmos (Vide Spatial, Nébuleuses Harmoniques & Champ d'Étoiles Précis)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;

    // Nébuleuse cosmique harmonique continue (violette, rose et cyan)
    for (let y = 0; y < 512; y++) {
      const ny = (y / 512) * Math.PI * 2;
      for (let x = 0; x < 512; x++) {
        const nx = (x / 512) * Math.PI * 2;

        const neb1 = Math.sin(nx * 2 + Math.cos(ny * 2)) * 0.5 + 0.5;
        const neb2 = Math.cos(ny * 2 + Math.sin(nx * 3)) * 0.5 + 0.5;
        const intensity = neb1 * neb2;

        const idx = (y * 512 + x) * 4;
        d[idx] = Math.floor(6 + intensity * 95);      // R
        d[idx + 1] = Math.floor(2 + intensity * 35);  // G
        d[idx + 2] = Math.floor(18 + intensity * 135);// B
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Étoiles de haute précision (multi-magnitudes avec aigrettes de diffraction)
    ctx.globalCompositeOperation = 'screen';
    for (let s = 0; s < 140; s++) {
      const sx = (s * 137) % 512;
      const sy = (s * 227) % 512;
      const mag = (s % 5 === 0) ? 2.5 : ((s % 3 === 0) ? 1.5 : 0.9);
      const color = (s % 4 === 0) ? '#fef08a' : ((s % 4 === 1) ? '#67e8f9' : '#ffffff');

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx, sy, mag, 0, Math.PI * 2);
      ctx.fill();

      // Aigrettes de diffraction sur les plus brillantes
      if (mag > 2.0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - 8, sy); ctx.lineTo(sx + 8, sy);
        ctx.moveTo(sx, sy - 8); ctx.lineTo(sx, sy + 8);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.0, 7.0);
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

    // Lignes de vitesse Hyperdrive 3D (Speed Streaks cinématiques)
    this.setupSpeedLines();

    // Système de Portail de Transition 3D monumental
    this.transitionPortal = null;
    this.cyclesData = CYCLES_DATA;
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
    // Dimensions monumentales continues : AUCUNE COUTURE, AUCUN TROU NOIR, AUCUN DÉCHIREMENT
    this.trackWidth = 380;
    this.trackLength = 460;

    // Matériau solide uni standard pour les cycles terrestres et géologiques
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.cycleGroundTextures[0],
      roughness: 0.35,
      metalness: 0.10,
      flatShading: false
    });

    // Vraie Eau 3D liquide réaliste pour le Cycle 1 (Chute / Eau)
    this.waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0099dd,
      emissive: 0x002244,
      emissiveIntensity: 0.40,
      map: this.cycleGroundTextures[0],
      roughness: 0.08,
      metalness: 0.28,
      transparent: true,
      opacity: 0.94,
      flatShading: false
    });

    // Grand terrain unifié continu géant (64 x 92 segments = 6k vertices, fluide 60fps)
    const geo = new THREE.PlaneGeometry(this.trackWidth, this.trackLength, 68, 92);
    const pos = geo.attributes.position;

    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j);
      const y = pos.getY(j);
      const distFromCenter = Math.abs(x);
      // Chenal de vol central (|x| <= 30) totalement plat pour un vol rapide et clair
      // Berges latérales (|x| > 30) qui montent en parois de canyon naturelles majestueuses
      if (distFromCenter > 30) {
        const elev = Math.pow((distFromCenter - 30) / 45, 2) * 26.0;
        const noise = Math.sin(x * 0.10) * Math.cos(y * 0.06) * 2.2;
        pos.setZ(j, elev + noise);
      }
    }
    geo.computeVertexNormals();

    // Calcul de l'abscisse curviligne 3D (arc-length) pour éliminer 100% de l'étirement sur les parois du canyon
    const kSlope = 52.0 / 2025.0;
    const calcArcLength = (x) => {
      const absX = Math.abs(x);
      if (absX <= 30) return absX;
      const u = kSlope * (absX - 30);
      const integral = (u * Math.sqrt(1 + u * u) + Math.log(u + Math.sqrt(1 + u * u))) / (2 * kSlope);
      return 30 + integral;
    };
    const maxArcLength = calcArcLength(this.trackWidth / 2);
    const uvs = geo.attributes.uv;
    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j);
      const arc = calcArcLength(x);
      const sign = x >= 0 ? 1 : -1;
      const uNorm = 0.5 + sign * (arc / (2 * maxArcLength));
      uvs.setX(j, uNorm);
    }
    uvs.needsUpdate = true;
    geo.userData = { basePositions: new Float32Array(pos.array) };

    // Le terrain est centré à z = -180 pour couvrir de +50 (derrière la caméra) jusqu'à -410 (fond du brouillard)
    this.terrainMesh = new THREE.Mesh(geo, this.waterMaterial);
    this.terrainMesh.rotation.x = -Math.PI / 2;
    this.terrainMesh.position.set(0, -0.7, -180);
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);

    // Référence conservée pour compatibilité totale du code existant
    this.terrainSections = [this.terrainMesh];

    // Matériau commun des monolithes géométriques
    this.monolithMaterial = new THREE.MeshStandardMaterial({
      color: this.cycle.monolith,
      roughness: 0.65,
      metalness: 0.25,
      flatShading: true
    });
  }

  // Animation physique 3D de vraie eau liquide apaisée et déformations du terrain
  // Animation physique 3D de vraie eau liquide apaisée et déformations du terrain
  updateTerrainMesh(time, audioPulse = 0) {
    const isWater = (this.currentCycleIndex === 0);
    const wasWater = (this.prevCycleIndex === 0);

    if (isWater || (this.isTransitioning && wasWater)) {
      let waveWeight = 1.0;
      if (this.isTransitioning) {
        if (!isWater && wasWater) {
          // Sortie de l'eau : amortir la houle progressivement jusqu'au basculement à t=0.5
          waveWeight = Math.max(0.0, 1.0 - (this.transitionProgress / 0.5));
        } else if (isWater && !wasWater) {
          // Entrée dans l'eau : faire monter la houle à partir de t=0.5
          waveWeight = Math.min(1.0, Math.max(0.0, (this.transitionProgress - 0.5) / 0.5));
        }
      }

      if (waveWeight > 0.01) {
        const geo = this.terrainMesh.geometry;
        const pos = geo.attributes.position;
        const base = geo.userData.basePositions;
        if (base) {
          const flowZ = (this.totalDistance || 0) * 0.015;
          const bassSwell = 1.0 + (audioPulse || 0) * 0.45;
          for (let j = 0; j < pos.count; j++) {
            const x = base[j * 3];
            const y = base[j * 3 + 1];
            const bz = base[j * 3 + 2];
            const worldZ = this.terrainMesh.position.z - y;

            // Houle liquide 3D majestueuse et fluide se propageant physiquement (apaisée, naturelle)
            const wavePhase = (worldZ - flowZ);
            const wave1 = Math.sin(x * 0.06 + time * 1.0) * Math.cos(wavePhase * 0.03 + time * 0.75) * (0.24 * bassSwell);
            const wave2 = Math.sin(x * 0.03 + wavePhase * 0.018 + time * 0.5) * 0.10;

            // Amortissement fluide vers les falaises rocheuses latérales pour raccord sans faille
            const absX = Math.abs(x);
            const lateralDamp = Math.max(0.0, Math.min(1.0, 1.0 - (absX - 22.0) / 12.0));

            pos.setZ(j, bz + (wave1 + wave2) * waveWeight * lateralDamp);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
        this.wasWater = true;
        return;
      }
    }

    if (this.wasWater) {
      // Rétablir le terrain plat pour les cycles terrestres
      const geo = this.terrainMesh.geometry;
      const pos = geo.attributes.position;
      const base = geo.userData.basePositions;
      if (base) {
        pos.array.set(base);
        pos.needsUpdate = true;
        geo.computeVertexNormals();
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
      child.traverse(c => {
        if (c.geometry) c.geometry.dispose();
      });
    }
    this.sideProps = [];

    // Densité et profondeur accrues pour border tout le canyon (16 paires = 32 décors majeurs)
    const count = 16;
    const spacing = 28;
    const startZ = 25;

    for (let i = 0; i < count; i++) {
      const z = startZ - i * spacing;
      for (const side of [-1, 1]) {
        // Positionnés immédiatement sur les bords du chenal de vol (|x| = 22 à 28)
        // 100% visibles à l'écran en mode portrait comme en paysage !
        const x = side * (22 + ((i * 3) % 7));
        const propMesh = this.buildSidePropMesh(cycleIndex, side, i);
        propMesh.position.set(x, 0, z);
        this.sidePropsGroup.add(propMesh);
        this.sideProps.push({ mesh: propMesh, side, index: i, cycleIndex });
      }
    }
  }

  buildSidePropMesh(cycleIndex, side, index = 0) {
    const group = new THREE.Group();
    const variant = (index + (side > 0 ? 1 : 0)) % 3;

    switch (cycleIndex) {
      case 0: { // Cycle 1 : Eau / Chute (Falaises Océaniques, Arches Marines & Spires Glaciaires)
        const pillarMat = new THREE.MeshStandardMaterial({
          color: 0x03243f,
          roughness: 0.15,
          metalness: 0.85,
          flatShading: true,
          emissive: 0x011b33,
          emissiveIntensity: 0.35
        });
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x00b4d8,
          emissiveIntensity: 0.85,
          transparent: true,
          opacity: 0.82,
          roughness: 0.08,
          metalness: 0.5
        });
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 1.1,
          roughness: 0.1,
          metalness: 0.6
        });
        const foamMat = new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.75,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85
        });

        if (variant === 0) {
          // Arche marine monumentale avec rideau d'eau en cascade
          const p1 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.8, 28, 8), pillarMat);
          p1.position.set(-3.5, 14, 0);
          group.add(p1);

          const p2 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.8, 28, 8), pillarMat);
          p2.position.set(3.5, 14, 0);
          group.add(p2);

          const lintel = new THREE.Mesh(new THREE.BoxGeometry(11.0, 3.5, 5.0), pillarMat);
          lintel.position.set(0, 28, 0);
          group.add(lintel);

          const cascade = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 24), waterMat);
          cascade.position.set(0, 14, 0);
          cascade.rotation.y = Math.PI / 2;
          group.add(cascade);

          const crestTorus = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.28, 8, 20), waterMat);
          crestTorus.position.set(0, 29.8, 0);
          crestTorus.rotation.x = Math.PI / 2;
          group.add(crestTorus);
        } else if (variant === 1) {
          // Spire de basalte étagée avec grand cristal d'eau flottant
          const c1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 4.2, 32, 7), pillarMat);
          c1.position.y = 16;
          group.add(c1);

          const cBase = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 5.2, 8, 7), pillarMat);
          cBase.position.y = 4;
          group.add(cBase);

          const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.6, 0), crystalMat);
          crystal.position.y = 34.0;
          group.add(crystal);
        } else {
          // Geyser d'eau jaillissant d'une base rocheuse avec anneaux d'écume
          const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(5.0, 0), pillarMat);
          baseRock.position.y = 4.0;
          group.add(baseRock);

          const spire = new THREE.Mesh(
            new THREE.ConeGeometry(2.2, 30, 8),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x00f0ff, emissiveIntensity: 0.95, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.88 })
          );
          spire.position.y = 18;
          group.add(spire);

          const foamRing = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.3, 8, 24), foamMat);
          foamRing.position.y = 14;
          foamRing.rotation.x = Math.PI / 2.2;
          group.add(foamRing);

          const foamRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.2, 8, 20), foamMat);
          foamRing2.position.y = 24;
          foamRing2.rotation.x = Math.PI / 2.1;
          group.add(foamRing2);
        }
        break;
      }
      case 1: { // Cycle 2 : Terre / Résilience (Strata Buttes, Arches Telluriques & Mégalithes d'Ambre)
        const earthMat = new THREE.MeshStandardMaterial({ color: 0x452516, roughness: 0.92, metalness: 0.08, flatShading: true });
        const strataMat = new THREE.MeshStandardMaterial({ color: 0x61361b, roughness: 0.9, metalness: 0.06, flatShading: true });
        const amberMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.95, roughness: 0.25 });

        if (variant === 0) {
          // Butte sédimentaire étagée couronnée d'un cristal d'ambre
          const b1 = new THREE.Mesh(new THREE.BoxGeometry(9.0, 10.0, 9.0), earthMat);
          b1.position.y = 5.0;
          group.add(b1);

          const b2 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 10.0, 6.8), strataMat);
          b2.position.y = 15.0;
          b2.rotation.y = 0.2;
          group.add(b2);

          const b3 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 9.0, 4.4), earthMat);
          b3.position.y = 24.5;
          group.add(b3);

          const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), amberMat);
          crystal.position.y = 30.5;
          group.add(crystal);
        } else if (variant === 1) {
          // Arche tellurique naturelle avec veines d'ambre runiques
          const p1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 26.0, 5.0), earthMat);
          p1.position.set(-3.6, 13.0, 0);
          group.add(p1);

          const rune1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 18.0, 5.2), amberMat);
          rune1.position.set(-3.6, 13.0, 0);
          group.add(rune1);

          const p2 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 26.0, 5.0), earthMat);
          p2.position.set(3.6, 13.0, 0);
          group.add(p2);

          const rune2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 18.0, 5.2), amberMat);
          rune2.position.set(3.6, 13.0, 0);
          group.add(rune2);

          const arch = new THREE.Mesh(new THREE.BoxGeometry(11.0, 4.0, 5.5), strataMat);
          arch.position.set(0, 27.0, 0);
          group.add(arch);
        } else {
          // Mégalithe fissuré abritant une géode d'ambre étincelante
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 4.2, 28.0, 6), earthMat);
          pillar.position.y = 14.0;
          pillar.rotation.y = 0.4;
          group.add(pillar);

          const geode = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5, 0), amberMat);
          geode.position.set(0, 29.0, 0);
          group.add(geode);
        }
        break;
      }
      case 2: { // Cycle 3 : Feu / Obsession (Colonnes de Basalte Hexagonales, Cheminées Volcaniques & Magma)
        const basaltMat = new THREE.MeshStandardMaterial({ color: 0x140606, roughness: 0.85, metalness: 0.3, flatShading: true });
        const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff3b00, emissive: 0xff2200, emissiveIntensity: 1.3, roughness: 0.2 });
        const glowMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 1.5, roughness: 0.2 });

        if (variant === 0) {
          // Faisceau de colonnes basaltiques hexagonales étagées (Giant's Causeway)
          const offsets = [
            [-2.4, -1.8, 24],
            [2.2, -1.6, 28],
            [0.0, 2.2, 32],
            [-2.0, 1.8, 20],
            [2.4, 1.6, 26]
          ];
          for (const [ox, oz, h] of offsets) {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, h, 6), basaltMat);
            col.position.set(ox, h / 2, oz);
            group.add(col);

            // Fissure de lave en fusion au sommet
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 6), lavaMat);
            cap.position.set(ox, h + 0.1, oz);
            group.add(cap);
          }
        } else if (variant === 1) {
          // Cheminée volcanique naturelle avec cœur incandescent intérieur
          const vent = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 4.8, 28, 7), basaltMat);
          vent.position.y = 14;
          group.add(vent);

          const crater = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 0.5, 3.0, 7), glowMat);
          crater.position.y = 28.5;
          group.add(crater);

          for (let s = 0; s < 3; s++) {
            const ang = (s / 3) * Math.PI * 2;
            const spire = new THREE.Mesh(new THREE.ConeGeometry(0.8, 4.5, 4), basaltMat);
            spire.position.set(Math.cos(ang) * 2.2, 29.5, Math.sin(ang) * 2.2);
            group.add(spire);
          }
        } else {
          // Éperon rocheux magmatique biseauté avec cascade de lave en fusion
          const spur = new THREE.Mesh(new THREE.ConeGeometry(3.8, 32, 5), basaltMat);
          spur.position.y = 16;
          spur.rotation.z = side > 0 ? -0.15 : 0.15;
          group.add(spur);

          const vein = new THREE.Mesh(new THREE.BoxGeometry(0.8, 26, 0.8), lavaMat);
          vein.position.set(side > 0 ? -1.2 : 1.2, 14, 1.8);
          group.add(vein);
        }
        break;
      }
      case 3: { // Cycle 4 : Électricité / Amour (Pylônes Treillis Cyber, Bobines Tesla & Condensateurs)
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.92 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.1, metalness: 0.8, roughness: 0.2 });
        const cyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00e0ff, emissiveIntensity: 1.4, roughness: 0.1 });

        if (variant === 0) {
          // Pylône treillis cyber avec bobine Tesla haute-tension
          const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 3.6, 30, 4), frameMat);
          tower.position.y = 15;
          tower.rotation.y = Math.PI / 4;
          group.add(tower);

          const torus = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.4, 12, 24), goldMat);
          torus.position.y = 31;
          torus.rotation.x = Math.PI / 2;
          group.add(torus);

          const node = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 12), cyanMat);
          node.position.y = 33;
          group.add(node);
        } else if (variant === 1) {
          // Antenne relais plasma à ailettes dorées
          const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.8, 34, 8), frameMat);
          mast.position.y = 17;
          group.add(mast);

          for (let f = 0; f < 3; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(7.0, 1.4, 0.4), goldMat);
            fin.position.y = 18 + f * 5.0;
            fin.rotation.y = f * 0.8;
            group.add(fin);
          }
        } else {
          // Tour de condensateurs à disques étagés
          const core = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.4, 30, 8), frameMat);
          core.position.y = 15;
          group.add(core);

          for (let d = 0; d < 4; d++) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.6, 16), (d % 2 === 0 ? goldMat : cyanMat));
            disc.position.y = 8 + d * 6.5;
            group.add(disc);
          }
        }
        break;
      }
      case 4: { // Cycle 5 : Lumière / Bonheur (Portiques Célestes, Obélisques de Quartz & Spire Solaire)
        const albasterMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12, metalness: 0.1 });
        const celestialGold = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xeab308, emissiveIntensity: 0.95, roughness: 0.2, metalness: 0.7 });

        if (variant === 0) {
          // Portique d'albâtre classique avec chapiteau céleste doré
          const col = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.0, 32, 16), albasterMat);
          col.position.y = 16;
          group.add(col);

          const capital = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, 5.2), celestialGold);
          capital.position.y = 32.5;
          group.add(capital);

          const baseRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.3, 8, 20), celestialGold);
          baseRing.position.y = 1.0;
          baseRing.rotation.x = Math.PI / 2;
          group.add(baseRing);
        } else if (variant === 1) {
          // Obélisque de quartz solaire avec apex en prisme d'or et halo
          const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, 32, 4), albasterMat);
          obelisk.position.y = 16;
          obelisk.rotation.y = Math.PI / 4;
          group.add(obelisk);

          const apex = new THREE.Mesh(new THREE.OctahedronGeometry(2.0, 0), celestialGold);
          apex.position.y = 33;
          group.add(apex);

          const halo = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.22, 8, 24), celestialGold);
          halo.position.y = 28;
          halo.rotation.x = Math.PI / 2.3;
          group.add(halo);
        } else {
          // Tour solaire octogonale à orbe éclatante
          const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 3.2, 28, 8), albasterMat);
          tower.position.y = 14;
          group.add(tower);

          const orb = new THREE.Mesh(
            new THREE.SphereGeometry(2.2, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfef08a, emissiveIntensity: 1.3, roughness: 0.1 })
          );
          orb.position.y = 30;
          group.add(orb);
        }
        break;
      }
      case 5: { // Cycle 6 : Chaos / Ombre (Aiguilles d'Obsidienne, Arches du Néant & Piliers Fracturés)
        const obsMat = new THREE.MeshStandardMaterial({ color: 0x08060c, roughness: 0.08, metalness: 0.95, flatShading: true });
        const runeMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.25, roughness: 0.2 });

        if (variant === 0) {
          // Aiguille monolithique tranchante facettée avec anneau de runes violettes
          const spike = new THREE.Mesh(new THREE.ConeGeometry(3.6, 36, 4), obsMat);
          spike.position.y = 18;
          spike.rotation.y = Math.PI / 4;
          group.add(spike);

          const runeRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.25, 8, 20), runeMat);
          runeRing.position.y = 22;
          runeRing.rotation.x = Math.PI / 2.2;
          group.add(runeRing);
        } else if (variant === 1) {
          // Piliers jumeaux d'obsidienne avec nexus d'énergie violette
          const p1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 30.0, 3.0), obsMat);
          p1.position.set(-2.2, 15, 0);
          group.add(p1);

          const p2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 24.0, 2.4), obsMat);
          p2.position.set(2.2, 12, 0);
          group.add(p2);

          const nexus = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), runeMat);
          nexus.position.set(0, 26, 0);
          group.add(nexus);
        } else {
          // Mégalithe géométrique fracturé avec fissure d'énergie du néant
          const block = new THREE.Mesh(new THREE.BoxGeometry(4.8, 30.0, 4.8), obsMat);
          block.position.y = 15;
          block.rotation.set(0.1, 0.4, 0.05);
          group.add(block);

          const fissure = new THREE.Mesh(new THREE.BoxGeometry(0.7, 26.0, 5.0), runeMat);
          fissure.position.y = 15;
          fissure.rotation.set(0.1, 0.4, 0.05);
          group.add(fissure);
        }
        break;
      }
      case 6: { // Cycle 7 : Vent / Ambition (Aiguilles Éoliennes, Ailettes Supersoniques & Tours Vortex)
        const windMat = new THREE.MeshStandardMaterial({ color: 0x04446c, roughness: 0.18, metalness: 0.85, emissive: 0x0284c7, emissiveIntensity: 0.3 });
        const aeroMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.1, roughness: 0.2 });

        if (variant === 0) {
          // Aiguille profilée contre le vent avec anneau aérodynamique
          const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 3.2, 38, 8), windMat);
          needle.position.y = 19;
          group.add(needle);

          const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.25, 8, 24), aeroMat);
          ring.position.y = 26;
          ring.rotation.x = Math.PI / 2.4;
          group.add(ring);
        } else if (variant === 1) {
          // Double ailette supersonique
          const mast = new THREE.Mesh(new THREE.BoxGeometry(1.6, 32, 3.4), windMat);
          mast.position.y = 16;
          group.add(mast);

          const wing = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.2, 2.2), aeroMat);
          wing.position.set(0, 26, 0);
          group.add(wing);
        } else {
          // Spire vortex profilée à double anneau
          const cone = new THREE.Mesh(new THREE.ConeGeometry(3.2, 34, 6), windMat);
          cone.position.y = 17;
          group.add(cone);

          for (let r = 0; r < 2; r++) {
            const tr = new THREE.Mesh(new THREE.TorusGeometry(3.8 - r * 1.2, 0.22, 8, 20), aeroMat);
            tr.position.y = 12 + r * 10;
            tr.rotation.x = Math.PI / 2.1;
            group.add(tr);
          }
        }
        break;
      }
      case 7: { // Cycle 8 : Folie / Cosmos (Monolithes Cosmiques, Singularités & Astéroïdes)
        const voidMat = new THREE.MeshStandardMaterial({ color: 0x0b0216, roughness: 0.15, metalness: 0.92 });
        const magentaGlow = new THREE.MeshStandardMaterial({ color: 0xd946ef, emissive: 0xa855f7, emissiveIntensity: 1.35, roughness: 0.2 });
        const coreMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 1.5, wireframe: true });

        if (variant === 0) {
          // Monolithe cosmique avec anneau de distorsion gravitationnelle
          const frame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 34, 5.0), voidMat);
          frame.position.y = 17;
          group.add(frame);

          const warpRing = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.4, 12, 28), magentaGlow);
          warpRing.position.y = 33;
          warpRing.rotation.x = Math.PI / 2;
          group.add(warpRing);
        } else if (variant === 1) {
          // Anneau de distorsion gravitationnelle avec tesseract
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.8, 28, 8), voidMat);
          pillar.position.y = 14;
          group.add(pillar);

          const ring = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.6, 12, 24), magentaGlow);
          ring.position.y = 30;
          group.add(ring);

          const centerTesseract = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), coreMat);
          centerTesseract.position.y = 30;
          group.add(centerTesseract);
        } else {
          // Fragment d'astéroïde cosmique avec cristal d'améthyste stellaire
          const asteroid = new THREE.Mesh(new THREE.DodecahedronGeometry(4.6, 0), voidMat);
          asteroid.position.y = 18;
          asteroid.rotation.set(0.5, 0.7, 0.3);
          group.add(asteroid);

          const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.4, 0), magentaGlow);
          crystal.position.set(0, 24, 0);
          group.add(crystal);
        }
        break;
      }
    }
    return group;
  }

  updateSideProps(dt, speed, audioPulse) {
    const deltaZ = speed * dt;
    for (let i = 0; i < this.sideProps.length; i++) {
      const prop = this.sideProps[i];
      prop.mesh.position.z += deltaZ;
      if (prop.mesh.position.z > 30) {
        prop.mesh.position.z -= 448;

        // Transition continue à l'horizon : si le cycle a changé, reconstruire ce décor
        if (prop.cycleIndex !== this.currentCycleIndex) {
          this.sidePropsGroup.remove(prop.mesh);
          prop.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
          });
          const newMesh = this.buildSidePropMesh(this.currentCycleIndex, prop.side, prop.index);
          const targetX = prop.side * (22 + ((prop.index * 3) % 7));
          newMesh.position.set(targetX, 0, prop.mesh.position.z);
          this.sidePropsGroup.add(newMesh);
          prop.mesh = newMesh;
          prop.cycleIndex = this.currentCycleIndex;
        }
      }

      // Micro-pulsation rythmique de l'échelle calée sur le kick/beat
      const s = 1.0 + audioPulse * 0.06;
      prop.mesh.scale.set(s, s, s);

      // Animation dynamique des anneaux orbitaux, orbes et pulsation émissive synchronisée
      if (prop.mesh.children && prop.mesh.children.length > 0) {
        for (let c = 0; c < prop.mesh.children.length; c++) {
          const child = prop.mesh.children[c];
          // Pulsation de l'illumination sur le rythme musical
          if (child.material && child.material.emissive && child.material.emissive.getHex() !== 0) {
            if (child.userData.baseEmissive === undefined) {
              child.userData.baseEmissive = child.material.emissiveIntensity || 1.0;
            }
            child.material.emissiveIntensity = child.userData.baseEmissive * (1.0 + audioPulse * 1.5);
          }
          if (child.geometry) {
            const type = child.geometry.type || '';
            if (type.includes('Torus')) {
              child.rotation.z += (prop.side > 0 ? 1.5 : -1.5) * dt;
            } else if (type.includes('Octahedron') || type.includes('Sphere') || type.includes('Icosahedron')) {
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

    if (this.currentCycleIndex === 0) {
      this.terrainMesh.material = this.waterMaterial;
    } else {
      if (this.cycleGroundTextures && this.cycleGroundTextures[this.currentCycleIndex]) {
        this.groundMaterial.map = this.cycleGroundTextures[this.currentCycleIndex];
        this.groundMaterial.color.set(0xffffff);
        this.groundMaterial.needsUpdate = true;
      }
      this.terrainMesh.material = this.groundMaterial;
    }
    this.monolithMaterial.color.set(cycle.monolith);

    this.groundMaterial.roughness = this.getRoughnessForElement(cycle.element);
    this.groundMaterial.metalness = this.getMetalnessForElement(cycle.element);

    this.updateActiveElement(this.currentCycleIndex);
  }

  // Transition fluide vers un cycle donné (Glide sans coupure, obstacles préservés)
  // Gestion du Portail Dimensionnel de Transition de Cycle
  spawnTransitionPortal(targetCycleIndex) {
    if (this.transitionPortal) return;
    const targetCycle = CYCLES_DATA[targetCycleIndex] || CYCLES_DATA[0];
    this.transitionPortal = new PortalGate(targetCycleIndex, targetCycle.primary, targetCycle.secondary);
    this.scene.add(this.transitionPortal.group);
  }

  checkPortalCrossing(playerZ) {
    if (!this.transitionPortal) return null;
    // Si le portail arrive à hauteur du vaisseau (z >= playerZ - 2.5)
    if (this.transitionPortal.group.position.z >= (playerZ - 2.5)) {
      const nextIdx = this.transitionPortal.targetCycleIndex;
      this.transitionPortal.dispose(this.scene);
      this.transitionPortal = null;
      return nextIdx;
    }
    return null;
  }

  setCycle(index, immediate = false) {
    const prevCycle = this.cycle;
    this.prevCycleIndex = prevCycle ? (prevCycle.id - 1) : 0;
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
    // 2. Les décors latéraux sont recyclés naturellement à l'horizon (z = -390) au fil de leur passage
    // 3. Interpolation progressive (Lerp 3.2s) des ciels, brouillards, textures et lumières
    this.isTransitioning = true;
    this.transitionProgress = 0.0;
    this.transitionDuration = 3.2;

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

    // L'élément environnemental actif (pluie, braises, foudre, etc.) se met à jour
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
    const pCount = isSaiyan ? 48 : 32;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const velocities = [];

    let pColor = 0x00f0ff;
    if (isSaiyan) {
      pColor = 0x38bdf8; // PURITY céleste cyan / bleu ciel éclatant
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
      positions[i * 3] = pos.x + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = pos.y + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 1.5;

      const spd = (isSaiyan ? 18 : 12) + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.cos(phi) * spd * 0.8 + 2.0,
        Math.sin(phi) * Math.sin(theta) * spd
      );
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: isSaiyan ? 1.5 : 1.35,
      color: pColor,
      map: isSaiyan ? getPurityMoteTexture() : getSparkTexture(),
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
      maxAge: 0.75
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

  
  // --- OBSTACLES SUSPENDUS & HAUTE ALTITUDE (ANTI-TRICHE EN HAUTEUR) ---
  spawnHighAltitudeHazard(x, cycleIdx) {
    const group = new THREE.Group();
    const subBoxes = [];
    const altY = 7.5 + Math.random() * 3.5; // Altitude comprise entre 7.5 et 11.0

    switch (cycleIdx) {
      case 0: { // Eau : Orbe d'eau tourbillonnante & cascade suspendue
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0284c7, emissive: 0x00f0ff, emissiveIntensity: 0.8,
          roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.85
        });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(1.9, 14, 14), mat);
        group.add(orb);
        subBoxes.push({ mesh: orb, box: new THREE.Box3() });

        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.2, 8, 24), new THREE.MeshBasicMaterial({ color: 0xbae6fd }));
        ring.rotation.x = Math.PI / 2.2;
        group.add(ring);
        break;
      }
      case 1: { // Terre : Stalactite tellurique tombant du plafond
        const mat = new THREE.MeshStandardMaterial({ color: 0x3d2714, roughness: 0.9, flatShading: true });
        const stalactite = new THREE.Mesh(new THREE.ConeGeometry(2.2, 10.0, 6), mat);
        stalactite.rotation.x = Math.PI; // Pointe vers le bas
        group.add(stalactite);
        subBoxes.push({ mesh: stalactite, box: new THREE.Box3() });
        break;
      }
      case 2: { // Feu : Mine de magma incandescent
        const mat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff5500, emissiveIntensity: 1.2, roughness: 0.3 });
        const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 1), mat);
        group.add(sphere);
        subBoxes.push({ mesh: sphere, box: new THREE.Box3() });

        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.25, 8, 20), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        ring.rotation.y = Math.PI / 4;
        group.add(ring);
        break;
      }
      case 3: { // Électricité : Nœud Tesla haute-tension
        const mat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0xfacc15, emissiveIntensity: 1.0, roughness: 0.2 });
        const node = new THREE.Mesh(new THREE.OctahedronGeometry(2.0), mat);
        group.add(node);
        subBoxes.push({ mesh: node, box: new THREE.Box3() });
        break;
      }
      case 4: { // Lumière : Prisme solaire rayonnant
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfef08a, emissiveIntensity: 0.9, roughness: 0.1 });
        const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 2.2, 7.0, 5), mat);
        group.add(prism);
        subBoxes.push({ mesh: prism, box: new THREE.Box3() });
        break;
      }
      case 5: { // Ombre : Monolithe du vide inversé
        const mat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.1, metalness: 0.95, flatShading: true });
        const spike = new THREE.Mesh(new THREE.ConeGeometry(2.2, 11.0, 5), mat);
        spike.rotation.x = Math.PI;
        group.add(spike);
        subBoxes.push({ mesh: spike, box: new THREE.Box3() });
        break;
      }
      case 6: { // Vent : Turbine éolienne supersonique
        const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const wing = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.7, 1.8), mat);
        group.add(wing);
        subBoxes.push({ mesh: wing, box: new THREE.Box3() });
        break;
      }
      default: { // Cosmos : Faille de distorsion spatiale
        const mat = new THREE.MeshStandardMaterial({ color: 0x110224, emissive: 0xc084fc, emissiveIntensity: 1.2 });
        const core = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), mat);
        group.add(core);
        subBoxes.push({ mesh: core, box: new THREE.Box3() });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.28, 8, 24), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
        ring.rotation.x = Math.PI / 2.3;
        group.add(ring);
        break;
      }
    }

    group.position.set(x, altY, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spin', rotSpeed: 1.8 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

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

  // Troll 3 (Obsession) : Vortex de flammes et anneau solaire magmatique en vrille
  spawnSpiralArch(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];

    const flameCoreMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff2200,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.3
    });
    const flameTongueMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 2.6,
      roughness: 0.15
    });
    const darkBasalt = new THREE.MeshStandardMaterial({
      color: 0x140505,
      roughness: 0.85,
      metalness: 0.2
    });

    // Anneau de magma circulaire principal (trou central de 12m pour voler à travers)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8.0, 1.4, 12, 32), flameCoreMat);
    group.add(ring);

    // 8 langues de flammes incandescentes rayonnant vers l'extérieur
    for (let f = 0; f < 8; f++) {
      const angle = (f / 8) * Math.PI * 2;
      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5.5, 5), flameTongueMat);
      flame.position.set(Math.cos(angle) * 9.2, Math.sin(angle) * 9.2, 0);
      flame.rotation.z = angle - Math.PI / 2;
      group.add(flame);
    }

    // Éperons de basalte magmatiques en haut et en bas
    const topCap = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8, 0), darkBasalt);
    topCap.position.set(0, 9.8, 0);
    group.add(topCap);

    const botCap = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8, 0), darkBasalt);
    botCap.position.set(0, -9.8, 0);
    group.add(botCap);

    // Boîtes de collision couvrant le haut et le bas (laissant le passage central ouvert)
    const boxTop = new THREE.Mesh(new THREE.BoxGeometry(18.0, 4.5, 3.5), flameCoreMat);
    boxTop.position.set(0, 8.0, 0);
    boxTop.visible = false;
    group.add(boxTop);
    subBoxes.push({ mesh: boxTop, box: new THREE.Box3() });

    const boxBot = new THREE.Mesh(new THREE.BoxGeometry(18.0, 4.5, 3.5), flameCoreMat);
    boxBot.position.set(0, -8.0, 0);
    boxBot.visible = false;
    group.add(boxBot);
    subBoxes.push({ mesh: boxBot, box: new THREE.Box3() });

    group.position.set(gapX, 7.5, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spiral', rotSpeed: (Math.random() < 0.5 ? 1 : -1) * 1.8 };

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

  // Cycle 3 (Feu / Obsession) : Cheminée volcanique éruptive à panache de flammes incandescentes
  spawnVolcanoSpire(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const h = 22.0;

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x140505,
      roughness: 0.88,
      metalness: 0.25,
      flatShading: true
    });
    const magmaMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff2200,
      emissiveIntensity: 2.0,
      roughness: 0.2
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 2.8,
      roughness: 0.1
    });

    // Tour de basalte volcanique hexagonale
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 4.8, h, 6), basaltMat);
    spire.position.y = h / 2;
    spire.castShadow = true;
    group.add(spire);
    subBoxes.push({ mesh: spire, box: new THREE.Box3() });

    // Cratère béant rempli de magma incandescent
    const crater = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 1.2, 2.5, 6), magmaMat);
    crater.position.y = h + 0.8;
    group.add(crater);

    // Panache de flammes incandescent jaillissant du volcan vers le ciel
    const flameCone = new THREE.Mesh(new THREE.ConeGeometry(3.2, 12.0, 7), flameMat);
    flameCone.position.y = h + 7.5;
    group.add(flameCone);

    // Langues de flammes latérales
    for (let f = 0; f < 3; f++) {
      const ang = (f / 3) * Math.PI * 2;
      const fSpire = new THREE.Mesh(new THREE.ConeGeometry(1.0, 6.5, 4), magmaMat);
      fSpire.position.set(Math.cos(ang) * 2.2, h + 3.0, Math.sin(ang) * 2.2);
      fSpire.rotation.z = (Math.random() - 0.5) * 0.3;
      group.add(fSpire);
    }

    group.position.set(x, 0, this.spawnDistance);
    const bbox = new THREE.Box3().setFromObject(group);
    const obj = { mesh: group, subBoxes, bbox, type: 'standard' };

    this.scene.add(group);
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

  // Cycle 6 (Ombre) : Éperons d'obsidienne facettés avec runes violettes du néant
  spawnVoidSpikes(x) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x08060c,
      roughness: 0.08,
      metalness: 0.95,
      flatShading: true
    });
    const runeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.25,
      roughness: 0.2
    });
    const subBoxes = [];

    for (let s = 0; s < 3; s++) {
      const h = 18.0 + s * 4.0;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.0, h, 4), mat);
      cone.position.set((s - 1) * 2.5, h / 2, (Math.random() - 0.5) * 2);
      cone.rotation.z = (s - 1) * 0.15;
      cone.rotation.y = Math.PI / 4;
      cone.castShadow = true;
      group.add(cone);
      subBoxes.push({ mesh: cone, box: new THREE.Box3() });

      const rune = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), runeMat);
      rune.position.set((s - 1) * 2.5, h + 1.2, 0);
      group.add(rune);
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

  // --- NOUVEAUX OBSTACLES ÉLÉMENTAIRES DIVERSIFIÉS (4 VARIANTES PAR CYCLE) ---

  // Cycle 1 (Eau) : Tourbillon abyssal tournoyant au ras des flots
  spawnVortexMaelstrom(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });

    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + r * 2.2, 0.35, 8, 24), mat);
      ring.position.y = 0.8 + r * 1.2;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      subBoxes.push({ mesh: ring, box: new THREE.Box3() });
    }

    const core = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.5, 6.0, 12), new THREE.MeshStandardMaterial({ color: 0x042442, roughness: 0.1, metalness: 0.9 }));
    core.position.y = 3.0;
    group.add(core);
    subBoxes.push({ mesh: core, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
    this.spawnWaterRipple(x, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'vortex', rotSpeed: 3.5 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 1 (Eau) : Arche de glace polaire et stalactites océaniques
  spawnIceArch(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    });

    const w = 18.0, h = 18.0;
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.8, h, 8), iceMat);
    p1.position.set(-w / 2, h / 2, 0);
    p1.castShadow = true;
    group.add(p1);
    subBoxes.push({ mesh: p1, box: new THREE.Box3() });

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.8, h, 8), iceMat);
    p2.position.set(w / 2, h / 2, 0);
    p2.castShadow = true;
    group.add(p2);
    subBoxes.push({ mesh: p2, box: new THREE.Box3() });

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(w + 3.0, 3.2, 3.8), iceMat);
    lintel.position.set(0, h, 0);
    lintel.castShadow = true;
    group.add(lintel);
    subBoxes.push({ mesh: lintel, box: new THREE.Box3() });

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 2 (Terre) : Éboulement de roches mégalithiques telluriques avec veines d'ambre
  spawnRockAvalanche(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.92, metalness: 0.08, flatShading: true });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.95, roughness: 0.2 });

    const offsets = [[-3.2, 4.0, 0], [2.8, 6.0, 0], [0.0, 14.0, 0]];
    offsets.forEach(([ox, oy, oz]) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5, 0), rockMat);
      rock.position.set(ox, oy, oz);
      rock.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      rock.castShadow = true;
      group.add(rock);
      subBoxes.push({ mesh: rock, box: new THREE.Box3() });

      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), amberMat);
      crystal.position.set(ox, oy + 2.2, oz);
      group.add(crystal);
    });

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'quake', shakePhase: Math.random() * 4 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 2 (Terre) : Double pilier de canyon en grès avec strates d'ambre
  spawnPillarCanyon(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({ color: 0x422615, roughness: 0.9, flatShading: true });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9, roughness: 0.25 });
    const h = 26.0;

    const pL = new THREE.Mesh(new THREE.BoxGeometry(6.0, h, 5.0), mat);
    pL.position.set(-8.5, h / 2, 0);
    pL.castShadow = true;
    group.add(pL);
    subBoxes.push({ mesh: pL, box: new THREE.Box3() });

    const bandL = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.0, 5.2), amberMat);
    bandL.position.set(-8.5, h * 0.65, 0);
    group.add(bandL);

    const pR = new THREE.Mesh(new THREE.BoxGeometry(6.0, h, 5.0), mat);
    pR.position.set(8.5, h / 2, 0);
    pR.castShadow = true;
    group.add(pR);
    subBoxes.push({ mesh: pR, box: new THREE.Box3() });

    const bandR = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.0, 5.2), amberMat);
    bandR.position.set(8.5, h * 0.65, 0);
    group.add(bandR);

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'sliding', baseX: gapX, phase: Math.random() * 3, speed: 1.5 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 3 (Feu / Obsession) : Portail de lave en fusion flanqué de piliers basaltiques et crêtes de flammes
  spawnLavaWall(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x140505,
      roughness: 0.9,
      metalness: 0.2,
      flatShading: true
    });
    const lavaMat = new THREE.MeshStandardMaterial({
      color: 0xff3700,
      emissive: 0xff2200,
      emissiveIntensity: 2.2,
      roughness: 0.25,
      metalness: 0.4
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 2.8,
      roughness: 0.1
    });

    const w = 15.0, h = 22.0;

    // --- Côté Gauche ---
    const pylonL = new THREE.Mesh(new THREE.BoxGeometry(4.0, h + 2, 4.0), basaltMat);
    pylonL.position.set(-6.0, (h + 2) / 2, 0);
    pylonL.castShadow = true;
    group.add(pylonL);

    const wallL = new THREE.Mesh(new THREE.BoxGeometry(w - 3, h, 2.5), lavaMat);
    wallL.position.set(-w / 2 - 6.5, h / 2, 0);
    group.add(wallL);

    for (let s = 0; s < 3; s++) {
      const drop = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.5, 4), flameMat);
      drop.position.set(-6.0 - s * 3.5, h - 1.5, 0);
      drop.rotation.z = Math.PI;
      group.add(drop);
    }

    for (let f = 0; f < 4; f++) {
      const fl = new THREE.Mesh(new THREE.ConeGeometry(1.3, 5.0, 5), flameMat);
      fl.position.set(-5.5 - f * 3.2, h + 2.5, 0);
      fl.rotation.z = (Math.random() - 0.5) * 0.3;
      group.add(fl);
    }

    const colBoxL = new THREE.Mesh(new THREE.BoxGeometry(w + 3, h + 2, 4.0), basaltMat);
    colBoxL.position.set(-w / 2 - 5.5, (h + 2) / 2, 0);
    colBoxL.visible = false;
    group.add(colBoxL);
    subBoxes.push({ mesh: colBoxL, box: new THREE.Box3() });

    // --- Côté Droit ---
    const pylonR = new THREE.Mesh(new THREE.BoxGeometry(4.0, h + 2, 4.0), basaltMat);
    pylonR.position.set(6.0, (h + 2) / 2, 0);
    pylonR.castShadow = true;
    group.add(pylonR);

    const wallR = new THREE.Mesh(new THREE.BoxGeometry(w - 3, h, 2.5), lavaMat);
    wallR.position.set(w / 2 + 6.5, h / 2, 0);
    group.add(wallR);

    for (let s = 0; s < 3; s++) {
      const drop = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.5, 4), flameMat);
      drop.position.set(6.0 + s * 3.5, h - 1.5, 0);
      drop.rotation.z = Math.PI;
      group.add(drop);
    }

    for (let f = 0; f < 4; f++) {
      const fl = new THREE.Mesh(new THREE.ConeGeometry(1.3, 5.0, 5), flameMat);
      fl.position.set(5.5 + f * 3.2, h + 2.5, 0);
      fl.rotation.z = (Math.random() - 0.5) * 0.3;
      group.add(fl);
    }

    const colBoxR = new THREE.Mesh(new THREE.BoxGeometry(w + 3, h + 2, 4.0), basaltMat);
    colBoxR.position.set(w / 2 + 5.5, (h + 2) / 2, 0);
    colBoxR.visible = false;
    group.add(colBoxR);
    subBoxes.push({ mesh: colBoxR, box: new THREE.Box3() });

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 3 (Feu / Obsession) : Météore céleste incandescent en fusion avec couronne de flammes tourbillonnantes
  spawnMeteorImpact(x) {
    const group = new THREE.Group();
    const subBoxes = [];

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x140505,
      roughness: 0.9,
      metalness: 0.2,
      flatShading: true
    });
    const magmaMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff2200,
      emissiveIntensity: 2.4,
      roughness: 0.2
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 2.8,
      roughness: 0.15
    });

    // Cœur de magma en fusion
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3.6, 1), magmaMat);
    core.position.y = 5.5;
    group.add(core);

    // Fragments de croûte de basalte craquelée autour du cœur
    for (let c = 0; c < 4; c++) {
      const ang = (c / 4) * Math.PI * 2;
      const crust = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 0), basaltMat);
      crust.position.set(Math.cos(ang) * 2.8, 5.5 + (Math.random() - 0.5) * 1.5, Math.sin(ang) * 2.8);
      crust.rotation.set(Math.random() * 2, Math.random() * 2, 0);
      group.add(crust);
    }

    // Couronne solaire 1 : anneau de feu orbital en rotation
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.6, 8, 24), flameMat);
    ring1.position.y = 5.5;
    ring1.rotation.x = Math.PI / 2.2;
    group.add(ring1);

    // Couronne solaire 2 : second anneau de feu croisé
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.45, 8, 24), magmaMat);
    ring2.position.y = 5.5;
    ring2.rotation.set(Math.PI / 3, 0, Math.PI / 4);
    group.add(ring2);

    // 6 langues de flammes stellaires rayonnant du météore
    for (let f = 0; f < 6; f++) {
      const a = (f / 6) * Math.PI * 2;
      const flare = new THREE.Mesh(new THREE.ConeGeometry(1.2, 5.0, 5), flameMat);
      flare.position.set(Math.cos(a) * 4.5, 5.5 + Math.sin(a) * 2.0, Math.sin(a) * 4.5);
      flare.rotation.set(Math.sin(a), 0, -Math.cos(a));
      group.add(flare);
    }

    // Cratère d'impact incandescent au sol
    const craterRim = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 6.0, 0.6, 12), basaltMat);
    craterRim.position.y = 0.3;
    group.add(craterRim);

    const craterMagma = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.7, 12), magmaMat);
    craterMagma.position.y = 0.35;
    group.add(craterMagma);

    // Boîte de collision principale
    const colBox = new THREE.Mesh(new THREE.BoxGeometry(8.5, 10.0, 8.5), basaltMat);
    colBox.position.y = 5.2;
    colBox.visible = false;
    group.add(colBox);
    subBoxes.push({ mesh: colBox, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spiral', rotSpeed: 1.4 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 4 (Électricité) : Barrière laser oscillante transversale
  spawnLaserGrid(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.9 });
    const h = 20.0;

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, h, 8), pylonMat);
    p1.position.set(-10, h / 2, 0);
    group.add(p1);
    subBoxes.push({ mesh: p1, box: new THREE.Box3() });

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, h, 8), pylonMat);
    p2.position.set(10, h / 2, 0);
    group.add(p2);
    subBoxes.push({ mesh: p2, box: new THREE.Box3() });

    for (let y = 4; y <= 16; y += 4) {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 20, 6), laserMat);
      beam.position.set(0, y, 0);
      beam.rotation.z = Math.PI / 2;
      group.add(beam);
      subBoxes.push({ mesh: beam, box: new THREE.Box3() });
    }

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 4 (Électricité) : Condensateur haute tension à décharge toroïdale
  spawnPulseConduit(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    const glow = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const h = 18.0;

    const pylon = new THREE.Mesh(new THREE.BoxGeometry(3.5, h, 3.5), mat);
    pylon.position.y = h / 2;
    group.add(pylon);
    subBoxes.push({ mesh: pylon, box: new THREE.Box3() });

    const tor = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.45, 8, 24), glow);
    tor.position.y = h;
    tor.rotation.x = Math.PI / 2;
    group.add(tor);
    subBoxes.push({ mesh: tor, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'pulse' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 5 (Lumière) : Roue solaire rayonnante céleste
  spawnSunDialRing(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.75, 12, 28), goldMat);
    ring.position.y = 8.5;
    group.add(ring);
    subBoxes.push({ mesh: ring, box: new THREE.Box3() });

    for (let r = 0; r < 4; r++) {
      const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 12, 6), goldMat);
      ray.position.y = 8.5;
      ray.rotation.z = (r * Math.PI) / 4;
      group.add(ray);
      subBoxes.push({ mesh: ray, box: new THREE.Box3() });
    }

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spin', rotSpeed: 1.4 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 5 (Lumière) : Colonnade d'albâtre avec chapiteaux célestes
  spawnAlabasterPillars(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const albasterMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1 });
    const h = 24.0;

    const pL = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, h, 14), albasterMat);
    pL.position.set(-8.0, h / 2, 0);
    pL.castShadow = true;
    group.add(pL);
    subBoxes.push({ mesh: pL, box: new THREE.Box3() });

    const pR = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, h, 14), albasterMat);
    pR.position.set(8.0, h / 2, 0);
    pR.castShadow = true;
    group.add(pR);
    subBoxes.push({ mesh: pR, box: new THREE.Box3() });

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'standard' };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 6 (Ombre) : Murailles d'obsidienne mouvantes avec gravures de runes du néant
  spawnShadowMonoliths(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({ color: 0x08060c, roughness: 0.08, metalness: 0.95, flatShading: true });
    const runeMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.25, roughness: 0.2 });
    const h = 28.0;

    const mL = new THREE.Mesh(new THREE.BoxGeometry(7.0, h, 4.0), mat);
    mL.position.set(-9.0, h / 2, 0);
    mL.castShadow = true;
    group.add(mL);
    subBoxes.push({ mesh: mL, box: new THREE.Box3() });

    const runeL = new THREE.Mesh(new THREE.BoxGeometry(1.2, h * 0.7, 4.2), runeMat);
    runeL.position.set(-9.0, h / 2, 0);
    group.add(runeL);

    const mR = new THREE.Mesh(new THREE.BoxGeometry(7.0, h, 4.0), mat);
    mR.position.set(9.0, h / 2, 0);
    mR.castShadow = true;
    group.add(mR);
    subBoxes.push({ mesh: mR, box: new THREE.Box3() });

    const runeR = new THREE.Mesh(new THREE.BoxGeometry(1.2, h * 0.7, 4.2), runeMat);
    runeR.position.set(9.0, h / 2, 0);
    group.add(runeR);

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'sliding', baseX: gapX, phase: Math.random() * 3, speed: 2.0 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 6 (Ombre) : Singularité d'ombre avec disque d'accrétion d'énergie violette
  spawnDarkVortex(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0xa855f7,
      emissiveIntensity: 1.4,
      wireframe: true
    });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0.95
    });

    const core = new THREE.Mesh(new THREE.SphereGeometry(3.0, 16, 16), coreMat);
    core.position.y = 7.5;
    group.add(core);
    subBoxes.push({ mesh: core, box: new THREE.Box3() });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.4, 8, 24), mat);
    ring.position.y = 7.5;
    group.add(ring);
    subBoxes.push({ mesh: ring, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spin', rotSpeed: -1.8 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 7 (Vent) : Pales éoliennes supersoniques en rotation
  spawnAeroBlades(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.2, metalness: 0.8 });
    const bladeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 12), hubMat);
    hub.position.y = 8.5;
    hub.rotation.x = Math.PI / 2;
    group.add(hub);
    subBoxes.push({ mesh: hub, box: new THREE.Box3() });

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.8, 0.4), bladeMat);
    b1.position.y = 8.5;
    group.add(b1);
    subBoxes.push({ mesh: b1, box: new THREE.Box3() });

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spin', rotSpeed: 1.6 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 7 (Vent) : Colonne de nuage condensé chargée d'éclairs
  spawnCloudSpire(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.75
    });

    const h = 34.0;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.8, h, 6), mat);
    cone.position.y = h / 2;
    cone.castShadow = true;
    group.add(cone);
    subBoxes.push({ mesh: cone, box: new THREE.Box3() });

    group.position.set(x, -12, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'needle', targetY: h / 2, riseSpeed: 42.0 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 8 (Cosmos) : Anneau de singularité de trou noir avec disque d'accrétion
  spawnBlackHoleGate(gapX) {
    const group = new THREE.Group();
    const subBoxes = [];
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x17022e,
      emissive: 0xa855f7,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.9
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(7.0, 0.8, 16, 32), ringMat);
    torus.position.y = 8.5;
    group.add(torus);
    subBoxes.push({ mesh: torus, box: new THREE.Box3() });

    group.position.set(gapX, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'spin', rotSpeed: 2.2 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Cycle 8 (Cosmos) : Polyèdre 4D cosmique oscillant
  spawnTesseractPrism(x) {
    const group = new THREE.Group();
    const subBoxes = [];
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2e0854,
      emissive: 0xc084fc,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.8
    });

    const poly = new THREE.Mesh(new THREE.IcosahedronGeometry(3.6, 0), mat);
    poly.position.y = 8.5;
    group.add(poly);
    subBoxes.push({ mesh: poly, box: new THREE.Box3() });

    group.position.set(x, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'glitch', glitchTimer: 0 };
    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Mise à jour fluide du monde avec synchronisation audio absolue (BPM, temps, mesure, kick)
  update(dt, speed, bpmOrAudioInfo, bassEnergy = 0, onCollisionCheck = null, onNearMiss = null, playerPos = null) {
    const deltaZ = speed * dt;
    const time = performance.now() * 0.001;

    // 1. Extraction en amont des informations de rythme musical (BPM, kick, temps, mesure)
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

    // 2. Transition fluide et cinématographique de cycle (Glide sans rupture)
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

      // Basculer la texture de sol en douceur à mi-course sous le voile de brume
      if (t >= 0.5) {
        if (this.currentCycleIndex === 0) {
          if (this.terrainMesh.material !== this.waterMaterial) {
            this.terrainMesh.material = this.waterMaterial;
          }
        } else {
          if (this.cycleGroundTextures && this.cycleGroundTextures[this.currentCycleIndex]) {
            if (this.groundMaterial.map !== this.cycleGroundTextures[this.currentCycleIndex]) {
              this.groundMaterial.map = this.cycleGroundTextures[this.currentCycleIndex];
              this.groundMaterial.needsUpdate = true;
            }
          }
          if (this.terrainMesh.material !== this.groundMaterial) {
            this.terrainMesh.material = this.groundMaterial;
          }
        }
      }

      if (t >= 1.0) {
        this.isTransitioning = false;
        this.scene.fog.near = 55;
        this.applyCycleImmediate(this.cycle);
      }
    }

    // Animation 3D physique des vagues d'eau et du relief synchronisée sur la musique
    this.updateTerrainMesh(time, audioPulse);
    // Le terrain reste parfaitement horizontal (zéro inclinaison déformante) et s'abaisse doucement pour l'eau
    if (this.terrainMesh) {
      this.terrainMesh.rotation.x = -Math.PI / 2;
      const targetY = (this.currentCycleIndex === 0) ? -0.7 : 0.0;
      this.terrainMesh.position.y += (targetY - this.terrainMesh.position.y) * 4.0 * dt;
    }

    // Défilement continu et fluide des textures (UV Flow vivant)
    if (this.groundMaterial && this.groundMaterial.map) {
      this.groundMaterial.map.offset.y -= speed * dt * 0.0018;
      if (this.currentCycleIndex === 0) {
        this.groundMaterial.map.offset.x = Math.sin(time * 0.7) * 0.015;
      }
    }

    // Effet de lave magmatique incandescente pour le Cycle 3 (Obsession)
    if (this.currentCycleIndex === 2) {
      const lavaPulse = 0.40 + Math.sin(time * 3.5) * 0.18 + audioPulse * 0.35;
      this.groundMaterial.emissive = new THREE.Color(0xff2200);
      this.groundMaterial.emissiveIntensity = lavaPulse;
    } else if (this.groundMaterial.emissiveIntensity > 0) {
      this.groundMaterial.emissiveIntensity = 0;
    }

    // Défilement infini et continu de la texture du sol (ZERO rupture, ZERO coupure)
    this.totalDistance = (this.totalDistance || 0) + deltaZ;
    const texScroll = deltaZ / 260.0;
    if (this.groundMaterial && this.groundMaterial.map) {
      this.groundMaterial.map.offset.y -= texScroll;
    }
    if (this.waterMaterial && this.waterMaterial.map) {
      this.waterMaterial.map.offset.y -= texScroll;
    }

    // Boost lumineux atmosphérique synchronisé avec le beat
    const audioLightBoost = 1.0 + audioPulse * 0.45;
    this.sunLight.intensity = (this.isTransitioning ? this.sunLight.intensity : this.cycle.lightIntensity) * audioLightBoost;
    this.hemiLight.intensity = 0.55 * (1.0 + audioPulse * 0.4);
    this.sunLight.target.position.z = -deltaZ;

    // 3. Animation de l'élément environnemental actif et des décors latéraux
    this.updateElements(dt, speed, audioPulse, time);
    if (this.updateSideProps) {
      this.updateSideProps(dt, speed, audioPulse);
    }

    // Défilement et animation du Portail Dimensionnel de Transition
    if (this.transitionPortal) {
      this.transitionPortal.update(dt, deltaZ, time);
      if (this.transitionPortal.group.position.z > 25.0) {
        this.transitionPortal.dispose(this.scene);
        this.transitionPortal = null;
      }
    }

    // 4. Cadencement progressif des obstacles : espacement resserré au fil des cycles
    // Cycle 1 : 2.15s (vol fluide et accessible) -> Cycle 8 : 0.82s (réflexes supersoniques intenses)
    this.timeSinceLastSpawn = (this.timeSinceLastSpawn || 0) + dt;
    const cycleIdx = this.currentCycleIndex || 0;
    // Espacement progressif resserré au fil des cycles (Cycle 1 ~1.1s, Cycle 8 ~0.40s)
    const minSpawnDelay = Math.max(0.52, 1.15 - cycleIdx * 0.08); // Cadence recalibrée et juste

    // Cadencement sur le rythme musical (BPM)
    let isSpawnBeat = isNewBeat;
    if (cycleIdx < 2) {
      isSpawnBeat = isNewBeat && (beatInBar === 0 || beatInBar === 2);
    } else if (cycleIdx < 5) {
      isSpawnBeat = isNewBeat && (beatInBar === 0 || beatInBar === 2 || (bass > 0.45 && beatInBar === 1));
    }

    if (isSpawnBeat && this.timeSinceLastSpawn >= minSpawnDelay) {
      this.timeSinceLastSpawn = 0;

      const spawnSingle = (lx) => {
        const r = Math.random();
        switch (this.cycle.style) {
          case 'falling':
            if (r < 0.28) this.spawnFallingPillar(lx);
            else if (r < 0.55) this.spawnWaterSpire(lx);
            else if (r < 0.78) this.spawnVortexMaelstrom(lx);
            else this.spawnIceArch((Math.random() - 0.5) * 12);
            break;
          case 'sliding':
            if (r < 0.28) this.spawnSlidingGate((Math.random() - 0.5) * 12);
            else if (r < 0.55) this.spawnEarthMonolith(lx);
            else if (r < 0.78) this.spawnRockAvalanche(lx);
            else this.spawnPillarCanyon((Math.random() - 0.5) * 10);
            break;
          case 'spiral':
            if (r < 0.28) this.spawnSpiralArch((Math.random() - 0.5) * 8);
            else if (r < 0.55) this.spawnVolcanoSpire(lx);
            else if (r < 0.78) this.spawnLavaWall((Math.random() - 0.5) * 10);
            else this.spawnMeteorImpact(lx);
            break;
          case 'tesla':
          case 'decoy':
            if (r < 0.28) this.spawnTeslaGate(lx);
            else if (r < 0.55) this.spawnPlasmaPrism(lx);
            else if (r < 0.78) this.spawnLaserGrid((Math.random() - 0.5) * 8);
            else this.spawnPulseConduit(lx);
            break;
          case 'solar':
            if (r < 0.28) this.spawnSolarBeam();
            else if (r < 0.55) this.spawnPrismObelisk(lx);
            else if (r < 0.78) this.spawnSunDialRing(lx);
            else this.spawnAlabasterPillars((Math.random() - 0.5) * 10);
            break;
          case 'quake':
            if (r < 0.28) this.spawnQuakePillars(lx);
            else if (r < 0.55) this.spawnVoidSpikes(lx);
            else if (r < 0.78) this.spawnShadowMonoliths((Math.random() - 0.5) * 10);
            else this.spawnDarkVortex(lx);
            break;
          case 'needles':
            if (r < 0.28) this.spawnCrystalNeedle(lx);
            else if (r < 0.55) this.spawnWindVortex(lx);
            else if (r < 0.78) this.spawnAeroBlades((Math.random() - 0.5) * 8);
            else this.spawnCloudSpire(lx);
            break;
          case 'glitch':
            if (r < 0.28) this.spawnGlitchMonolith(lx);
            else if (r < 0.55) this.spawnCosmicRift(lx);
            else if (r < 0.78) this.spawnBlackHoleGate((Math.random() - 0.5) * 8);
            else this.spawnTesseractPrism(lx);
            break;
          default:
            this.spawnWaterSpire(lx);
            break;
        }
      };

      // Formations d'obstacles multi-voies (Portes doubles, slaloms)
      const formationChance = 0.20 + cycleIdx * 0.05;
      if (cycleIdx >= 1 && Math.random() < formationChance) {
        if (Math.random() < 0.5) {
          // Double piliers laissant le couloir central libre
          spawnSingle(-11);
          spawnSingle(11);
        } else {
          // Slalom (Une voie latérale + centre)
          const sideLane = (Math.random() < 0.5) ? -12 : 12;
          spawnSingle(sideLane);
          spawnSingle(0);
        }
      } else {
        const lanes = [-15, -9, 0, 9, 15];
        const lx = lanes[Math.floor(Math.random() * lanes.length)];
        spawnSingle(lx);
        // 25% de chance d'ajouter un obstacle en haute altitude pour empêcher le survol
        if (Math.random() < 0.28) {
          const altLane = (Math.random() - 0.5) * 22;
          this.spawnHighAltitudeHazard(altLane, cycleIdx);
        }
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

      // Pulsation émissive synchronisée avec le rythme musical sur les éléments lumineux
      if (obs.mesh) {
        obs.mesh.traverse(child => {
          if (child.material && child.material.emissive && child.material.emissive.getHex() !== 0) {
            if (child.userData.baseEmissive === undefined) {
              child.userData.baseEmissive = child.material.emissiveIntensity || 1.0;
            }
            child.material.emissiveIntensity = child.userData.baseEmissive * (1.0 + audioPulse * 1.6);
          }
        });
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
      } else if (obs.type === 'spin') {
        const beatBoost = 1.0 + audioPulse * 1.2;
        obs.mesh.rotation.z += (obs.rotSpeed || 1.5) * beatBoost * dt;
      } else if (obs.type === 'vortex') {
        obs.mesh.rotation.y += (obs.rotSpeed || 3.0) * dt;
      } else if (obs.type === 'pulse') {
        const pulse = 1.0 + Math.sin(time * 6.0) * 0.18 * (1.0 + audioPulse * 0.8);
        obs.mesh.scale.set(pulse, pulse, pulse);
      } else if (obs.type === 'glitch') {
        if (isNewBeat && Math.random() < 0.25) {
          obs.mesh.position.x += (Math.random() - 0.5) * 1.2;
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

      // Détection de Frôlement In Extremis (Near Miss / Close Call)
      if (onNearMiss && playerPos && !obs.hasNearMissed && !obs.isDestroyed) {
        const obsZ = obs.mesh.position.z;
        if (obsZ >= -3.0 && obsZ <= 3.8) {
          const dx = Math.abs(obs.mesh.position.x - playerPos.x);
          const dy = Math.abs(obs.mesh.position.y - playerPos.y);
          if (dx >= 1.2 && dx <= 4.2 && dy <= 3.8) {
            obs.hasNearMissed = true;
            onNearMiss(obs, Math.hypot(dx, dy));
          }
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

    // 6. Animation des particules d'explosion des obstacles détruits (Star Fox & Purity)
    if (this.activeExplosions) {
      for (let i = this.activeExplosions.length - 1; i >= 0; i--) {
        const exp = this.activeExplosions[i];
        exp.timer += dt;
        const pos = exp.pts.geometry.attributes.position.array;
        const vel = exp.velocities;
        const drag = Math.pow(0.12, dt); // Freinage aérodynamique soyeux
        for (let p = 0; p < vel.length / 3; p++) {
          pos[p * 3] += vel[p * 3] * dt;
          pos[p * 3 + 1] += vel[p * 3 + 1] * dt;
          pos[p * 3 + 2] += vel[p * 3 + 2] * dt;
          vel[p * 3] *= drag;
          vel[p * 3 + 1] = vel[p * 3 + 1] * drag + 0.8 * dt; // Micro-lévitation céleste
          vel[p * 3 + 2] *= drag;
        }
        exp.pts.geometry.attributes.position.needsUpdate = true;
        const lifeRatio = exp.timer / exp.maxAge;
        exp.pts.material.opacity = Math.max(0, 0.95 * Math.pow(1.0 - lifeRatio, 1.5));

        if (exp.timer >= exp.maxAge) {
          this.scene.remove(exp.pts);
          exp.pts.geometry.dispose();
          exp.pts.material.dispose();
          this.activeExplosions.splice(i, 1);
        }
      }
    }
  }

  // --- LIGNES DE VITESSE HYPERDRIVE (SPEED STREAKS 3D) ---
  setupSpeedLines() {
    this.speedLineCount = 140;
    const geo = new THREE.BufferGeometry();
    this.speedLinePositions = new Float32Array(this.speedLineCount * 6);

    for (let i = 0; i < this.speedLineCount; i++) {
      const x = (Math.random() - 0.5) * 44;
      const y = 1.0 + Math.random() * 14;
      const z = -Math.random() * 180;
      const len = 3.5 + Math.random() * 8.0;

      this.speedLinePositions[i * 6] = x;
      this.speedLinePositions[i * 6 + 1] = y;
      this.speedLinePositions[i * 6 + 2] = z;

      this.speedLinePositions[i * 6 + 3] = x;
      this.speedLinePositions[i * 6 + 4] = y;
      this.speedLinePositions[i * 6 + 5] = z - len;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.speedLinePositions, 3));

    this.speedLineMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.speedLinesMesh = new THREE.LineSegments(geo, this.speedLineMat);
    this.scene.add(this.speedLinesMesh);
  }

  updateSpeedLines(dt, speed, isBoostOrSaiyan = false) {
    if (!this.speedLinesMesh) return;
    const speedRatio = Math.max(0, Math.min(1.0, (speed - 62.0) / 55.0));
    const targetOpacity = isBoostOrSaiyan ? 0.75 : speedRatio * 0.45;
    this.speedLineMat.opacity += (targetOpacity - this.speedLineMat.opacity) * 6.0 * dt;

    if (this.speedLineMat.opacity < 0.01) {
      this.speedLinesMesh.visible = false;
      return;
    }
    this.speedLinesMesh.visible = true;

    if (this.cycle) {
      this.speedLineMat.color.set(isBoostOrSaiyan ? 0x00f0ff : (this.cycle.primary || 0xbae6fd));
    }

    const pos = this.speedLinesMesh.geometry.attributes.position.array;
    const moveZ = (speed * 1.85 + (isBoostOrSaiyan ? 65.0 : 0)) * dt;

    for (let i = 0; i < this.speedLineCount; i++) {
      pos[i * 6 + 2] += moveZ;
      pos[i * 6 + 5] += moveZ;

      if (pos[i * 6 + 5] > 25.0) {
        const x = (Math.random() - 0.5) * 44;
        const y = 1.0 + Math.random() * 14;
        const z = -170 - Math.random() * 40;
        const len = 4.0 + Math.random() * 10.0 + (isBoostOrSaiyan ? 8.0 : 0);

        pos[i * 6] = x;
        pos[i * 6 + 1] = y;
        pos[i * 6 + 2] = z;

        pos[i * 6 + 3] = x;
        pos[i * 6 + 4] = y;
        pos[i * 6 + 5] = z - len;
      }
    }
    this.speedLinesMesh.geometry.attributes.position.needsUpdate = true;
  }

  reset() {
    if (this.transitionPortal) {
      this.transitionPortal.dispose(this.scene);
      this.transitionPortal = null;
    }
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

    if (this.speedLineMat) {
      this.speedLineMat.opacity = 0;
    }
    if (this.speedLinesMesh) {
      this.speedLinesMesh.visible = false;
    }
  }
}
