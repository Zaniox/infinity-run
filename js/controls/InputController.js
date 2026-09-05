export class InputController {
  constructor() {
    this.axis = 0; // -1 (gauche) à +1 (droite)
    this.keyLeft = false;
    this.keyRight = false;

    this.isPointerDown = false;
    this.pointerStartX = 0;
    this.pointerDeltaX = 0;

    this.initKeyboard();
    this.initPointer();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Flèches et touches Q/D (ou A/D)
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) {
        this.keyLeft = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keyRight = true;
      }
      this.updateAxis();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(e.code)) {
        this.keyLeft = false;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keyRight = false;
      }
      this.updateAxis();
    });
  }

  initPointer() {
    // Gestion souris et écran tactile
    window.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerDeltaX = 0;
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        // Déplacement par glissement (drag)
        const diff = (e.clientX - this.pointerStartX) / (window.innerWidth * 0.22);
        this.pointerDeltaX = Math.max(-1, Math.min(1, diff));
        this.updateAxis();
      } else {
        // Suivi léger de la souris
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        if (Math.abs(normalizedX) > 0.12) {
          const steer = (Math.abs(normalizedX) - 0.12) / 0.88;
          this.pointerDeltaX = Math.sign(normalizedX) * steer;
        } else {
          this.pointerDeltaX = 0;
        }
        if (!this.keyLeft && !this.keyRight) {
          this.axis = this.pointerDeltaX;
        }
      }
    });

    const resetPointer = () => {
      this.isPointerDown = false;
      this.pointerDeltaX = 0;
      this.updateAxis();
    };

    window.addEventListener('pointerup', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
  }

  updateAxis() {
    if (this.keyLeft && !this.keyRight) {
      this.axis = -1;
    } else if (this.keyRight && !this.keyLeft) {
      this.axis = 1;
    } else if (this.isPointerDown) {
      this.axis = this.pointerDeltaX;
    } else if (!this.keyLeft && !this.keyRight) {
      this.axis = this.pointerDeltaX;
    } else {
      this.axis = 0;
    }
  }

  getAxis() {
    return this.axis;
  }
}
