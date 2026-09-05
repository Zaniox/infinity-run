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
    sky: 0x010c08,
    fog: 0x03160e,
    ground: 0x04140c,
    monolith: 0x0d281a,
    primary: 0x00ff88,
    secondary: 0x00b4d8,
    lightIntensity: 1.7,
    style: "ramp"
  },
  {
    id: 3,
    name: "Obsession",
    subtitle: "Vortex / Spirale",
    sky: 0x01081a,
    fog: 0x021226,
    ground: 0x031224,
    monolith: 0x09264c,
    primary: 0x00f0ff,
    secondary: 0x3b82f6,
    lightIntensity: 1.9,
    style: "chevrons"
  },
  {
    id: 4,
    name: "Amour",
    subtitle: "Lumière / Éther",
    sky: 0x120412,
    fog: 0x240d22,
    ground: 0x1c081a,
    monolith: 0x3d1439,
    primary: 0xf472b6,
    secondary: 0xfbbf24,
    lightIntensity: 2.0,
    style: "arches"
  },
  {
    id: 5,
    name: "Bonheur",
    subtitle: "Énergie Solaire",
    sky: 0x140a02,
    fog: 0x261504,
    ground: 0x221004,
    monolith: 0x442208,
    primary: 0xfbbf24,
    secondary: 0xf97316,
    lightIntensity: 2.1,
    style: "plateaus"
  },
  {
    id: 6,
    name: "Chaos",
    subtitle: "Entropie / Feu",
    sky: 0x120103,
    fog: 0x220205,
    ground: 0x1c0206,
    monolith: 0x3e050c,
    primary: 0xff003c,
    secondary: 0xff7700,
    lightIntensity: 1.8,
    style: "shattered"
  },
  {
    id: 7,
    name: "Ambition",
    subtitle: "Ascension / Cristal",
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
    subtitle: "Distorsion",
    sky: 0x120114,
    fog: 0x220226,
    ground: 0x1a0220,
    monolith: 0x3c0544,
    primary: 0xe879f9,
    secondary: 0xc084fc,
    lightIntensity: 1.9,
    style: "twisted"
  }
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.currentCycleIndex = 0;
    this.cycle = CYCLES_DATA[0];

    // Initialisation de la brume volumétrique atmosphérique (Race the Sun)
    this.scene.background = new THREE.Color(this.cycle.sky);
    this.scene.fog = new THREE.FogExp2(this.cycle.fog, 0.0042);

    // Éclairage directionnel & ombres nettes
    this.setupLighting();

    // Terrain solide uni sans grille filaire
    this.setupSolidTerrain();

    // Gestionnaire d'obstacles procéduraux
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.spawnDistance = -280;
    this.despawnZ = 25;
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
    this.sectionLength = 260;
    this.terrainSections = [];

    // Matériau solide mat avec texture d'ombres propre (sans brillance aveuglante)
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: this.cycle.ground,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: false
    });

    // 2 grandes sections coulissantes pour un sol infini fluide
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.PlaneGeometry(this.trackWidth, this.sectionLength, 28, 48);

      // Génération d'un relief doux organique sur les côtés (Race the Sun)
      const pos = geo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        const y = pos.getY(j);
        // Les bords extérieurs s'élèvent en douces falaises/dunes
        const distFromCenter = Math.abs(x);
        if (distFromCenter > 28) {
          const elev = Math.pow((distFromCenter - 28) / 38, 2) * 9.0;
          const noise = Math.sin(x * 0.12) * Math.cos(y * 0.08) * 1.5;
          pos.setZ(j, elev + noise);
        }
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, this.groundMaterial);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = -i * this.sectionLength;
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

  // --- SPAWN D'OBSTACLES GÉOMÉTRIQUES ÉPURÉS (STYLE RACE THE SUN) ---

  // 1. Monolithe vertical imposant biseauté
  spawnMonolith(x, scaleY = 1.0) {
    const w = 4.0 + Math.random() * 3.5;
    const h = (24.0 + Math.random() * 28.0) * scaleY;
    const d = 5.0 + Math.random() * 4.0;

    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
    mesh.position.set(x, h / 2, this.spawnDistance);

    // Léger dévers pour le style "structures qui s'affaissent"
    if (this.cycle.style === 'falling') {
      mesh.rotation.z = (Math.random() - 0.5) * 0.16;
      mesh.rotation.x = (Math.random() - 0.5) * 0.12;
    } else if (this.cycle.style === 'twisted') {
      mesh.rotation.y = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // 2. Aiguille triangulaire / Obélisque acéré
  spawnNeedle(x, scaleY = 1.0) {
    const r = 3.2 + Math.random() * 2.2;
    const h = (30.0 + Math.random() * 34.0) * scaleY;
    const geo = new THREE.ConeGeometry(r, h, 4); // Cône à 4 pans (pyramide élancée)
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);

    mesh.position.set(x, h / 2, this.spawnDistance);
    mesh.rotation.y = Math.PI / 4;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // 3. Muraille / Falaise biseautée avec ouverture
  spawnWallWithGate(gapX) {
    const group = new THREE.Group();
    const h = 26.0;
    const thickness = 6.0;
    const subBoxes = [];

    // Pilier gauche
    const leftW = Math.max(10, gapX + 28);
    const leftGeo = new THREE.BoxGeometry(leftW, h, thickness);
    const leftMesh = new THREE.Mesh(leftGeo, this.monolithMaterial);
    leftMesh.position.set(-leftW / 2 + gapX - 4.5, h / 2, 0);
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    group.add(leftMesh);
    subBoxes.push({ mesh: leftMesh, box: new THREE.Box3() });

    // Pilier droit
    const rightW = Math.max(10, 28 - gapX);
    const rightGeo = new THREE.BoxGeometry(rightW, h, thickness);
    const rightMesh = new THREE.Mesh(rightGeo, this.monolithMaterial);
    rightMesh.position.set(rightW / 2 + gapX + 4.5, h / 2, 0);
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    group.add(rightMesh);
    subBoxes.push({ mesh: rightMesh, box: new THREE.Box3() });

    // Arche supérieure (optionnelle pour forcer le vol rasant)
    if (Math.random() < 0.6) {
      const lintelGeo = new THREE.BoxGeometry(16.0, 6.0, thickness);
      const lintelMesh = new THREE.Mesh(lintelGeo, this.monolithMaterial);
      lintelMesh.position.set(gapX, h - 3.0, 0);
      lintelMesh.castShadow = true;
      lintelMesh.receiveShadow = true;
      group.add(lintelMesh);
      subBoxes.push({ mesh: lintelMesh, box: new THREE.Box3() });
    }

    group.position.set(0, 0, this.spawnDistance);
    const obj = { mesh: group, subBoxes };

    this.scene.add(group);
    this.obstacles.push(obj);
  }

  // 4. Plateau surélevé horizontal (style Bonheur / Plateaus)
  spawnPlateau(x, y) {
    const w = 18.0 + Math.random() * 12.0;
    const h = 4.0;
    const d = 26.0 + Math.random() * 18.0;

    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, this.monolithMaterial);
    mesh.position.set(x, y, this.spawnDistance);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const obj = { mesh, bbox };

    this.scene.add(mesh);
    this.obstacles.push(obj);
  }

  // Défilement du sol et mise à jour des obstacles
  update(dt, speed, bpm, onCollisionCheck) {
    const deltaZ = speed * dt;

    // 1. Défilement continu du sol solide
    for (const sec of this.terrainSections) {
      sec.position.z += deltaZ;
      if (sec.position.z >= this.sectionLength) {
        sec.position.z -= this.sectionLength * 2;
      }
    }

    // Suivi de la lumière du soleil
    this.sunLight.target.position.z = -deltaZ;

    // 2. Génération cadencée sur le tempo musical (BPM)
    const beatInterval = 60.0 / (bpm || 130);
    const measureBeats = speed > 90.0 ? 3.0 : 4.0;
    this.obstacleTimer += dt;

    if (this.obstacleTimer >= beatInterval * measureBeats) {
      this.obstacleTimer = 0;

      const lanes = [-14, -8, 0, 8, 14];
      const lx = lanes[Math.floor(Math.random() * lanes.length)];
      const r = Math.random();

      if (this.cycle.style === 'needles') {
        this.spawnNeedle(lx);
      } else if (this.cycle.style === 'plateaus' && r < 0.4) {
        this.spawnPlateau((Math.random() - 0.5) * 16, 6 + Math.random() * 8);
      } else if (r < 0.35) {
        this.spawnWallWithGate((Math.random() - 0.5) * 14);
      } else {
        this.spawnMonolith(lx);
      }
    }

    // 3. Déplacement, mise à jour des boîtes et test de collision
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += deltaZ;

      if (obs.subBoxes) {
        for (const sub of obs.subBoxes) {
          sub.box.setFromObject(sub.mesh);
        }
      } else {
        obs.bbox.setFromObject(obs.mesh);
      }

      // Test de collision avec le joueur si fourni
      if (onCollisionCheck && Math.abs(obs.mesh.position.z) < 8.0) {
        let hit = false;
        if (obs.subBoxes) {
          for (const sub of obs.subBoxes) {
            if (onCollisionCheck(sub.box)) hit = true;
          }
        } else if (onCollisionCheck(obs.bbox)) {
          hit = true;
        }
        if (hit) {
          // Collision confirmée
        }
      }

      // Recyclage des obstacles dépassés
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
