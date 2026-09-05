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
    // Brume volumétrique violet foncé profonde pour fondre l'horizon
    this.scene.fog = new THREE.FogExp2(0x050110, 0.0055);
  }

  initCamera() {
    // Caméra perspective 3e personne en légère plongée
    this.camera = new THREE.PerspectiveCamera(
      64,
      this.width / this.height,
      0.1,
      1200
    );
    this.camera.position.set(0, 4.2, 9.5);
    this.cameraTarget = new THREE.Vector3(0, 2.0, -15);
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
    this.renderer.toneMappingExposure = 1.25;
  }

  initLights() {
    // Ambiance violet sombre
    const ambientLight = new THREE.AmbientLight(0x280540, 1.6);
    this.scene.add(ambientLight);

    // Key Light magenta puissant (reflets vernis supérieurs)
    const keyLight = new THREE.DirectionalLight(0xff2ea6, 3.2);
    keyLight.position.set(12, 20, 10);
    this.scene.add(keyLight);

    // Rim Light cyan néon électrique (contour réflexif sur les flancs)
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.8);
    rimLight.position.set(-12, 12, -6);
    this.scene.add(rimLight);

    // Lumière rasante douce au sol
    const groundGlow = new THREE.PointLight(0x7928ca, 2.0, 40);
    groundGlow.position.set(0, 1.0, 5);
    this.scene.add(groundGlow);
    this.groundGlow = groundGlow;
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
