import * as THREE from 'three';

export class InfiniteGrid {
  constructor(scene) {
    this.scene = scene;
    this.speed = 65.0; // Vitesse constante de défilement vers la caméra

    // Dimensions de la grille
    this.trackWidth = 80;
    this.sectionLength = 240;
    this.gridWidthSegments = 40;
    this.gridLengthSegments = 120;

    this.group = new THREE.Group();
    this.sections = [];

    this.createGridSections();
    this.scene.add(this.group);
  }

  createGridSections() {
    // Matériau filaire (wireframe) couleur cyan néon (#00f0ff)
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    // Sous-couche opaque sombre
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x030108,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    // Deux grands segments juxtaposés en Z pour une boucle infinie continue
    for (let i = 0; i < 2; i++) {
      const sectionGroup = new THREE.Group();

      const geom = new THREE.PlaneGeometry(
        this.trackWidth,
        this.sectionLength,
        this.gridWidthSegments,
        this.gridLengthSegments
      );

      // Sol sombre occultant
      const baseMesh = new THREE.Mesh(geom, baseMaterial);
      baseMesh.rotation.x = -Math.PI / 2;
      sectionGroup.add(baseMesh);

      // Grille filaire cyan néon
      const wireMesh = new THREE.Mesh(geom, wireMaterial);
      wireMesh.rotation.x = -Math.PI / 2;
      wireMesh.position.y = 0.01;
      sectionGroup.add(wireMesh);

      // Bordures de guidage cyan néon intense
      this.addBorderGuides(sectionGroup);

      // Positionnement initial en Z
      sectionGroup.position.z = -i * this.sectionLength;
      this.sections.push(sectionGroup);
      this.group.add(sectionGroup);
    }
  }

  addBorderGuides(parent) {
    const guideMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 2
    });

    const halfLength = this.sectionLength / 2;
    const borderOffsets = [-16, 16];

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

  update(deltaTime) {
    const deltaZ = this.speed * deltaTime;

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      // Le sol défile vers la caméra (+Z) à vitesse constante
      section.position.z += deltaZ;

      // Quand une section passe derrière la caméra, elle boucle sans couture vers l'avant
      if (section.position.z >= this.sectionLength) {
        section.position.z -= this.sectionLength * 2;
      }
    }
  }
}
