import * as THREE from 'three';

export class InfiniteGrid {
  constructor(scene) {
    this.scene = scene;
    this.speed = 68.0; // Vitesse de défilement vers la sphère (effet Race the Sun)

    // Configuration des sections de grille
    this.trackWidth = 80;
    this.sectionLength = 240;
    this.gridWidthSegments = 40;
    this.gridLengthSegments = 120;

    this.group = new THREE.Group();
    this.sections = [];

    this.createGridSections();
    this.createHorizonAccent();
    this.scene.add(this.group);
  }

  createGridSections() {
    // Matériau filaire néon violet / magenta cyber
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });

    // Sous-couche sombre pour masquer le vide
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x05010b,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    // Deux grands segments juxtaposés en Z pour une boucle infinie sans à-coup
    for (let i = 0; i < 2; i++) {
      const sectionGroup = new THREE.Group();

      // Géométrie de la grille
      const geom = new THREE.PlaneGeometry(
        this.trackWidth,
        this.sectionLength,
        this.gridWidthSegments,
        this.gridLengthSegments
      );

      const baseMesh = new THREE.Mesh(geom, baseMaterial);
      baseMesh.rotation.x = -Math.PI / 2;
      sectionGroup.add(baseMesh);

      const wireMesh = new THREE.Mesh(geom, wireMaterial);
      wireMesh.rotation.x = -Math.PI / 2;
      wireMesh.position.y = 0.01;
      sectionGroup.add(wireMesh);

      // Lignes de guidage néon magenta sur les bords de piste
      this.addBorderGuides(sectionGroup);

      // Positionnement initial en Z
      sectionGroup.position.z = -i * this.sectionLength;
      this.sections.push(sectionGroup);
      this.group.add(sectionGroup);
    }
  }

  addBorderGuides(parent) {
    const guideMat = new THREE.LineBasicMaterial({
      color: 0xff2ea6,
      linewidth: 2
    });

    const halfLength = this.sectionLength / 2;
    const borderOffsets = [-15, 15]; // Limites visuelles de la trajectoire principale

    borderOffsets.forEach((x) => {
      const points = [
        new THREE.Vector3(x, 0.02, -halfLength),
        new THREE.Vector3(x, 0.02, halfLength)
      ];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, guideMat);
      parent.add(line);
    });
  }

  createHorizonAccent() {
    // Halo néon lointain au point de fuite
    const horizonGeo = new THREE.PlaneGeometry(160, 4);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x7928ca,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    this.horizonMesh.position.set(0, 0.5, -280);
    this.scene.add(this.horizonMesh);
  }

  update(deltaTime) {
    const deltaZ = this.speed * deltaTime;
    const resetThreshold = this.sectionLength;

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      // Le sol avance vers la caméra (+Z) pour simuler la course du joueur vers l'avant (-Z)
      section.position.z += deltaZ;

      // Quand une section dépasse derrière la caméra, on la replace devant
      if (section.position.z >= resetThreshold) {
        section.position.z -= this.sectionLength * 2;
      }
    }
  }
}
