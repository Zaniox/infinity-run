import * as THREE from 'three';

export class InfiniteGrid {
  constructor(scene) {
    this.scene = scene;
    this.trackWidth = 84;
    this.sectionLength = 260;
    this.gridWidthSegments = 42;
    this.gridLengthSegments = 130;

    this.group = new THREE.Group();
    this.sections = [];

    this.createGridSections();
    this.scene.add(this.group);
  }

  createGridSections() {
    // Matériau filaire cyan néon éclatant
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.72
    });

    // Sous-sol sombre absorbant
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x030107,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    for (let i = 0; i < 2; i++) {
      const sectionGroup = new THREE.Group();

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

      this.addBorderGuides(sectionGroup);

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
    const borderOffsets = [-17, 17];

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

  update(deltaTime, forwardSpeed = 65.0) {
    // Défilement dynamique basé sur la vitesse de planeur
    const deltaZ = forwardSpeed * deltaTime;

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      section.position.z += deltaZ;

      if (section.position.z >= this.sectionLength) {
        section.position.z -= this.sectionLength * 2;
      }
    }
  }
}
