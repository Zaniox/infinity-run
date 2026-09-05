/**
 * // SOUNDRISE : INFINITY RUN - SYSTÈME DE PARTICULES RÉALISTES
 * Générateur de textures procédurales haute définition pour bannir
 * définitivement les carrés Three.js par défaut et offrir un rendu
 * organique, fluide et cinématographique (Race the Sun style).
 */
import * as THREE from 'three';

const textureCache = {};

/**
 * Texture de lueur douce circulaire avec atténuation exponentielle (orbes, photons, braises, débris)
 */
export function getSoftGlowTexture() {
  if (textureCache.glow) return textureCache.glow;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.42, 'rgba(255, 255, 255, 0.42)');
  grad.addColorStop(0.72, 'rgba(255, 255, 255, 0.10)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.glow = texture;
  return texture;
}

/**
 * Texture d'étincelle incandescente avec cœur ultra-brillant (plasma, foudre, braises)
 */
export function getSparkTexture() {
  if (textureCache.spark) return textureCache.spark;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.10, 'rgba(255, 255, 255, 0.98)');
  grad.addColorStop(0.28, 'rgba(255, 255, 255, 0.50)');
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.spark = texture;
  return texture;
}

/**
 * Texture de volute de fumée vaporeuse et brume organique (Chaos / Ombre)
 */
export function getSmokeTexture() {
  if (textureCache.smoke) return textureCache.smoke;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const centers = [
    { x: 64, y: 64, r: 60, a: 0.65 },
    { x: 52, y: 56, r: 48, a: 0.50 },
    { x: 74, y: 58, r: 46, a: 0.48 },
    { x: 60, y: 74, r: 44, a: 0.42 }
  ];

  for (const c of centers) {
    const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    grad.addColorStop(0.0, `rgba(255, 255, 255, ${c.a})`);
    grad.addColorStop(0.35, `rgba(255, 255, 255, ${c.a * 0.65})`);
    grad.addColorStop(0.72, `rgba(255, 255, 255, ${c.a * 0.18})`);
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.smoke = texture;
  return texture;
}

/**
 * Texture d'étoile céleste avec micro-diffraction (Cosmos / Folie)
 */
export function getStarTexture() {
  if (textureCache.star) return textureCache.star;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.92)');
  grad.addColorStop(0.38, 'rgba(255, 255, 255, 0.32)');
  grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.05)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  // Aigrettes de diffraction fines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(10, 32); ctx.lineTo(54, 32);
  ctx.moveTo(32, 10); ctx.lineTo(32, 54);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.star = texture;
  return texture;
}

/**
 * Texture de goutte d'eau translucide avec reflet spéculaire (Cycle 1 Eau / Chute)
 */
export function getWaterDropletTexture() {
  if (textureCache.droplet) return textureCache.droplet;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Corps d'eau translucide
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 28);
  grad.addColorStop(0.0, 'rgba(210, 245, 255, 0.95)');
  grad.addColorStop(0.25, 'rgba(56, 189, 248, 0.70)');
  grad.addColorStop(0.65, 'rgba(2, 132, 199, 0.25)');
  grad.addColorStop(1.0, 'rgba(0, 50, 100, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();

  // Reflet spéculaire net
  ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
  ctx.beginPath();
  ctx.arc(24, 22, 5, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.droplet = texture;
  return texture;
}

/**
 * Texture d'arc électrique ramifié haute tension (Cycle 4 Électricité / Amour)
 */
export function getElectricZapTexture() {
  if (textureCache.zap) return textureCache.zap;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Halo plasma extérieur
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 58);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.20, 'rgba(254, 240, 138, 0.85)');
  grad.addColorStop(0.50, 'rgba(234, 179, 8, 0.35)');
  grad.addColorStop(1.0, 'rgba(200, 150, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  // Arcs de foudre ramifiés
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.0;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 12;

  const drawBranch = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
    ctx.lineTo(mx, my);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  drawBranch(64, 64, 20, 30);
  drawBranch(64, 64, 108, 25);
  drawBranch(64, 64, 24, 105);
  drawBranch(64, 64, 104, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.zap = texture;
  return texture;
}

/**
 * Texture de bulle de magma incandescent (Cycle 3 Feu / Obsession)
 */
export function getLavaBubbleTexture() {
  if (textureCache.lava) return textureCache.lava;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.20, 'rgba(254, 240, 138, 0.95)');
  grad.addColorStop(0.45, 'rgba(249, 115, 22, 0.75)');
  grad.addColorStop(0.75, 'rgba(239, 68, 68, 0.35)');
  grad.addColorStop(1.0, 'rgba(150, 10, 10, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.lava = texture;
  return texture;
}

/**
 * Texture de poussière cosmique irisée (Cycle 8 Folie / Cosmos)
 */
export function getCosmicDustTexture() {
  if (textureCache.dust) return textureCache.dust;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.15, 'rgba(232, 121, 249, 0.90)');
  grad.addColorStop(0.45, 'rgba(192, 132, 252, 0.45)');
  grad.addColorStop(0.75, 'rgba(56, 189, 248, 0.15)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.dust = texture;
  return texture;
}

/**
 * Texture de flamme dorée et aura d'énergie de Super Saiyan (Sayanfinity)
 */
export function getSaiyanAuraTexture() {
  if (textureCache.saiyanAura) return textureCache.saiyanAura;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Flamme montante dorée avec dégradé chaud
  const grad = ctx.createRadialGradient(64, 75, 4, 64, 64, 58);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, 'rgba(254, 240, 138, 0.95)');
  grad.addColorStop(0.40, 'rgba(250, 204, 21, 0.82)');
  grad.addColorStop(0.68, 'rgba(234, 88, 12, 0.38)');
  grad.addColorStop(1.0, 'rgba(180, 83, 9, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  // Forme de flamme effilée
  ctx.moveTo(64, 4);
  ctx.bezierCurveTo(96, 32, 118, 70, 112, 98);
  ctx.bezierCurveTo(106, 120, 78, 126, 64, 124);
  ctx.bezierCurveTo(50, 126, 22, 120, 16, 98);
  ctx.bezierCurveTo(10, 70, 32, 32, 64, 4);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.saiyanAura = texture;
  return texture;
}

/**
 * Texture de grille d'énergie hexagonale pour le bouclier d'Armure
 */
export function getShieldHexTexture() {
  if (textureCache.shieldHex) return textureCache.shieldHex;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 256, 256);

  // Motif hexagonal futuriste cyan
  const drawHex = (x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = x + r * Math.cos(angle);
      const hy = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.fill();
  };

  const r = 28;
  const h = r * Math.sqrt(3);
  for (let y = 0; y < 256 + h; y += h) {
    let row = 0;
    for (let x = 0; x < 256 + r * 3; x += r * 3) {
      drawHex(x, y, r - 3);
      drawHex(x + 1.5 * r, y + h / 2, r - 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  textureCache.shieldHex = texture;
  return texture;
}

/**
 * Texture de plasma laser pour les tirs de blaster Star Fox
 */
export function getLaserBeamTexture() {
  if (textureCache.laserBeam) return textureCache.laserBeam;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(32, 0, 32, 256);
  grad.addColorStop(0.0, 'rgba(0, 240, 255, 0.0)');
  grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.8, 'rgba(0, 240, 255, 0.8)');
  grad.addColorStop(1.0, 'rgba(0, 240, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(18, 0, 28, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.laserBeam = texture;
  return texture;
}


