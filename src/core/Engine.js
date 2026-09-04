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
    // Brume d'ambiance Cyber-Baroque profonde
    this.scene.fog = new THREE.FogExp2(0x070114, 0.007);
  }

  initCamera() {
    // Caméra perspective 3e personne avec légère plongée
    this.camera = new THREE.PerspectiveCamera(
      62,
      this.width / this.height,
      0.1,
      1000
    );
    // Position : légèrement surélevée et en retrait
    this.camera.position.set(0, 4.2, 9.5);
    // Cible légèrement en avant sur la ligne d'horizon
    this.cameraTarget = new THREE.Vector3(0, 1.2, -12);
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
    this.renderer.toneMappingExposure = 1.15;
  }

  initLights() {
    // Lumière ambiante violette mystique
    const ambientLight = new THREE.AmbientLight(0x350d5e, 1.5);
    this.scene.add(ambientLight);

    // Lumière principale magenta (reflet brillant haut droit)
    const mainLight = new THREE.DirectionalLight(0xff2ea6, 3.0);
    mainLight.position.set(8, 14, 8);
    this.scene.add(mainLight);

    // Lumière de contre-jour cyan néon (rim light subtile comme sur l'image)
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 2.0);
    rimLight.position.set(-8, 8, -6);
    this.scene.add(rimLight);

    // Lumière rasante au sol violette profonde
    const groundLight = new THREE.PointLight(0x9d4edd, 2.5, 30);
    groundLight.position.set(0, 0.5, 2);
    this.scene.add(groundLight);
    this.groundLight = groundLight;
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
