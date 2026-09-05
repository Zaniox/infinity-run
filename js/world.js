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
    subtitle: "Gravité / Abysse",
    troll: "CHUTE CÉLESTE : Monolithes qui tombent du ciel en piqué",
    sky: 0x05010a,
    fog: 0x12021a,
    ground: 0x100418,
    monolith: 0x240838,
    primary: 0xa855f7,
    secondary: 0xec4899,
    lightIntensity: 1.8,
    style: "falling"
  },
  {
    id: 2,
    name: "Résilience",
    subtitle: "Terre / Métal",
    troll: "PISTONS COULISSANTS : Portes de blindage qui se referment",
    sky: 0x010c08,
    fog: 0x03160e,
    ground: 0x04140c,
    monolith: 0x0d281a,
    primary: 0x00ff88,
    secondary: 0x00b4d8,
    lightIntensity: 1.7,
    style: "sliding"
  },
  {
    id: 3,
    name: "Obsession",
    subtitle: "Vortex / Spirale",
    troll: "VORTEX EN ROTATION : Arches géantes tournant en hélice",
    sky: 0x01081a,
    fog: 0x021226,
    ground: 0x031224,
    monolith: 0x09264c,
    primary: 0x00f0ff,
    secondary: 0x3b82f6,
    lightIntensity: 1.9,
    style: "spiral"
  },
  {
    id: 4,
    name: "Amour",
    subtitle: "Lumière / Éther",
    troll: "LEURRE PRISMATIQUE : Faux cœurs et prismes flottants",
    sky: 0x120412,
    fog: 0x240d22,
    ground: 0x1c081a,
    monolith: 0x3d1439,
    primary: 0xf472b6,
    secondary: 0xfbbf24,
    lightIntensity: 2.0,
    style: "decoy"
  },
  {
    id: 5,
    name: "Bonheur",
    subtitle: "Énergie Solaire",
    troll: "ÉRUPTIONS SOLAIRES : Nappe de lasers horizontaux à raser",
    sky: 0x140a02,
    fog: 0x261504,
    ground: 0x221004,
    monolith: 0x442208,
    primary: 0xfbbf24,
    secondary: 0xf97316,
    lightIntensity: 2.1,
    style: "solar"
  },
  {
    id: 6,
    name: "Chaos",
    subtitle: "Entropie / Feu",
    troll: "SÉISME D'ENTROPIE : Piliers sismiques vacillant sur les kicks",
    sky: 0x120103,
    fog: 0x220205,
    ground: 0x1c0206,
    monolith: 0x3e050c,
    primary: 0xff003c,
    secondary: 0xff7700,
    lightIntensity: 1.8,
    style: "quake"
  },
  {
    id: 7,
    name: "Ambition",
    subtitle: "Ascension / Cristal",
    troll: "POUSSÉE CRISTALLINE : Aiguilles jaillissant vers le ciel",
    sky: 0x030a16,
    fog: 0x061628,
    ground: 0x061426,
    monolith: 0x103054,
    primary: 0xe0f2fe,
    secondary: 0x38bdf8,
    lightIntensity: 2.0,
    style: "needles"
  },
  {
    id: 8,
    name: "Folie",
    subtitle: "Distorsion & Feinte Finale",
    troll: "LA FEINTE COSMIQUE : Distorsion de réalité et boucle infinie",
    sky: 0x120114,
    fog: 0x220226,
    ground: 0x1a0220,
    monolith: 0x3c0544,
    primary: 0xe879f9,
    secondary: 0xc084fc,
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

  // Troll 1 (Chute) : Monolithe tombant du ciel en piqué gravitationnel
  spawnFallingPillar(x) {
    const w = 5.0, h = 28.0, d = 5.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
    mesh.position.set(x, 48.0, this.spawnDistance); // Tombe depuis le ciel
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'falling', targetY: h / 2, fallSpeed: 42.0 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 2 (Résilience) : Porte blindée à pistons coulissants au rythme du beat
  spawnSlidingGate(gapX) {
    const group = new THREE.Group();
    const h = 24.0, thickness = 5.0;
    const subBoxes = [];

    const leftW = Math.max(12, gapX + 28);
    const leftGeo = new THREE.BoxGeometry(leftW, h, thickness);
    const leftMesh = new THREE.Mesh(leftGeo, this.monolithMaterial);
    leftMesh.position.set(-leftW / 2 + gapX - 4.5, h / 2, 0);
    leftMesh.castShadow = true;
    group.add(leftMesh);
    subBoxes.push({ mesh: leftMesh, box: new THREE.Box3() });

    const rightW = Math.max(12, 28 - gapX);
    const rightGeo = new THREE.BoxGeometry(rightW, h, thickness);
    const rightMesh = new THREE.Mesh(rightGeo, this.monolithMaterial);
    rightMesh.position.set(rightW / 2 + gapX + 4.5, h / 2, 0);
    rightMesh.castShadow = true;
    group.add(rightMesh);
    subBoxes.push({ mesh: rightMesh, box: new THREE.Box3() });

    group.position.set(0, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes, type: 'sliding', dir: Math.random() < 0.5 ? 1 : -1, speed: 6.5 };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // Troll 3 (Obsession) : Arche tourbillonnante en rotation sur l'axe Z
  spawnSpiralArch(gapX) {
    const group = new THREE.Group();
    const size = 26.0;

    const topGeo = new THREE.BoxGeometry(size, 4.0, 4.0);
    const top = new THREE.Mesh(topGeo, this.monolithMaterial);
    top.position.y = 12;
    group.add(top);

    const botGeo = new THREE.BoxGeometry(size, 4.0, 4.0);
    const bot = new THREE.Mesh(botGeo, this.monolithMaterial);
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

  // Troll 4 (Amour) : Prisme decoy (labyrinthe de prismes d'éther)
  spawnDecoyArch(x) {
    const geo = new THREE.OctahedronGeometry(6.5, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xbe185d,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 5.5, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'decoy' };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 5 (Bonheur) : Nappe de rayons solaires forçant le rase-mottes
  spawnSolarBeam() {
    const group = new THREE.Group();
    const w = 110.0, h = 1.2, d = 4.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.85
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

  // Troll 6 (Chaos) : Piliers sismiques vacillants
  spawnQuakePillars(x) {
    const w = 5.0, h = 26.0, d = 5.0;
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.castShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox, type: 'quake', shakePhase: Math.random() * Math.PI * 2 };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Troll 7 (Ambition) : Aiguilles cristallines géantes jaillissant du sol
  spawnCrystalNeedle(x) {
    const r = 3.5, h = 38.0;
    const geo = new THREE.ConeGeometry(r, h, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.1,
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

  // Troll 8 (Folie) : Monolithe glitché vacillant et instable
  spawnGlitchMonolith(x) {
    const w = 4.5, h = 24.0, d = 4.5;
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
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

    // 3. Cadencement des obstacles sur le BPM et les Trolls
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
}
