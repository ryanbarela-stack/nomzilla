import type { PathId } from "./paths";
import titanSheetUrl from "../assets/sprites/titan.png";
import wardenSheetUrl from "../assets/sprites/warden.png";
import emperorSheetUrl from "../assets/sprites/emperor.png";

export const GRID = 48;
// Scale factor from the original 32px design — every absolute pixel measurement
// below is written as "base-at-32px * S" so the whole cast gained more canvas
// real estate (and therefore room for finer detail) without changing proportions.
const S = GRID / 32;
const GROUND_Y = GRID - 3 * S;
const CX = GRID / 2;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawGroundShadow(ctx: CanvasRenderingContext2D, width: number) {
  ctx.globalAlpha = 0.22;
  px(ctx, CX - width / 2, GROUND_Y, width, 2 * S, "#000000");
  ctx.globalAlpha = 1;
}

const EGG_PALETTE = {
  shell: "#f2ede0",
  shellLight: "#ffffff",
  shellMid: "#e6e0d0",
  shellDark: "#d8d2c2",
  speckle: "#b8b2a4",
  outline: "#8f8b82",
  glow: "#ffe9a8",
};

function drawEggBody(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerY = GROUND_Y - h / 2;
  ctx.lineWidth = 1 * S;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.beginPath();
  ctx.ellipse(CX, centerY, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // mid-tone band for a smoother rounded gradient, then the brighter highlight and darker shadow on top
  ctx.fillStyle = EGG_PALETTE.shellMid;
  ctx.beginPath();
  ctx.ellipse(CX + w * 0.08, centerY + h * 0.05, w * 0.32, h * 0.36, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = EGG_PALETTE.shellLight;
  ctx.beginPath();
  ctx.ellipse(CX - w * 0.18, centerY - h * 0.22, w * 0.22, h * 0.28, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = EGG_PALETTE.shellDark;
  ctx.beginPath();
  ctx.ellipse(CX + w * 0.2, centerY + h * 0.2, w * 0.18, h * 0.24, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // faint hairline texture strokes to break up the flat shell surface
  ctx.strokeStyle = EGG_PALETTE.shellDark;
  ctx.lineWidth = 0.6 * S;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(CX - w * 0.3, centerY - h * 0.15);
  ctx.quadraticCurveTo(CX - w * 0.15, centerY - h * 0.02, CX - w * 0.22, centerY + h * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + w * 0.05, centerY - h * 0.32);
  ctx.quadraticCurveTo(CX + w * 0.18, centerY - h * 0.18, CX + w * 0.12, centerY - h * 0.02);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const speckles: [number, number][] = [
    [-0.2, -0.05],
    [0.18, 0.12],
    [0.02, -0.32],
    [-0.12, 0.3],
    [0.28, -0.1],
    [-0.3, 0.12],
    [0.1, 0.34],
    [0.32, 0.18],
  ];
  for (const [ox, oy] of speckles) {
    px(ctx, CX + ox * w - 0.65 * S, centerY + oy * h - 0.65 * S, 1.3 * S, 1.3 * S, EGG_PALETTE.speckle);
  }
  return centerY;
}

function drawEgg(ctx: CanvasRenderingContext2D, cracked: boolean) {
  const w = 15 * S;
  const h = 19 * S;
  drawGroundShadow(ctx, w + 2 * S);
  const centerY = drawEggBody(ctx, w, h);

  if (cracked) {
    ctx.strokeStyle = EGG_PALETTE.outline;
    ctx.lineWidth = 1.1 * S;
    ctx.beginPath();
    ctx.moveTo(CX + 0.5 * S, centerY - h * 0.42);
    ctx.lineTo(CX + 2 * S, centerY - h * 0.18);
    ctx.lineTo(CX - 1.5 * S, centerY + 0.05 * h);
    ctx.lineTo(CX + 1.5 * S, centerY + 0.28 * h);
    ctx.lineTo(CX, centerY + 0.42 * h);
    ctx.stroke();

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = EGG_PALETTE.glow;
    ctx.beginPath();
    ctx.ellipse(CX + 0.5 * S, centerY, 1.1 * S, 3 * S, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const HATCHLING_PALETTE = {
  body: "#c9cdd1",
  bodyLight: "#e8eaec",
  bodyDark: "#9a9fa5",
  eye: "#2a2420",
  blush: "#ffa8ba",
  outline: "#4a4d51",
};

function drawHatchling(ctx: CanvasRenderingContext2D) {
  const pal = HATCHLING_PALETTE;
  const shellW = 17 * S;
  const shellH = 8 * S;
  drawGroundShadow(ctx, shellW + 2 * S);

  const bodyW = 11 * S;
  const bodyH = 9 * S;
  const bodyX = CX - bodyW / 2;
  const bodyY = GROUND_Y - shellH * 0.55 - bodyH * 0.6;
  const headW = 9 * S;
  const headH = 8 * S;
  const headX = CX - headW / 2;
  const headY = bodyY - headH + 2 * S;

  // stubby arms resting on the shell rim
  px(ctx, bodyX - 3 * S, bodyY + bodyH * 0.4, 3 * S, 3 * S, pal.bodyDark);
  px(ctx, bodyX + bodyW, bodyY + bodyH * 0.4, 3 * S, 3 * S, pal.bodyDark);

  // torso (mostly hidden behind the shell rim, drawn first)
  px(ctx, bodyX - S, bodyY - S, bodyW + 2 * S, bodyH + 2 * S, pal.outline);
  px(ctx, bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + bodyW * 0.6, bodyY + 1 * S, bodyW * 0.3, bodyH - 2 * S, pal.bodyDark);

  // head
  px(ctx, headX - S, headY - S, headW + 2 * S, headH + 2 * S, pal.outline);
  px(ctx, headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1 * S, headY + 1 * S, headW * 0.3, headH - 2 * S, pal.bodyLight);

  // blush
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = pal.blush;
  ctx.beginPath();
  ctx.ellipse(headX + headW * 0.22, headY + headH * 0.62, headW * 0.14, headH * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // big eyes with shine
  const eyeY = headY + headH * 0.38;
  for (const eyeX of [headX + headW * 0.28, headX + headW * 0.64]) {
    ctx.fillStyle = "#f5f0e1";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 1.7 * S, 1.9 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX + 0.3 * S, eyeY + 0.3 * S, 0.9 * S, 1.05 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    px(ctx, eyeX - 0.3 * S, eyeY - 0.9 * S, 0.7 * S, 0.7 * S, "#ffffff");
  }

  // smile
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.36, headY + headH * 0.78);
  ctx.quadraticCurveTo(headX + headW * 0.5, headY + headH * 0.95, headX + headW * 0.64, headY + headH * 0.78);
  ctx.stroke();

  // broken shell "cup" drawn last so its front rim occludes the lower torso
  const shellCenterY = GROUND_Y - shellH * 0.35;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.ellipse(CX, shellCenterY, shellW / 2, shellH / 2, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // subtle shell-surface texture lines
  ctx.strokeStyle = EGG_PALETTE.shellDark;
  ctx.lineWidth = 0.5 * S;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(CX - shellW * 0.3, shellCenterY - shellH * 0.05);
  ctx.lineTo(CX - shellW * 0.15, shellCenterY + shellH * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + shellW * 0.18, shellCenterY - shellH * 0.1);
  ctx.lineTo(CX + shellW * 0.3, shellCenterY + shellH * 0.1);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // jagged notches along the broken rim
  const notches: [number, number][] = [
    [-0.32, -0.9],
    [-0.05, -1.05],
    [0.2, -0.85],
    [0.4, -0.6],
  ];
  for (const [ox, oy] of notches) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(CX + ox * shellW, shellCenterY + oy * shellH * 0.5);
    ctx.lineTo(CX + ox * shellW - 1 * S, shellCenterY + oy * shellH * 0.5 - 1.4 * S);
    ctx.lineTo(CX + ox * shellW + 1 * S, shellCenterY + oy * shellH * 0.5 - 1.4 * S);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// --- Evolved forms: rendered from hand-painted sprite sheets rather than
// procedural drawing. Each sheet is a 4-row grid of idle-animation frames;
// columns sweep through a single creature's charge-up/burst cycle, so a
// handful of representative columns are picked per growth stage.

const SPRITE_CELL = 64;
const SPRITE_ROWS = 4;
const IDLE_FPS = 6;

interface SpriteSheet {
  url: string;
  young: number;
  mid: number;
  grand: number;
}

const SPRITE_SHEETS: Record<PathId, SpriteSheet> = {
  titan: { url: titanSheetUrl, young: 2, mid: 5, grand: 6 },
  warden: { url: wardenSheetUrl, young: 0, mid: 3, grand: 5 },
  emperor: { url: emperorSheetUrl, young: 0, mid: 5, grand: 6 },
};

const spriteImages = new Map<PathId, HTMLImageElement>();

function getSpriteImage(pathId: PathId): HTMLImageElement {
  let img = spriteImages.get(pathId);
  if (!img) {
    img = new Image();
    img.src = SPRITE_SHEETS[pathId].url;
    spriteImages.set(pathId, img);
  }
  return img;
}

function drawEvolvedCreature(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId, time: number) {
  const sheet = SPRITE_SHEETS[pathId];
  const img = getSpriteImage(pathId);
  if (!img.complete || img.naturalWidth === 0) return;

  const col = stage <= 3 ? sheet.young : stage === 4 ? sheet.mid : sheet.grand;
  const row = Math.floor(time * IDLE_FPS) % SPRITE_ROWS;

  drawGroundShadow(ctx, GRID * 0.5);

  const drawSize = GRID * 0.94;
  const dx = CX - drawSize / 2;
  const dy = GROUND_Y - drawSize;
  ctx.drawImage(img, col * SPRITE_CELL, row * SPRITE_CELL, SPRITE_CELL, SPRITE_CELL, dx, dy, drawSize, drawSize);
}

/**
 * Draws the kaiju at the given growth stage (0-5): an egg that cracks, hatches,
 * then (from stage 3 on) evolves along the chosen path — Titan, Warden, or
 * Emperor. `time` (seconds) drives a gentle idle bob.
 */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId | null, time = 0) {
  const s = Math.max(0, Math.min(5, stage));
  ctx.clearRect(0, 0, GRID, GRID);

  const bob = Math.sin(time * 2.1) * 0.7 * S;
  ctx.save();
  ctx.translate(0, bob);

  if (s === 0) drawEgg(ctx, false);
  else if (s === 1) drawEgg(ctx, true);
  else if (s === 2) drawHatchling(ctx);
  else drawEvolvedCreature(ctx, s, pathId ?? "titan", time);

  ctx.restore();
}
