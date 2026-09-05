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
    // Brume volumétrique violet foncé
    this.scene.fog = new THREE.FogExp2(0x050110, 0.0055);
  }

  initCamera() {
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
    this.renderer.toneMappingExposure = 1.3;
  }

  initLights() {
    // Ambiance violet sombre
    const ambientLight = new THREE.AmbientLight(0x300550, 1.8);
    this.scene.add(ambientLight);

    // Rim light / Backlight violet puissant créant le halo lumineux du pourtour (comme image 1)
    const backRimLight = new THREE.DirectionalLight(0xbd00ff, 4.5);
    backRimLight.position.set(0, 8, -10);
    this.scene.add(backRimLight);

    // Lumière cyan brillante avant-droite (crée le reflet cyan visible sur l'image 1)
    const cyanSpecLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    cyanSpecLight.position.set(8, 6, 8);
    this.scene.add(cyanSpecLight);

    // Key light magenta avant-gauche (reflet magenta supérieur gauche)
    const magentaLight = new THREE.DirectionalLight(0xff2ea6, 3.5);
    magentaLight.position.set(-8, 14, 8);
    this.scene.add(magentaLight);

    // Lumière rasante au sol
    const groundGlow = new THREE.PointLight(0x9333ea, 2.5, 40);
    groundGlow.position.set(0, 1.0, 4);
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
