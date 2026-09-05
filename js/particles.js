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
