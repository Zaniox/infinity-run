import * as THREE from 'three';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initResizeListener();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Brume atmosphérique sombre pour fondre l'horizon
    this.scene.fog = new THREE.FogExp2(0x04010b, 0.0075);
  }

  initCamera() {
    // Caméra perspective 3e personne avec légère plongée
    this.camera = new THREE.PerspectiveCamera(
      64,
      this.width / this.height,
      0.1,
      1000
    );
    // Position : légèrement surélevée et en arrière de la sphère
    this.camera.position.set(0, 4.0, 9.0);
    // Cible : point central en avant sur la piste
    this.cameraTarget = new THREE.Vector3(0, 1.0, -12);
    this.camera.lookAt(this.cameraTarget);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  initLights() {
    // Lumière ambiante douce
    const ambientLight = new THREE.AmbientLight(0x18052e, 1.5);
    this.scene.add(ambientLight);

    // Lumière néon cyan rasante
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    cyanLight.position.set(10, 12, 6);
    this.scene.add(cyanLight);

    // Lumière néon magenta en contre-champ
    const magentaLight = new THREE.DirectionalLight(0xff007f, 2.0);
    magentaLight.position.set(-10, 10, -6);
    this.scene.add(magentaLight);

    // Lumière ponctuelle sous la sphère
    this.playerLight = new THREE.PointLight(0x00f0ff, 2.0, 25);
    this.playerLight.position.set(0, 0.8, 0);
    this.scene.add(this.playerLight);
  }

  initResizeListener() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
