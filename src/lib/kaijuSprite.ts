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

  const col = stage <= 2 ? sheet.young : stage === 3 ? sheet.mid : sheet.grand;
  const row = Math.floor(time * IDLE_FPS) % SPRITE_ROWS;

  drawGroundShadow(ctx, GRID * 0.5);

  const drawSize = GRID * 0.94;
  const dx = CX - drawSize / 2;
  const dy = GROUND_Y - drawSize;
  ctx.drawImage(img, col * SPRITE_CELL, row * SPRITE_CELL, SPRITE_CELL, SPRITE_CELL, dx, dy, drawSize, drawSize);
}

/**
 * Draws the kaiju at the given growth stage (0-4): an egg that cracks, then
 * (from stage 2 on) evolves along the chosen path — Titan, Warden, or
 * Emperor. `time` (seconds) drives a gentle idle bob.
 */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId | null, time = 0) {
  const s = Math.max(0, Math.min(4, stage));
  ctx.clearRect(0, 0, GRID, GRID);

  const bob = Math.sin(time * 2.1) * 0.7 * S;
  ctx.save();
  ctx.translate(0, bob);

  if (s === 0) drawEgg(ctx, false);
  else if (s === 1) drawEgg(ctx, true);
  else drawEvolvedCreature(ctx, s, pathId ?? "titan", time);

  ctx.restore();
}
