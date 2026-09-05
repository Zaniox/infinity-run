import * as THREE from 'three';

export class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = [];
    this.pickups = [];

    // Configuration d'apparition procédurale
    this.spawnDistance = -280; // Distance en Z où les structures apparaissent
    this.despawnZ = 16;        // Distance derrière la caméra où elles disparaissent
    this.spawnTimer = 0;
    this.spawnInterval = 1.1;  // Fréquence d'apparition en secondes
    this.pickupTimer = 0;
    this.pickupInterval = 2.8; // Fréquence d'apparition des orbes violettes

    // Matériaux partagés pour les performances
    this.initSharedMaterials();
  }

  initSharedMaterials() {
    // Matériau filaire cyan néon pour les colonnes
    this.columnWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    // Matériau corps sombre de colonne
    this.columnBaseMat = new THREE.MeshBasicMaterial({
      color: 0x070214,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    // Matériau arche filaire magenta
    this.archWireMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    // Matériau pyramide inversée violet profond
    this.pyramidMat = new THREE.MeshStandardMaterial({
      color: 0x2e0854,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.15
    });

    this.pyramidWireMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      wireframe: true
    });

    // Matériau pour les orbes violettes d'énergie
    this.pickupCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.pickupGlowMat = new THREE.MeshBasicMaterial({
      color: 0xc026d3,
      transparent: true,
      opacity: 0.8
    });
    this.pickupRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2ea6,
      transparent: true,
      opacity: 0.9
    });
  }

  spawnColumn(x) {
    const group = new THREE.Group();
    const width = 3.2;
    const height = 18 + Math.random() * 12; // Hauteur imposante
    const geom = new THREE.BoxGeometry(width, height, width, 4, 16, 4);

    const baseMesh = new THREE.Mesh(geom, this.columnBaseMat);
    const wireMesh = new THREE.Mesh(geom, this.columnWireMat);
    group.add(baseMesh);
    group.add(wireMesh);

    // Positionnement au sol
    group.position.set(x, height / 2, this.spawnDistance);

    // Bounding Box pour collision
    const bbox = new THREE.Box3();
    bbox.setFromObject(group);

    const obstacleObj = {
      type: 'column',
      mesh: group,
      bbox: bbox,
      width: width,
      height: height
    };

    this.scene.add(group);
    this.obstacles.push(obstacleObj);
  }

  spawnArch(x, y) {
    const group = new THREE.Group();
    // Arche géométrique (portique composé de 2 piliers et d'un linteau)
    const pillarWidth = 1.6;
    const archWidth = 12.0;
    const archHeight = 14.0;

    // Pilier gauche
    const leftPillarGeo = new THREE.BoxGeometry(pillarWidth, archHeight, pillarWidth);
    const leftPillar = new THREE.Mesh(leftPillarGeo, this.archWireMat);
    leftPillar.position.set(-archWidth / 2, archHeight / 2, 0);
    group.add(leftPillar);

    // Pilier droit
    const rightPillarGeo = new THREE.BoxGeometry(pillarWidth, archHeight, pillarWidth);
    const rightPillar = new THREE.Mesh(rightPillarGeo, this.archWireMat);
    rightPillar.position.set(archWidth / 2, archHeight / 2, 0);
    group.add(rightPillar);

    // Linteau supérieur
    const topBarGeo = new THREE.BoxGeometry(archWidth + pillarWidth, pillarWidth, pillarWidth);
    const topBar = new THREE.Mesh(topBarGeo, this.archWireMat);
    topBar.position.set(0, archHeight, 0);
    group.add(topBar);

    group.position.set(x, y, this.spawnDistance);

    const bbox = new THREE.Box3();
    bbox.setFromObject(group);

    // On stocke les bboxes des 3 composants pour permettre de voler AU MILIEU de l'arche !
    const leftBbox = new THREE.Box3().setFromObject(leftPillar);
    const rightBbox = new THREE.Box3().setFromObject(rightPillar);
    const topBbox = new THREE.Box3().setFromObject(topBar);

    const obstacleObj = {
      type: 'arch',
      mesh: group,
      subBoxes: [
        { mesh: leftPillar, box: new THREE.Box3() },
        { mesh: rightPillar, box: new THREE.Box3() },
        { mesh: topBar, box: new THREE.Box3() }
      ],
      bbox: bbox
    };

    this.scene.add(group);
    this.obstacles.push(obstacleObj);
  }

  spawnPyramid(x, y) {
    const group = new THREE.Group();
    const radius = 4.2;
    const height = 8.0;

    // Cône / Pyramide à 4 côtés orientée vers le bas
    const geom = new THREE.ConeGeometry(radius, height, 4);

    const solidMesh = new THREE.Mesh(geom, this.pyramidMat);
    const wireMesh = new THREE.Mesh(geom, this.pyramidWireMat);
    group.add(solidMesh);
    group.add(wireMesh);

    // Inversion de la pyramide (pointe vers le bas)
    group.rotation.x = Math.PI;
    group.position.set(x, y, this.spawnDistance);

    const bbox = new THREE.Box3();
    bbox.setFromObject(group);

    const obstacleObj = {
      type: 'pyramid',
      mesh: group,
      bbox: bbox,
      rotSpeed: 0.6
    };

    this.scene.add(group);
    this.obstacles.push(obstacleObj);
  }

  spawnPickup(x, y) {
    const group = new THREE.Group();

    // Cœur de l'orbe blanc éclatant
    const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const coreMesh = new THREE.Mesh(coreGeo, this.pickupCoreMat);
    group.add(coreMesh);

    // Aura violette émissive
    const glowGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const glowMesh = new THREE.Mesh(glowGeo, this.pickupGlowMat);
    group.add(glowMesh);

    // Anneau néon magenta rotatif
    const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 32);
    const ringMesh = new THREE.Mesh(ringGeo, this.pickupRingMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    group.add(ringMesh);

    group.position.set(x, y, this.spawnDistance);

    const pickupObj = {
      mesh: group,
      ringMesh: ringMesh,
      radius: 1.1,
      collected: false
    };

    this.scene.add(group);
    this.pickups.push(pickupObj);
  }

  generateRandomWave() {
    const laneCount = 5;
    const lanes = [-12, -6, 0, 6, 12];
    const randLane = lanes[Math.floor(Math.random() * lanes.length)];

    const r = Math.random();
    if (r < 0.45) {
      // Colonne
      this.spawnColumn(randLane);
      if (Math.random() < 0.35) {
        // Deuxième colonne sur une autre voie
        const otherLane = lanes.filter(l => l !== randLane)[Math.floor(Math.random() * 4)];
        this.spawnColumn(otherLane);
      }
    } else if (r < 0.75) {
      // Arche filaire
      const archX = (Math.random() - 0.5) * 10;
      this.spawnArch(archX, 0);
    } else {
      // Pyramide inversée flottante
      const pyrY = 8 + Math.random() * 10; // Altitude moyenne / haute
      this.spawnPyramid(randLane, pyrY);
    }
  }

  generatePickup() {
    const lanes = [-10, -5, 0, 5, 10];
    const x = lanes[Math.floor(Math.random() * lanes.length)];
    // Soit au sol (2m), soit en l'air (8 à 16m)
    const y = Math.random() < 0.5 ? 2.2 : (8 + Math.random() * 10);
    this.spawnPickup(x, y);
  }

  update(deltaTime, forwardSpeed) {
    const deltaZ = forwardSpeed * deltaTime;

    // 1. Spawning procédural
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.generateRandomWave();
    }

    this.pickupTimer += deltaTime;
    if (this.pickupTimer >= this.pickupInterval) {
      this.pickupTimer = 0;
      this.generatePickup();
    }

    // 2. Déplacement et mise à jour des obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += deltaZ;

      if (obs.type === 'pyramid') {
        obs.mesh.rotation.y += obs.rotSpeed * deltaTime;
      }

      // Mise à jour de la bounding box
      if (obs.subBoxes) {
        // Pour les arches, mettre à jour chaque partie
        for (const sub of obs.subBoxes) {
          sub.box.setFromObject(sub.mesh);
        }
      } else {
        obs.bbox.setFromObject(obs.mesh);
      }

      // Despawn si dépassé
      if (obs.mesh.position.z > this.despawnZ) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }

    // 3. Déplacement et animation des pickups d'énergie
    const time = performance.now() * 0.003;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.mesh.position.z += deltaZ;
      p.ringMesh.rotation.z += 3.0 * deltaTime;
      p.ringMesh.rotation.y += 2.0 * deltaTime;

      // Légère oscillation verticale
      p.mesh.position.y += Math.sin(time + i) * 0.015;

      if (p.mesh.position.z > this.despawnZ || p.collected) {
        this.scene.remove(p.mesh);
        this.pickups.splice(i, 1);
      }
    }
  }

  checkCollisions(playerSphere) {
    // Vérifie les collisions avec les obstacles proches
    for (const obs of this.obstacles) {
      // Optimisation : tester uniquement les objets à proximité en Z
      if (Math.abs(obs.mesh.position.z - playerSphere.center.z) > 7.0) {
        continue;
      }

      if (obs.subBoxes) {
        for (const sub of obs.subBoxes) {
          if (sub.box.intersectsSphere(playerSphere)) {
            return { hit: true, type: obs.type };
          }
        }
      } else if (obs.bbox.intersectsSphere(playerSphere)) {
        return { hit: true, type: obs.type };
      }
    }
    return { hit: false };
  }

  checkPickups(playerSphere) {
    // Vérifie la collecte des orbes d'énergie
    for (const p of this.pickups) {
      if (p.collected) continue;

      const dist = p.mesh.position.distanceTo(playerSphere.center);
      if (dist < (p.radius + playerSphere.radius * 0.9)) {
        p.collected = true;
        return true; // Orbe collectée !
      }
    }
    return false;
  }

  reset() {
    // Nettoyer tous les obstacles et pickups existants
    for (const obs of this.obstacles) {
      this.scene.remove(obs.mesh);
    }
    this.obstacles = [];

    for (const p of this.pickups) {
      this.scene.remove(p.mesh);
    }
    this.pickups = [];

    this.spawnTimer = 0;
    this.pickupTimer = 0;
  }
}
