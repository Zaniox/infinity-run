export class InputController {
  constructor() {
    this.axisX = 0; // -1 (gauche) à +1 (droite)
    this.axisY = 0; // -1 (piqué / descente) à +1 (cabré / montée)

    // État des touches clavier
    this.keyLeft = false;
    this.keyRight = false;
    this.keyUp = false;
    this.keyDown = false;

    // Souris & tactile
    this.isPointerDown = false;
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.pointerDeltaX = 0;
    this.pointerDeltaY = 0;

    this.initKeyboard();
    this.initPointer();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Latéral
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) {
        this.keyLeft = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keyRight = true;
      }

      // Vertical (Vol : Monter / Descendre)
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) {
        this.keyUp = true;
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.keyDown = true;
      }

      this.updateAxes();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) {
        this.keyLeft = false;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keyRight = false;
      }
      if (['ArrowUp', 'KeyW', 'KeyZ'].includes(e.code)) {
        this.keyUp = false;
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.keyDown = false;
      }

      this.updateAxes();
    });
  }

  initPointer() {
    window.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      this.pointerDeltaX = 0;
      this.pointerDeltaY = 0;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        // Mode glissement (drag 2D)
        const diffX = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.22);
        const diffY = (this.pointerStartY - e.clientY) / (window.innerHeight * 0.22); // Vers le haut = positif

        this.pointerDeltaX = Math.max(-1, Math.min(1, diffX));
        this.pointerDeltaY = Math.max(-1, Math.min(1, diffY));
        this.updateAxes();
      } else {
        // Suivi libre de la souris
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -((e.clientY / window.innerHeight) * 2 - 1); // Haut = positif

        // Deadzones
        this.pointerDeltaX = Math.abs(normX) > 0.1 ? Math.sign(normX) * ((Math.abs(normX) - 0.1) / 0.9) : 0;
        this.pointerDeltaY = Math.abs(normY) > 0.12 ? Math.sign(normY) * ((Math.abs(normY) - 0.12) / 0.88) : 0;

        if (!this.keyLeft && !this.keyRight) {
          this.axisX = this.pointerDeltaX;
        }
        if (!this.keyUp && !this.keyDown) {
          this.axisY = this.pointerDeltaY;
        }
      }
    });

    const resetPointer = () => {
      this.isPointerDown = false;
      this.pointerDeltaX = 0;
      this.pointerDeltaY = 0;
      this.updateAxes();
    };

    window.addEventListener('pointerup', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
  }

  updateAxes() {
    // Axe X
    if (this.keyLeft && !this.keyRight) {
      this.axisX = -1;
    } else if (this.keyRight && !this.keyLeft) {
      this.axisX = 1;
    } else if (this.isPointerDown || (!this.keyLeft && !this.keyRight)) {
      this.axisX = this.pointerDeltaX;
    } else {
      this.axisX = 0;
    }

    // Axe Y (Vol)
    if (this.keyUp && !this.keyDown) {
      this.axisY = 1;  // Monter / cabrer
    } else if (this.keyDown && !this.keyUp) {
      this.axisY = -1; // Piquer / descendre
    } else if (this.isPointerDown || (!this.keyUp && !this.keyDown)) {
      this.axisY = this.pointerDeltaY;
    } else {
      this.axisY = 0;
    }
  }

  getAxisX() {
    return this.axisX;
  }

  getAxisY() {
    return this.axisY;
  }
}
